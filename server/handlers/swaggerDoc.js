const {
  deviceConfigurationSwagger,
  deviceConfigurationComponent,
} = require('./deviceConfigurationHandler/docs');
const {
  rawCaptureSwagger,
  rawCaptureComponent,
} = require('./rawCaptureHandler/docs');
const { replayEventPostSwagger } = require('./replayEventHandler/docs');
const { sessionSwagger, sessionComponent } = require('./sessionHandler/docs');
const {
  walletRegistrationSwagger,
  walletRegistrationComponent,
} = require('./walletRegistrationHandler/docs');
const { version } = require('../../package.json');

const paths = {
  ...deviceConfigurationSwagger,
  ...rawCaptureSwagger,
  ...replayEventPostSwagger,
  ...sessionSwagger,
  ...walletRegistrationSwagger,
};

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Treetracker Field API',
    version,
  },
  paths,
  components: {
    schemas: {
      DeviceConfiguration: { ...deviceConfigurationComponent },
      RawCapture: { ...rawCaptureComponent },
      Session: { ...sessionComponent },
      WalletRegistration: { ...walletRegistrationComponent },
    },
  },
};

module.exports = swaggerDefinition;
