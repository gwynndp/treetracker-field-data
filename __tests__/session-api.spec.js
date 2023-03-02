require('dotenv').config();
const request = require('supertest');
const server = require('../server/app');
const { expect } = require('chai');
const { knex } = require('../server/infra/database/knex');
const { walletRegistrationObject } = require('./wallet-registration-api.spec');
const {
  deviceConfigurationObject,
} = require('./device-configuration-api.spec');

const sessionObject = {
  id: '25dcb2bb-d151-455a-92dd-2f5d62e69ac6',
  device_configuration_id: deviceConfigurationObject.id,
  originating_wallet_registration_id: walletRegistrationObject.id,
  target_wallet: 'target_wallet',
  check_in_photo_url: 'https://picsum.photos/200',
  track_url: 'https://picsum.photos/200',
  bulk_pack_file_name: 'bulk_pack_file_name',
  organization: 'organization',
  start_time: new Date().toISOString(),
  bulk_pack_version: 'v2',
};

describe('Session', () => {
  before(async () => {
    await knex('device_configuration').insert({
      ...deviceConfigurationObject,
      created_at: new Date(),
    });
    await knex('wallet_registration').insert(walletRegistrationObject);
  });

  after(async () => {
    await knex('session').del();
    await knex('device_configuration').del();
    await knex('wallet_registration').del();
  });

  it(`Session should be successfully added`, function (done) {
    request(server)
      .post(`/session`)
      .send(sessionObject)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.id).to.eql(sessionObject.id);
        return done();
      });
  });

  it(`Should handle duplicates`, function (done) {
    request(server)
      .post(`/session`)
      .send(sessionObject)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.id).to.eql(sessionObject.id);
        if (err) return done(err);
        return done();
      });
  });

  it('Added session should be persisted', async function () {
    const response = await request(server).get(`/session`).expect(200);

    expect(
      response.body.sessions.some((session) => session.id === sessionObject.id),
    ).to.equal(true);

    const singleGetResponse = await request(server)
      .get(`/session/${sessionObject.id}`)
      .expect(200);

    expect(singleGetResponse.body.id).to.equal(sessionObject.id);
  });
});

module.exports = { sessionObject };
