const express = require('express');
const Sentry = require('@sentry/node');
const bodyParser = require('body-parser');
const log = require('loglevel');
const HttpError = require('./handlers/HttpError');
const { errorHandler, handlerWrapper } = require('./handlers/utils');
const helper = require('./handlers/utils');
const router = require('./routes.js');

const app = express();
const config = require('../config/config.js');
const { registerEventHandlers } = require('./services/event-handlers');

Sentry.init({ dsn: config.sentry_dsn });

/*
 * Check request
 */
app.use(
  handlerWrapper(async (req, _res, next) => {
    if (
      req.method === 'POST' ||
      req.method === 'PATCH' ||
      req.method === 'PUT'
    ) {
      if (req.headers['content-type'] !== 'application/json') {
        throw new HttpError(
          415,
          'Invalid content type. API only supports application/json',
        );
      }
    }
    next();
  }),
);

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// routers
app.use('/', router);
// Global error handler
app.use(errorHandler);

const { version } = require('../package.json');

app.get('*', function (req, res) {
  res.status(200).send(version);
});

registerEventHandlers();

module.exports = app;
