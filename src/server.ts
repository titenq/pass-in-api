import 'dotenv/config';
import Fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import indexRoute from './routes/indexRoute';

const port= process.env.PORT;

const fastify = Fastify({ logger: true });

fastify.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Pass-in',
      description: 'Documentação da API Pass-in',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
});

fastify.register(fastifySwaggerUi, {
  routePrefix: '/docs'
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const startServer = async () => {
  await indexRoute(fastify);
  await fastify.listen({ port: Number(port) });
};

try {
  startServer();

  console.log(`API started in http://localhost:${port}`)
} catch (err) {
  fastify.log.error(err);

  process.exit(1);
}
