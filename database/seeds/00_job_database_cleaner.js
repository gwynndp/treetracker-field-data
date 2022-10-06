const { growerAccounts } = require('./data/wallet_registration');

exports.seed = async function (knex) {
  await knex.raw(`
    DELETE FROM raw_capture;
    DELETE FROM session;  
    DELETE FROM wallet_registration;    
    DELETE FROM device_configuration;
  `);

  const growerAccountIds = growerAccounts.map((g) => g.id);

  const planters = await knex('planter')
    .whereIn('grower_account_uuid', growerAccountIds)
    .del(['id']);

  const planterIds = planters.map((p) => p.id);

  await knex('trees').whereIn('planter_id', planterIds).del();
};
