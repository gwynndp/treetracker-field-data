const express = require('express');
const captureRouter = express.Router();

const { createTreesInMainDB, LegacyTree } = require('../models/LegacyTree');
const { createCapture, CaptureData }= require('../models/Capture');
const { dispatch } = require('../models/DomainEvent');

const Session = require('../infra/database/Session');
const { publishToTopic } = require('../infra/messaging/RabbitMQMessaging');

const { CaptureRepository, EventRepository } = require('../infra/database/PgRepositories');
const { LegacyTreeRepository, LegacyTreeAttributeRepository }  = require('../infra/database/PgMigrationRepositories');

captureRouter.get("/", function(req, res) {
    res.send('hello world');
    res.end();
})

captureRouter.post("/", async function(req, res) {
    const session = new Session(false);
    const migrationSession = new Session(true);
    const captureRepo = new CaptureRepository(session);
    const eventRepository = new EventRepository(session);
    const legacyTreeRepository = new LegacyTreeRepository(migrationSession);
    const legacyTreeAttributeRepository = new LegacyTreeAttributeRepository(migrationSession);
    const executeCreateCapture = createCapture(captureRepo, eventRepository);
    const eventDispatch = dispatch(eventRepository, publishToTopic);
    const legacyDataMigration = createTreesInMainDB(legacyTreeRepository, legacyTreeAttributeRepository);

    try {
        await migrationSession.beginTransaction();
        const { entity: tree } = await legacyDataMigration(LegacyTree({ ...req.body }), [ ...req.body.attributes ]);
        const captureData = CaptureData({reference_id: tree.id, ...req.body});
        await session.beginTransaction();
        const { entity, raisedEvents } = await executeCreateCapture(captureData);
        await session.commitTransaction();       
        await migrationSession.commitTransaction();
        raisedEvents.forEach(domainEvent => eventDispatch(domainEvent));
        res.status(200).json({
            ...entity
        });
    } catch(e){
        console.log(e);
        if (session.isTransactionInProgress()){
            await session.rollbackTransaction();
        }
        if (migrationSession.isTransactionInProgress()) {
            await migrationSession.rollbackTransaction();
        }
        let result = e;
        res.status(422).json({...result});
    }
})

module.exports = captureRouter;