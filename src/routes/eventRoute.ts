import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import generateSlug from '../helpers/generateSlug';
import EventModel from '../models/eventModel';
import { EventRequestBody, EventRequestParams, EventRequestQuery } from '../interfaces/eventInterface';
import prisma from '../lib/prisma';

const eventRoute = async (fastify: FastifyInstance, options: any) => {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/events/:eventId',
      {
        schema: {
          summary: 'Buscar evento por id',
          tags: ['events'],
          params: z.object({
            eventId: z.string().uuid()
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().positive().nullable(),
              isActive: z.boolean(),
              slug: z.string(),
              createdAt: z.date(),
              attendeesAmount: z.number().int().positive().nullable()
            })
          }
        }
      },
      async (
        request: FastifyRequest<{ Params: EventRequestParams }>,
        reply: FastifyReply
      ) => {
        try {
          const { eventId } = request.params;

          const event = await prisma.event.findUnique({
            select: {
              id: true,
              title: true,
              details: true,
              maximumAttendees: true,
              isActive: true,
              slug: true,
              createdAt: true,
              _count: {
                select: {
                  attendees: true
                }
              }
            },
            where: {
              id: eventId
            }
          });

          if (!event) {
            return reply.status(404).send({ error: 'Evento não encontrado.' });
          }

          const { _count, ...rest } = event;

          const eventReply = {
            ...rest,
            attendeesAmount: _count?.attendees
          };

          return reply.status(200).send(eventReply);
        } catch (error) {
          console.log('error: ', error);
        }
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

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/events/:eventId/attendees',
      {
        schema: {
          summary: 'Buscar participantes pelo id do evento',
          tags: ['events'],
          params: z.object({
            eventId: z.string().uuid()
          }),
          querystring: z.object({
            page: z.string().nullish().default('1').transform(Number),
            limit: z.string().nullish().default('10').transform(Number),
            query: z.string().nullish()
          }),
          response: {
            200: z.object({
              attendees: z.array(
                z.object({
                  id: z.number().int().positive(),
                  name: z.string().min(4),
                  email: z.string().email(),
                  createdAt: z.date(),
                  eventId: z.string().uuid(),
                  checkInAt: z.date().nullable()
                })
              )
            })
          }
        }
      },
      async (
        request: FastifyRequest<{ Params: EventRequestParams, Querystring: EventRequestQuery }>,
        reply: FastifyReply
      ) => {
        try {
          const { eventId } = request.params;
          const { page, limit, query } = request.query;

          const attendees = await prisma.attendee.findMany({
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              eventId: true,
              checkIn: {
                select: {
                  createdAt: true
                }
              }
            },
            where: query ? {
              eventId,
              name: {
                contains: query
              }
            } : {
              eventId
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
              createdAt: 'desc'
            }
          });

          const attendeesMap = attendees.map(attendee => {
            const { checkIn, ...rest } = attendee;

            const attendeesReply = {
              ...rest,
              checkInAt: attendee.checkIn?.createdAt
            };

            return attendeesReply;
          });

          return reply.status(200).send({ attendees: attendeesMap });
        } catch (error) {
          console.log('error: ', error);
        }
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

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/events',
      {
        schema: {
          summary: 'Criar evento',
          tags: ['events'],
          body: z.object({
            title: z.string().min(4).max(64),
            details: z.string().nullable(),
            maximumAttendees: z.number({
              required_error: 'O campo maximumAttendees é obrigatório',
              invalid_type_error: 'O campo maximumAttendees deve ser um número inteiro positivo'
            }).int({
              message: 'O campo maximumAttendees deve ser um número inteiro'
            }).positive({
              message: 'O campo maximumAttendees deve ser um número inteiro positivo'
            }).nullable(),
            isActive: z.boolean(),
            eventDate: z.string().datetime({
              message: 'O campo eventDate está com o formato de data inválido'
            })
          }).describe('title: string, mínimo 4 caracteres, máximo 64 caracteres\ndetails: string, não obrigatório\nmaximumAttendees: número inteiro positivo, não obrigatório\nisActive: boolean\neventDate: string no formato 2024-04-18T22:30:00Z'),
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
            isActive,
            eventDate
          } = request.body;

          console.log(eventDate)

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
              isActive,
              eventDate: new Date(eventDate)
            }
          });

          return reply.status(201).send({ eventId: event.id });
        } catch (error) {
          console.log('error: ', error);
        }
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

export default eventRoute;
