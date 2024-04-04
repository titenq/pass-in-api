import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import AttendeeModel from '../models/attendeeModel';
import {
  AttendeeBadgeRequestParams,
  AttendeeRequestBody,
  AttendeeRequestParams
} from '../interfaces/attendeeInterface';
import prisma from '../lib/prisma';

const attendeeRoute = async (fastify: FastifyInstance, options: any) => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/attendees/:attendeeId/badge',
      {
        schema: {
          summary: 'Buscar informações do participante pelo id',
          tags: ['attendee'],
          params: z.object({
            attendeeId: z.coerce.number().int().positive()
          }),
          response: {
            200: z.object({
              name: z.string().min(4),
              email: z.string().email(),
              eventTitle: z.string().min(4),
              checkInURL: z.string().url()
            })
          }
        }
      },
      async (
        request: FastifyRequest<{ Params: AttendeeBadgeRequestParams }>,
        reply: FastifyReply
      ) => {
        try {
          const { attendeeId } = request.params;

          const attendee = await prisma.attendee.findUnique({
            select: {
              name: true,
              email: true,
              event: {
                select: {
                  title: true
                }
              }
            },
            where: {
              id: attendeeId
            }
          });

          if (!attendee) {
            return reply.status(404).send({ error: 'Participante não encontrado.' });
          }

          const protocol = request.protocol;
          const hostname = request.hostname;
          const baseURL = `${protocol}://${hostname}`;
          const checkInURL = new URL(`attendees/${attendeeId}/check-in`, baseURL).toString();

          const { event, ...rest } = attendee;

          const attendeeReply = {
            ...rest,
            eventTitle: event.title,
            checkInURL
          };

          return reply.status(200).send(attendeeReply);
        } catch (error) {
          console.log('error: ', error);
        }
      });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/attendees/:attendeeId/check-in',
      {
        schema: {
          summary: 'Fazer check-in do participante pelo id',
          tags: ['check-in'],
          params: z.object({
            attendeeId: z.coerce.number().int().positive()
          }),
          response: {
            201: z.object({
              id: z.number().int().positive(),
              createdAt: z.date(),
              attendeeId: z.number().int().positive()
            })
          }
        }
      },
      async (
        request: FastifyRequest<{ Params: AttendeeBadgeRequestParams }>,
        reply: FastifyReply
      ) => {
        try {
          const { attendeeId } = request.params;

          const attendeeCheckIn = await prisma.checkIn.findUnique({
            where: {
              attendeeId
            }
          });

          if (attendeeCheckIn) {
            return reply.status(409).send({ error: 'Check In já realizado com o ID do participante.' });
          }

          const checkIn = await prisma.checkIn.create({
            data: {
              attendeeId
            }
          });

          return reply.status(201).send(checkIn);
        } catch (error) {
          console.log('error: ', error);
        }
      });

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/events/:eventId/attendees',
      {
        schema: {
          summary: 'Registrar participante pelo id do evento',
          tags: ['attendee'],
          body: z.object({
            name: z.string().min(4),
            email: z.string().email()
          }),
          params: z.object({
            eventId: z.string().uuid()
          }),
          response: {
            201: z.object({
              attendeeId: z.number().int().positive()
            })
          }
        }
      },
      async (
        request: FastifyRequest<{ Body: AttendeeRequestBody, Params: AttendeeRequestParams }>,
        reply: FastifyReply
      ) => {
        try {
          const { eventId } = request.params;
          const { name, email } = request.body;

          const attendeeEmailEventId = await prisma.attendee.findUnique({
            where: {
              eventId_email: {
                email,
                eventId
              }
            }
          });

          if (attendeeEmailEventId) {
            return reply.status(409).send({
              error: 'Participante já resgistrado para esse evento.'
            });
          }

          const [event, countAttendeesInEvent] = await Promise.all([
            prisma.event.findUnique({
              where: {
                id: eventId
              }
            }),
            prisma.attendee.count({
              where: {
                eventId
              }
            })
          ]);

          if (!event) {
            return reply.status(404).send({
              error: 'Evento não encontrado.'
            });
          }

          if (!event?.isActive) {
            return reply.status(409).send({
              error: 'O evento está inativo.'
            });
          }

          if (event?.maximumAttendees && countAttendeesInEvent >= event?.maximumAttendees) {
            return reply.status(409).send({
              error: 'O evento atingiu ao número máximo de participantes.'
            });
          }

          const attendee: AttendeeModel = await prisma.attendee.create({
            data: {
              name,
              email,
              eventId
            }
          });

          return reply.status(201).send({ attendeeId: attendee.id });
        } catch (error) {
          console.log('error: ', error);
        }
      });
};

export default attendeeRoute;
