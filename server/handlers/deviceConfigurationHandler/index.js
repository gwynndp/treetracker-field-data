const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../../utils/helper');
const DeviceConfigurationService = require('../../services/DeviceConfigurationService');
const HttpError = require('../../utils/HttpError');
const {
  deviceConfigurationGetQuerySchema,
  deviceConfigurationIdParamSchema,
  deviceConfigurationPostSchema,
} = require('./schemas');

const deviceConfigurationPost = async function (req, res) {
  await deviceConfigurationPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const deviceConfigurationService = new DeviceConfigurationService();

  const { deviceConfiguration, status } =
    await deviceConfigurationService.createDeviceConfiguration(req.body);

  res.status(status).json(deviceConfiguration);
};

const deviceConfigurationGet = async function (req, res) {
  await deviceConfigurationGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const deviceConfigurationService = new DeviceConfigurationService();

  const deviceConfigurations =
    await deviceConfigurationService.getDeviceConfigurations(
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
  const deviceConfiguration =
    await deviceConfigurationService.getDeviceConfigurationById(
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
