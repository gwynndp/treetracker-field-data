const SessionService = require('../../services/SessionService');
const HttpError = require('../../utils/HttpError');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../../utils/helper');
const {
  sessionGetQuerySchema,
  sessionPostSchema,
  sessionIdParamSchema,
} = require('./schemas');

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

  // verify filter values

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
