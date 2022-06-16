const Joi = require('joi');

const sessionGetQuerySchema = Joi.object({
  id: Joi.string().uuid(),
  start_time: Joi.string().regex(/^\d{2}:\d{2}$/),
  device_configuration_id: Joi.string().uuid(),
  originating_wallet_registration_id: Joi.string().uuid(),
  target_wallet: Joi.string().uuid(),
  created_at: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  grower_account_id: Joi.string().uuid(),
  organization_id: Joi.array(),
  device_identifier: Joi.string(),
  wallet: Joi.string(),
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  whereNulls: Joi.array(),
  whereNotNulls: Joi.array(),
  whereIns: Joi.array(),
  bulk_pack_file_name: Joi.string(),
});

const sessionPostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  device_configuration_id: Joi.string().uuid().required(),
  originating_wallet_registration_id: Joi.string().uuid().required(),
  target_wallet: Joi.string(),
  check_in_photo_url: Joi.string().uri(),
  track_url: Joi.string().uri(),
  organization: Joi.string().allow(null, ''),
  start_time: Joi.date().iso(),
  bulk_pack_file_name: Joi.string(),
  bulk_pack_version: Joi.string().valid('v1', 'v2'),
}).unknown(false);

const sessionIdParamSchema = Joi.object({
  session_id: Joi.string().uuid().required(),
}).unknown(false);

module.exports = {
  sessionGetQuerySchema,
  sessionPostSchema,
  sessionIdParamSchema,
};
