const express = require('express');
const captureRouter = express.Router();

const { createTreesInMainDB, LegacyTree } = require('../models/LegacyTree');
const { createCapture, NewCapture, getCaptures }= require('../models/Capture');
const { dispatch } = require('../models/DomainEvent');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const { CaptureRepository, EventRepository } = require('../infra/database/PgRepositories');
const { LegacyTreeRepository, LegacyTreeAttributeRepository }  = require('../infra/database/PgMigrationRepositories');

captureRouter.get("/", async function(req, res) {
    const session = new Session(false);
    const captureRepo = new CaptureRepository(session);
    const executeGetCaptures = getCaptures(captureRepo);
    const result = await executeGetCaptures(req.query);
    res.send(result);
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
    const eventDispatch = dispatch(eventRepository, publishMessage);
    const legacyDataMigration = createTreesInMainDB(legacyTreeRepository, legacyTreeAttributeRepository);

    try {
        await migrationSession.beginTransaction();
        const { entity: tree } = await legacyDataMigration(LegacyTree({ ...req.body }), [ ...req.body.attributes ]);
        const captureData = NewCapture({reference_id: tree.id, ...req.body});
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