const j2s = require('joi-to-swagger');
const {
  walletRegistrationPostSchema: postJoiSchema,
  walletRegistrationGetQuerySchema: getJoiSchema,
  walletRegistrationIdParamSchema: getSingleJoiSchema,
} = require('./schemas');

const { swagger: walletRegistrationPostSchema } = j2s(postJoiSchema);
const { swagger: walletRegistrationGetSchema } = j2s(getJoiSchema);
const { swagger: walletRegistrationIdParamSchema } = j2s(getSingleJoiSchema);

const singleWalletRegistrationResponse = {
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/WalletRegistration',
      },
    },
  },
};

const walletRegistrationSwagger = {
  '/wallet-registration': {
    get: {
      tags: ['wallet-registration'],
      summary: 'Retrieves list of wallet registration data',
      parameters: [
        {
          schema: {
            ...walletRegistrationGetSchema,
          },
          in: 'query',
          name: 'query',
          description: 'Retrieves list of wallet registration data',
        },
      ],
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  wallet_registrations: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/WalletRegistration',
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
      tags: ['wallet-registration'],
      summary: 'Create a new wallet registration',
      requestBody: {
        content: {
          'application/json': {
            schema: { ...walletRegistrationPostSchema },
          },
        },
      },
      responses: {
        201: singleWalletRegistrationResponse,
        200: singleWalletRegistrationResponse,
      },
    },
  },
  '/wallet-registration/{wallet_registration_id}': {
    get: {
      tags: ['wallet-registration'],
      summary: 'get a single wallet registration',
      parameters: [
        {
          schema: {
            ...walletRegistrationIdParamSchema,
          },
          in: 'path',
          required: true,
          name: 'wallet_registration_id',
          description: 'id of wallet registration to return',
        },
      ],
      responses: {
        200: singleWalletRegistrationResponse,
      },
    },
  },
};

const walletRegistrationComponent = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    wallet: { type: 'string' },
    user_photo_url: { type: 'string' },
    grower_account_id: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    registered_at: { type: 'string', format: 'date-time' },
    bulk_pack_file_name: { type: 'string' },
    v1_legacy_organization: { type: 'string' },
  },
};

module.exports = {
  walletRegistrationSwagger,
  walletRegistrationComponent,
};
