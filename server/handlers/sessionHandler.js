const Joi = require('joi');
const SessionService = require('../services/SessionService');
const HttpError = require('../utils/HttpError');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../utils/helper');

const sessionGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
});

const sessionPostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  device_configuration_id: Joi.string().uuid().required(),
  originating_wallet_registration_id: Joi.string().uuid().required(),
  target_wallet: Joi.string(),
  check_in_photo_url: Joi.string().uri(),
  track_url: Joi.string().uri(),
  organization: Joi.string().allow(null, ''),
}).unknown(false);

const sessionIdParamSchema = Joi.object({
  session_id: Joi.string().uuid().required(),
}).unknown(false);

const sessionPost = async function (req, res) {
  await sessionPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const sessionService = new SessionService();
  const { session, status } = await sessionService.createSession(req.body);

  res.status(status).send(session);
};

const sessionGet = async function (req, res) {
  await sessionGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const sessionService = new SessionService();
  const sessions = await sessionService.getSessions(filter, limitOptions);
  const count = await sessionService.getSessionsCount(filter);

  const url = 'session';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({ sessions, links, query: { count, ...limitOptions, ...filter } });
};

const sessionSingleGet = async function (req, res) {
  await sessionIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const sessionService = new SessionService();

  const session = await sessionService.getSessionById(req.params.session_id);

  if (!session?.id) {
    throw new HttpError(404, `session with ${req.params.session_id} not found`);
  }

  res.send(session);
};

module.exports = {
  sessionPost,
  sessionGet,
  sessionSingleGet,
};
