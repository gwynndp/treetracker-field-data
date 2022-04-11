const WalletRegistrationRepository = require('../repositories/WalletRegistrationRepository');

class WalletRegistration {
  constructor(session) {
    this._session = session;
    this._walletRegistrationRepository = new WalletRegistrationRepository(
      this._session,
    );
  }

  static WalletRegistration({
    id,
    wallet,
    user_photo_url,
    grower_account_id,
    first_name,
    last_name,
    phone,
    email,
    lat,
    lon,
    registered_at,
    bulk_pack_file_name,
    v1_legacy_organization,
  }) {
    return Object.freeze({
      id,
      wallet,
      user_photo_url,
      grower_account_id,
      first_name,
      last_name,
      phone,
      email,
      lat,
      lon,
      registered_at,
      bulk_pack_file_name,
      v1_legacy_organization,
    });
  }

  _response(walletRegistration) {
    return this.constructor.WalletRegistration(walletRegistration);
  }

  async getWalletRegistrations(filter, limitOptions) {
    const walletRegistrations = await this._walletRegistrationRepository.getByFilter(
      filter,
      limitOptions,
    );
    return walletRegistrations.map((row) => this._response(row));
  }

  async getWalletRegistrationsCount(filter) {
    return this._walletRegistrationRepository.countByFilter(filter);
  }

  async getWalletRegistrationById(walletRegistrationId) {
    const walletRegistrations = await this.getWalletRegistrations({
      id: walletRegistrationId,
    });
    return walletRegistrations[0];
  }

  async createWalletRegistration(walletRegistrationObject) {
    const existingWalletRegistration = await this.getWalletRegistrationById(
      walletRegistrationObject.id,
    );

    if (!existingWalletRegistration?.id) {
      const createdWalletRegistration = await this._walletRegistrationRepository.create(
        walletRegistrationObject,
      );
      return {
        walletRegistration: this._response(createdWalletRegistration),
        status: 201,
      };
    }
    return { walletRegistration: existingWalletRegistration, status: 200 };
  }
}

module.exports = WalletRegistration;
