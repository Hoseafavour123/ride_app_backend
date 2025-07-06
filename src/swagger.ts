
import swaggerJSDoc from 'swagger-jsdoc'

const url = process.env.NODE_ENV === 'production' ? 'https://bege-api.onrender.com/api/v1' : 'http://localhost:5000/api/v1'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BeGe API',
      version: '1.0.0',
    },

    servers: [{ url }],
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
