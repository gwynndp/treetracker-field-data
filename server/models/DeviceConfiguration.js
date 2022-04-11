const DeviceConfigurationRepository = require('../repositories/DeviceConfigurationRepository');

class DeviceConfiguration {
  constructor(session) {
    this._deviceConfigurationRepository = new DeviceConfigurationRepository(
      session,
    );
  }

  static DeviceConfiguration({
    id,
    device_identifier,
    brand,
    model,
    device,
    serial,
    hardware,
    manufacturer,
    app_build,
    app_version,
    os_version,
    sdk_version,
    bulk_pack_file_name,
    logged_at,
    created_at,
  }) {
    return Object.freeze({
      id,
      device_identifier,
      brand,
      model,
      device,
      serial,
      hardware,
      manufacturer,
      app_build,
      app_version,
      os_version,
      sdk_version,
      bulk_pack_file_name,
      logged_at,
      created_at,
    });
  }

  _response(deviceConfiguration) {
    return this.constructor.DeviceConfiguration(deviceConfiguration);
  }

  async getDeviceConfigurations(filter, limitOptions) {
    const deviceConfigurations = await this._deviceConfigurationRepository.getByFilter(
      filter,
      limitOptions,
    );

    return deviceConfigurations.map((row) => this._response(row));
  }

  async getDeviceConfigurationsCount(filter) {
    return this._deviceConfigurationRepository.countByFilter(filter);
  }

  async getDeviceConfigurationById(deviceConfigurationId) {
    const deviceConfigurations = await this.getDeviceConfigurations({
      id: deviceConfigurationId,
    });
    return deviceConfigurations[0];
  }

  async createDeviceConfiguration(deviceConfigurationObject) {
    const existingDeviceConfiguration = await this.getDeviceConfigurationById(
      deviceConfigurationObject.id,
    );

    if (!existingDeviceConfiguration?.id) {
      const createdDeviceConfiguration = await this._deviceConfigurationRepository.create(
        {
          ...deviceConfigurationObject,
          created_at: new Date().toISOString(),
        },
      );
      return {
        deviceConfiguration: this._response(createdDeviceConfiguration),
        status: 201,
      };
    }
    return { deviceConfiguration: existingDeviceConfiguration, status: 200 };
  }
}

module.exports = DeviceConfiguration;
