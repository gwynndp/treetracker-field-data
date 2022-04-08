const Joi = require('joi');
const ReplayEventService = require('../services/ReplayEventService');

const replayEventAPISchema = Joi.object({
  status: Joi.string().valid('raised', 'received'),
});

const replayEventPost = async (req, res) => {
  await replayEventAPISchema.validateAsync(req.body, { abortEarly: false });

  const replayEventService = new ReplayEventService();
  replayEventService.replayEvents(req.body.status);

  res
    .status(200)
    .json({ request: 'accepted', status: 'replay in progress...' });
};

module.exports = replayEventPost;
