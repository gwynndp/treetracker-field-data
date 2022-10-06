const Chance = require('chance');
const {
  walletRegistrationIds,
  growerAccounts,
} = require('./data/wallet_registration');
const chance = new Chance();

exports.seed = async function (knex) {
  const promises = [];
  for (const id of walletRegistrationIds) {
    const random = Math.floor(Math.random() * growerAccounts.length);
    const growerAccount = growerAccounts[random];
    const {
      wallet,
      image_url,
      id: growerAccountId,
      first_name,
      phone,
      lat,
      lon,
    } = growerAccount;
    promises.push(
      knex
        .insert({
          id,
          wallet,
          user_photo_url: image_url,
          grower_account_id: growerAccountId,
          first_name: first_name,
          last_name: chance.last(),
          phone: phone,
          email: wallet,
          lat: lat || 0,
          lon: lon || 0,
          registered_at: new Date().toISOString(),
        })
        .into('wallet_registration'),
    );
  }
  await Promise.all(promises);
};
