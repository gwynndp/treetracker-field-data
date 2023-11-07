const clearDB = async (knex, knexLegacyDB) => {
  await knexLegacyDB('tree_attributes').del();
  await knexLegacyDB('trees').del();
  await knexLegacyDB('planter').del();
  await knex('domain_event').del();
  await knex('raw_capture').del();
  await knex('track').del();
  await knex('session').del();
  await knex('device_configuration').del();
  await knex('wallet_registration').del();
};

module.exports = {
  clearDB,
};
