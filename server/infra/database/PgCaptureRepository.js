const BaseRepository = require("./BaseRepository");
const Session = require("./Session");

class CaptureRepositoryImpl extends BaseRepository {
    constructor(session) {
        super("captures", session);
        this._tableName = "captures";
        this._session = session
    }

    async saveCapture(capture) {
        return await super.create(capture);
    }
}

module.exports = { CaptureRepositoryImpl }