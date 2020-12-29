const express = require('express')
const captureRouter = express.Router()
const { createCapture, CaptureData }= require('../models/Capture')
const Session = require('../infra/database/Session')
const { CaptureRepositoryImpl } = require('../infra/database/PgCaptureRepository')

captureRouter.get("/", function(req, res) {
    res.send('hello world');
    res.end();
})

captureRouter.post("/", async function(req, res) {
    let session = new Session();
    await session.beginTransaction();
    const captureRepoImpl = new CaptureRepositoryImpl(session);
    const captureData = CaptureData(req.body);
    const executeCreateCapture = createCapture(captureRepoImpl);
    let result = {}
    try {
        result = await executeCreateCapture(captureData);
        await session.commitTransaction();
    } catch(e){
        await session.rollbackTransaction();
        result = e;
        res.status(422).json({...result});
    }
    res.status(201).json({
        ...result
    });
})

module.exports = captureRouter;