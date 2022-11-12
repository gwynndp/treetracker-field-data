const { v4: uuid } = require('uuid');
const captureMatchRawCaptures = require('./data/capture_match_raw_captures');
const { walletRegistrationIds } = require('./data/wallet_registration');

const createRawCapture = async (rc, knex) => {
  //planter information as well
  const random = Math.floor(Math.random() * walletRegistrationIds.length);
  const walletRegistrationId = walletRegistrationIds[random];
  let planterId;

  const walletRegistration = await knex('field_data.wallet_registration')
    .select(
      'session.id as session_id',
      'planter.id as planter_id',
      'user_photo_url',
      'grower_account_id',
      'wallet_registration.first_name as first_name',
      'wallet_registration.last_name as last_name',
      'wallet_registration.email as email',
      'wallet_registration.phone as phone',
    )
    .where({ 'wallet_registration.id': walletRegistrationId })
    .join(
      'field_data.session',
      'field_data.wallet_registration.id',
      '=',
      'field_data.session.originating_wallet_registration_id',
    )
    .leftJoin(
      'public.planter',
      'field_data.wallet_registration.grower_account_id',
      '=',
      'public.planter.grower_account_uuid',
    )
    .first();

  const {
    user_photo_url: image_url,
    grower_account_id: growerAccountId,
    first_name,
    last_name,
    email,
    phone,
    session_id,
    planter_id,
  } = walletRegistration;

  if (planter_id) {
    planterId = planter_id;
  } else {
    const planter = await knex
      .insert(
        {
          first_name,
          last_name,
          email,
          image_url,
          phone,
          grower_account_uuid: growerAccountId,
        },
        ['id'],
      )
      .into('planter');

    planterId = planter[0].id;
  }
  const newId = uuid();
  const treeToAdd = { ...rc };
  delete treeToAdd.captured_at;

  const rawCaptureToAdd = { ...rc };
  delete rawCaptureToAdd.time_created;
  delete rawCaptureToAdd.time_updated;

  await knex
    .with(
      'createdTree',
      knex
        .insert(
          {
            ...treeToAdd,
            planter_id: planterId,
            uuid: newId,
            time_created: rc.captured_at,
            time_updated: treeToAdd.updated_at || rc.captured_at,
            gps_accuracy: treeToAdd.gps_accuracy || 0,
          },
          ['id'],
        )
        .into('trees'),
    )
    .insert({
      id: newId,
      ...rawCaptureToAdd,
      gps_accuracy: rawCaptureToAdd.gps_accuracy || 0,
      session_id,
      reference_id: knex.select('id').from('createdTree'),
      status: 'unprocessed',
      created_at: rc.time_created || rc.captured_at || new Date().toISOString(),
      updated_at: rc.time_updated || rc.captured_at || new Date().toISOString(),
    })
    .into('field_data.raw_capture');
};

exports.seed = async function (knex) {
  for (const rc of captureMatchRawCaptures) {
    await createRawCapture(rc, knex);
  }
};
