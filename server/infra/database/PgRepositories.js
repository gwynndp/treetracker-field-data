const BaseRepository = require("./BaseRepository");

class CaptureRepository extends BaseRepository {
    constructor(session) {
        super("captures", session);
        this._tableName = "captures";
        this._session = session;
    }

    async getByFilter(filterCriteria, options) {
        return await this._session.getDB()
        .where(filterCriteria)
        .select(
            'id',
            'reference_id',
            'image_url',
            'lat',
            'lon',
            'gps_accuracy',
            'planter_id',
            'planter_photo_url',
            'planter_contact',
            'device_identifier',
            'note',
            'attributes',
            'status',
            'created_at',
            'updated_at'
        )
        .from('captures')
        .orderBy('created_at', 'desc')
        .limit(options.limit)
        .offset(options.offset);
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