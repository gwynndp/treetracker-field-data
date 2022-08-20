const log = require('loglevel');
const Session = require('../infra/database/Sessions/Session');
const DomainEvent = require('../models/DomainEvent');
const {
  EventHandlerService,
  DictEventHandlers,
} = require('./EventHandlerService');
const QueueService = require('./QueueService');

class ReplayEventService {
  constructor() {
    this._session = new Session();
    this._domainEvent = new DomainEvent(this._session);
  }

  async replayEvents() {
    const domainEvents = await this._domainEvent.getDomainEvents(
      {},
      { limit: 1000 },
    );

    domainEvents.forEach(async (domainEvent) => {
      switch (domainEvent.status) {
        case 'raised':
          try {
            const queueService = new QueueService(this._session);
            await queueService.init();
            queueService.publishRawCaptureCreatedMessage(domainEvent);
          } catch (e) {
            log.error(`Error dispatching event ${domainEvent.id}. Error ${e}`);
          }
          break;
        case 'received':
          {
            const eventHandlerService = new EventHandlerService();
            const eventHandler = DictEventHandlers[domainEvent.payload.type];
            if (typeof eventHandler !== 'undefined' && eventHandler !== null) {
              eventHandlerService.applyEventHandler(eventHandler, domainEvent);
            } else {
              log.warn(
                `Event handler not found for the payload type ${domainEvent.payload.type}`,
              );
            }
          }
          break;
        default:
          log.info(
            `Domain event ${domainEvent.id} not in raised or received status, skipping its replay`,
          );
          break;
      }
    });
  }
}

module.exports = ReplayEventService;
