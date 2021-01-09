const { raiseEvent, DomainEvent } = require('./DomainEvent');
const { Repository } = require('./Repository');

const CaptureData = ({ id, reference_id, image_url, lat, lon, planter_id, planter_identifier, attributes }) => Object.freeze({
    id,
    reference_id,
    image_url,
    lat,
    lon,
    planter_id,
    planter_identifier,
    status: 'unverified',
    attributes
});

const FieldCaptureDataCreated = ({ id, lat, lon, planter_id, planter_identifier, attributes, created_at }) => Object.freeze({
    id,
    type: 'FieldDataCaptureCreated',
    lat,
    lon,
    planter_id,
    planter_identifier,
    attributes,
    created_at, 
});

const createCapture = (captureRepositoryImpl, eventRepositoryImpl) => (async (captureData) => {

    // json wrap the 'attributes' array for storage in jsonb (storing array not suppported in jsonb)
    const newCapture = { 
        ...captureData,
        attributes: { entries: captureData.attributes }, 
        "created_at": new Date().toISOString(),
        "updated_at": new Date().toISOString()
    };
    const captureRepository = new Repository(captureRepositoryImpl);
    const capture = await captureRepository.save(newCapture);
    const filteredAttr = capture.attributes.entries
                            .filter(attribute => attribute.key === "app_flavor")
    const fieldDataCaptureCreated = FieldCaptureDataCreated({
        ...capture,
        attributes: filteredAttr
    });
    const raiseFieldDataEvent = raiseEvent(eventRepositoryImpl);
    const domainEvent = await raiseFieldDataEvent(DomainEvent(fieldDataCaptureCreated));
    return { entity: capture, raisedEvents: [domainEvent] };
})

module.exports = {
    CaptureData,
    createCapture,
}