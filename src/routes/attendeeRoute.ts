import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import AttendeeModel from '../models/attendeeModel';
import {
  AttendeeBadgeRequestParams,
  AttendeeRequestBody,
  AttendeeRequestParams,
} from '../interfaces/attendeeInterface';
import prisma from '../lib/prisma';
import generateCheckInId from '../helpers/generateCheckInId';

const attendeeRoute = async (fastify: FastifyInstance, options: any) => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/attendees/:attendeeId/badge/:checkInId',
      {
        schema: {
          summary: 'Buscar informações do participante pelo id',
          tags: ['Participante'],
          params: z.object({
            attendeeId: z.coerce
              .number({
                required_error: 'O parâmetro attendeeId é obrigatório',
                invalid_type_error:
                  'O parâmetro attendeeId deve ser um número inteiro positivo',
              })
              .int({
                message: 'O parâmetro attendeeId deve ser um número inteiro',
              })
              .positive({
                message:
                  'O parâmetro attendeeId deve ser um número inteiro positivo',
              }),
            checkInId: z.string({
              required_error: 'O parâmetro checkInId é obrigatório',
              invalid_type_error: 'O parâmetro checkInId deve ser um texto',
            }),
          }),
          response: {
            200: z.object({
              checkInId: z.string(),
              name: z.string().min(4),
              email: z.string().email(),
              eventTitle: z.string().min(4),
              checkInURL: z.string().url(),
              eventDate: z.date(),
            }),
          },
        },
      },
      async (
        request: FastifyRequest<{ Params: AttendeeBadgeRequestParams }>,
        reply: FastifyReply,
      ) => {
        try {
          const { attendeeId, checkInId } = request.params;

          const attendee = await prisma.attendee.findUnique({
            select: {
              checkInId: true,
              name: true,
              email: true,
              event: {
                select: {
                  title: true,
                  eventDate: true,
                },
              },
            },
            where: {
              id: attendeeId,
              checkInId,
            },
          });

          if (!attendee) {
            return reply
              .status(404)
              .send({ error: 'Participante não encontrado.' });
          }

          const protocol = request.protocol;
          const hostname = request.hostname;
          const baseURL = `${protocol}://${hostname}`;
          const checkInURL = new URL(
            `attendees/${attendeeId}/check-in/${attendee.checkInId}`,
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
          console.log('error: ', error);
        }
      },
    )
    .setErrorHandler((error, request, reply) => {
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

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/attendees/:attendeeId/check-in/:checkInId',
      {
        schema: {
          summary: 'Fazer check-in do participante pelo id',
          tags: ['Check-in'],
          params: z.object({
            attendeeId: z.coerce
              .number({
                required_error: 'O parâmetro attendeeId é obrigatório',
                invalid_type_error:
                  'O parâmetro attendeeId deve ser um número inteiro positivo',
              })
              .int({
                message: 'O parâmetro attendeeId deve ser um número inteiro',
              })
              .positive({
                message:
                  'O parâmetro attendeeId deve ser um número inteiro positivo',
              }),
            checkInId: z.string({
              required_error: 'O parâmetro checkInId é obrigatório',
              invalid_type_error: 'O parâmetro checkInId deve ser um texto',
            }),
          }),
          response: {
            201: z.object({
              id: z.number().int().positive(),
              createdAt: z.date(),
              attendeeId: z.number().int().positive(),
              checkInId: z.string(),
            }),
          },
        },
      },
      async (
        request: FastifyRequest<{ Params: AttendeeBadgeRequestParams }>,
        reply: FastifyReply,
      ) => {
        try {
          const { attendeeId, checkInId } = request.params;

          const attendee = await prisma.attendee.findUnique({
            where: {
              id: attendeeId,
              checkInId,
            },
          });

          if (!attendee) {
            return reply
              .status(409)
              .send({ error: 'Id e checkInId do participante não conferem.' });
          }

          const attendeeCheckIn = await prisma.checkIn.findUnique({
            where: {
              attendeeId,
            },
          });

          if (attendeeCheckIn) {
            return reply.status(409).send({
              error: 'Check In já realizado com o ID do participante.',
            });
          }

          const checkIn = await prisma.checkIn.create({
            data: {
              attendeeId,
              checkInId,
            },
          });

          return reply.status(201).send(checkIn);
        } catch (error) {
          console.log('error: ', error);
        }
      },
    )
    .setErrorHandler((error, request, reply) => {
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

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/events/:eventId/attendees',
      {
        schema: {
          summary: 'Registrar participante pelo id do evento',
          tags: ['Participante'],
          body: z
            .object({
              name: z
                .string({
                  invalid_type_error: 'O campo nome deve ser um texto',
                  required_error: 'O campo nome é obrigatório',
                })
                .min(4, {
                  message: 'O campo nome deve ter no mínimo 4 caracteres',
                })
                .max(64, {
                  message: 'O campo nome dever ter no máximo 64 caracteres',
                }),
              email: z.string().email(),
            })
            .describe(
              'name: string, mínimo 4 caracteres, máximo 64 caracteres\nemail: string',
            ),
          params: z.object({
            eventId: z.string().uuid({
              message: 'UUID inválida',
            }),
          }),
          response: {
            201: z.object({
              attendeeId: z.number().int().positive(),
            }),
          },
        },
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

          const attendeeEmailEventId = await prisma.attendee.findUnique({
            where: {
              eventId_email: {
                email,
                eventId,
              },
            },
          });

          if (attendeeEmailEventId) {
            return reply.status(409).send({
              error: 'Participante já resgistrado para esse evento.',
            });
          }

          const [event, countAttendeesInEvent] = await Promise.all([
            prisma.event.findUnique({
              where: {
                id: eventId,
              },
            }),
            prisma.attendee.count({
              where: {
                eventId,
              },
            }),
          ]);

          if (!event) {
            return reply.status(404).send({
              error: 'Evento não encontrado.',
            });
          }

          if (!event?.isActive) {
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

          const attendee: AttendeeModel = await prisma.attendee.create({
            data: {
              checkInId: generateCheckInId(),
              name,
              email,
              eventId,
            },
          });

          return reply.status(201).send({ attendeeId: attendee.id });
        } catch (error) {
          console.error(error);

          return reply.status(501).send(error);
        }
      },
    )
    .setErrorHandler((error, request, reply) => {
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

export default attendeeRoute;
