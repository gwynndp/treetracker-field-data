const replayEventPostSwagger = {
  '/replay-event': {
    post: {
      tags: ['replay-event'],
      summary: 'Replay Events',
      description: 'Initiates the replay of events.',
      responses: {
        200: {
          description: 'Request accepted',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  request: { type: 'string', example: 'accepted' },
                  status: { type: 'string', example: 'replay in progress...' },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = { replayEventPostSwagger };
