const ReplayEventService = require('../../services/ReplayEventService');

const replayEventPost = async (req, res) => {
  const replayEventService = new ReplayEventService();
  replayEventService.replayEvents();

  res
    .status(200)
    .json({ request: 'accepted', status: 'replay in progress...' });
};

module.exports = { replayEventPost };
