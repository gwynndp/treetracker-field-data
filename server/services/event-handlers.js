const Session = require('../infra/database/Session');
const { subscribe } = require('../infra/messaging/RabbitMQMessaging');

const { RawCaptureRepository, EventRepository } = require('../infra/database/PgRepositories')
const { DomainEvent, receiveEvent } = require('../models/domain-event');
const { applyVerification } = require('../models/RawCapture');

const handleVerifyCaptureProcessed = (async (message) => {
    const session = new Session(false);
    const eventRepository = new EventRepository(session);
    const captureRepository = new RawCaptureRepository(session);
    const receive = receiveEvent(eventRepository);
    const domainEvent = await receive(DomainEvent({payload: message,status: 'handled'}));
    try {
        await session.beginTransaction();
        const handleEvent = applyVerification(captureRepository);
        handleEvent(message);
        await eventRepository.update({ id: domainEvent.id, status: domainEvent.status});
        await session.commitTransaction();
    } catch(e) {
        await session.rollbackTransaction();
    }
});

const registerEventHandlers = () => {
    subscribe("admin-verification", handleVerifyCaptureProcessed);
}

const handleEvent = (handleVerify) => (async (message) => {
    handleVerify(message,()=>{
        });
});

const dictEventHandlers = () => {
    return {"VerifyCaptureProcessed":handleVerifyCaptureProcessed};
}

module.exports = {dictEventHandlers, registerEventHandlers, handleEvent};
