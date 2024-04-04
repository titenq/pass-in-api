import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const homeRoute = async (fastify: FastifyInstance, options: any) => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get('/',
      {
        schema: {
          summary: 'Rota de verificação',
          tags: ['home'],
          response: {
            200: z.object({
              message: z.string(),
            })
          }
        }
      },
      async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({ message: 'API online' });
  });
};

export default homeRoute;
