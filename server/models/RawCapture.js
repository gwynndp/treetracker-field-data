const log = require('loglevel');
const { raiseEvent, DomainEvent } = require('./domain-event');
const { Repository } = require('./Repository');

const RawCapture = ({
  id,
  reference_id,
  session_id,
  abs_step_count,
  delta_step_count,
  rotation_matrix,
  image_url,
  lat,
  lon,
  gps_accuracy,
  note,
  device_identifier,
  grower_account_id,
  wallet,
  user_photo_url,
  extra_attributes,
  status,
  created_at,
  updated_at,
  captured_at,
}) =>
  Object.freeze({
    id,
    reference_id,
    session_id,
    abs_step_count,
    delta_step_count,
    rotation_matrix,
    image_url,
    lat,
    lon,
    gps_accuracy,
    note,
    device_identifier,
    grower_account_id,
    wallet,
    user_photo_url,
    extra_attributes,
    status,
    created_at,
    updated_at,
    captured_at,
  });

const rawCaptureFromRequest = ({
  id,
  reference_id,
  lat,
  lon,
  gps_accuracy,
  image_url,
  session_id,
  abs_step_count,
  delta_step_count,
  rotation_matrix,
  note,
  extra_attributes,
  captured_at,
}) =>
  Object.freeze({
    id,
    reference_id,
    session_id,
    abs_step_count,
    delta_step_count,
    rotation_matrix,
    image_url,
    lat,
    lon,
    gps_accuracy,
    note,
    status: 'unprocessed',
    extra_attributes: { entries: extra_attributes },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    captured_at,
  });

const RawCaptureCreated = ({
  id,
  lat,
  lon,
  field_user_id,
  field_username,
  extra_attributes,
  created_at,
  captured_at,
}) =>
  Object.freeze({
    id,
    type: 'RawCaptureCreated',
    lat,
    lon,
    field_user_id,
    field_username,
    extra_attributes,
    created_at,
    captured_at,
  });

const createRawCapture = (captureRepositoryImpl, eventRepositoryImpl) => async (
  inputRawCapture,
) => {
  log.warn('createRawCapture...');
  const newRawCapture = { ...inputRawCapture };
  const captureRepository = new Repository(captureRepositoryImpl);
  const rawCapture = await captureRepository.add(newRawCapture);
  // remove extra_attributes until implemented on mobile side
  // const filteredAttr = rawCapture.extra_attributes.entries?.filter(
  //   (attribute) => attribute.key === 'app_flavor',
  // );
  const rawCaptureCreated = RawCaptureCreated({
    ...rawCapture,
    // extra_attributes: filteredAttr,
  });
  const raiseFieldDataEvent = raiseEvent(eventRepositoryImpl);
  const domainEvent = await raiseFieldDataEvent(
    DomainEvent({ payload: rawCaptureCreated }),
  );
  log.warn('finish createRawCapture, raised event:', domainEvent);
  return { entity: rawCapture, raisedEvents: [domainEvent] };
};

const FilterCriteria = ({
  status = undefined,
  grower_account_id = undefined,
}) => {
  return Object.entries({ status, grower_account_id })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const QueryOptions = ({ limit = undefined, offset = undefined }) => {
  return Object.entries({ limit, offset })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const getRawCaptures = (captureRepositoryImpl) => async (
  filterCriteria = undefined,
) => {
  let filter = {};
  let options = { limit: 1000, offset: 0 };
  if (filterCriteria !== undefined) {
    filter = FilterCriteria({ ...filterCriteria });
    options = { ...options, ...QueryOptions({ ...filterCriteria }) };
  }
  const captureRepository = new Repository(captureRepositoryImpl);
  const rawCaptures = await captureRepository.getByFilter(filter, options);
  return rawCaptures.map((row) => {
    return RawCapture({ ...row });
  });
};

const applyVerification = (captureRepositoryImpl) => async (
  verifyCaptureProcessed,
) => {
  if (verifyCaptureProcessed.approved) {
    await captureRepositoryImpl.update({
      id: verifyCaptureProcessed.id,
      status: 'approved',
    });
  } else {
    await captureRepositoryImpl.update({
      id: verifyCaptureProcessed.id,
      status: 'rejected',
      rejection_reason: verifyCaptureProcessed.rejection_reason,
    });
  }
};

module.exports = {
  rawCaptureFromRequest,
  createRawCapture,
  getRawCaptures,
  applyVerification,
  RawCapture,
};
