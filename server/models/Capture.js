const { CaptureRepository } = require('./CaptureRepository')
const { raiseDomainEvent } = require('./DomainEvent');

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

const createCapture = (captureRepoImpl) => ((captureData) => {

    let newCapture = { 
        ...captureData,
        "created_at": new Date().toISOString(),
        "updated_at": new Date().toISOString()
    };
    const captureRepository = new CaptureRepository(captureRepoImpl);
    const result = captureRepository.saveCapture(newCapture)
    // raiseDomainEvent('FieldCaptureDataPosted', result)
    return result;
})

module.exports = {
    CaptureData,
    createCapture,
}