import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { FastifyInstance } from 'fastify';

interface RouteModule {
  default: (fastify: FastifyInstance) => void;
}

const indexRoute = async (fastify: FastifyInstance) => {
  const files = readdirSync(__dirname)
    .filter(file => file !== 'indexRoute.ts' && file.endsWith('.ts'));

  for (const file of files) {
    const routeModule: RouteModule = await import(resolve(__dirname, file));
    routeModule.default(fastify);
  }
};

export default indexRoute;
