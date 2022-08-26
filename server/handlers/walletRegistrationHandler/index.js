const HttpError = require('../../utils/HttpError');
const WalletRegistrationService = require('../../services/WalletRegistrationService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../../utils/helper');
const {
  walletRegistrationPostSchema,
  walletRegistrationIdParamSchema,
  walletRegistrationGetQuerySchema,
} = require('./schemas');

const walletRegistrationPost = async function (req, res) {
  await walletRegistrationPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  if (!req.body.phone && !req.body.email) {
    throw new HttpError(422, 'Either phone or email is required');
  }

  const walletRegistrationService = new WalletRegistrationService();

  const { walletRegistration, status } =
    await walletRegistrationService.createWalletRegistration(req.body);

  res.status(status).json(walletRegistration);
};

const walletRegistrationGet = async function (req, res) {
  await walletRegistrationGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const walletRegistrationService = new WalletRegistrationService();
  const walletRegistrations =
    await walletRegistrationService.getWalletRegistrations(
      filter,
      limitOptions,
    );
  const count = await walletRegistrationService.getWalletRegistrationsCount(
    filter,
  );

  const url = 'wallet-registration';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    wallet_registrations: walletRegistrations,
    links,
    query: { count, ...limitOptions, ...filter },
  });
};

const walletRegistrationSingleGet = async function (req, res) {
  await walletRegistrationIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const walletRegistrationService = new WalletRegistrationService();
  const walletRegistration =
    await walletRegistrationService.getWalletRegistrationById(
      req.params.wallet_registration_id,
    );

  if (!walletRegistration?.id) {
    throw new HttpError(
      404,
      `wallet registration with ${req.params.wallet_registration_id} not found`,
    );
  }

  res.send(walletRegistration);
};

module.exports = {
  walletRegistrationPost,
  walletRegistrationGet,
  walletRegistrationSingleGet,
};
