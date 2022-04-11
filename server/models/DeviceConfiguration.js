const DeviceConfiguration = ({
  id,
  device_identifier,
  brand,
  model,
  device,
  serial,
  hardware,
  manufacturer,
  app_build,
  app_version,
  os_version,
  sdk_version,
  bulk_pack_file_name,
  logged_at,
  created_at,
}) =>
  Object.freeze({
    id,
    device_identifier,
    brand,
    model,
    device,
    serial,
    hardware,
    manufacturer,
    app_build,
    app_version,
    os_version,
    sdk_version,
    bulk_pack_file_name,
    logged_at,
    created_at,
  });

const getDeviceConfiguration = (deviceConfigurationRepository) => async (
  filterCriteria,
) => {
  const deviceConfigurations = await deviceConfigurationRepository.getByFilter(
    filterCriteria,
  );
  return deviceConfigurations.map((row) => DeviceConfiguration(row));
};

module.exports = {
  DeviceConfiguration,
  getDeviceConfiguration,
};
