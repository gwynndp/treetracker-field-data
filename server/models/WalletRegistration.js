const WalletRegistration = ({
  id,
  wallet,
  user_photo_url,
  grower_account_id,
  first_name,
  last_name,
  phone,
  email,
  lat,
  lon,
  registered_at,
  bulk_pack_file_name,
  v1_legacy_organization,
}) =>
  Object.freeze({
    id,
    wallet,
    user_photo_url,
    grower_account_id,
    first_name,
    last_name,
    phone,
    email,
    lat,
    lon,
    registered_at,
    bulk_pack_file_name,
    v1_legacy_organization,
  });

const getWalletRegistration = (walletRegistrationRepository) => async (
  filterCriteria,
) => {
  const walletRegistrations = await walletRegistrationRepository.getByFilter(
    filterCriteria,
  );
  return walletRegistrations.map((row) => WalletRegistration(row));
};

module.exports = {
  WalletRegistration,
  getWalletRegistration,
};
