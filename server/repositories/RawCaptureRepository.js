const BaseRepository = require('./BaseRepository');

class RawCaptureRepository extends BaseRepository {
  constructor(session) {
    super('raw_capture', session);
    this._tableName = 'raw_capture';
    this._session = session;
  }

  async getByFilter(filterCriteria, options) {
    const promise = this._session
      .getDB()(this._tableName)
      .where(filterCriteria)
      .select(
        'raw_capture.id',
        'raw_capture.reference_id',
        'raw_capture.image_url',
        'raw_capture.lat',
        'raw_capture.lon',
        'raw_capture.gps_accuracy',
        'raw_capture.note',
        'raw_capture.abs_step_count',
        'raw_capture.delta_step_count',
        'raw_capture.rotation_matrix',
        'raw_capture.session_id',
        'raw_capture.rejection_reason',
        'device_configuration.device_identifier',
        'wallet_registration.grower_account_id',
        'wallet_registration.wallet',
        'wallet_registration.user_photo_url',
        'raw_capture.extra_attributes',
        'raw_capture.status',
        'raw_capture.created_at',
        'raw_capture.updated_at',
        'raw_capture.captured_at',
      )
      .leftJoin('session', 'raw_capture.session_id', '=', 'session.id')
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
      .orderBy('created_at', 'desc');

    if (options && options.limit) {
      promise.limit(options.limit);
    }

    if (options && options.offset) {
      promise.limit(options.offset);
    }

    return promise;
  }

  async add(rawCapture) {
    const knex = this._session.getDB();
    const result = await this._session
      .getDB()
      .with(
        'createdRawCapture',
        knex.insert(rawCapture).into(this._tableName).returning('*'),
      )
      .select(
        'createdRawCapture.id',
        'createdRawCapture.reference_id',
        'createdRawCapture.image_url',
        'createdRawCapture.lat',
        'createdRawCapture.lon',
        'createdRawCapture.gps_accuracy',
        'createdRawCapture.note',
        'createdRawCapture.abs_step_count',
        'createdRawCapture.delta_step_count',
        'createdRawCapture.rotation_matrix',
        'createdRawCapture.session_id',
        'createdRawCapture.rejection_reason',
        'device_configuration.device_identifier',
        'wallet_registration.grower_account_id',
        'wallet_registration.wallet',
        'wallet_registration.user_photo_url',
        'createdRawCapture.extra_attributes',
        'createdRawCapture.status',
        'createdRawCapture.created_at',
        'createdRawCapture.updated_at',
        'createdRawCapture.captured_at',
      )
      .from('createdRawCapture')
      .leftJoin('session', 'createdRawCapture.session_id', '=', 'session.id')
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

    return result[0];
  }
}

module.exports = RawCaptureRepository;
