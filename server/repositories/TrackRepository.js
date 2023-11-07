const BaseRepository = require('./BaseRepository');

class TrackRepository extends BaseRepository {
  constructor(session) {
    super('track', session);
    this._tableName = 'track';
    this._session = session;
  }
}

module.exports = TrackRepository;
