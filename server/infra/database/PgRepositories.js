const BaseRepository = require("./BaseRepository");

class RawCaptureRepository extends BaseRepository {
    constructor(session) {
        super("raw_capture", session);
        this._tableName = "raw_capture";
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
            'field_user_id',
            'field_user_photo_url',
            'field_username',
            'device_identifier',
            'note',
            'attributes',
            'status',
            'capture_taken_at',
            'created_at',
            'updated_at'
        )
        .from('raw_capture')
        .orderBy('created_at', 'desc')
        .limit(options.limit)
        .offset(options.offset);
    }

    async add(rawCapture) {
        return await super.create(rawCapture);
    }
}

class EventRepository extends BaseRepository {
    constructor(session) {
        super("domain_event", session);
        this._tableName = "domain_event";
        this._session = session;
    }

    async add(domainEvent) {
        return await super.create(domainEvent);
    }
}

module.exports = { 
    RawCaptureRepository,
    EventRepository,
}