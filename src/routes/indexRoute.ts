import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { FastifyInstance } from 'fastify';

const indexRoute = async (fastify: FastifyInstance) => {
  const files = readdirSync(__dirname)
    .filter(file => file !== 'indexRoute.ts' && file.endsWith('.ts'));

  for (const file of files) {
    const routeModule = await import(resolve(__dirname, file));
    fastify.register(routeModule);
  }
};

export default indexRoute;
