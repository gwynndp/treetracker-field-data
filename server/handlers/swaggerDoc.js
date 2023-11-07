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
const { trackSwagger, trackComponent } = require('./tracksHandler/docs');
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
  ...trackSwagger,
};

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Treetracker Field Data API',
    version,
  },
  paths,
  components: {
    schemas: {
      DeviceConfiguration: { ...deviceConfigurationComponent },
      RawCapture: { ...rawCaptureComponent },
      Session: { ...sessionComponent },
      WalletRegistration: { ...walletRegistrationComponent },
      Track: { ...trackComponent },
    },
  },
};

const swaggerOptions = {
  customCss: `
    .topbar-wrapper img { 
      content:url('../assets/greenstand.webp');
      width:80px; 
      height:auto;
    }
    `,
  explorer: true,
};

module.exports = { swaggerDocument, swaggerOptions };
