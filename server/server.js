require('dotenv').config();
const log = require('loglevel');
// setup log level
require('./setup');
const app = require('./app');

const port = process.env.NODE_PORT || 3006;
const { knex, knexMainDB } = require('./infra/database/knex');

const server = app.listen(port, () => {
  log.info(`listening on port:${port}`);
  log.debug('debug log level!');
});

process.once('SIGINT', function (code) {
  console.log('Terminate request received...');
  knex.destroy();
  knexMainDB.destroy();
  server.close();
});
