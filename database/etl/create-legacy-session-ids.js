const log = require('loglevel');
const convertStringToUuid = require('uuid-by-string');

log.setDefaultLevel('info');

const connection = process.env.DATABASE_URL;

const knexConfig = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === 'debug',
  connection,
  pool: { min: 0, max: 4 },
};

const knex = require('knex')(knexConfig);

(async () => {
  console.log('query');
  const j = 0;
  while (j < 500) {
    const rows = await knex
      .select('id', 'device_identifier', 'planter_identifier')
      .table('trees')
      .where('active', '=', true)
      .whereNull('session_id')
      .whereNotNull('device_identifier')
      .whereNotNull('planter_identifier')
      .limit(1000);

    console.log('got');
    let i = 0;
    await rows.forEach(async (row) => {
      const { id, device_identifier, planter_identifier } = row;
      const sessionId = convertStringToUuid(
        device_identifier + planter_identifier,
      );
      log.info(device_identifier);
      log.info(planter_identifier);
      log.info(sessionId);
      await knex
        .table('trees')
        .where('id', '=', id)
        .update('session_id', sessionId);
      i += 1;
      log.info(i);
    });
  }
})().catch((e) => console.error(e.stack));
