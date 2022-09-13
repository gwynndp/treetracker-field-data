const Joi = require('joi');

const rawCaptureGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  status: Joi.string().allow('unprocessed', 'approved', 'rejected'),
  bulk_pack_file_name: Joi.string(),
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

const rawCaptureIdParamSchema = Joi.object({
  raw_capture_id: Joi.string().uuid().required(),
}).unknown(false);

const rawCaptureRejectionSchema = Joi.object({
  rejection_reason: Joi.string().required(),
});

module.exports = {
  rawCaptureIdParamSchema,
  rawCaptureSchema,
  rawCaptureGetQuerySchema,
  rawCaptureRejectionSchema,
};
