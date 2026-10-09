export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Notification Service API',
    version: '1.0.0',
    description: 'A High-Performance Notification Service API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  paths: {
    '/api/notifications': {
      post: {
        summary: 'Send a new notification',
        description: 'Simulates dispatching a notification (email or sms) and records it in the database.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['recipient', 'type', 'body'],
                properties: {
                  recipient: { type: 'string', description: 'Email address or phone number', example: 'test@example.com' },
                  type: { type: 'string', enum: ['email', 'sms'], example: 'email' },
                  subject: { type: 'string', description: 'Required if type is email', example: 'Welcome to our service!' },
                  body: { type: 'string', description: 'Message content', example: 'Thank you for signing up.' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Notification created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                    recipient: { type: 'string', example: 'test@example.com' },
                    type: { type: 'string', example: 'email' },
                    subject: { type: 'string', example: 'Welcome to our service!' },
                    body: { type: 'string', example: 'Thank you for signing up.' },
                    status: { type: 'string', example: 'sent' },
                    timestamp: { type: 'string', format: 'date-time', example: '2026-06-17T13:47:13.544Z' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Validation failed' },
                    errors: {
                      type: 'object',
                      example: { subject: 'Subject is required for email notifications' }
                    }
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Get all notifications',
        description: 'Retrieve a paginated list of sent notifications sorted by timestamp descending.',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            required: false,
            schema: { type: 'integer', default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                          recipient: { type: 'string', example: 'test@example.com' },
                          type: { type: 'string', example: 'email' },
                          status: { type: 'string', example: 'sent' },
                          timestamp: { type: 'string', format: 'date-time', example: '2026-06-17T13:47:13.544Z' },
                        }
                      }
                    },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    totalPages: { type: 'integer', example: 5 },
                    totalItems: { type: 'integer', example: 50 },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Service health check',
        description: 'Check if the API server is running.',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'text/plain': {
                schema: { type: 'string', example: 'OK' }
              }
            }
          }
        }
      }
    }
  },
};
