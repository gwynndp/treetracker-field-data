const Joi = require('joi');

const deviceConfigurationPostSchema = Joi.object({
  id: Joi.string().uuid().required(),
  device_identifier: Joi.string().required(),
  brand: Joi.string().required(),
  model: Joi.string().required(),
  device: Joi.string().required(),
  serial: Joi.string().allow('', null),
  hardware: Joi.string().required(),
  manufacturer: Joi.string().required(),
  app_build: Joi.string().required(),
  app_version: Joi.string().required(),
  os_version: Joi.string().required(),
  sdk_version: Joi.string().required(),
  logged_at: Joi.string().isoDate().required(),
  bulk_pack_file_name: Joi.string(),
}).unknown(false);

const deviceConfigurationIdParamSchema = Joi.object({
  device_configuration_id: Joi.string().uuid().required(),
}).unknown(false);

const deviceConfigurationGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  bulk_pack_file_name: Joi.string(),
});

module.exports = {
  deviceConfigurationGetQuerySchema,
  deviceConfigurationIdParamSchema,
  deviceConfigurationPostSchema,
};
