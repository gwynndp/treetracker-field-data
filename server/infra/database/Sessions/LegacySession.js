const { knexLegacyDB } = require('../knex');
const BaseSession = require('./BaseSession');

class LegacySession extends BaseSession {
  constructor() {
    super(knexLegacyDB);
  }
}

module.exports = LegacySession;
