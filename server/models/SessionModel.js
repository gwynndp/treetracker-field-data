const SessionRepository = require('../repositories/SessionRepository');

class SessionModel {
  constructor(session) {
    this._sessionRepository = new SessionRepository(session);
  }

  static SessionModel({
    id,
    device_configuration_id,
    originating_wallet_registration_id,
    target_wallet,
    check_in_photo_url,
    track_url,
    organization,
    device_identifier,
    grower_account_id,
    wallet,
    user_photo_url,
    bulk_pack_file_name,
    created_at,
  }) {
    return Object.freeze({
      id,
      device_configuration_id,
      originating_wallet_registration_id,
      target_wallet,
      check_in_photo_url,
      track_url,
      organization,
      device_identifier,
      grower_account_id,
      wallet,
      user_photo_url,
      bulk_pack_file_name,
      created_at,
    });
  }

  _response(session) {
    return this.constructor.SessionModel(session);
  }

  async getSessions(filter, limitOptions) {
    const sessions = await this._sessionRepository.getSessions(
      filter,
      limitOptions,
    );
    return sessions.map((row) => this._response(row));
  }

  async getSessionsCount(filter) {
    return this._sessionRepository.countByFilter(filter);
  }

  async getSessionById(sessionId) {
    const sessions = await this.getSessions(
      { 'session.id': sessionId },
      { limit: 1 },
    );
    return sessions[0];
  }

  async createSession(sessionObject) {
    const existingSession = await this.getSessionById(sessionObject.id);

    if (!existingSession?.id) {
      const createdSession = await this._sessionRepository.create({
        ...sessionObject,
        created_at: new Date().toISOString(),
      });
      return { session: this._response(createdSession), status: 201 };
    }
    return { session: existingSession, status: 200 };
  }
}

module.exports = SessionModel;
