const RawCaptureRepository = require('../repositories/RawCaptureRepository');
const DomainEvent = require('./DomainEvent');

class RawCapture {
  constructor(session) {
    this._session = session;
    this._rawCaptureRepository = new RawCaptureRepository(session);
  }

  static RawCapture({
    id,
    reference_id,
    session_id,
    abs_step_count,
    delta_step_count,
    rotation_matrix,
    image_url,
    lat,
    lon,
    gps_accuracy,
    note,
    device_identifier,
    grower_account_id,
    wallet,
    user_photo_url,
    extra_attributes,
    status,
    bulk_pack_file_name,
    created_at,
    updated_at,
    captured_at,
    organization_id,
  }) {
    return Object.freeze({
      id,
      reference_id,
      session_id,
      abs_step_count,
      delta_step_count,
      rotation_matrix,
      image_url,
      lat,
      lon,
      gps_accuracy,
      note,
      device_identifier,
      grower_account_id,
      wallet,
      user_photo_url,
      extra_attributes,
      status,
      bulk_pack_file_name,
      created_at,
      updated_at,
      captured_at,
      organization_id,
    });
  }

  static RawCaptureCreated({
    id,
    lat,
    lon,
    field_user_id,
    field_username,
    extra_attributes,
    created_at,
    captured_at,
  }) {
    return Object.freeze({
      id,
      type: 'RawCaptureCreated',
      lat,
      lon,
      field_user_id,
      field_username,
      extra_attributes,
      created_at,
      captured_at,
    });
  }

  _response(rawCapture) {
    return this.constructor.RawCapture(rawCapture);
  }

  async getRawCaptures(filter, limitOptions) {
    const rawCaptures = await this._rawCaptureRepository.getByFilter(
      filter,
      limitOptions,
    );
    return rawCaptures.map((row) => this._response(row));
  }

  async getRawCapturesCount(filter) {
    return this._rawCaptureRepository.countByFilter(filter);
  }

  async getRawCaptureById(rawCaptureId) {
    const rawCaptures = await this.getRawCaptures({
      'raw_capture.id': rawCaptureId,
    });
    return rawCaptures[0];
  }

  async createRawCapture(rawCaptureObject) {
    const domainEventModel = new DomainEvent(this._session);

    const existingRawCapture = await this.getRawCaptureById(
      rawCaptureObject.id,
    );
    if (existingRawCapture?.id) {
      const domainEvent = await domainEventModel.getDomainEventByPayloadId(
        rawCaptureObject.id,
      );
      if (domainEvent.status !== 'sent') {
        return {
          domainEvent,
          capture: existingRawCapture,
          status: 200,
        };
      }
      return { capture: existingRawCapture, status: 200 };
    }

    const rawCapture = await this._rawCaptureRepository.create({
      ...rawCaptureObject,
      status: 'unprocessed',
      // extra_attributes: { entries: newRawCapture.extra_attributes },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    // remove extra_attributes until implemented on mobile side
    // const filteredAttr = rawCapture.extra_attributes.entries?.filter(
    //   (attribute) => attribute.key === 'app_flavor',
    // );

    const rawCaptureCreated = this.constructor.RawCaptureCreated({
      ...rawCapture,
      // extra_attributes: filteredAttr,
    });

    const domainEvent = await domainEventModel.raiseEvent(rawCaptureCreated);
    return { capture: rawCapture, domainEvent, status: 201 };
  }

  async updateRawCapture(rawCaptureObject) {
    const rawCapture = await this._rawCaptureRepository.update({
      ...rawCaptureObject,
      updated_at: new Date().toISOString(),
    });

    return { capture: rawCapture, status: 200 };
  }

  async applyVerification(verifyCaptureProcessed) {
    if (verifyCaptureProcessed.approved) {
      await this._rawCaptureRepository.update({
        id: verifyCaptureProcessed.id,
        status: 'approved',
      });
    } else {
      await this._rawCaptureRepository.update({
        id: verifyCaptureProcessed.id,
        status: 'rejected',
        rejection_reason: verifyCaptureProcessed.rejection_reason,
      });
    }
  }
}

module.exports = RawCapture;
