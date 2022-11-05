const BaseRepository = require('./BaseRepository');

class SessionRepository extends BaseRepository {
  constructor(session) {
    super('session', session);
    this._tableName = 'session';
    this._session = session;
  }

  async getSessions(filterCriteria, limitOptions) {
    return this._session
      .getDB()(this._tableName)
      .where(filterCriteria)
      .select(
        'session.id',
        'session.device_configuration_id',
        'session.originating_wallet_registration_id',
        'session.target_wallet',
        'session.check_in_photo_url',
        'session.track_url',
        'session.re_tracking',
        'session.organization',
        'session.organization_id',
        'session.created_at',
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
      )
      .limit(limitOptions.limit)
      .offset(limitOptions.offset);
  }
}

module.exports = SessionRepository;
