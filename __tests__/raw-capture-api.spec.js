require('dotenv').config();
const request = require('supertest');
const server = require('../server/app');
const { expect } = require('chai');
const sinon = require('sinon');
const Broker = require('rascal').BrokerAsPromised;
const { knex, knexLegacyDB } = require('../server/infra/database/knex');
const {
  insertTestCapture,
  clearDB,
  capture,
  captureRequestObject,
  captureWithExistingTree,
} = require('./insert-test-capture');
const LegacyAPI = require('../server/services/LegacyAPIService');

let reference_id;

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

    await insertTestCapture(knex, knexLegacyDB);
  });

  after(async () => {
    brokerStub.restore();

    await clearDB(knex, knexLegacyDB);
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
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const numOfEmittedEvents = await knex('domain_event')
      .count()
      .where({ status: 'sent' });
    expect(+numOfEmittedEvents[0].count).to.eql(3);
  });

  it('should reject a raw capture', async () => {
    let legacyAPIRejectTreeStub;

    legacyAPIRejectTreeStub = sinon
      .stub(LegacyAPI, 'rejectLegacyTree')
      .resolves();

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

    legacyAPIRejectTreeStub.restore();
  });
});
