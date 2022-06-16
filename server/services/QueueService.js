// const { SubscriptionNames } = require('../infra/RabbitMQ/config');
const DomainEventModel = require('../models/DomainEvent');
// const RabbitMQ = require('../infra/RabbitMQ/RabbitMQ');

class QueueService {
  constructor(session) {
    this._session = session;
    this._domainEventModel = new DomainEventModel(session);
    // this._rabbitmq = new RabbitMQ();
  }

  async init() {
    // await this._rabbitmq.init();
  }

  publishRawCaptureCreatedMessage(domainEvent) {
    // this._rabbitmq.publishMessage(
    //   SubscriptionNames.RAW_CAPTURE_CREATED,
    //   domainEvent,
    //   () =>
    //     this._domainEventModel.update({
    //       ...domainEvent,
    //       status: 'sent',
    //     }),
    // );
  }

  subscribeToAdminVerificationEvent(eventHandler) {
    // this._rabbitmq.subscribe(
    //   SubscriptionNames.ADMIN_VERIFICATION,
    //   eventHandler,
    // );
  }
}

module.exports = QueueService;
