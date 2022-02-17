/**
 * Contains functions used to process various incoming events subscribed in the application
 * and update the status of the domain event.
 */
const Session = require('../infra/database/Session');
const { subscribe } = require('../infra/messaging/RabbitMQMessaging');

const RawCaptureRepository = require('../infra/database/RawCaptureRepository');
const EventRepository = require('../infra/database/EventRepository');
const { DomainEvent, receiveEvent } = require('../models/domain-event');
const { applyVerification } = require('../models/RawCapture');
const log = require('loglevel');

// `session` here is expected to already be in a transaction since the caller might wish
// to update domain event status along with any business logic specific updates to other
// entities.
const handleVerifyCaptureProcessed = async (payload, session) => {
  const captureRepository = new RawCaptureRepository(session);
  const executeApplyVerification = applyVerification(captureRepository);
  executeApplyVerification(payload);
};

const processMessage = (eventHandler) => async (message) => {
  const session = new Session(false);
  const eventRepository = new EventRepository(session);
  const receiveAndStoreEvent = receiveEvent(eventRepository);
  const domainEvent = await receiveAndStoreEvent(
    DomainEvent({ payload: message, status: 'received' }),
  );
  const executeApplyEventHandler = applyEventHandler(eventHandler);
  executeApplyEventHandler(domainEvent);
};

const applyEventHandler = (eventHandler) => async (domainEvent) => {
  const session = new Session(false);
  const eventRepository = new EventRepository(session);
  log.debug(JSON.stringify(domainEvent));
  try {
    await session.beginTransaction();
    eventHandler(domainEvent.payload, session);
    await eventRepository.update({ id: domainEvent.id, status: 'handled' });
    await session.commitTransaction();
  } catch (e) {
    await session.rollbackTransaction();
  }
};

const registerEventHandlers = () => {
  subscribe(
    'admin-verification',
    processMessage(dictEventHandlers['VerifyCaptureProcessed']),
  );
};

const dictEventHandlers = Object.freeze({
  VerifyCaptureProcessed: handleVerifyCaptureProcessed,
});

module.exports = {
  dictEventHandlers,
  registerEventHandlers,
  applyEventHandler,
};
