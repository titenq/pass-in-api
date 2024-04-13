import { z } from 'zod';

import genError, { Required, Type } from '../helpers/genError';

const getAttendeesByEventSchema = {
  summary: 'Buscar participantes pelo id do evento',
  tags: ['Eventos'],
  params: z.object({
    eventId: z
      .string(genError('eventId', Type.STRING, Required.TRUE))
      .uuid(genError('eventId', Type.UUID, Required.NULL)),
  }),
  querystring: z.object({
    page: z.coerce
      .number(genError('page', Type.NUMBER, Required.FALSE))
      .int(genError('page', Type.INT, Required.NULL))
      .positive(genError('page', Type.POSITIVE, Required.NULL))
      .nullish()
      .default(1),
    limit: z.coerce
      .number(genError('limit', Type.NUMBER, Required.FALSE))
      .int(genError('limit', Type.INT, Required.NULL))
      .positive(genError('limit', Type.POSITIVE, Required.NULL))
      .nullish()
      .default(10),
    query: z
      .string(genError('query', Type.STRING, Required.FALSE))
      .nullish(),
  }),
  response: {
    200: z.object({
      currentPage: z
        .number(genError('currentPage', Type.NUMBER, Required.TRUE))
        .int(genError('currentPage', Type.INT, Required.NULL))
        .positive(genError('currentPage', Type.POSITIVE, Required.NULL)),
      totalPages: z
        .number(genError('totalPages', Type.NUMBER, Required.TRUE))
        .int(genError('totalPages', Type.INT, Required.NULL))
        .positive(genError('totalPages', Type.POSITIVE, Required.NULL)),
      totalAttendees: z
        .number(genError('totalAttendees', Type.NUMBER, Required.FALSE))
        .int(genError('totalAttendees', Type.INT, Required.NULL))
        .nonnegative(genError('totalAttendees', Type.NONNEGATIVE, Required.NULL))
        .nullish()
        .default(0),
      attendees: z.array(
        z.object({
          id: z
            .number(genError('attendees', Type.NUMBER, Required.TRUE))
            .int(genError('attendees', Type.INT, Required.NULL))
            .positive(genError('attendees', Type.POSITIVE, Required.NULL)),
          name: z
            .string(genError('name', Type.STRING, Required.TRUE))
            .min(4, genError('name', Type.MIN, Required.NULL, '4'))
            .max(64, genError('name', Type.MAX, Required.NULL, '64')),
          email: z
            .string(genError('email', Type.STRING, Required.TRUE))
            .email(genError('email', Type.EMAIL, Required.NULL)),
          createdAt: z
            .date(genError('createdAt', Type.DATE, Required.TRUE)),
          eventId: z
            .string(genError('eventId', Type.STRING, Required.TRUE))
            .uuid(genError('eventId', Type.UUID, Required.NULL)),
          checkInAt: z
            .date(genError('checkInAt', Type.DATE, Required.FALSE))
            .nullish(),
        }),
      ),
    }),
  },
};

const getEventByIdSchema = {
  summary: 'Buscar evento por id',
  tags: ['Eventos'],
  params: z.object({
    eventId: z
      .string(genError('eventId', Type.STRING, Required.TRUE))
      .uuid(genError('eventId', Type.UUID, Required.NULL)),
  }),
  response: {
    200: z.object({
      id: z
        .string(genError('id', Type.STRING, Required.TRUE))
        .uuid(genError('id', Type.UUID, Required.NULL)),
      title: z
        .string(genError('title', Type.STRING, Required.TRUE))
        .min(4, genError('title', Type.MIN, Required.NULL, '4'))
        .max(64, genError('title', Type.MAX, Required.NULL, '64')),
      details: z
        .string(genError('details', Type.STRING, Required.FALSE))
        .nullish(),
      maximumAttendees: z
        .number(genError('maximumAttendees', Type.NUMBER, Required.FALSE))
        .int(genError('maximumAttendees', Type.INT, Required.NULL))
        .positive(genError('maximumAttendees', Type.POSITIVE, Required.NULL))
        .nullish(),
      isActive: z
        .boolean(genError('isActive', Type.BOOLEAN, Required.TRUE)),
      slug: z
        .string(genError('slug', Type.STRING, Required.TRUE)),
      createdAt: z
        .date(genError('createdAt', Type.DATE, Required.TRUE)),
      attendeesAmount: z
        .number(genError('attendeesAmount', Type.NUMBER, Required.FALSE))
        .int(genError('attendeesAmount', Type.INT, Required.NULL))
        .nonnegative(genError('attendeesAmount', Type.NONNEGATIVE, Required.NULL))
        .default(0),
      eventDate: z
        .date(genError('eventDate', Type.DATE, Required.TRUE))
    }),
  }
};

const createEventSchema = {
  summary: 'Criar evento',
  tags: ['Eventos'],
  body: z.object({
    title: z
      .string(genError('title', Type.STRING, Required.TRUE))
      .min(4, genError('title', Type.MIN, Required.NULL, '4'))
      .max(64, genError('title', Type.MAX, Required.NULL, '64')),
    details: z
      .string(genError('details', Type.STRING, Required.FALSE))
      .nullish(),
    maximumAttendees: z
      .number(genError('maximumAttendees', Type.NUMBER, Required.FALSE))
      .int(genError('maximumAttendees', Type.INT, Required.NULL))
      .positive(genError('maximumAttendees', Type.POSITIVE, Required.NULL))
      .nullish(),
    isActive: z
      .boolean(genError('isActive', Type.BOOLEAN, Required.TRUE)),
    eventDate: z
      .date(genError('eventDate', Type.DATE, Required.TRUE)),
  })
    .describe(
      'title: string, mínimo 4 caracteres, máximo 64 caracteres\ndetails: string, não obrigatório\nmaximumAttendees: número inteiro positivo, não obrigatório\nisActive: boolean\neventDate: string no formato 2024-04-18T22:30:00Z',
    ),
  response: {
    201: z.object({
      eventId: z
        .string(genError('eventId', Type.STRING, Required.TRUE))
        .uuid(genError('eventId', Type.UUID, Required.NULL)),
    }),
  }
};

export {
  getAttendeesByEventSchema,
  getEventByIdSchema,
  createEventSchema
};
