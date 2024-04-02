import 'dotenv/config';
import Fastify from 'fastify';

import indexController from './controllers/indexController';

const port= process.env.PORT;

const fastify = Fastify({ logger: true });

const startServer = async () => {
  await indexController(fastify);
  await fastify.listen({ port: Number(port) });
};

try {
  startServer();

  console.log(`API started in http://localhost:${port}`)
} catch (err) {
  fastify.log.error(err);

  process.exit(1);
}
