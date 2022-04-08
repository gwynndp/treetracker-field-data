const Session = require('../infra/database/Sessions/Session');
const DeviceConfiguration = require('../models/DeviceConfiguration');

class DeviceConfigurationService {
  constructor() {
    this._session = new Session();
    this._deviceConfiguration = new DeviceConfiguration(this._session);
  }

  async getDeviceConfigurations(filter, limitOptions) {
    return this._deviceConfiguration.getDeviceConfigurations(
      filter,
      limitOptions,
    );
  }

  async getDeviceConfigurationsCount(filter) {
    return this._deviceConfiguration.getDeviceConfigurationsCount(filter);
  }

  async getDeviceConfigurationById(deviceConfigurationId) {
    return this._deviceConfiguration.getDeviceConfigurationById(
      deviceConfigurationId,
    );
  }

  async createDeviceConfiguration(deviceConfigurationObject) {
    try {
      await this._session.beginTransaction();
      const response = await this._deviceConfiguration.createDeviceConfiguration(
        deviceConfigurationObject,
      );
      await this._session.commitTransaction();

      return response;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = DeviceConfigurationService;
