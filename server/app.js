const express = require('express');
const Sentry = require('@sentry/node');
const bodyParser = require('body-parser');
const HttpError = require("./utils/HttpError");
const {errorHandler} = require("./routes/utils");
const log = require("loglevel");
const helper = require("./routes/utils");

const app = express();
const config = require('../config/config.js');
const captureRouter = require('./routes/captureHandler');
const registerEventHandlers = require('./services/EventHandlers');

Sentry.init({ dsn: config.sentry_dsn });

/*
 * Check request
 */
app.use(helper.handlerWrapper(async (req, _res, next) => {
  if(req.method === "POST" || req.method === "PATCH"  || req.method === "PUT" ){
    if(req.headers['content-type'] !== "application/json"){
    throw new HttpError(415, "Invalid content type. API only supports application/json");
    }
  }
  next();
}));

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

//routers
app.use('/captures', captureRouter);

// Global error handler
app.use(errorHandler);

const version = require('../package.json').version
app.get('*',function (req, res) {
  res.status(200).send(version)
});

registerEventHandlers();

module.exports = app; 
