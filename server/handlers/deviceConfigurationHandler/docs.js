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
        $ref: '#/components/schemas/Device-Configuration',
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
                      $ref: '#/components/schemas/Device-Configuration',
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
    device_identifier: { type: 'string' },
    brand: { type: 'string' },
    model: { type: 'string' },
    device: { type: 'string' },
    serial: { type: 'string' },
    hardware: { type: 'string' },
    manufacturer: { type: 'string' },
    app_build: { type: 'string' },
    app_version: { type: 'string' },
    os_version: { type: 'array' },
    sdk_version: { type: 'string' },
    logged_at: { type: 'string' },
    bulk_pack_file_name: { type: 'string' },
  },
};

module.exports = {
  deviceConfigurationSwagger,
  deviceConfigurationComponent,
};
