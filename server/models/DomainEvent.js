const { Repository } = require('./Repository');

const DomainEvent = ({type, payload}) => Objects.freeze({
    type,
    payload,
    status: 'raised',
    created_at: new Date().toISOString,
    updated_at: new Date().toISOString
});

const raiseEvent = (eventRepositoryImpl) => ((domainEvent) => {
    const eventRepository = new Repository(eventRepositoryImpl);
    eventRepository.save(domainEvent);
});

module.exports = { raiseEvent }