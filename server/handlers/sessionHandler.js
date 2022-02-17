const Joi = require('joi');
const log = require('loglevel');

const Session = require('../infra/database/Session');
const SessionRepository = require('../infra/database/SessionRepository');

const sessionPostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  device_configuration_id: Joi.string().uuid().required(),
  originating_wallet_registration_id: Joi.string().uuid().required(),
  target_wallet: Joi.string(),
  check_in_photo_url: Joi.string().uri(),
  track_url: Joi.string().uri(),
  organization: Joi.string(),
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

    if (existingSession.length === 0) {
      await session.beginTransaction();
      await sessionRepo.create(newSession);
      await session.commitTransaction();
    }
    res.status(200).json();
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

module.exports = {
  sessionPost,
};
