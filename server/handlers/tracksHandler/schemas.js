const Joi = require('joi');

const trackGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  bulk_pack_file_name: Joi.string(),
  session_id: Joi.string().uuid(),
});

const trackPostSchema = Joi.object({
  locations_url: Joi.string().uri().required(),
  session_id: Joi.string().uuid().required(),
  bulk_pack_file_name: Joi.string().required(),
}).unknown(false);

const trackIdParamSchema = Joi.object({
  track_id: Joi.string().uuid().required(),
}).unknown(false);

module.exports = {
  trackGetQuerySchema,
  trackPostSchema,
  trackIdParamSchema,
};
