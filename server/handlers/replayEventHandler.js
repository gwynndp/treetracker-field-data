const Joi = require('joi');
const { getDomainEvents, dispatch } = require('../models/domain-event');
const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');
const EventRepository = require('../infra/database/EventRepository');
const {
  dictEventHandlers,
  applyEventHandler,
} = require('../services/event-handlers');

const replayEventAPISchema = Joi.object({
  status: Joi.string().valid('raised', 'received'),
});

const replayEventPost = async (req, res, next) => {
  await replayEventAPISchema.validateAsync(req.body, { abortEarly: false });
  const session = new Session(false);
  const eventRepository = new EventRepository(session);
  const executeGetDomainEvents = getDomainEvents(eventRepository);

  const domainEvents = await executeGetDomainEvents({
    status: req.body.status,
  });
  const eventDispatch = dispatch(eventRepository, publishMessage);
  domainEvents.forEach(async (domainEvent) => {
    switch (domainEvent.status) {
      case 'raised':
        try {
          eventDispatch(domainEvent);
        } catch (e) {
          console.log(`Error dispatching event ${domainEvent.id}. Error ${e}`);
        }
        break;
      case 'received':
        {
          const eventHandler = dictEventHandlers[domainEvent.payload.type];
          if (typeof eventHandler !== 'undefined' && eventHandler !== null) {
            const executeApplyEventHandler = applyEventHandler(eventHandler);
            executeApplyEventHandler(domainEvent);
          } else {
            console.log(`Event handler not found for the payload type 
                    ${domainEvent.payload.type}`);
          }
        }
        break;
      default:
        console.log(`Domain event ${domainEvent.id} not in raised or
                received status, skipping its replay`);
        break;
    }
  });
  res
    .status(201)
    .json({ request: 'accepted', status: 'replay in progress...' });
};

module.exports = replayEventPost;
