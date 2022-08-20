const Joi = require('joi');

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

const walletRegistrationGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  bulk_pack_file_name: Joi.string(),
});

module.exports = {
  walletRegistrationPostSchema,
  walletRegistrationIdParamSchema,
  walletRegistrationGetQuerySchema,
};
