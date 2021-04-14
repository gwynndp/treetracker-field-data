const Session = require('../infra/database/Session');
const { subscribe } = require('../infra/messaging/RabbitMQMessaging');

const { RawCaptureRepository, EventRepository } = require('../infra/database/PgRepositories')
const { DomainEvent, receiveEvent } = require('../models/DomainEvent');
const { applyVerification } = require('../models/RawCapture');

const handleVerifyCaptureProcessed = (async (message) => {
    const session = new Session(false);
    const eventRepository = new EventRepository(session);
    const captureRepository = new RawCaptureRepository(session);
    const receive = receiveEvent(eventRepository);
    const domainEvent = await receive(DomainEvent(message));
    try {
        await session.beginTransaction();
        const handleEvent = applyVerification(captureRepository);
        handleEvent(message);
        await eventRepository.update({ id: domainEvent.id, status: 'handled' });
        await session.commitTransaction();
    } catch(e) {
        await session.rollbackTransaction();
    }
});

const registerEventHandlers = () => {
    subscribe("admin-verification", handleVerifyCaptureProcessed);
}

module.exports = {handleVerifyCaptureProcessed, registerEventHandlers};
//module.exports = {handleVerifyCaptureProcessed}
//module.exports = {handleVerifyCaptureProcessed}, registerEventHandlers;
