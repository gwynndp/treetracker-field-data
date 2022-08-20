const express = require('express');

const router = express.Router();

const { replayEventPost } = require('../handlers/replayEventHandler');
const { handlerWrapper } = require('../utils/utils');

router.post('/replay-events', handlerWrapper(replayEventPost));

module.exports = router;
