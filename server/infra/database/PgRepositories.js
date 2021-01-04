const BaseRepository = require("./BaseRepository");
const Session = require("./Session");

class CaptureRepositoryImpl extends BaseRepository {
    constructor(session) {
        super("captures", session);
        this._tableName = "captures";
        this._session = session;
    }

    async saveCapture(capture) {
        return await super.create(capture);
    }
}

class EventRepositoryImpl extends BaseRepository {
    constructor(session) {
        super("events", session);
        this._tableName = "events";
        this._session = session;
    }

    async save(event) {
        return await super.create(event);
    }

    async update(event) {
        return await super.update(event);
    }
}

module.exports = { 
    CaptureRepositoryImpl,
    EventRepositoryImpl,
}