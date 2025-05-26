import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BeGe API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:5000/api/v1' }],
  },
  apis: [
    path.resolve(__dirname, './routes/**/*.ts'),
    path.resolve(__dirname, './controllers/**/*.ts'),
  ],
  
})
