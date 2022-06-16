const log = require('loglevel');
const Joi = require('joi');
const HttpError = require('../utils/HttpError');
const RawCaptureService = require('../services/RawCaptureService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../utils/helper');

const rawCaptureGetQuerySchema = Joi.object({
  // offset: Joi.number().integer().greater(-1),
  // limit: Joi.number().integer().greater(0),
  limit: Joi.number().integer().min(1).max(1000),
  offset: Joi.number().integer().min(0),
  status: Joi.string().allow('unprocessed', 'approved', 'rejected'),
  bulk_pack_file_name: Joi.string(),
  grower_account_id: Joi.string().uuid(),
  organization_id: Joi.string(),
  startDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  id: Joi.string().uuid(),
  reference_id: Joi.string(),
  tree_id: Joi.string().uuid(),
  species_id: Joi.string().uuid(),
  tag: Joi.string(),
  device_identifier: Joi.string(),
  wallet: Joi.string(),
  tokenized: Joi.string(),
  sort: Joi.object(),
  token_id: Joi.string().uuid(),
}).unknown(false);

const rawCaptureSchema = Joi.object({
  id: Joi.string().required().guid().required(),
  session_id: Joi.string().guid().required(),
  lat: Joi.number().required().min(-90).max(90),
  lon: Joi.number().required().min(-180).max(180),
  image_url: Joi.string().uri().required(),
  gps_accuracy: Joi.number().allow(null),
  abs_step_count: Joi.number().integer().allow(null),
  delta_step_count: Joi.number().integer().allow(null),
  rotation_matrix: Joi.array().items(Joi.number()).allow(null),
  note: Joi.string().allow(null, ''),
  extra_attributes: Joi.any().allow(null), // skip validation, field not currently processed
  // Joi.array()
  //   .items(
  //     Joi.object({
  //       key: Joi.string().required(),
  //       value: Joi.string().required().allow(''),
  //     }),
  //   )
  //  .allow(null),
  captured_at: Joi.date().iso().required(),
  bulk_pack_file_name: Joi.string(),
}).unknown(false);

const rawCaptureUpdateSchema = Joi.object({
  id: Joi.string().required().guid().required(),
  limit: Joi.number().integer().min(1).max(1000),
  offset: Joi.number().integer().min(0),
  status: Joi.string().allow('unprocessed', 'approved', 'rejected'),
  bulk_pack_file_name: Joi.string(),
  grower_account_id: Joi.string().uuid(),
  organization_id: Joi.string(),
  startDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: Joi.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reference_id: Joi.string(),
  tree_id: Joi.string().uuid(),
  species_id: Joi.string().uuid(),
  tag: Joi.string(),
  device_identifier: Joi.string(),
  wallet: Joi.string(),
  tokenized: Joi.string(),
  sort: Joi.object(),
  token_id: Joi.string().uuid(),
  age: Joi.number().integer().allow(null),
  morphology: Joi.string().allow(null),
  tags: Joi.array().items(Joi.string()).allow(null),
  rejection_reason: Joi.string().allow(null),
}).unknown(false);

const rawCaptureIdParamSchema = Joi.object({
  raw_capture_id: Joi.string().uuid().required(),
}).unknown(false);

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
  log.warn('raw capture post...');
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

const rawCaptureSingleUpdate = async (req, res) => {
  log.warn('raw capture update...', req.params.raw_capture_id);

  await rawCaptureIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const rawCaptureService = new RawCaptureService();
  const rawCapture = await rawCaptureService.getRawCaptureById(req.body.id);

  if (!rawCapture?.id) {
    throw new HttpError(
      404,
      `raw capture with ${req.params.raw_capture_id} not found`,
    );
  }
  // const updatedRawCapture = {
  //   // ...rawCapture,
  //   ...req.body,
  // };

  await rawCaptureUpdateSchema.validateAsync(req.body, {
    abortEarly: false,
  });
  const { status, capture } = await rawCaptureService.updateRawCapture(
    req.body,
  );

  res.status(status).send(capture);
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
  rawCaptureSingleUpdate,
};
