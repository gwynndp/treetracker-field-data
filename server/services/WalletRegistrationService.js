const Session = require('../infra/database/Sessions/Session');
const WalletRegistration = require('../models/WalletRegistration');

class WalletRegistrationService {
  constructor() {
    this._session = new Session();
    this._walletRegistration = new WalletRegistration(this._session);
  }

  async getWalletRegistrations(filter, limitOptions) {
    return this._walletRegistration.getWalletRegistrations(
      filter,
      limitOptions,
    );
  }

  async getWalletRegistrationsCount(filter) {
    return this._walletRegistration.getWalletRegistrationsCount(filter);
  }

  async getWalletRegistrationById(walletRegistrationId) {
    return this._walletRegistration.getWalletRegistrationById(
      walletRegistrationId,
    );
  }

  async createWalletRegistration(walletRegistrationObject) {
    try {
      await this._session.beginTransaction();
      const response = await this._walletRegistration.createWalletRegistration(
        walletRegistrationObject,
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

module.exports = WalletRegistrationService;
