const j2s = require('joi-to-swagger');
const {
  deviceConfigurationGetQuerySchema: getJoiSchema,
  deviceConfigurationIdParamSchema: getSingleJoiSchema,
  deviceConfigurationPostSchema: postJoiSchema,
} = require('./schemas');

const { swagger: deviceConfigurationPostSchema } = j2s(postJoiSchema);
const { swagger: deviceConfigurationGetSchema } = j2s(getJoiSchema);
const { swagger: deviceConfigurationIdParamSchema } = j2s(getSingleJoiSchema);

const singleDeviceConfigurationResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/DeviceConfiguration',
      },
    },
  },
};

const deviceConfigurationSwagger = {
  '/device-configuration': {
    get: {
      tags: ['device-configuration'],
      summary: 'Retrieve a list of device configurations',
      parameters: [
        {
          schema: {
            ...deviceConfigurationGetSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Allowed query parameters',
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
                      $ref: '#/components/schemas/DeviceConfiguration',
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
      tags: ['device-configuration'],
      summary: 'Create a new device configuration',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...deviceConfigurationPostSchema },
          },
        },
      },
      responses: {
        201: singleDeviceConfigurationResponse,
        200: singleDeviceConfigurationResponse,
      },
    },
  },
  '/device-configuration/{device_configuration_id}': {
    get: {
      tags: ['device-configuration'],
      summary: 'get a single device configuration',
      parameters: [
        {
          schema: {
            ...deviceConfigurationIdParamSchema,
          },
          in: 'path',
          required: true,
          name: 'device_configuration_id',
          description: 'id of device configuration_id to return',
        },
      ],
      responses: {
        200: singleDeviceConfigurationResponse,
      },
    },
  },
};

const deviceConfigurationComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    reference_id: { type: 'number' },
    tree_id: { type: 'string', format: 'uuid' },
    image_url: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    created_at: { type: 'string', format: 'date-time' },
    status: { type: 'string' },
    captured_at: { type: 'string', format: 'date-time' },
    planting_organization_id: { type: 'string', format: 'uuid' },
    tag_array: { type: 'array', items: { type: 'string' } },
    grower_account_id: { type: 'string', format: 'uuid' },
    morphology: { type: 'string' },
    age: { type: 'number' },
    note: { type: 'string' },
    attributes: { type: 'object' },
    species_id: { type: 'string', format: 'uuid' },
    session_id: { type: 'string', format: 'uuid' },
    device_configuration_id: { type: 'string', format: 'uuid' },
  },
};

module.exports = {
  deviceConfigurationSwagger,
  deviceConfigurationComponent,
};
