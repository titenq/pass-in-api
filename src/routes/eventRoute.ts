import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import generateSlug from '../helpers/generateSlug';
import EventModel from '../models/eventModel';
import {
  EventRequestBody,
  EventRequestParams,
  EventRequestQuery,
} from '../interfaces/eventInterface';
import eventService from '../services/eventService';
import {
  createEventSchema,
  getAttendeesByEventSchema,
  getEventByIdSchema
} from '../schemas/eventSchema';
import errorHandler from '../helpers/errorHandler';

const eventRoute = async (fastify: FastifyInstance, options: any) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId',
      { schema: getEventByIdSchema },
      async (
        request: FastifyRequest<{ Params: EventRequestParams }>,
        reply: FastifyReply,
      ) => {
        try {
          const { eventId } = request.params;
          const event = await eventService.getEventById(eventId);

          if (!event) {
            return reply.status(404).send({ error: 'Evento não encontrado.' });
          }

          const { _count, ...rest } = event;
          const eventReply = {
            ...rest,
            attendeesAmount: _count?.attendees,
          };

          return reply.status(200).send(eventReply);
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/attendees',
      { schema: getAttendeesByEventSchema },
      async (
        request: FastifyRequest<{
          Params: EventRequestParams;
          Querystring: EventRequestQuery;
        }>,
        reply: FastifyReply,
      ) => {
        try {
          const { eventId } = request.params;
          const { page, limit, query } = request.query;
          const {
            attendees,
            count
          } = await eventService.getAttendeesByEvent(eventId, page, limit, query);

          const isEvent = await eventService.getEventById(eventId);

          if (!isEvent) {
            return reply.status(404).send({
              error: 'Não existe evento com esse ID'
            });
          }

          const attendeesMap = attendees.map(attendee => {
            const { checkIn, ...rest } = attendee;
            const attendeesReply = {
              ...rest,
              checkInAt: attendee.checkIn?.createdAt,
            };

            return attendeesReply;
          });

          return reply.status(200).send({
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalAttendees: count,
            attendees: attendeesMap,
          });
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/events',
      { schema: createEventSchema },
      async (
        request: FastifyRequest<{ Body: EventRequestBody }>,
        reply: FastifyReply,
      ) => {
        try {
          const {
            title,
            details,
            maximumAttendees,
            isActive,
            eventDate
          } = request.body;

          const slug = generateSlug(title);

          const isSlug = await eventService.getIsSlug(slug);

          if (isSlug) {
            return reply.status(409).send({
              error: 'Já existe um evento com esse título'
            });
          }

          const event: EventModel = await eventService.createEvent(
            title,
            slug,
            isActive,
            eventDate,
            details!,
            maximumAttendees!
          );

          return reply.status(201).send({ eventId: event.id });
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    );
};

export default eventRoute;
