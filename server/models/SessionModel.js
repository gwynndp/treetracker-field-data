const SessionModel = ({
  id,
  device_configuration_id,
  originating_wallet_registration_id,
  target_wallet,
  check_in_photo_url,
  track_url,
  organization,
  bulk_pack_file_name,
  created_at,
}) =>
  Object.freeze({
    id,
    device_configuration_id,
    originating_wallet_registration_id,
    target_wallet,
    check_in_photo_url,
    track_url,
    organization,
    bulk_pack_file_name,
    created_at,
  });

const getSession = (sessionRepository) => async (filterCriteria) => {
  const sessions = await sessionRepository.getByFilter(filterCriteria);
  return sessions.map((row) => SessionModel(row));
};

module.exports = {
  SessionModel,
  getSession,
};
