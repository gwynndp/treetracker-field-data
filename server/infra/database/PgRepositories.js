const BaseRepository = require("./BaseRepository");

class CaptureRepository extends BaseRepository {
    constructor(session) {
        super("captures", session);
        this._tableName = "captures";
        this._session = session;
    }

    async save(capture) {
        return await super.create(capture);
    }
}

class EventRepository extends BaseRepository {
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
    CaptureRepository,
    EventRepository,
}