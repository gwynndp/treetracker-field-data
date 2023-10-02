const j2s = require('joi-to-swagger');
const {
  sessionPostSchema: postJoiSchema,
  sessionGetQuerySchema: getJoiSchema,
  sessionIdParamSchema: getSingleJoiSchema,
} = require('./schemas');

const { swagger: sessionPostSchema } = j2s(postJoiSchema);
const { swagger: sessionGetSchema } = j2s(getJoiSchema);
const { swagger: sessionIdParamSchema } = j2s(getSingleJoiSchema);

const singleRawCaptureResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Session',
      },
    },
  },
};

const sessionSwagger = {
  '/session': {
    get: {
      tags: ['session'],
      summary: 'Retrieves list of session data',
      parameters: [
        {
          schema: {
            ...sessionGetSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Retrieves list of session data',
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  tags: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Session',
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
      tags: ['session'],
      summary: 'Create a new session',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...sessionPostSchema },
          },
        },
      },
      responses: {
        201: singleRawCaptureResponse,
        200: singleRawCaptureResponse,
      },
    },
  },
  '/session/{session_id}': {
    get: {
      tags: ['session'],
      summary: 'get a single session',
      parameters: [
        {
          schema: {
            ...sessionIdParamSchema,
          },
          in: 'path',
          required: true,
          name: 'session_id',
          description: 'id of session_id to return',
        },
      ],
      responses: {
        200: singleRawCaptureResponse,
      },
    },
  },
};

const sessionComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    start_time: { type: 'string', format: 'date-time' },
    bulk_pack_version: { type: 'string' },
    device_configuration_id: { type: 'string' },
    originating_wallet_registration_id: { type: 'string' },
    target_wallet: { type: 'string' },
    check_in_photo_url: { type: 'string' },
    track_url: { type: 'string' },
    organization: { type: 'string' },
    organization_id: { type: 'string' },
    device_identifier: { type: 'string' },
    grower_account_id: { type: 'string' },
    wallet: { type: 'string' },
    user_photo_url: { type: 'string' },
    bulk_pack_file_name: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
  },
};

module.exports = {
  sessionSwagger,
  sessionComponent,
};
