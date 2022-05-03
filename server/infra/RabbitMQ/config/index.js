const SubscriptionNames = {
  RAW_CAPTURE_CREATED: 'raw-capture-created',
  ADMIN_VERIFICATION: 'admin-verification',
};

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
        queues: [
          SubscriptionNames.ADMIN_VERIFICATION,
          SubscriptionNames.RAW_CAPTURE_CREATED,
        ],
        publications: {
          [SubscriptionNames.RAW_CAPTURE_CREATED]: {
            queue: SubscriptionNames.RAW_CAPTURE_CREATED,
          },
        },
        subscriptions: {
          [SubscriptionNames.ADMIN_VERIFICATION]: {
            queue: SubscriptionNames.ADMIN_VERIFICATION,
            contentType: 'application/json',
          },
        },
      },
    },
  },
  SubscriptionNames,
};
