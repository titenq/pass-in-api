import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const homeController = async (fastify: FastifyInstance, options: any) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'API online' });
  });
};

export default homeController;
