const express = require('express');

const router = express.Router();

const {
  sessionPost,
  sessionGet,
  sessionSingleGet,
} = require('../handlers/sessionHandler');
const { handlerWrapper } = require('../utils/utils');

router
  .route('/session')
  .post(handlerWrapper(sessionPost))
  .get(handlerWrapper(sessionGet));
router.route('/session/:session_id').get(handlerWrapper(sessionSingleGet));

module.exports = router;
