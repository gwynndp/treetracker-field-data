const express = require('express');

const router = express.Router();
const {
  rawCapturePost,
  rawCaptureGet,
  rawCaptureSingleGet,
  rawCaptureRejectPatch,
} = require('../handlers/rawCaptureHandler');
const { handlerWrapper } = require('../utils/utils');

router
  .route('/raw-captures')
  .post(handlerWrapper(rawCapturePost))
  .get(handlerWrapper(rawCaptureGet));
router
  .route('/raw-captures/:raw_capture_id')
  .get(handlerWrapper(rawCaptureSingleGet));
router
  .route('/raw-captures/:raw_capture_id/reject')
  .patch(handlerWrapper(rawCaptureRejectPatch));

module.exports = router;
