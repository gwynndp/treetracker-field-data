const express = require('express');
const replayEventRouter = express.Router();

const { handleEvent, getDomainEvents, dispatch } = require('../models/DomainEvent');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const { EventRepository } = require('../infra/database/PgRepositories');
const { handleVerifyCaptureProcessed } = require('../services/EventHandlers');

replayEventRouter.post("/", async function(req, res) {
    const session = new Session(false);
    const eventRepository = new EventRepository(session);
    const executeGetDomainEvents = getDomainEvents(eventRepository);
    const domainEvents = await executeGetDomainEvents({"status":req.body.status});
    if(req.body.status == "raised"){
        const eventDispatch = dispatch(eventRepository, publishMessage);
        try {
            domainEvents.forEach(async (domainEvent) => {
                const result = await executeGetDomainEvents({"id":domainEvent.id});
                eventDispatch(domainEvent);
            });
        } catch(e) {
            console.log(e);
            if (session.isTransactionInProgress()){
                await session.rollbackTransaction();
            }
            if (migrationSession.isTransactionInProgress()) {
               await migrationSession.rollbackTransaction();
            }
            let result = e;
            res.status(422).json({...result[0]});
        }
    }else if(req.body.status == "received"){
        const eventHandle = handleEvent(handleVerifyCaptureProcessed);
        domainEvents.forEach(async (domainEvent) => {
            try {
                eventHandle(domainEvent.payload);
            } catch(e) {
                console.log(e);
                if (session.isTransactionInProgress()){
                    await session.rollbackTransaction();
                }
                if (migrationSession.isTransactionInProgress()) {
                    await migrationSession.rollbackTransaction();
                }
                let result = e;
                res.status(422).json({...result[0]});
            }
        });
    }
    res.status(200).json({"status":"Replay in progress..."});

})

module.exports = replayEventRouter;
