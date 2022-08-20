const { SubscriptionNames } = require('../server/infra/RabbitMQ/config');

module.exports = {
  config: {
    vhosts: {
      dev: {
        connection: {
          url: process.env.RABBIT_MQ_URL,
          socketOptions: {
            timeout: 1000,
          },
        },
        queues: [SubscriptionNames.CAPTURE_CREATED],
        publications: {
          [SubscriptionNames.CAPTURE_CREATED]: {
            queue: SubscriptionNames.CAPTURE_CREATED,
          },
        },
      },
    },
  },
};
