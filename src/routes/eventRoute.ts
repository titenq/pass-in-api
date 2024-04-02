import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import generateSlug from '../helpers/generateSlug';
import EventModel from '../models/eventModel';
import { EventRequestBody } from '../interfaces/eventInterface';
import prisma from '../lib/prisma';

const eventRoute = async (fastify: FastifyInstance, options: any) => {
  fastify.get('/events', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'event online' });
  });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/events',
      {
        schema: {
          body: z.object({
            title: z.string().min(4),
            details: z.string().nullable(),
            maximumAttendees: z.number().int().positive().nullable(),
            isActive: z.boolean()
          }),
          response: {
            201: z.object({
              eventId: z.string().uuid()
            })
          }
        }
      },
      async (
        request: FastifyRequest<{ Body: EventRequestBody }>,
        reply: FastifyReply
      ) => {
        try {
          const {
            title,
            details,
            maximumAttendees,
            isActive
          } = request.body;

          const slug = generateSlug(title);
          const isSlug = await prisma.event.findUnique({ where: { slug } });

          if (isSlug) {
            return reply.status(409).send({ error: 'Another event with same title exists.' });
          }

          const event: EventModel = await prisma.event.create({
            data: {
              title,
              details,
              maximumAttendees,
              slug,
              isActive
            }
          });

          return reply.status(201).send({ eventId: event.id });
        } catch (error) {
          console.log('error: ', error);
        }
      });
};

export default eventRoute;
