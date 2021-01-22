const { v4: uuid } = require('uuid');
const { Repository } = require('./Repository');

const DomainEvent = (payload) => Object.freeze({
    id: uuid(),
    payload,
    status: 'raised',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
});

const raiseEvent = (eventRepositoryImpl) => (async (domainEvent) => {
    const eventRepository = new Repository(eventRepositoryImpl);
    return await eventRepository.save(domainEvent);
});

const dispatch = (eventRepositoryImpl, publishToTopic) => (async (domainEvent) => {
    publishToTopic(domainEvent.payload)
    .then(()=>{
        eventRepositoryImpl.update(
            {
                ...domainEvent,
                status: 'sent',
                updated_at: new Date().toISOString(),
            });
        })
    .catch(console.error);
});

module.exports = { DomainEvent, raiseEvent, dispatch }