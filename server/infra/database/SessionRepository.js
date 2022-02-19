const BaseRepository = require('./BaseRepository');

class SessionRepository extends BaseRepository {
  constructor(session) {
    super('session', session);
    this._tableName = 'session';
    this._session = session;
  }

  async getSession(filterCriteria) {
    return await this._session
      .getDB()(this._tableName)
      .where(filterCriteria)
      .select(
        'device_configuration.device_identifier',
        'wallet_registration.grower_account_id',
        'wallet_registration.wallet',
        'wallet_registration.user_photo_url',
      )
      .leftJoin(
        'wallet_registration',
        'session.originating_wallet_registration_id',
        '=',
        'wallet_registration.id',
      )
      .leftJoin(
        'device_configuration',
        'session.device_configuration_id',
        '=',
        'device_configuration.id',
      );
  }
}

module.exports = SessionRepository;
