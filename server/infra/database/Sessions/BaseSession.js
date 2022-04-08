class BaseSession {
  constructor(knex) {
    this._knex = knex;
    this.thx = undefined;
  }

  getDB() {
    if (this.thx) {
      return this.thx;
    }
    return this._knex;
  }

  isTransactionInProgress() {
    return this.thx !== undefined;
  }

  async beginTransaction() {
    if (this.thx) {
      throw new Error('Can not start transaction in transaction');
    }
    this.thx = await this._knex.transaction();
  }

  async commitTransaction() {
    if (!this.thx) {
      throw new Error('Can not commit transaction before start it!');
    }
    await this.thx.commit();
    this.thx = undefined;
  }

  async rollbackTransaction() {
    if (!this.thx) {
      throw new Error('Can not rollback transaction before start it!');
    }
    await this.thx.rollback();
    this.thx = undefined;
  }
}

module.exports = BaseSession;
