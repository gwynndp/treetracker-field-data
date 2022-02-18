const express = require('express');

const router = express.Router();
const {
  rawCapturePost,
  rawCaptureGet,
} = require('./handlers/rawCaptureHandler.js');
const {
  walletRegistrationPost,
  walletRegistrationGet,
  walletRegistrationSingleGet,
} = require('./handlers/walletRegistrationHandler.js');
const {
  deviceConfigurationPost,
  deviceConfigurationGet,
  deviceConfigurationSingleGet,
} = require('./handlers/deviceConfigurationHandler.js');
const replayEventPost = require('./handlers/replayEventHandler');
const {
  sessionPost,
  sessionGet,
  sessionSingleGet,
} = require('./handlers/sessionHandler.js');
const { handlerWrapper } = require('./handlers/utils');

router
  .route('/wallet-registration')
  .post(handlerWrapper(walletRegistrationPost))
  .get(handlerWrapper(walletRegistrationGet));
router
  .route('/wallet-registration/:wallet_registration_id')
  .get(handlerWrapper(walletRegistrationSingleGet));

router
  .route('/device-configuration')
  .post(handlerWrapper(deviceConfigurationPost))
  .get(handlerWrapper(deviceConfigurationGet));
router
  .route('/device-configuration/:device_configuration_id')
  .get(handlerWrapper(deviceConfigurationSingleGet));

router
  .route('/session')
  .post(handlerWrapper(sessionPost))
  .get(handlerWrapper(sessionGet));
router.route('/session/:session_id').get(handlerWrapper(sessionSingleGet));

router.post('/raw-captures', handlerWrapper(rawCapturePost));
router.get('/raw-captures', handlerWrapper(rawCaptureGet));
router.post('/replay-events', handlerWrapper(replayEventPost));

module.exports = router;
