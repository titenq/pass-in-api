import { readdirSync } from 'fs';
import { resolve } from 'path';
import { FastifyInstance } from 'fastify';

interface ControllerModule {
  default: (fastify: FastifyInstance) => void;
}

const indexController = async (fastify: FastifyInstance) => {
  const files = readdirSync(__dirname)
    .filter(file => file !== 'indexController.ts' && file.endsWith('.ts'));

  for (const file of files) {
    const controllerModule: ControllerModule = await import(resolve(__dirname, file));
    controllerModule.default(fastify);
  }
};

export default indexController;
