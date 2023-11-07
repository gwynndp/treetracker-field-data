const TrackService = require('../../services/TrackService');
const HttpError = require('../../utils/HttpError');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../../utils/helper');
const {
  trackGetQuerySchema,
  trackPostSchema,
  trackIdParamSchema,
} = require('./schemas');

const trackPost = async function (req, res) {
  await trackPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const trackService = new TrackService();
  const track = await trackService.createTrack(req.body);

  res.status(201).send(track);
};

const trackGet = async function (req, res) {
  await trackGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const trackService = new TrackService();
  const tracks = await trackService.getTracks(filter, limitOptions);
  const count = await trackService.getTracksCount(filter);

  const url = 'track';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({ tracks, links, query: { count, ...limitOptions, ...filter } });
};

const trackSingleGet = async function (req, res) {
  await trackIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const trackService = new TrackService();
  const track = await trackService.getTrackById(req.params.track_id);

  if (!track?.id) {
    throw new HttpError(404, `track with ${req.params.track_id} not found`);
  }

  res.send(track);
};

module.exports = {
  trackGet,
  trackPost,
  trackSingleGet,
};
