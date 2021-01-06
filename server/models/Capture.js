const { raiseEvent, DomainEvent } = require('./DomainEvent');
const { Repository } = require('./Repository');

const CaptureData = ({ id, reference_id, image_url, lat, lon, planter_id, planter_identifier }) => Object.freeze({
    id,
    reference_id,
    image_url,
    lat,
    lon,
    planter_id,
    planter_identifier,
    status: 'unverified'
});

const FieldCaptureDataCreated = ({ id, lat, lon, planter_id, planter_identifier, created_at }) => Object.freeze({
    id,
    type: 'FieldDataCaptureCreated',
    lat,
    lon,
    planter_id,
    planter_identifier,
    created_at, 
});

const createCapture = (captureRepositoryImpl, eventRepositoryImpl) => (async (captureData) => {
    let newCapture = { 
        ...captureData,
        "created_at": new Date().toISOString(),
        "updated_at": new Date().toISOString()
    };
    const captureRepository = new Repository(captureRepositoryImpl);
    const capture = await captureRepository.save(newCapture);
    const fieldDataCaptureCreated = FieldCaptureDataCreated({
        ...capture
    });
    const raiseFieldDataEvent = raiseEvent(eventRepositoryImpl);
    const domainEvent = await raiseFieldDataEvent(DomainEvent(fieldDataCaptureCreated));
    return { entity: capture, raisedEvents: [domainEvent] };
})

module.exports = {
    CaptureData,
    createCapture,
}