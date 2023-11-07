const TrackRepository = require('../repositories/TrackRepository');

class Track {
  constructor(session) {
    this._trackRepository = new TrackRepository(session);
  }

  static Track({
    id,
    locations_url,
    bulk_pack_file_name,
    session_id,
    created_at,
  }) {
    return Object.freeze({
      id,
      locations_url,
      bulk_pack_file_name,
      session_id,
      created_at,
    });
  }

  _response(track) {
    return this.constructor.Track(track);
  }

  async getTracks(filter, limitOptions) {
    const tracks = await this._trackRepository.getByFilter(
      filter,
      limitOptions,
    );
    return tracks.map((row) => this._response(row));
  }

  async getTracksCount(filter) {
    return this._trackRepository.countByFilter(filter);
  }

  async getTrackById(trackId) {
    const track = await this._trackRepository.getById(trackId);
    return track;
  }

  async createTrack(trackObject) {
    const createdTrack = await this._trackRepository.create(trackObject);
    return createdTrack;
  }
}

module.exports = Track;
