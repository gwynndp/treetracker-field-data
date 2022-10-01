const HttpError = require('../../utils/HttpError');
const RawCaptureService = require('../../services/RawCaptureService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../../utils/helper');
const {
  rawCaptureIdParamSchema,
  rawCaptureSchema,
  rawCaptureGetQuerySchema,
  rawCaptureRejectionSchema,
} = require('./schemas');

const rawCaptureGet = async (req, res) => {
  await rawCaptureGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const rawCaptureService = new RawCaptureService();

  const rawCaptures = await rawCaptureService.getRawCaptures(
    filter,
    limitOptions,
  );
  const count = await rawCaptureService.getRawCapturesCount(filter);

  const url = 'raw-captures';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    raw_captures: rawCaptures,
    links,
    query: { count, ...limitOptions, ...filter },
  });
};

const rawCapturePost = async (req, res) => {
  delete req.body.extra_attributes; // remove extra_attributes until implemented on mobile side
  const { body } = req;
  if (body.rotation_matrix != null) {
    for (let i = 0; i < body.rotation_matrix.length; i += 1) {
      if (body.rotation_matrix[i] < 0.001) {
        body.rotation_matrix[i] = 0;
      }
    }
  }
  await rawCaptureSchema.validateAsync(body, { abortEarly: false });

  const rawCaptureService = new RawCaptureService();
  const { status, capture } = await rawCaptureService.createRawCapture(body);

  res.status(status).send(capture);
};

const rawCaptureRejectPatch = async (req, res) => {
  await rawCaptureRejectionSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await rawCaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const legacyAPIAuthorizationHeader = req.headers.authorization;

  if (!legacyAPIAuthorizationHeader) {
    throw new HttpError(422, 'legacy authorization header needed');
  }

  const rawCaptureService = new RawCaptureService();
  const rawCapture = await rawCaptureService.rejectRawCapture({
    rejectionReason: req.body.rejection_reason,
    organizationId: req.body.organization_id,
    rawCaptureId: req.params.raw_capture_id,
    legacyAPIAuthorizationHeader,
  });

  res.send(rawCapture);
};

const rawCaptureSingleGet = async function (req, res) {
  await rawCaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const rawCaptureService = new RawCaptureService();
  const rawCapture = await rawCaptureService.getRawCaptureById(
    req.params.raw_capture_id,
  );

  if (!rawCapture?.id) {
    throw new HttpError(
      404,
      `raw capture with ${req.params.raw_capture_id} not found`,
    );
  }

  res.send(rawCapture);
};

module.exports = {
  rawCaptureGet,
  rawCapturePost,
  rawCaptureSingleGet,
  rawCaptureRejectPatch,
};
