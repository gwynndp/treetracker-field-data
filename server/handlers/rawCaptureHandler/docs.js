const j2s = require('joi-to-swagger');
const {
  rawCaptureSchema: postJoiSchema,
  rawCaptureGetQuerySchema: getJoiSchema,
  rawCaptureIdParamSchema: getSingleJoiSchema,
  rawCaptureRejectionSchema: rejectJoiSchema,
} = require('./schemas');

const { swagger: rawCapturePostSchema } = j2s(postJoiSchema);
const { swagger: rawCaptureGetSchema } = j2s(getJoiSchema);
const { swagger: rawCaptureIdParamSchema } = j2s(getSingleJoiSchema);
const { swagger: rawCaptureRejectSchema } = j2s(rejectJoiSchema);

const singleRawCaptureResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Raw-Capture',
      },
    },
  },
};

const rawCaptureSwagger = {
  '/raw-captures': {
    get: {
      tags: ['raw-capture'],
      summary:
        'Retrieves capture data based on a filtering criteria or without filtering criteria',
      parameters: [
        {
          schema: {
            ...rawCaptureGetSchema,
          },
          in: 'query',
          name: 'query',
          description:
            'The status of the capture data, it can be one of the following three \n* unprocessed\n* approved\n* rejected',
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
                      $ref: '#/components/schemas/Raw-Capture',
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
      tags: ['raw-capture'],
      summary: 'Create a new raw capture',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...rawCapturePostSchema },
          },
        },
      },
      responses: {
        201: singleRawCaptureResponse,
        200: singleRawCaptureResponse,
      },
    },
  },
  '/raw-capture/{raw_capture_id}': {
    get: {
      tags: ['raw-capture'],
      summary: 'get a single raw capture',
      parameters: [
        {
          schema: {
            ...rawCaptureIdParamSchema,
          },
          in: 'path',
          required: true,
          name: 'raw_capture_id',
          description: 'id of raw_capture_id to return',
        },
      ],
      responses: {
        200: singleRawCaptureResponse,
      },
    },
  },
  '/raw-capture/{raw_capture_id}/reject': {
    patch: {
      tags: ['raw-capture'],
      summary: 'reject a raw capture',
      parameters: [
        {
          schema: {
            ...rawCaptureRejectSchema,
          },
          in: 'path',
          required: true,
          name: 'raw_capture_id',
          description: 'ID of the raw capture to be rejected',
        },
      ],
      responses: {
        200: {
          description: 'Raw capture has been rejected successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Raw-Capture',
              },
            },
          },
        },
      },
    },
  },
};

const rawCaptureComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    reference_id: { type: 'string' },
    session_id: { type: 'string' },
    abs_step_count: { type: 'integer' },
    delta_step_count: { type: 'integer' },
    rotation_matrix: { type: 'array', items: { type: 'number' } },
    image_url: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    gps_accuracy: { type: 'number' },
    note: { type: 'string' },
    device_identifier: { type: 'string' },
    grower_account_id: { type: 'string' },
    wallet: { type: 'string' },
    user_photo_url: { type: 'string' },
    extra_attributes: { type: 'object' },
    status: { type: 'string' },
    rejection_reason: { type: 'string' },
    bulk_pack_file_name: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
    captured_at: { type: 'string', format: 'date-time' },
    organization_id: { type: 'string' },
  },
};

module.exports = {
  rawCaptureSwagger,
  rawCaptureComponent,
};
