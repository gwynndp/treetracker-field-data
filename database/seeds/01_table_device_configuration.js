const Chance = require('chance');
const deviceConfigurationIds = require('./data/device_configuration');
const chance = new Chance();

exports.seed = async function (knex) {
  const promises = [];
  for (const id of deviceConfigurationIds) {
    promises.push(
      knex
        .insert({
          id,
          device_identifier: chance.string(),
          brand: chance.string(),
          model: chance.string(),
          device: chance.string(),
          serial: chance.string(),
          hardware: chance.string(),
          manufacturer: chance.string(),
          app_build: chance.string(),
          app_version: chance.string(),
          os_version: chance.string(),
          sdk_version: chance.string(),
          logged_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
        .into('device_configuration'),
    );
  }
  await Promise.all(promises);
};
