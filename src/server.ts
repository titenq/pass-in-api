import 'dotenv/config';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod';

import indexRoute from './routes/indexRoute';

const port= process.env.PORT;

const fastify = Fastify({ logger: true });

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
