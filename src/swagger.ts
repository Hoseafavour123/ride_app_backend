
import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BeGe API',
      version: '1.0.0',
    },

    servers: [{ url: 'https://bege-api.onrender.com/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./dist/routes/**/*.js', './dist/controllers/**/*.js',
  ],
})
