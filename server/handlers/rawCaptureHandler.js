const log = require('loglevel');

const Joi = require('joi');
const { createTreesInMainDB, LegacyTree } = require('../models/LegacyTree');
const {
  createRawCapture,
  rawCaptureFromRequest,
  getRawCaptures,
  RawCapture,
} = require('../models/RawCapture');
const { dispatch } = require('../models/domain-event');

const Session = require('../infra/database/Session');
const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const RawCaptureRepository = require('../infra/database/RawCaptureRepository');
const EventRepository = require('../infra/database/EventRepository');
const SessionRepository = require('../infra/database/SessionRepository');
const LegacyTreeRepository = require('../infra/database/LegacyTreeRepository');
const LegacyTreeAttributeRepository = require('../infra/database/LegacyTreeAttributeRepository');
const HttpError = require('./HttpError');

const rawCaptureSchema = Joi.object({
  id: Joi.string().required().guid().required(),
  session_id: Joi.string().guid().required(),
  lat: Joi.number().required().min(-90).max(90),
  lon: Joi.number().required().min(-180).max(180),
  image_url: Joi.string().uri().required(),
  gps_accuracy: Joi.number().integer().allow(null),
  abs_step_count: Joi.number().integer().allow(null),
  delta_step_count: Joi.number().integer().allow(null),
  rotation_matrix: Joi.array().items(Joi.number()).allow(null),
  note: Joi.string().allow(null, ''),
  extra_attributes: Joi.any().allow(null), // skip validation, field not currently processed
  // Joi.array()
  //   .items(
  //     Joi.object({
  //       key: Joi.string().required(),
  //       value: Joi.string().required().allow(''),
  //     }),
  //   )
  //  .allow(null),
  captured_at: Joi.date().iso().required(),
}).unknown(false);

const rawCaptureIdParamSchema = Joi.object({
  raw_capture_id: Joi.string().uuid().required(),
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
  log.warn('raw capture post...');
  delete req.body.extra_attributes; // remove extra_attributes until implemented on mobile side
  const body = req.body;
  if(body.rotation_matrix != null){
    for( let i=0; i<body.rotation_matrix.length(); i++){
      if(body.rotation_matrix[i] < .001){
        body.rotation_matrix[i] = 0;
      }
    }
  }
  await rawCaptureSchema.validateAsync(body, { abortEarly: false });
  const session = new Session(false);
  const migrationSession = new Session(true);
  const captureRepo = new RawCaptureRepository(session);
  const eventRepository = new EventRepository(session);
  const sessionRepo = new SessionRepository(session);
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
    const existingCapture = await captureRepo.getByFilter({
      'raw_capture.id': body.id,
    });
    const [rawCapture] = existingCapture;
    if (rawCapture) {
      const domainEvent = await eventRepository.getDomainEventByPayloadId(
        rawCapture.id,
      );
      if (domainEvent.status !== 'sent') {
        eventDispatch(domainEvent);
      }
      res.status(200).json(rawCapture);
    } else {
      let sessionObject = {};
      const sessionArray = await sessionRepo.getSession({
        'session.id': body.session_id,
      });
      if (!sessionArray.length) {
        throw new HttpError(
          409,
          `A session resource with id, ${body.session_id} has yet to be created, kindly retry later`,
        );
      }
      [sessionObject] = sessionArray;
      await migrationSession.beginTransaction();
      const legacyTreeObject = await LegacyTree({
        ...body,
        ...sessionObject,
        session: migrationSession,
      });
      const { entity: tree } = await legacyDataMigration(
        { ...legacyTreeObject },
        body.attributes || [],
      );
      const rawCapture = rawCaptureFromRequest({
        reference_id: tree.id,
        ...body,
      });
      await session.beginTransaction();

      const { entity, raisedEvents } = await executeCreateRawCapture(
        rawCapture,
      );
      await session.commitTransaction();
      await migrationSession.commitTransaction();
      raisedEvents.forEach((domainEvent) => eventDispatch(domainEvent));
      log.warn('succeeded.');
      return res.status(201).json(entity);
    }
  } catch (e) {
    log.warn('catch error in transaction');
    console.log(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    if (migrationSession.isTransactionInProgress()) {
      await migrationSession.rollbackTransaction();
    }
    next(e);
  }
};

const rawCaptureSingleGet = async function (req, res) {
  try {
    await rawCaptureIdParamSchema.validateAsync(req.params, {
      abortEarly: false,
    });

    const session = new Session();
    const rawCaptureRepo = new RawCaptureRepository(session);

    const rawCaptures = await rawCaptureRepo.getByFilter({
      'raw_capture.id': req.params.raw_capture_id,
    });

    const [rawCapture = {}] = rawCaptures;

    res.send(RawCapture(rawCapture));
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  rawCaptureGet,
  rawCapturePost,
  rawCaptureSingleGet,
};
