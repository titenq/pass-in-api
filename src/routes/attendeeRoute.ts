import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import AttendeeModel from '../models/attendeeModel';
import {
  AttendeeBadgeRequestParams,
  AttendeeRequestBody,
  AttendeeRequestParams,
} from '../interfaces/attendeeInterface';
import attendeeService from '../services/attendeeService';
import checkInService from '../services/checkInService';
import {
  getAttendeeBadgeSchema,
  getAttendeeByEmailSchema,
  getAttendeeCheckInSchema
} from '../schemas/attendeeSchema';
import errorHandler from '../helpers/errorHandler';

const attendeeRoute = async (fastify: FastifyInstance, options: any) => {
  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge/:checkInId',
      { schema: getAttendeeBadgeSchema },
      async (
        request: FastifyRequest<{ Params: AttendeeBadgeRequestParams }>,
        reply: FastifyReply,
      ) => {
        try {
          const { attendeeId, checkInId } = request.params;
          const attendee = await attendeeService.getAttendeeBadge({
            attendeeId,
            checkInId,
          });

          if (!attendee) {
            return reply.status(404).send({
              error: 'Participante não encontrado.'
            });
          }

          const protocol = request.protocol;
          const hostname = request.hostname;
          const baseURL = `${protocol}://${hostname}`;
          const checkInURL = new URL(
            `attendees/${attendeeId}/check-in/${checkInId}`,
            baseURL,
          ).toString();

          const { event, ...rest } = attendee;

          const attendeeReply = {
            ...rest,
            eventTitle: event.title,
            eventDate: event.eventDate,
            checkInURL,
          };

          return reply.status(200).send(attendeeReply);
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/check-in/:checkInId',
      { schema: getAttendeeCheckInSchema },
      async (
        request: FastifyRequest<{ Params: AttendeeBadgeRequestParams }>,
        reply: FastifyReply,
      ) => {
        try {
          const { attendeeId, checkInId } = request.params;
          const attendee = await attendeeService.getAttendeeCheckIn({
            attendeeId,
            checkInId,
          });

          if (!attendee) {
            return reply.status(409).send({
              error: 'Id e checkInId do participante não conferem.'
            });
          }

          const attendeeCheckIn = await checkInService.getCheckIn(attendeeId);

          if (attendeeCheckIn) {
            return reply.status(409).send({
              error: 'Check In já realizado com o ID do participante.',
            });
          }

          const checkIn = await checkInService.createCheckIn({
            attendeeId,
            checkInId,
          });

          return reply.status(201).send(checkIn);
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    );

  fastify.withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees',
      {
        schema: getAttendeeByEmailSchema
      },
      async (
        request: FastifyRequest<{
          Body: AttendeeRequestBody;
          Params: AttendeeRequestParams;
        }>,
        reply: FastifyReply,
      ) => {
        try {
          const { eventId } = request.params;
          const { name, email } = request.body;

          const attendeeEmailEventId = await attendeeService.getAttendeeByEmail(
            email,
            eventId,
          );

          if (attendeeEmailEventId) {
            return reply.status(409).send({
              error: 'Participante já resgistrado para esse evento.',
            });
          }

          const { event, countAttendeesInEvent } =
            await attendeeService.getEventAndAttendees(eventId);

          if (!event) {
            return reply.status(404).send({
              error: 'Evento não encontrado.',
            });
          }

          if (!event.isActive) {
            return reply.status(409).send({
              error: 'O evento está inativo.',
            });
          }

          if (
            event?.maximumAttendees &&
            countAttendeesInEvent >= event?.maximumAttendees
          ) {
            return reply.status(409).send({
              error: 'O evento atingiu ao número máximo de participantes.',
            });
          }

          const attendee: AttendeeModel = await attendeeService.createAttendee(
            name,
            email,
            eventId
          );

          return reply.status(201).send({ attendeeId: attendee.id });
        } catch (error) {
          console.error(error);

          errorHandler(error, request, reply);
        }
      },
    );
};

export default attendeeRoute;
