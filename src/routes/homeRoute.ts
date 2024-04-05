import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z, ZodError } from 'zod';

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
      }).setErrorHandler((error, request, reply) => {
        if (error instanceof ZodError) {
          reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            issues: error.issues,
          });

          return;
        }

        reply.send(error);
      });
};

export default homeRoute;
