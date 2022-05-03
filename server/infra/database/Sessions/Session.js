const { knex } = require('../knex');
const BaseSession = require('./BaseSession');

class Session extends BaseSession {
  constructor() {
    super(knex);
  }
}

module.exports = Session;
