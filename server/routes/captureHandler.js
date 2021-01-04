const express = require('express');
const captureRouter = express.Router();
const { createCapture, CaptureData }= require('../models/Capture');
const Session = require('../infra/database/Session');
const { dispatch } = require('../models/DomainEvent');
const { publishToTopic } = require('../infra/messaging/RabbitMQMessaging');

const { CaptureRepositoryImpl, EventRepositoryImpl } = require('../infra/database/PgRepositories');

captureRouter.get("/", function(req, res) {
    res.send('hello world');
    res.end();
})

captureRouter.post("/", async function(req, res) {
    let session = new Session();
    const captureRepoImpl = new CaptureRepositoryImpl(session);
    const eventRepositoryImpl = new EventRepositoryImpl(session);
    await session.beginTransaction();
    const captureData = CaptureData(req.body);
    const executeCreateCapture = createCapture(captureRepoImpl, eventRepositoryImpl);
    const eventDispatch = dispatch(eventRepositoryImpl, publishToTopic);
    try {
        const { entity, raisedEvents } = await executeCreateCapture(captureData);
        await session.commitTransaction();       
        raisedEvents.forEach(domainEvent => eventDispatch(domainEvent));
        res.status(200).json({
            ...entity
        });
    } catch(e){
        console.log(e);
        await session.rollbackTransaction();
        let result = e;
        res.status(422).json({...result});
    }
})

module.exports = captureRouter;