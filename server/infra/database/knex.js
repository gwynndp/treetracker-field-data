const expect = require('expect-runtime');
const knex = require('knex');
const knexMainDB = require('knex');
const connection = require('../../../config/config').connectionString;
const connectionMainDB = require('../../../config/config')
  .connectionStringMainDB;

expect(connection).to.match(/^postgresql:\//);
const log = require('loglevel');

const connectionObject = (connectionString) => {
  // We need to parse the connection string into a connection object
  // so that pg 8  won't throw an SSL error when connecting to the postgres database
  // when running node version greater than 12
  const urlregexp = /postgresql:\/\/(.+):(.+)@(.+):(\d+)\/(.+)\?ssl=true/g;
  const dbConnValues = [...connectionString.matchAll(urlregexp)][0];
  let connObject = null;
  if (dbConnValues && dbConnValues.length > 0) {
    connObject = {
      host: dbConnValues[3],
      user: dbConnValues[1],
      password: dbConnValues[2],
      database: dbConnValues[5],
      port: dbConnValues[4],
      ssl: { rejectUnauthorized: false },
    };
  } else {
    connObject = connectionString;
  }
  return connObject;
};

const knexConfig = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === 'debug',
  connection: connectionObject(connection),
  pool: { min: 0, max: 10 },
};

const knexConfigMainDB = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === 'debug',
  connection: connectionObject(connectionMainDB),
  pool: { min: 0, max: 10 },
};

log.debug(process.env.DATABASE_SCHEMA);
if (process.env.DATABASE_SCHEMA) {
  log.info('setting a schema');
  knexConfig.searchPath = [process.env.DATABASE_SCHEMA];
}
log.debug(knexConfig.searchPath);

module.exports = {
  knex: knex(knexConfig),
  knexMainDB: knexMainDB(knexConfigMainDB),
};
