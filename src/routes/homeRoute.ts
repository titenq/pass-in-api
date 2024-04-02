import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const homeRoute = async (fastify: FastifyInstance, options: any) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'API online' });
  });
};

export default homeRoute;
