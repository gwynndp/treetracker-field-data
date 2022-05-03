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
        queues: [SubscriptionNames.ADMIN_VERIFICATION],
        publications: {
          [SubscriptionNames.ADMIN_VERIFICATION]: {
            queue: SubscriptionNames.ADMIN_VERIFICATION,
          },
        },
      },
    },
  },
};
