const express = require('express');
const router = express.Router();
const { rawCapturePost, rawCaptureGet } = require('./handlers/rawCaptureHandler.js');

router.post('/raw-captures', rawCapturePost);
router.get('/raw-captures', rawCaptureGet);

module.exports = router;
