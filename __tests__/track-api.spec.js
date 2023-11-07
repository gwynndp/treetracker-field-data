require('dotenv').config();
const request = require('supertest');
const server = require('../server/app');
const { expect } = require('chai');
const { knex, knexLegacyDB } = require('../server/infra/database/knex');
const { insertTestCapture } = require('./insert-test-capture');
const { clearDB } = require('./clear-db');
const { sessionObject } = require('./session-api.spec');

const trackObject = {
  locations_url: 'https://www.tracks.com/track',
  session_id: sessionObject.id,
  bulk_pack_file_name: 'track_bulk_pack_file_name',
};

describe('Track', () => {
  before(async () => {
    await clearDB(knex, knexLegacyDB);
    await insertTestCapture(knex, knexLegacyDB);
    await knex('track').del();
  });

  it(`track should be successfully added`, function (done) {
    request(server)
      .post(`/track`)
      .send(trackObject)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body.locations_url).to.eql(trackObject.locations_url);
        expect(res.body.session_id).to.eql(trackObject.session_id);
        return done();
      });
  });

  it('Added track should be persisted', async function () {
    const response = await request(server)
      .get(`/track?session_id=${trackObject.session_id}`)
      .expect(200);

    const { tracks, query } = response.body;
    expect(query.count).to.equal(1);
    expect(query.limit).to.equal(100);
    expect(query.offset).to.equal(0);
    expect(query.session_id).to.equal(trackObject.session_id);
    expect(tracks[0].locations_url).to.equal(trackObject.locations_url);
    expect(tracks.length).to.equal(1);

    const singleGetResponse = await request(server)
      .get(`/track/${tracks[0].id}`)
      .expect(200);

    expect(singleGetResponse.body.id).to.equal(tracks[0].id);
  });
});

module.exports = {
  trackObject,
};
