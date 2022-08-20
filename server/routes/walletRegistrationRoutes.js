const express = require('express');

const router = express.Router();
const {
  walletRegistrationPost,
  walletRegistrationGet,
  walletRegistrationSingleGet,
} = require('../handlers/walletRegistrationHandler');
const { handlerWrapper } = require('../utils/utils');

router
  .route('/wallet-registration')
  .post(handlerWrapper(walletRegistrationPost))
  .get(handlerWrapper(walletRegistrationGet));
router
  .route('/wallet-registration/:wallet_registration_id')
  .get(handlerWrapper(walletRegistrationSingleGet));

module.exports = router;
