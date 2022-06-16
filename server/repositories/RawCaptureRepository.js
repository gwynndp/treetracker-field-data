const expect = require('expect-runtime');

const BaseRepository = require('./BaseRepository');

class RawCaptureRepository extends BaseRepository {
  constructor(session) {
    super('raw_capture', session);
    this._tableName = 'raw_capture';
    this._session = session;
  }

  _filterWhereBuilder(object, builder) {
    const result = builder;
    const {
      whereNulls = [],
      whereNotNulls = [],
      whereIns = [],
      ...parameters
    } = object;

    if (parameters.tokenized === 'true') {
      whereNotNulls.push('wallet.token.id');
    } else if (parameters.tokenized === 'false') {
      whereNulls.push('wallet.token.id');
    }
    delete parameters.tokenized;

    result.whereNot(`${this._tableName}.status`, 'deleted');
    whereNotNulls.forEach((whereNot) => {
      result.whereNotNull(whereNot);
    });

    whereNulls.forEach((whereNull) => {
      result.whereNull(whereNull);
    });

    whereIns.forEach((whereIn) => {
      result.whereIn(whereIn.field, whereIn.values);
    });

    const filterObject = { ...parameters };

    if (filterObject.startDate) {
      result.where(
        `${this._tableName}.captured_at`,
        '>=',
        filterObject.startDate,
      );
      delete filterObject.startDate;
    }
    if (filterObject.endDate) {
      result.where(
        `${this._tableName}.captured_at`,
        '<=',
        filterObject.endDate,
      );
      delete filterObject.endDate;
    }

    // if (filterObject.tag) {
    //   filterObject[`treetracker.tag.name`] = filterObject.tag;
    //   delete filterObject.tag;
    // }

    if (filterObject.id) {
      result.where(`${this._tableName}.id`, '=', filterObject.id);
      delete filterObject.id;
    }

    if (filterObject.reference_id) {
      result.where(
        `${this._tableName}.reference_id`,
        '=',
        filterObject.reference_id,
      );
      delete filterObject.reference_id;
    }

    if (filterObject.organization_ids) {
      result.where(
        `${this._tableName}.planting_organization_id`,
        'in',
        filterObject.organization_ids.split(','),
      );
      delete filterObject.organization_ids;
    }

    result.where(filterObject);
  }

  async getByFilter(filterCriteria, options) {
    const promise = this._session
      .getDB()(this._tableName)
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
        'device_configuration.id as device_configuration_id',
        'wallet_registration.grower_account_id',
        'wallet_registration.wallet',
        'wallet_registration.user_photo_url',
        'raw_capture.extra_attributes',
        'raw_capture.status',
        'raw_capture.created_at',
        'raw_capture.updated_at',
        'raw_capture.captured_at',
        'session.organization_id',
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
      .orderBy(`${this._tableName}.created_at`, 'desc')
      .where((builder) => this._filterWhereBuilder(filterCriteria, builder));

    if (options && options.limit) {
      promise.limit(options.limit);
    }

    if (options && options.offset) {
      promise.offset(options.offset);
    }

    return promise;
  }

  async countByFilter(filter) {
    const result = await this._session
      .getDB()(this._tableName)
      .count()
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
      .where((builder) => this._filterWhereBuilder(filter, builder));

    expect(result).match([
      {
        count: expect.any(String),
      },
    ]);

    return parseInt(result[0].count);
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

  async update(rawCapture) {
    const result = await this._session
      .getDB()
      .update('status', rawCapture.status)
      .into(this._tableName)
      .where('id', rawCapture.id)
      .returning('*');

    return result[0];
  }
}

module.exports = RawCaptureRepository;
