const express = require('express');

const router = express.Router();
const {
  rawCapturePost,
  rawCaptureGet,
  rawCaptureSingleGet,
  rawCaptureSingleUpdate,
} = require('./handlers/rawCaptureHandler');
const {
  walletRegistrationPost,
  walletRegistrationGet,
  walletRegistrationSingleGet,
} = require('./handlers/walletRegistrationHandler');
const {
  deviceConfigurationPost,
  deviceConfigurationGet,
  deviceConfigurationSingleGet,
} = require('./handlers/deviceConfigurationHandler');
const replayEventPost = require('./handlers/replayEventHandler');
const {
  sessionPost,
  sessionGet,
  sessionSingleGet,
} = require('./handlers/sessionHandler');
const { handlerWrapper } = require('./utils/utils');

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

router
  .route('/raw-captures')
  .post(handlerWrapper(rawCapturePost))
  .get(handlerWrapper(rawCaptureGet));
router
  .route('/raw-captures/:raw_capture_id')
  .get(handlerWrapper(rawCaptureSingleGet))
  .patch(handlerWrapper(rawCaptureSingleUpdate));

router.post('/replay-events', handlerWrapper(replayEventPost));

module.exports = router;
