const express = require('express');

const router = express.Router();

const {
  trackGet,
  trackPost,
  trackSingleGet,
} = require('../handlers/tracksHandler');
const { handlerWrapper } = require('../utils/utils');

router
  .route('/track')
  .post(handlerWrapper(trackPost))
  .get(handlerWrapper(trackGet));
router.route('/track/:track_id').get(handlerWrapper(trackSingleGet));

module.exports = router;
