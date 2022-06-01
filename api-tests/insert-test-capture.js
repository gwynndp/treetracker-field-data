const { walletRegistrationObject } = require('./wallet-registration-api.spec');
const {
  deviceConfigurationObject,
} = require('./device-configuration-api.spec');
const { sessionObject } = require('./session-api.spec');

const captureRequestObject = {
  id: '21ae129d-4233-4705-ac24-f4c96051e5ef',
  session_id: sessionObject.id,
  image_url: 'https://www.htpplkjl.com',
  lat: 37.421998333333335,
  lon: 122.08400000000002,
  gps_accuracy: 12.123,
  abs_step_count: 1,
  delta_step_count: 2,
  rotation_matrix: [1, 2, 3],
  note: '123',
  extra_attributes: [
    {
      key: 'extra',
      value: "extra's value",
    },
  ],
  bulk_pack_file_name: 'bulk_pack_file_name',
  captured_at: new Date().toISOString(),
};

const capture = {
  ...captureRequestObject,
  id: 'f385f789-d08a-4c19-b8d8-c78370089bb3',
};

const captureWithExistingTree = {
  ...captureRequestObject,
  id: '55a17810-5937-4427-b9dd-dc6461e584e2',
};

const domainEventObject = {
  id: 'e876107a-2a7c-442b-9e57-880d596e1025',
  payload: {
    id: capture.id,
  },
  status: 'raised',
  created_at: '2021-05-04 11:24:43',
  updated_at: '2021-05-04 11:24:43',
};

const insertTestCapture = async (knex, knexLegacyDB) => {
  await knexLegacyDB('planter').insert({
    email: walletRegistrationObject.wallet,
    first_name: 'first_name',
    last_name: 'last_name',
  });
  await knex('device_configuration').insert({
    ...deviceConfigurationObject,
    created_at: new Date(),
  });
  await knex('wallet_registration').insert(walletRegistrationObject);
  await knex('session').insert({ ...sessionObject, created_at: new Date() });
  await knex('domain_event').insert(domainEventObject);
  await knex('raw_capture').insert({
    ...capture,
    extra_attributes: { entries: capture.extra_attributes },
    reference_id: 23,
    status: 'unprocessed',
    created_at: new Date(),
    updated_at: new Date(),
  });
  await knexLegacyDB('trees').insert({
    uuid: captureWithExistingTree.id,
    time_created: new Date(),
    time_updated: new Date(),
  });
};

const clearDB = async (knex, knexLegacyDB) => {
  await knexLegacyDB('tree_attributes').del();
  await knexLegacyDB('trees').del();
  await knexLegacyDB('planter').del();
  await knex('domain_event').del();
  await knex('raw_capture').del();
  await knex('session').del();
  await knex('device_configuration').del();
  await knex('wallet_registration').del();
};

module.exports = {
  captureRequestObject,
  capture,
  insertTestCapture,
  clearDB,
  captureWithExistingTree,
};
