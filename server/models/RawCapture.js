const RawCaptureRepository = require('../repositories/RawCaptureRepository');
const { DomainEventTypes } = require('../utils/enums');
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
    rejection_reason,
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
      rejection_reason,
      bulk_pack_file_name,
      created_at,
      updated_at,
      captured_at,
      organization_id,
    });
  }

  static RawCaptureCreated({
    id,
    reference_id,
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
      type: DomainEventTypes.RawCaptureCreated,
      reference_id,
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
      let domainEvent = await domainEventModel.getDomainEventByPayloadIdAndType(
        rawCaptureObject.id,
        DomainEventTypes.RawCaptureCreated,
      );
      if (!domainEvent) {
        const rawCaptureToRaise = this.constructor.RawCaptureCreated({
          ...existingRawCapture,
        });

        domainEvent = await domainEventModel.raiseEvent(rawCaptureToRaise);
        return { capture: existingRawCapture, domainEvent, status: 200 };
      }
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

  async applyVerification(capture) {
    await this._rawCaptureRepository.update({
      id: capture.id,
      status: 'approved',
      updated_at: new Date().toISOString(),
    });
  }

  async rejectRawCapture({ rawCaptureId, rejectionReason }) {
    const rawCapture = await this.getRawCaptureById(rawCaptureId);
    let domainEvent;
    if (rawCapture.status === 'approved') {
      const domainEventModel = new DomainEvent(this._session);
      domainEvent = await domainEventModel.getDomainEventByPayloadIdAndType(
        rawCaptureId,
        DomainEventTypes.RawCaptureRejected,
      );
      if (!domainEvent) {
        domainEvent = await domainEventModel.raiseEvent({
          id: rawCaptureId,
          type: DomainEventTypes.RawCaptureRejected,
        });
      } else if (domainEvent.status === 'sent') {
        domainEvent = null;
      }
    }

    const updates = {
      id: rawCaptureId,
      rejection_reason: rejectionReason,
      status: 'rejected',
      updated_at: new Date().toISOString(),
    };

    await this._rawCaptureRepository.update({
      ...updates,
    });

    return { rawCapture: { ...rawCapture, ...updates }, domainEvent };
  }
}

module.exports = RawCapture;
