import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

const errorHandler = (error: any, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof ZodError || error.details.issues) {
    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      issues: error instanceof ZodError ? error.issues : error.details.issues,
    });

    return;
  }

  reply.send(error);
};

export default errorHandler;
