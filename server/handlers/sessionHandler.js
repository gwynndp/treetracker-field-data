const Joi = require('joi');
const log = require('loglevel');

const Session = require('../infra/database/Session');
const SessionRepository = require('../infra/database/SessionRepository');
const { getSession, SessionModel } = require('../models/SessionModel');

const sessionPostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  device_configuration_id: Joi.string().uuid().required(),
  originating_wallet_registration_id: Joi.string().uuid().required(),
  target_wallet: Joi.string(),
  check_in_photo_url: Joi.string().uri(),
  track_url: Joi.string().uri(),
  organization: Joi.string().allow(null, ''),
  bulk_pack_file_name: Joi.string(),
}).unknown(false);

const sessionIdParamSchema = Joi.object({
  session_id: Joi.string().uuid().required(),
}).unknown(false);

const sessionPost = async function (req, res, next) {
  await sessionPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const session = new Session();
  const sessionRepo = new SessionRepository(session);

  try {
    const newSession = {
      ...req.body,
      created_at: new Date().toISOString(),
    };
    const { id } = newSession;
    const existingSession = await sessionRepo.getByFilter({ id });
    const [dbSession] = existingSession;

    if (!dbSession) {
      await session.beginTransaction();
      const createdSession = await sessionRepo.create(newSession);
      await session.commitTransaction();
      return res.status(201).json(createdSession);
    }
    res.status(200).json(dbSession);
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

const sessionGet = async function (req, res) {
  const session = new Session();
  const sessionRepo = new SessionRepository(session);

  const executeGetSession = getSession(sessionRepo);
  const sessions = await executeGetSession(req.query);

  res.send(sessions);
};

const sessionSingleGet = async function (req, res) {
  await sessionIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const sessionRepo = new SessionRepository(session);

  const dbSessions = await sessionRepo.getByFilter({
    id: req.params.session_id,
  });

  const [dbSession = {}] = dbSessions;

  res.send(SessionModel(dbSession));
};

module.exports = {
  sessionPost,
  sessionGet,
  sessionSingleGet,
};
