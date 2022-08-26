const express = require('express');

const router = express.Router();

const {
  deviceConfigurationPost,
  deviceConfigurationGet,
  deviceConfigurationSingleGet,
} = require('../handlers/deviceConfigurationHandler');
const { handlerWrapper } = require('../utils/utils');

router
  .route('/device-configuration')
  .post(handlerWrapper(deviceConfigurationPost))
  .get(handlerWrapper(deviceConfigurationGet));
router
  .route('/device-configuration/:device_configuration_id')
  .get(handlerWrapper(deviceConfigurationSingleGet));

module.exports = router;
