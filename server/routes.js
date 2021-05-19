const express = require('express');
const router = express.Router();
const { rawCapturePost, rawCaptureGet } = require('./handlers/rawCaptureHandler.js');
const replayEventPost = require('./handlers/replayEventHandler');

router.post('/raw-captures', rawCapturePost);
router.get('/raw-captures', rawCaptureGet);
router.post('/replay-events', replayEventPost);

module.exports = router;
