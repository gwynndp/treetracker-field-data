const ReplayEventService = require('../../services/ReplayEventService');
const { replayEventAPISchema } = require('./schemas');

const replayEventPost = async (req, res) => {
  await replayEventAPISchema.validateAsync(req.body, { abortEarly: false });

  const replayEventService = new ReplayEventService();
  replayEventService.replayEvents(req.body.status);

  res
    .status(200)
    .json({ request: 'accepted', status: 'replay in progress...' });
};

module.exports = { replayEventPost };
