const j2s = require('joi-to-swagger');
const {
  trackPostSchema: postJoiSchema,
  trackGetQuerySchema: getJoiSchema,
  trackIdParamSchema: getSingleJoiSchema,
} = require('./schemas');

const { swagger: trackPostSchema } = j2s(postJoiSchema);
const { swagger: trackGetSchema } = j2s(getJoiSchema);
const { swagger: trackIdParamSchema } = j2s(getSingleJoiSchema);

const singleTrackResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Track',
      },
    },
  },
};

const trackSwagger = {
  '/track': {
    get: {
      tags: ['track'],
      summary: 'Retrieves list of track data',
      parameters: [
        {
          schema: {
            ...trackGetSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Retrieves list of track data',
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tracks: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Track',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['track'],
      summary: 'Create a new track',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...trackPostSchema },
          },
        },
      },
      responses: {
        201: singleTrackResponse,
        200: singleTrackResponse,
      },
    },
  },
  '/track/{track_id}': {
    get: {
      tags: ['track'],
      summary: 'get a single track',
      parameters: [
        {
          schema: {
            ...trackIdParamSchema,
          },
          in: 'path',
          required: true,
          name: 'track_id',
          description: 'id of track to return',
        },
      ],
      responses: {
        200: singleTrackResponse,
      },
    },
  },
};

const trackComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    session_id: { type: 'string', format: 'uuid' },
    locations_url: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    bulk_pack_file_name: { type: 'string' },
  },
};

module.exports = {
  trackSwagger,
  trackComponent,
};
