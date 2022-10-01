const SubscriptionNames = {
  RAW_CAPTURE_CREATED: 'raw-capture-created',
  RAW_CAPTURE_REJECTED: 'raw-capture-rejected',
  CAPTURE_CREATED: 'capture-created',
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
          SubscriptionNames.CAPTURE_CREATED,
          SubscriptionNames.RAW_CAPTURE_CREATED,
          SubscriptionNames.RAW_CAPTURE_REJECTED,
        ],
        publications: {
          [SubscriptionNames.RAW_CAPTURE_CREATED]: {
            queue: SubscriptionNames.RAW_CAPTURE_CREATED,
          },
          [SubscriptionNames.RAW_CAPTURE_REJECTED]: {
            queue: SubscriptionNames.RAW_CAPTURE_REJECTED,
          },
        },
        subscriptions: {
          [SubscriptionNames.CAPTURE_CREATED]: {
            queue: SubscriptionNames.CAPTURE_CREATED,
            contentType: 'application/json',
          },
        },
      },
    },
  },
  SubscriptionNames,
};
