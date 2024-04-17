import 'dotenv/config';
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors';

import indexRoute from './routes/indexRoute';
import { fastifySwaggerOptions, fastifySwaggerUiOptions } from './helpers/swaggerOptions';
import errorHandler from './helpers/errorHandler';

const port = process.env.PORT;
const app = Fastify();
let origin: string = '*';

if (process.env.NODE_ENV === 'PROD') {
  origin = 'http://dominio.com.br';
}

app.register(fastifyCors, { origin });
app.register(fastifySwagger, fastifySwaggerOptions);
app.register(fastifySwaggerUi, fastifySwaggerUiOptions);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

const startServer = async () => {
  await indexRoute(app);
  await app.listen({
    port: Number(port),
    host: '0.0.0.0'
  });
};

const listeners = ['SIGINT', 'SIGTERM'];

listeners.forEach(signal => {
  process.on(signal, async () => {
    console.log(`\nClosing signal received: ${signal}`);

    await app.close();

    console.log('Server closed successfully');

    process.exit(0);
  });
});

try {
  startServer();

  console.log(`Server started in http://localhost:${port}
API Doc: http://localhost:${port}/docs`);
} catch (err) {
  app.log.error(err);

  process.exit(1);
}
