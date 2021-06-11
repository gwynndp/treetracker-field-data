const expect = require('expect-runtime');
const connection = require('../../../config/config').connectionString;
const connectionMainDB = require('../../../config/config').connectionStringMainDB;
expect(connection).to.match(/^postgresql:\//);
const log = require("loglevel");

// We need to parse the connection string into a connection object
// so that pg 8  won't throw an SSL error when connecting to the postgres database 
// when running node version greater than 12
const urlregexp = /postgresql:\/\/(.+):(.+)@(.+):(\d+)\/(.+)\?ssl=true/g;
const dbConnValues = [...connection.matchAll(urlregexp)][0];
const mainDBConnValues =[...connectionMainDB.matchAll(urlregexp)][0];

let knexConfig = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === "debug"? true:false,
  connection: {
    host: dbConnValues[3],
    user: dbConnValues[1],
    password: dbConnValues[2],
    database: dbConnValues[5],
    port: dbConnValues[4],
    ssl: { rejectUnauthorized: false }
  },
  pool: { min:0, max: 10 },
};

let knexConfigMainDB = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === "debug"? true: false,
  connection: {
    host: mainDBConnValues[3],
    user: mainDBConnValues[1],
    password: mainDBConnValues[2],
    database: mainDBConnValues[5],
    port: mainDBConnValues[4],
    ssl: { rejectUnauthorized: false }
  },
  pool: { min:0, max:10 },
};

log.debug(process.env.DATABASE_SCHEMA);
if(process.env.DATABASE_SCHEMA){
  log.info('setting a schema')
  knexConfig.searchPath = [process.env.DATABASE_SCHEMA]
};
log.debug(knexConfig.searchPath);

const knex = require('knex')(knexConfig);
const knexMainDB = require('knex')(knexConfigMainDB);

module.exports = { knex, knexMainDB };
