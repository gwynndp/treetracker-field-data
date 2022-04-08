const BaseRepository = require("./BaseRepository");

class WalletRegistrationRepository extends BaseRepository {
  constructor(session) {
    super('wallet_registration', session);
    this._tableName = 'wallet_registration';
    this._session = session;
  }
}

module.exports = WalletRegistrationRepository;
