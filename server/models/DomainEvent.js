const { v4: uuid } = require('uuid');
const EventRepository = require('../repositories/EventRepository');

class DomainEvent {
  constructor(session) {
    this._eventRepository = new EventRepository(session);
  }

  static DomainEvent(payload) {
    return Object.freeze({
      id: uuid(),
      payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  async getDomainEvents(filter, limitOptions) {
    const domainEvents = this._eventRepository.getByFilter(
      filter,
      limitOptions,
    );

    return domainEvents;
  }

  async getDomainEventByPayloadIdAndType(payloadId, type) {
    return this._eventRepository.getDomainEventByPayloadIdAndType(
      payloadId,
      type,
    );
  }

  async raiseEvent(domainEvent) {
    return this._eventRepository.create({
      ...this.constructor.DomainEvent(domainEvent),
      status: 'raised',
    });
  }

  async receiveEvent(domainEvent) {
    return this._eventRepository.create({
      ...this.constructor.DomainEvent(domainEvent),
      status: 'received',
    });
  }

  async update(object) {
    return this._eventRepository.update({
      ...object,
      updated_at: new Date().toISOString(),
    });
  }
}

module.exports = DomainEvent;
