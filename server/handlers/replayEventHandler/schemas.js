const Joi = require('joi');

const replayEventAPISchema = Joi.object({
  status: Joi.string().valid('raised', 'received').required(),
});

module.exports = { replayEventAPISchema };
