const express = require('express');
const { v4: uuidv4 } = require('uuid');

const { createTreesInMainDB, LegacyTree } = require('../models/LegacyTree');
const {
  createRawCapture,
  rawCaptureFromRequest,
  getRawCaptures,
} = require('../models/RawCapture');
const { dispatch } = require('../models/domain-event');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const {
  RawCaptureRepository,
  EventRepository,
} = require('../infra/database/PgRepositories');
const {
  LegacyTreeRepository,
  LegacyTreeAttributeRepository,
} = require('../infra/database/PgMigrationRepositories');
const Joi = require('joi');
const { ValidationError } = require('joi');

const rawLegacyCaptureSchema = Joi.object({
  uuid: Joi.string().required().guid(),
  image_url: Joi.string().required().uri(),
  lat: Joi.number().required().min(0).max(90),
  lon: Joi.number().required().min(0).max(180),
  note: Joi.string(),
  device_identifier: Joi.string(),
  planter_id: Joi.number().required(),
  planter_identifier: Joi.string().required(),
  planter_photo_url: Joi.string().uri(),
  attributes: Joi.array(),
  timestamp: Joi.date().timestamp('unix'),
}).unknown(false);

const rawCaptureGet = async (req, res, next) => {
  const session = new Session(false);
  const captureRepo = new RawCaptureRepository(session);
  const executeGetRawCaptures = getRawCaptures(captureRepo);
  const result = await executeGetRawCaptures(req.query);
  res.send(result);
  res.end();
};

const rawCapturePost = async (req, res, next) => {
  await rawLegacyCaptureSchema.validateAsync(req.body, { abortEarly: false });
  const session = new Session(false);
  const migrationSession = new Session(true);
  const captureRepo = new RawCaptureRepository(session);
  const eventRepository = new EventRepository(session);
  const legacyTreeRepository = new LegacyTreeRepository(migrationSession);
  const legacyTreeAttributeRepository = new LegacyTreeAttributeRepository(
    migrationSession,
  );
  const executeCreateRawCapture = createRawCapture(
    captureRepo,
    eventRepository,
  );
  const eventDispatch = dispatch(eventRepository, publishMessage);
  const legacyDataMigration = createTreesInMainDB(
    legacyTreeRepository,
    legacyTreeAttributeRepository,
  );

  try {
    await migrationSession.beginTransaction();
    const { entity: tree } = await legacyDataMigration(
      LegacyTree({ ...req.body }),
      [...req.body.attributes],
    );
    const rawCapture = rawCaptureFromRequest({ id: tree.id, ...req.body });
    await session.beginTransaction();
    const { entity, raisedEvents } = await executeCreateRawCapture(rawCapture);
    await session.commitTransaction();
    await migrationSession.commitTransaction();
    raisedEvents.forEach((domainEvent) => eventDispatch(domainEvent));
    res.status(200).json({
      ...entity,
    });
  } catch (e) {
    console.log(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    if (migrationSession.isTransactionInProgress()) {
      await migrationSession.rollbackTransaction();
    }
    res.status(422).json({ ...e });
  }
};

module.exports = {
  rawCaptureGet,
  rawCapturePost,
};
