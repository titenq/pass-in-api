import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

import slug from '../helpers/slug';
import EventModel from '../models/eventModel';
import { EventRequestBody } from '../interfaces/eventInterface';

const prisma = new PrismaClient({ log: ['query'] });

const eventController = async (fastify: FastifyInstance, options: any) => {
  fastify.get('/events', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({ message: 'event online' });
  });

  fastify.post('/events', async (request: FastifyRequest<{ Body: EventRequestBody }>, reply: FastifyReply) => {
    try {
      const data = await z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
        isActive: z.boolean()
      })
        .safeParseAsync(request.body);

      if (!data.success) {
        const errors = JSON.parse(data.error.message);

        return reply.status(400).send({ error: errors });
      }

      const event: EventModel = await prisma.event.create({
        data: {
          title: data.data.title,
          details: data.data.details,
          maximumAttendees: data.data.maximumAttendees,
          slug: slug(data.data.title),
          isActive: data.data.isActive
        }
      });

      return reply.status(201).send(event);
    } catch (error) {
      console.log('error: ', error);
    }
  });
};

export default eventController;
