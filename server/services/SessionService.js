const Session = require('../infra/database/Sessions/Session');
const SessionModel = require('../models/SessionModel');

class SessionService {
  constructor() {
    this._session = new Session();
    this._sessionModel = new SessionModel(this._session);
  }

  async getSessions(filter, limitOptions) {
    return this._sessionModel.getSessions(filter, limitOptions);
  }

  async getSessionsCount(filter) {
    return this._sessionModel.getSessionsCount(filter);
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
