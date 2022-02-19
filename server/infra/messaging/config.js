module.exports = {
  config: {
    vhosts: {
      test: {
        connection: {
          url: process.env.RABBIT_MQ_URL,
          socketOptions: {
            timeout: 1000,
          },
        },
        queues: [
          process.env.RAW_CAPTURE_VERIFIED_QUEUE,
          process.env.RAW_CAPTURE_CREATED_QUEUE,
        ],
        publications: {
          'raw-capture-created': {
            queue: process.env.RAW_CAPTURE_CREATED_QUEUE,
          },
        },
        subscriptions: {
          'admin-verification': {
            queue: process.env.RAW_CAPTURE_VERIFIED_QUEUE,
          },
        },
      },
    },
  },
};
