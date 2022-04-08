require('dotenv').config();
const request = require('supertest');
const server = require('../server/app');
const { expect } = require('chai');
const { knex } = require('../server/infra/database/knex');

const deviceConfigurationObject = {
  id: '91ea4021-ff49-4c0b-b20c-bbd2f1f7d320',
  device_identifier: 'device_identifier',
  brand: 'brand',
  model: 'model',
  device: 'device',
  serial: 'serial',
  hardware: 'hardware',
  manufacturer: 'manufacturer',
  app_build: 'app_build',
  app_version: 'app_version',
  os_version: 'os_version',
  sdk_version: 'sdk_version',
  logged_at: new Date().toISOString(),
};

describe('Device Configuration', () => {
  after(async () => {
    await knex('device_configuration').del();
  });

  it(`Device Configuration should be successfully added`, function (done) {
    request(server)
      .post(`/device-configuration`)
      .send(deviceConfigurationObject)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.id).to.eql(deviceConfigurationObject.id);
        return done();
      });
  });

  it(`Should handle duplicates`, function (done) {
    request(server)
      .post(`/device-configuration`)
      .send(deviceConfigurationObject)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.id).to.eql(deviceConfigurationObject.id);
        if (err) return done(err);
        return done();
      });
  });

  it('Added device configuration should be persisted', async function () {
    const response = await request(server)
      .get(`/device-configuration`)
      .expect(200);

    expect(
      response.body.device_configurations.some(
        (walletRegistration) =>
          walletRegistration.id === deviceConfigurationObject.id,
      ),
    ).to.equal(true);

    const singleGetResponse = await request(server)
      .get(`/device-configuration/${deviceConfigurationObject.id}`)
      .expect(200);

    expect(singleGetResponse.body.id).to.equal(deviceConfigurationObject.id);
  });
});

module.exports = {
  deviceConfigurationObject,
};
