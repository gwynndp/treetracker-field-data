/*
 * The integration test to test the whole microservice, with DB
 */
require('dotenv').config();
const request = require('supertest');
const server = require('../server/app');
const { expect } = require('chai');
const { RequestObject, ...seed } = require('../seed');
const log = require('loglevel');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');

describe('microservice integration tests', () => {
  // beforeEach(async () => {
  //   // before all, seed data to DB
  //   await seed.seed();
  //   // do any other setup here
  //   // including authorize to the service if required
  // });

  // afterEach((done) => {
  //   after finished all the test, clear data from DB
  //   seed.clear().then(() => {
  //     //In case other sinon stub would affect me
  //     sinon.restore();
  //     done();
  //   });
  // });

  describe('E2E tests for /raw-captures end point', () => {
    it(`Should raise validation error with error code 422 -- uuid is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('uuid');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- uuid is not valid `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('uuid', 'sdf');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- image_url is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('image_url');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- image_url is not a valid url `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('image_url', 'sasdf');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- lat is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('lat');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- lat should be a number `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('lat', 'sasdf');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- lat should be less than 90 `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('lat', 100);
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- lat should be greater than 0 `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('lat', -100);
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- lon is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('lon');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- lon should be a number `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('lon', 'sasdf');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- lon should be less than 180 `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('lat', 190);
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- lon should be greater than 0 `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('lat', -100);
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- note should be a string `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('note', -100);
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- device_identifiers is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('device_identifier');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- device_identifiers should be a string `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('device_identifier', -100);
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- planter_id is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('planter_id');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- planter_id should be a number `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('planter_id', 'number');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- planter_identifier is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('planter_identifier');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- planter_identifier should be a string `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('planter_identifier', 500);
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- planter_photo_url should be a url `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('planter_photo_url', '5000');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- attributes should be an array `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('attributes', '5000');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- attributes should be an array of objects `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('attributes', ['5000']);
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- planter_identifier is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('planter_identifier');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- timestamp is required `, function (done) {
      const request_object = new RequestObject();
      request_object.delete_property('timestamp');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- should be of type unixtimestamp in seconds `, function (done) {
      const request_object = new RequestObject();
      request_object.change_property('timestamp', 'ashbfhd');
      request(server)
        .post(`/raw-captures`)
        .send(request_object.request_object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    describe('Raw capture should be added sucessfully', () => {
      after(function (done) {
        seed.delete_inserted_raw_capture().then(() => done());
      });
      it(`Raw capture should be successfully added`, function (done) {
        const request_object = new RequestObject();
        request(server)
          .post(`/raw-captures`)
          .send(request_object.request_object)
          .set('Accept', 'application/json')
          .expect(201)
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.id).equal(request_object.request_object.uuid);
            return done();
          });
      });

      it('Added raw capture should be persisted', function (done) {
        const request_object = new RequestObject();
        request(server)
          .get(`/raw-captures`)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            expect(
              res.body.some(
                (raw_capture) =>
                  raw_capture.id === request_object.request_object.uuid,
              ),
            ).to.equal(true);
            return done();
          });
      });
    });
  });
});
