require('dotenv').config();
const request = require('supertest');
const Broker = require('rascal').BrokerAsPromised;
const { expect } = require('chai');
const sinon = require('sinon');
const server = require('../server/app');
const { knex, knexLegacyDB } = require('../server/infra/database/knex');
const {
  insertTestCapture,
  capture,
  clearDB,
} = require('./insert-test-capture');
const { SubscriptionNames } = require('../server/infra/RabbitMQ/config');
const { config } = require('./rabbitmq-test-config');

const domainEventObject1 = {
  id: 'a63d448b-750e-4961-9bf8-4fc1599c195c',
  payload: {},
  status: 'raised',
  created_at: '2021-05-04 11:24:43',
  updated_at: '2021-05-04 11:24:43',
};

describe('Replay Events API', () => {
  beforeEach(async () => {
    await insertTestCapture(knex, knexLegacyDB);
    await knex('domain_event').insert(domainEventObject1);
  });

  afterEach(async () => {
    await clearDB(knex, knexLegacyDB);
  });

  it(`Send previously raised events`, async () => {
    let brokerStub = sinon.stub(Broker, 'create').resolves({
      publish: () => {
        return {
          on: function (state, callback) {
            if (state === 'success') callback();
            return this;
          },
        };
      },
    });

    const res = await request(server)
      .post(`/replay-events`)
      .set('Content-Type', 'application/json')
      .send({ status: 'raised' })
      .expect(200);

    expect(res.body.request).to.eql('accepted');
    expect(res.body.status).to.eql('replay in progress...');

    // the event replay process is not awaited
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const numOfSentEvents = await knex('domain_event')
      .count()
      .where({ status: 'sent' });

    // domain_event in the insertTestCapture is also sent
    expect(+numOfSentEvents[0].count).to.eql(2);
    brokerStub.restore();
  });

  //put this after below??
  it('Handle previously received events', async () => {
    await knex('domain_event').insert({
      ...domainEventObject1,
      id: 'dbd4367d-0d61-45b2-8c80-c62808f66af9',
      payload: {
        id: capture.id,
        type: 'CaptureCreated',
      },
      status: 'received',
    });

    const res = await request(server)
      .post(`/replay-events`)
      .set('Content-Type', 'application/json')
      .send({ status: 'received' })
      .expect(200);

    expect(res.body.request).to.eql('accepted');
    expect(res.body.status).to.eql('replay in progress...');

    // the event replay process is not awaited
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const numOfRaisedEvents = await knex('domain_event')
      .count()
      .where({ status: 'handled' });
    expect(+numOfRaisedEvents[0].count).to.eql(1);

    const noOfApprovedCaptures = await knex('raw_capture')
      .count()
      .where({ id: capture.id, status: 'approved' });
    expect(+noOfApprovedCaptures[0].count).to.eql(1);
  });

  it(`Should handle ${SubscriptionNames.CAPTURE_CREATED} event`, async () => {
    await knex('raw_capture')
      .update({ status: 'unprocessed' })
      .where('id', capture.id);
    const broker = await Broker.create(config);
    const publication = await broker.publish(
      SubscriptionNames.CAPTURE_CREATED,
      { id: capture.id },
    );

    publication
      .on('success', () => {})
      .on('error', (err, messageId) => {
        console.error(`Error with id ${messageId} ${err.message}`);
        throw err;
      });

    // wait for the message to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const noOfApprovedCaptures = await knex('raw_capture')
      .count()
      .where({ id: capture.id, status: 'approved' });
    expect(+noOfApprovedCaptures[0].count).to.eql(1);

    const numOfRaisedEvents = await knex('domain_event')
      .count()
      .where({ status: 'handled' });
    expect(+numOfRaisedEvents[0].count).to.eql(1);

    await broker.unsubscribeAll();
    await broker.purge();
    await broker.shutdown();
  });
});
