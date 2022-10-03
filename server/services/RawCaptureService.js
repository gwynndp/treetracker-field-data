const Session = require('../infra/database/Sessions/Session');
const LegacySession = require('../infra/database/Sessions/LegacySession');
const RawCapture = require('../models/RawCapture');
const LegacyTree = require('../models/LegacyTree');
const SessionModel = require('../models/SessionModel');
const QueueService = require('./QueueService');
const LegacyAPIService = require('./LegacyAPIService');
const HttpError = require('../utils/HttpError');

class RawCaptureService {
  constructor() {
    this._session = new Session();
    this._rawCapture = new RawCapture(this._session);
  }

  async getRawCaptures(filter, limitOptions) {
    return this._rawCapture.getRawCaptures(filter, limitOptions);
  }

  async getRawCapturesCount(filter) {
    return this._rawCapture.getRawCapturesCount(filter);
  }

  async getRawCaptureById(rawCaptureId) {
    return this._rawCapture.getRawCaptureById(rawCaptureId);
  }

  async createRawCapture(rawCaptureObject) {
    const legacySession = new LegacySession();
    const legacyTreeModel = new LegacyTree(legacySession);
    const sessionModel = new SessionModel(this._session);

    try {
      const sessionObject = await sessionModel.getSessionById(
        rawCaptureObject.session_id,
      );
      if (!sessionObject?.id) {
        throw new HttpError(
          409,
          `A session resource with id, ${rawCaptureObject.session_id} has yet to be created, kindly retry later`,
        );
      }

      await legacySession.beginTransaction();

      // capture's id overwrites the session's id
      const legacyTreeObject = await legacyTreeModel.legacyTree({
        ...sessionObject,
        ...rawCaptureObject,
      });

      const legacyTree = await legacyTreeModel.createTreesInLegacyDB(
        { ...legacyTreeObject },
        rawCaptureObject.extra_attributes || [],
      );

      await this._session.beginTransaction();

      const { capture, status, domainEvent } =
        await this._rawCapture.createRawCapture({
          ...rawCaptureObject,
          reference_id: legacyTree.id,
        });

      await this._session.commitTransaction();
      await legacySession.commitTransaction();

      if (domainEvent) {
        const queueService = new QueueService(this._session);
        await queueService.init();
        queueService.publishRawCaptureCreatedMessage(domainEvent);
        queueService.tearDown();
      }

      return { capture, status };
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      if (legacySession.isTransactionInProgress()) {
        await legacySession.rollbackTransaction();
      }
      throw e;
    }
  }

  async rejectRawCapture({
    rejectionReason,
    organizationId,
    rawCaptureId,
    legacyAPIAuthorizationHeader,
  }) {
    try {
      await this._session.beginTransaction();

      // get the legacy id of the tree in the legacy DB
      const rawCapture = await this.getRawCaptureById(rawCaptureId);
      const legacyTreeId = rawCapture.reference_id;

      // update the legacy API
      await LegacyAPIService.rejectLegacyTree({
        id: +legacyTreeId,
        organizationId,
        legacyAPIAuthorizationHeader,
        rejectionReason,
      });

      const { rawCapture: updatedRawCapture, domainEvent } =
        await this._rawCapture.rejectRawCapture({
          rawCaptureId,
          rejectionReason,
        });

      await this._session.commitTransaction();

      if (domainEvent) {
        //   console.log('are we getting here');
        const queueService = new QueueService(this._session);
        await queueService.init();
        queueService.publishRawCaptureRejectedMessage(domainEvent);
        queueService.tearDown();
      }

      return updatedRawCapture;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = RawCaptureService;
