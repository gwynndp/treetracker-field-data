const Joi = require('joi');
const log = require('loglevel');

const Session = require('../infra/database/Session');

const WalletRegistrationRepository = require('../infra/database/WalletRegistrationRepository');
const {
  getWalletRegistration,
  WalletRegistration,
} = require('../models/WalletRegistration');
const HttpError = require('./HttpError');

const walletRegistrationPostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  wallet: Joi.string().required(),
  user_photo_url: Joi.string().uri().required(),
  grower_account_id: Joi.string().uuid().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string().allow(null),
  email: Joi.string().pattern(/.*@.*/).allow(null),
  lat: Joi.number().required().min(-90).max(90).required(),
  lon: Joi.number().required().min(-180).max(180).required(),
  registered_at: Joi.string().isoDate(),
  v1_legacy_organization: Joi.string().allow(null, ''),
  bulk_pack_file_name: Joi.string(),
}).unknown(false);

const walletRegistrationIdParamSchema = Joi.object({
  wallet_registration_id: Joi.string().uuid().required(),
}).unknown(false);

const walletRegistrationPost = async function (req, res, next) {
  await walletRegistrationPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  if (!req.body.phone && !req.body.email) {
    throw new HttpError(422, 'Either phone or email is required');
  }

  const session = new Session();
  const walletRegistrationRepo = new WalletRegistrationRepository(session);

  try {
    const newWalletRegistration = {
      ...req.body,
    };
    const { id } = newWalletRegistration;
    const existingWalletRegistration = await walletRegistrationRepo.getByFilter(
      { id },
    );

    const [walletRegistration] = existingWalletRegistration;

    if (!walletRegistration) {
      await session.beginTransaction();
      const createdWalletRegistration = await walletRegistrationRepo.create(
        newWalletRegistration,
      );
      await session.commitTransaction();
      return res.status(201).json(createdWalletRegistration);
    }
    res.status(200).json(walletRegistration);
  } catch (e) {
    log.warn(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

const walletRegistrationGet = async function (req, res) {
  const session = new Session();
  const walletRegistrationRepo = new WalletRegistrationRepository(session);

  const executeGetWalletRegistration = getWalletRegistration(
    walletRegistrationRepo,
  );
  const walletRegistrations = await executeGetWalletRegistration(req.query);

  res.send(walletRegistrations);
};

const walletRegistrationSingleGet = async function (req, res) {
  await walletRegistrationIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const session = new Session();
  const walletRegistrationRepo = new WalletRegistrationRepository(session);

  const walletRegistrations = await walletRegistrationRepo.getByFilter({
    id: req.params.wallet_registration_id,
  });

  const [walletRegistration = {}] = walletRegistrations;

  res.send(WalletRegistration(walletRegistration));
};

module.exports = {
  walletRegistrationPost,
  walletRegistrationGet,
  walletRegistrationSingleGet,
};
