const Session = require('../infra/database/Sessions/Session');
const SessionModel = require('../models/SessionModel');

class SessionService {
  constructor() {
    this._session = new Session();
    this._sessionModel = new SessionModel(this._session);
    this._wrKeys = ['grower_account_id', 'wallet', 'user_photo_url'];
  }

  formatKeys(filter) {
    return Object.entries(filter).reduce((obj, [key, val]) => {
      const copy = { ...obj };
      if (this._wrKeys.includes(key)) {
        copy[`wallet_registration.${key}`] = val;
      } else {
        copy[`session.${key}`] = val;
      }
      return copy;
    }, {});
  }

  async getSessions(filter, limitOptions) {
    const formatedFilter = this.formatKeys(filter);
    return this._sessionModel.getSessions(formatedFilter, limitOptions);
  }

  async getSessionsCount(filter) {
    const formatedFilter = this.formatKeys(filter);
    return this._sessionModel.getSessionsCount(formatedFilter);
  }

  async getSessionById(sessionId) {
    return this._sessionModel.getSessionById(sessionId);
  }

  async createSession(sessionObject) {
    try {
      await this._session.beginTransaction();
      const response = await this._sessionModel.createSession(sessionObject);
      await this._session.commitTransaction();

      return response;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = SessionService;
