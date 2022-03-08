const log = require('loglevel');
const convertStringToUuid = require('uuid-by-string');

log.setDefaultLevel('info');

const device_identifier = '50eccbeeef2214fe';
const planter_identifier = 'adamulanga85@gmail.com';

const sessionId = convertStringToUuid(device_identifier + planter_identifier);
log.info(device_identifier);
log.info(planter_identifier);
log.info(sessionId);
