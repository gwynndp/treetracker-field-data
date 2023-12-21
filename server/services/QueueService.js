const { SubscriptionNames } = require('../infra/RabbitMQ/config');
const DomainEventModel = require('../models/DomainEvent');
const RabbitMQ = require('../infra/RabbitMQ/RabbitMQ');

class QueueService {
  constructor(session) {
    this._session = session;
    this._domainEventModel = new DomainEventModel(session);
    this._rabbitmq = new RabbitMQ();
  }

  async init() {
    await this._rabbitmq.init();
  }

  async tearDown() {
    await this._rabbitmq.teardownBroker();
  }

  publishRawCaptureCreatedMessage(domainEvent) {
    this._rabbitmq.publishMessage(
      SubscriptionNames.RAW_CAPTURE_CREATED,
      domainEvent.payload,
      () =>
        this._domainEventModel.update({
          ...domainEvent,
          status: 'sent',
        }),
    );
  }

  publishRawCaptureRejectedMessage(domainEvent) {
    this._rabbitmq.publishMessage(
      SubscriptionNames.RAW_CAPTURE_REJECTED,
      domainEvent.payload,
      () =>
        this._domainEventModel.update({
          ...domainEvent,
          status: 'sent',
        }),
    );
  }

  subscribeToCaptureCreationEvent(eventHandler) {
    this._rabbitmq.subscribe(SubscriptionNames.CAPTURE_CREATED, eventHandler);
  }
}

module.exports = QueueService;
