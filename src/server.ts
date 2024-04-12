import 'dotenv/config';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';

import indexRoute from './routes/indexRoute';
import { fastifySwaggerOptions, fastifySwaggerUiOptions } from './helpers/swaggerOptions';

const port = process.env.PORT;
const fastify = Fastify();
let origin: string = '*';

if (process.env.NODE_ENV === 'PROD') {
  origin = 'http://dominio.com.br';
}

fastify.register(fastifyCors, { origin });
fastify.register(fastifySwagger, fastifySwaggerOptions);
fastify.register(fastifySwaggerUi, fastifySwaggerUiOptions);
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const startServer = async () => {
  await indexRoute(fastify);
  await fastify.listen({ port: Number(port), host: '0.0.0.0' });
};

try {
  startServer();

  console.log(`API started in http://localhost:${port}
API Doc: http://localhost:${port}/docs`);
} catch (err) {
  fastify.log.error(err);

  process.exit(1);
}
