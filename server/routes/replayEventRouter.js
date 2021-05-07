const express = require('express');
const replayEventRouter = express.Router();

const { getDomainEvents, dispatch } = require('../models/domain-event');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const { EventRepository } = require('../infra/database/PgRepositories');
const { dictEventHandlers, handleEvent} = require('../services/event-handlers');

const processEvent = (event, executor) => {
    try {
        executor(event);
    } catch (e) {
        console.log(`Error processing event ${e}`);
    }
}

replayEventRouter.post("/", async function(req, res) {
    const session = new Session(false);
    const eventRepository = new EventRepository(session);
    const executeGetDomainEvents = getDomainEvents(eventRepository);
    const domainEvents = await executeGetDomainEvents({"status":req.body.status});
    if(req.body.status == "raised"){
        const eventDispatch = dispatch(eventRepository, publishMessage);
            domainEvents.forEach(async (domainEvent) => {
                processEvent(domainEvent.payload,eventDispatch);
            });
    }else{
        domainEvents.forEach(async (domainEvent) => {
            const eventHandler = dictEventHandlers()[domainEvent.payload.type];
            if (typeof eventHandler !== "undefined" && eventHandler !== null){
                const eventHandle = handleEvent(eventHandler);
                processEvent(domainEvent.payload,eventHandle);
            }
        });
    }
    res.status(201).json({"request":"accepted","status":"replay in progress..."});
})

module.exports = replayEventRouter;
