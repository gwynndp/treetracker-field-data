const Joi = require('joi');

const sessionGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
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
}).unknown(false);

const sessionIdParamSchema = Joi.object({
  session_id: Joi.string().uuid().required(),
}).unknown(false);

module.exports = {
  sessionGetQuerySchema,
  sessionPostSchema,
  sessionIdParamSchema,
};
