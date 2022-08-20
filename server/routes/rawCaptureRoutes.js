const express = require('express');

const router = express.Router();
const {
  rawCapturePost,
  rawCaptureGet,
  rawCaptureSingleGet,
} = require('../handlers/rawCaptureHandler');
const { handlerWrapper } = require('../utils/utils');

router
  .route('/raw-captures')
  .post(handlerWrapper(rawCapturePost))
  .get(handlerWrapper(rawCaptureGet));
router
  .route('/raw-captures/:raw_capture_id')
  .get(handlerWrapper(rawCaptureSingleGet));

module.exports = router;
