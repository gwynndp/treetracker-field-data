const { v4: uuid } = require('uuid');
const { Repository } = require('./Repository');

const DomainEvent = (
    {
        id = uuid(),
        payload,
        status,
        created_at = new Date().toISOString(),
        updated_at = new Date().toISOString()
    }) => Object.freeze({
        id,
        payload,
        status,
        created_at,
        updated_at
    });

const FilterCriteria = ({
    status = undefined,
    id = undefined,
}) => {
    return Object.entries({ status,id })
        .filter(entry => entry[1] !== undefined)
        .reduce((result, item) => {
            result[item[0]] = item[1];
            return result;
        }, {});
}

const QueryOptions = ({
    limit = undefined,
    offset = undefined,
}) => {
    return Object.entries({ limit, offset })
        .filter(entry => entry[1] !== undefined)
        .reduce((result, item) => {
            result[item[0]] = item[1];
            return result;
        }, {});
}

const getDomainEvents = (eventRepositoryImpl) => (async (filterCriteria = undefined) => {
    let filter = {}
    let options = { limit: 1000, offset: 0 };
    if (filterCriteria !== undefined) {
        filter = {...filter, ...FilterCriteria({...filterCriteria }) };
        options = { ...options, ...QueryOptions({ ...filterCriteria }) };
    }
    const eventRepository = new Repository(eventRepositoryImpl);
    const rawRepos = await eventRepository.getByFilter(filter, options);
    return rawRepos.map((row) => { return DomainEvent({ ...row }); });
});


const raiseEvent = (eventRepositoryImpl) => (async (domainEvent) => {
    const eventRepository = new Repository(eventRepositoryImpl);
    return await eventRepository.add({ ...domainEvent, status: 'raised' });
});

const receiveEvent = (eventRepositoryImpl) => (async (domainEvent) => {
    const eventRepository = new Repository(eventRepositoryImpl);
    return await eventRepository.add({ ...domainEvent, status: 'received' });
})

const dispatch = (eventRepositoryImpl, publishToTopic) => (async (domainEvent) => {
    publishToTopic(domainEvent.payload,()=>{
        eventRepositoryImpl.update(
            {
                ...domainEvent,
                status: 'sent',
                updated_at: new Date().toISOString(),
            });
            return eventRepositoryImpl;
        });
});

module.exports = { DomainEvent, getDomainEvents, raiseEvent, receiveEvent, dispatch }
