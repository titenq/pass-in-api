import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';

const getAttendeesByEventSchema = {
  summary: 'Buscar participantes pelo id do evento',
  tags: ['Eventos'],
  params: z.object({
    eventId: z
      .string(genMsgError('eventId', Type.STRING, Required.TRUE))
      .uuid(genMsgError('eventId', Type.UUID, Required.NULL)),
  }),
  querystring: z.object({
    page: z.coerce
      .number(genMsgError('page', Type.NUMBER, Required.FALSE))
      .int(genMsgError('page', Type.INT, Required.NULL))
      .positive(genMsgError('page', Type.POSITIVE, Required.NULL))
      .nullish()
      .default(1),
    limit: z.coerce
      .number(genMsgError('limit', Type.NUMBER, Required.FALSE))
      .int(genMsgError('limit', Type.INT, Required.NULL))
      .positive(genMsgError('limit', Type.POSITIVE, Required.NULL))
      .nullish()
      .default(10),
    query: z
      .string(genMsgError('query', Type.STRING, Required.FALSE))
      .nullish(),
  }),
  response: {
    200: z.object({
      currentPage: z
        .number(genMsgError('currentPage', Type.NUMBER, Required.TRUE))
        .int(genMsgError('currentPage', Type.INT, Required.NULL))
        .positive(genMsgError('currentPage', Type.POSITIVE, Required.NULL)),
      totalPages: z
        .number(genMsgError('totalPages', Type.NUMBER, Required.TRUE))
        .int(genMsgError('totalPages', Type.INT, Required.NULL))
        .positive(genMsgError('totalPages', Type.POSITIVE, Required.NULL)),
      totalAttendees: z
        .number(genMsgError('totalAttendees', Type.NUMBER, Required.FALSE))
        .int(genMsgError('totalAttendees', Type.INT, Required.NULL))
        .nonnegative(genMsgError('totalAttendees', Type.NONNEGATIVE, Required.NULL))
        .nullish()
        .default(0),
      attendees: z.array(
        z.object({
          id: z
            .number(genMsgError('attendees', Type.NUMBER, Required.TRUE))
            .int(genMsgError('attendees', Type.INT, Required.NULL))
            .positive(genMsgError('attendees', Type.POSITIVE, Required.NULL)),
          name: z
            .string(genMsgError('name', Type.STRING, Required.TRUE))
            .min(4, genMsgError('name', Type.MIN, Required.NULL, '4'))
            .max(64, genMsgError('name', Type.MAX, Required.NULL, '64')),
          email: z
            .string(genMsgError('email', Type.STRING, Required.TRUE))
            .email(genMsgError('email', Type.EMAIL, Required.NULL)),
          createdAt: z
            .date(genMsgError('createdAt', Type.DATE, Required.TRUE)),
          eventId: z
            .string(genMsgError('eventId', Type.STRING, Required.TRUE))
            .uuid(genMsgError('eventId', Type.UUID, Required.NULL)),
          checkInAt: z
            .date(genMsgError('checkInAt', Type.DATE, Required.FALSE))
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
      .string(genMsgError('eventId', Type.STRING, Required.TRUE))
      .uuid(genMsgError('eventId', Type.UUID, Required.NULL)),
  }),
  response: {
    200: z.object({
      id: z
        .string(genMsgError('id', Type.STRING, Required.TRUE))
        .uuid(genMsgError('id', Type.UUID, Required.NULL)),
      title: z
        .string(genMsgError('title', Type.STRING, Required.TRUE))
        .min(4, genMsgError('title', Type.MIN, Required.NULL, '4'))
        .max(64, genMsgError('title', Type.MAX, Required.NULL, '64')),
      details: z
        .string(genMsgError('details', Type.STRING, Required.FALSE))
        .nullish(),
      maximumAttendees: z
        .number(genMsgError('maximumAttendees', Type.NUMBER, Required.FALSE))
        .int(genMsgError('maximumAttendees', Type.INT, Required.NULL))
        .positive(genMsgError('maximumAttendees', Type.POSITIVE, Required.NULL))
        .nullish(),
      isActive: z
        .boolean(genMsgError('isActive', Type.BOOLEAN, Required.TRUE)),
      slug: z
        .string(genMsgError('slug', Type.STRING, Required.TRUE)),
      createdAt: z
        .date(genMsgError('createdAt', Type.DATE, Required.TRUE)),
      attendeesAmount: z
        .number(genMsgError('attendeesAmount', Type.NUMBER, Required.FALSE))
        .int(genMsgError('attendeesAmount', Type.INT, Required.NULL))
        .nonnegative(genMsgError('attendeesAmount', Type.NONNEGATIVE, Required.NULL))
        .default(0),
      eventDate: z
        .date(genMsgError('eventDate', Type.DATE, Required.TRUE))
    }),
  }
};

const createEventSchema = {
  summary: 'Criar evento',
  tags: ['Eventos'],
  body: z.object({
    title: z
      .string(genMsgError('title', Type.STRING, Required.TRUE))
      .min(4, genMsgError('title', Type.MIN, Required.NULL, '4'))
      .max(64, genMsgError('title', Type.MAX, Required.NULL, '64')),
    details: z
      .string(genMsgError('details', Type.STRING, Required.FALSE))
      .nullish(),
    maximumAttendees: z
      .number(genMsgError('maximumAttendees', Type.NUMBER, Required.FALSE))
      .int(genMsgError('maximumAttendees', Type.INT, Required.NULL))
      .positive(genMsgError('maximumAttendees', Type.POSITIVE, Required.NULL))
      .nullish(),
    isActive: z
      .boolean(genMsgError('isActive', Type.BOOLEAN, Required.TRUE)),
    eventDate: z
      .date(genMsgError('eventDate', Type.DATE, Required.TRUE)),
  })
    .describe(
      'title: string (mínimo 4 caracteres, máximo 64 caracteres)\ndetails: string (não obrigatório)\nmaximumAttendees: number (número inteiro positivo, não obrigatório)\nisActive: boolean\neventDate: Date (string no formato 2024-04-18T22:30:00Z)',
    ),
  response: {
    201: z.object({
      eventId: z
        .string(genMsgError('eventId', Type.STRING, Required.TRUE))
        .uuid(genMsgError('eventId', Type.UUID, Required.NULL)),
    }),
  }
};

export {
  getAttendeesByEventSchema,
  getEventByIdSchema,
  createEventSchema
};
