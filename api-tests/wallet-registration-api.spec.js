require('dotenv').config();
const request = require('supertest');
const server = require('../server/app');
const { expect } = require('chai');
const { knex } = require('../server/infra/database/knex');

const walletRegistrationObject = {
  id: '67761c8f-e077-4869-b964-a7bcb42f6aed',
  wallet: 'wallet',
  user_photo_url: 'https://picsum.photos/200',
  grower_account_id: 'f12d8d02-f803-4927-a03d-f3bbe35e3b4c',
  first_name: 'firstName',
  last_name: 'lastName',
  phone: '+1212223443',
  email: 'email@email.com',
  lat: 12,
  lon: 12,
  registered_at: new Date().toISOString(),
  v1_legacy_organization: 'legacy',
};

describe('Wallet Registration', () => {
  after(async () => {
    await knex('wallet_registration').del();
  });

  it(`Wallet Registration should be successfully added`, function (done) {
    request(server)
      .post(`/wallet-registration`)
      .send(walletRegistrationObject)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.id).to.eql(walletRegistrationObject.id);
        return done();
      });
  });

  it(`Should handle duplicates`, function (done) {
    request(server)
      .post(`/wallet-registration`)
      .send(walletRegistrationObject)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.id).to.eql(walletRegistrationObject.id);
        if (err) return done(err);
        return done();
      });
  });

  it('Added wallet registration should be persisted', async function () {
    const response = await request(server)
      .get(`/wallet-registration`)
      .expect(200);

    expect(
      response.body.some(
        (walletRegistration) =>
          walletRegistration.id === walletRegistrationObject.id,
      ),
    ).to.equal(true);

    const singleGetResponse = await request(server)
      .get(`/wallet-registration/${walletRegistrationObject.id}`)
      .expect(200);

    expect(singleGetResponse.body.id).to.equal(walletRegistrationObject.id);
  });
});

module.exports = {
  walletRegistrationObject,
};
