const Session = require('../infra/database/Sessions/Session');
const Track = require('../models/Track');

class TrackService {
  constructor() {
    this._session = new Session();
    this._track = new Track(this._session);
  }

  async getTracks(filter, limitOptions) {
    return this._track.getTracks(filter, limitOptions);
  }

  async getTracksCount(filter) {
    return this._track.getTracksCount(filter);
  }

  async getTrackById(trackId) {
    return this._track.getTrackById(trackId);
  }

  async createTrack(trackObject) {
    try {
      await this._session.beginTransaction();
      const response = await this._track.createTrack(trackObject);
      await this._session.commitTransaction();

      return response;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = TrackService;
