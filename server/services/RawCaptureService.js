const Session = require('../infra/database/Sessions/Session');
const LegacySession = require('../infra/database/Sessions/LegacySession');
const RawCapture = require('../models/RawCapture');
const LegacyTree = require('../models/LegacyTree');
const SessionModel = require('../models/SessionModel');
const QueueService = require('./QueueService');
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

      const {
        capture,
        status,
        domainEvent,
      } = await this._rawCapture.createRawCapture({
        ...rawCaptureObject,
        reference_id: legacyTree.id,
      });

      await this._session.commitTransaction();
      await legacySession.commitTransaction();

      if (domainEvent) {
        const queueService = new QueueService(this._session);
        await queueService.init();
        queueService.publishRawCaptureCreatedMessage(domainEvent);
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

  async updateRawCapture(rawCaptureObject) {
    return this._rawCapture.updateRawCapture(rawCaptureObject);
  }
}

module.exports = RawCaptureService;
