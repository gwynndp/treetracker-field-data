const Joi = require('joi');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../utils/helper');
const DeviceConfigurationService = require('../services/DeviceConfigurationService');
const HttpError = require('../utils/HttpError');

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
}).unknown(false);

const deviceConfigurationIdParamSchema = Joi.object({
  device_configuration_id: Joi.string().uuid().required(),
}).unknown(false);

const deviceConfigurationGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
});

const deviceConfigurationPost = async function (req, res) {
  await deviceConfigurationPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const deviceConfigurationService = new DeviceConfigurationService();

  const {
    deviceConfiguration,
    status,
  } = await deviceConfigurationService.createDeviceConfiguration(req.body);

  res.status(status).json(deviceConfiguration);
};

const deviceConfigurationGet = async function (req, res) {
  await deviceConfigurationGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const deviceConfigurationService = new DeviceConfigurationService();

  const deviceConfigurations = await deviceConfigurationService.getDeviceConfigurations(
    filter,
    limitOptions,
  );
  const count = await deviceConfigurationService.getDeviceConfigurationsCount(
    filter,
  );

  const url = 'device-configuration';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    device_configurations: deviceConfigurations,
    links,
    query: { count, ...limitOptions, ...filter },
  });
};

const deviceConfigurationSingleGet = async function (req, res) {
  await deviceConfigurationIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const deviceConfigurationService = new DeviceConfigurationService();
  const deviceConfiguration = await deviceConfigurationService.getDeviceConfigurationById(
    req.params.device_configuration_id,
  );

  if (!deviceConfiguration?.id) {
    throw new HttpError(
      404,
      `device configuration with ${req.params.device_configuration_id} not found`,
    );
  }

  res.send(deviceConfiguration);
};

module.exports = {
  deviceConfigurationPost,
  deviceConfigurationGet,
  deviceConfigurationSingleGet,
};
