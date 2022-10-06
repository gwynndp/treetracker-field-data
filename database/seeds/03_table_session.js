const deviceConfigurationIds = require('./data/device_configuration');
const { walletRegistrationIds } = require('./data/wallet_registration');
const sessionIds = require('./data/session');

exports.seed = async function (knex) {
  const promises = [];
  for (let i = 0; i < 100; i++) {
    promises.push(
      knex
        .insert({
          id: sessionIds[i],
          device_configuration_id: deviceConfigurationIds[i],
          originating_wallet_registration_id: walletRegistrationIds[i],
          created_at: new Date().toISOString(),
        })
        .into('session'),
    );
  }
  await Promise.all(promises);
};
