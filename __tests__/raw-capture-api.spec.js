require('dotenv').config();
const request = require('supertest');
const server = require('../server/app');
const { expect } = require('chai');
const sinon = require('sinon');
const Broker = require('rascal').BrokerAsPromised;
const { v4: uuid } = require('uuid');
const { knex, knexLegacyDB } = require('../server/infra/database/knex');
const {
  insertTestCapture,
  capture,
  captureRequestObject,
  captureWithExistingTree,
} = require('./insert-test-capture');
const { clearDB } = require('./clear-db');
const LegacyAPI = require('../server/services/LegacyAPIService');

let reference_id;

const captureWithoutDomainEvent = {
  ...captureRequestObject,
  id: uuid(),
};

describe('Raw Captures', () => {
  let brokerStub;

  before(async () => {
    brokerStub = sinon.stub(Broker, 'create').resolves({
      publish: () => {
        return {
          on: function (state, callback) {
            if (state === 'success') callback();
            return this;
          },
        };
      },
    });

    await clearDB(knex, knexLegacyDB);
    await insertTestCapture(knex, knexLegacyDB);
    await knex('raw_capture').insert({
      ...captureWithoutDomainEvent,
      extra_attributes: { entries: captureWithoutDomainEvent.extra_attributes },
      reference_id: 64864,
      status: 'approved',
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  after(async () => {
    brokerStub.restore();
  });

  it(`Raw capture should be successfully added`, function (done) {
    request(server)
      .post(`/raw-captures`)
      .send(captureRequestObject)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        reference_id = res.body.reference_id;
        expect(res.body.id).to.eql(captureRequestObject.id);
        if (err) return done(err);
        return done();
      });
  });

  it(`Should handle duplicates`, function (done) {
    request(server)
      .post(`/raw-captures`)
      .send(captureRequestObject)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.id).to.eql(captureRequestObject.id);
        if (err) return done(err);
        return done();
      });
  });

  it(`Should handle existing raw capture without existing domain event`, function (done) {
    request(server)
      .post(`/raw-captures`)
      .send({ ...captureWithoutDomainEvent })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.id).to.eql(captureWithoutDomainEvent.id);
        if (err) return done(err);
        return done();
      });
  });

  it(`Should handle new captures with existing tree in the legacy database`, function (done) {
    request(server)
      .post(`/raw-captures`)
      .send(captureWithExistingTree)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        expect(res.body.id).to.eql(captureWithExistingTree.id);
        if (err) return done(err);
        return done();
      });
  });

  it('should resend capture created event if it wasnt successful last time and capture already exists', async () => {
    const res = await request(server)
      .post(`/raw-captures`)
      .send({ ...captureRequestObject, id: capture.id })
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.id).to.eql(capture.id);
  });

  it('Added raw capture should be persisted', async function () {
    const res = await request(server).get(`/raw-captures`).expect(200);

    expect(
      res.body.raw_captures.some(
        (raw_capture) => raw_capture.id === captureRequestObject.id,
      ),
    ).to.equal(true);
  });

  it('should get a single raw capture', async function () {
    const res = await request(server)
      .get(`/raw-captures/${captureRequestObject.id}`)
      .expect(200);

    expect(res.body.id).to.eql(captureRequestObject.id);
  });

  it('should confirm number of sent capture-created events', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const numOfEmittedEvents = await knex('domain_event')
      .count()
      .where({ status: 'sent' });
    expect(+numOfEmittedEvents[0].count).to.eql(4);
  });

  describe('should reject a raw capture', async () => {
    let legacyAPIRejectTreeStub;

    beforeEach(async () => {
      legacyAPIRejectTreeStub = sinon
        .stub(LegacyAPI, 'rejectLegacyTree')
        .resolves();

      await knex('domain_event').del();
    });

    afterEach(() => {
      legacyAPIRejectTreeStub.restore();
    });

    it('should reject an unprocessed raw capture, should not emit an event', async () => {
      const rejection_reason = 'invalid photograph';

      const res = await request(server)
        .patch(`/raw-captures/${captureRequestObject.id}/reject`)
        .send({ rejection_reason, organization_id: 12 })
        .set('Authorization', 'jwt_token');

      expect(
        legacyAPIRejectTreeStub.calledOnceWithExactly({
          id: +reference_id,
          legacyAPIAuthorizationHeader: 'jwt_token',
          organizationId: 12,
          rejectionReason: rejection_reason,
        }),
      ).eql(true);

      expect(res.body.status).to.eql('rejected');
      expect(res.body.rejection_reason).to.eql(rejection_reason);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const numOfEmittedEvents = await knex('domain_event')
        .count()
        .where({ status: 'sent' });
      expect(+numOfEmittedEvents[0].count).to.eql(0);
    });

    it('should reject an approved raw capture, should emit an event', async () => {
      const rejection_reason = 'not a tree';

      const res = await request(server)
        .patch(`/raw-captures/${captureWithoutDomainEvent.id}/reject`)
        .send({ rejection_reason })
        .set('Authorization', 'jwt_token');

      expect(
        legacyAPIRejectTreeStub.calledOnceWithExactly({
          id: 64864,
          legacyAPIAuthorizationHeader: 'jwt_token',
          organizationId: undefined,
          rejectionReason: rejection_reason,
        }),
      ).eql(true);

      expect(res.body.status).to.eql('rejected');
      expect(res.body.rejection_reason).to.eql(rejection_reason);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const numOfEmittedEvents = await knex('domain_event')
        .count()
        .where({ status: 'sent' });
      expect(+numOfEmittedEvents[0].count).to.eql(1);
    });
  });
});
