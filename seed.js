/*
 * seed data to DB for testing
 */
// const pool = require('../server/database/database.js');
const log = require('loglevel');
const assert = require('assert');
// const knex = require('knex')({
//   client: 'pg',
//   //  debug: true,
//   connection: require('./config/config').connectionString,
// });
const { knex } = require('./server/infra/database/knex');

// Example of a database seed using knex
// This follows from the wallet microservice
// New mircroservices will need their own seed story

// const capture = {
//   id: 999999,
// };

// const captureB = {
//   id: 999998,
// };

// const token = {
//   id: 9,
//   uuid: uuid.v4(),
// };

// const wallet = {
//   id: 12,
//   name: 'wallet',
//   password: 'test1234',
//   passwordHash:
//     '31dd4fe716e1a908f0e9612c1a0e92bfdd9f66e75ae12244b4ee8309d5b869d435182f5848b67177aa17a05f9306e23c10ba41675933e2cb20c66f1b009570c1',
//   salt: 'TnDe2LDPS7VaPD9GQWL3fhG4jk194nde',
//   type: 'p',
// };

// const storyOfThisSeed = `
//     a capture: #${capture.id}

//     a token: #${token.id}
//       capture: #${capture.id}
//       wallet: #${wallet.id}
//       uuid: ${token.uuid}

//     wallet #${wallet.id} connected to capture #${capture.id}, get a token #${token.id}

//     Another capture: #${captureB.id}

// `;
// console.debug(
//   '--------------------------story of database ----------------------------------',
//   storyOfThisSeed,
//   '-----------------------------------------------------------------------------',
// );

class RequestObject {
  constructor() {
    this.request_object = {
      uuid: '2428381a-7c62-11eb-9439-0242ac130102',
      image_url: 'https://www.htpplkjl.com',
      lat: 37.421998333333335,
      lon: 122.08400000000002,
      planter_id: 1,
      planter_identifier: 'arunbakt@live.com',
      device_identifier: 'check@live.com',
      planter_photo_url: 'https://www.nting,com',
      attributes: [
        {
          key: 'rotation_matrix',
          value:
            '0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0',
        },
      ],
      timestamp: 1620943368,
    };

    this.delete_property = function (property) {
      delete this.request_object[property];
    };

    this.change_property = function (property, value) {
      this.request_object[property] = value;
    };
  }
}

async function seed() {
  // log.debug('seed api key');
  // // wallet
  // await knex('wallet').insert({
  //   id: wallet.id,
  //   type: wallet.type,
  //   name: wallet.name,
  //   password: wallet.passwordHash,
  //   salt: wallet.salt,
  // });
  // // token
  // log.log('seed token');
  // await knex('token').insert({
  //   id: token.id,
  //   capture_id: capture.id,
  //   entity_id: wallet.id,
  //   uuid: token.uuid,
  // });
  // await knex('token').insert(tokenB);
}

async function clear() {
  // log.debgu('clear tables');
  // await knex('token').del();
  // await knex('wallet').del();
}

async function delete_inserted_raw_capture() {
  const request_object = new RequestObject();
  await knex('raw_capture').del().where({
    id: request_object.request_object.uuid,
  });
}

module.exports = {
  seed,
  clear,
  // wallet,
  // token,
  RequestObject,
  delete_inserted_raw_capture,
};
