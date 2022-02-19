const SessionModel = ({
  id,
  device_configuration_id,
  originating_wallet_registration_id,
  target_wallet,
  check_in_photo_url,
  track_url,
  organization,
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
    created_at,
  });

const getSession = (sessionRepository) => async (filterCriteria) => {
  const sessions = await sessionRepository.getByFilter({});
  return sessions.map((row) => SessionModel(row));
};

module.exports = {
  SessionModel,
  getSession,
};
