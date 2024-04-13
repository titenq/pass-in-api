import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';

const getAttendeeBadgeSchema = {
  summary: 'Buscar informações do participante pelo id',
  tags: ['Participante'],
  params: z.object({
    attendeeId: z.coerce
      .number(genMsgError('attendeeId', Type.NUMBER, Required.TRUE))
      .int(genMsgError('attendeeId', Type.INT, Required.NULL))
      .positive(genMsgError('attendeeId', Type.POSITIVE, Required.NULL)),
    checkInId: z
      .string(genMsgError('checkInId', Type.STRING, Required.TRUE)),
  }),
  response: {
    200: z.object({
      checkInId: z
        .string(genMsgError('checkInId', Type.STRING, Required.TRUE)),
      name: z
        .string(genMsgError('name', Type.STRING, Required.TRUE))
        .min(4, genMsgError('name', Type.MIN, Required.NULL, '4'))
        .max(64, genMsgError('name', Type.MAX, Required.NULL, '64')),
      email: z
        .string(genMsgError('email', Type.STRING, Required.TRUE))
        .email(genMsgError('email', Type.EMAIL, Required.NULL)),
      eventTitle: z
        .string(genMsgError('eventTitle', Type.STRING, Required.TRUE))
        .min(4, genMsgError('eventTitle', Type.MIN, Required.NULL, '4'))
        .max(64, genMsgError('eventTitle', Type.MAX, Required.NULL, '64')),
      checkInURL: z
        .string(genMsgError('checkInURL', Type.STRING, Required.TRUE))
        .url(genMsgError('checkInURL', Type.URL, Required.NULL)),
      eventDate: z
        .date(genMsgError('eventDate', Type.DATE, Required.TRUE)),
    }),
  }
};

const getAttendeeCheckInSchema = {
  summary: 'Fazer check-in do participante pelo id',
  tags: ['Check-in'],
  params: z.object({
    attendeeId: z.coerce
      .number(genMsgError('attendeeId', Type.NUMBER, Required.TRUE))
      .int(genMsgError('attendeeId', Type.INT, Required.NULL))
      .positive(genMsgError('attendeeId', Type.POSITIVE, Required.NULL)),
    checkInId: z
      .string(genMsgError('checkInId', Type.STRING, Required.TRUE)),
  }),
  response: {
    201: z.object({
      id: z
        .number(genMsgError('id', Type.NUMBER, Required.TRUE))
        .int(genMsgError('id', Type.INT, Required.NULL))
        .positive(genMsgError('id', Type.POSITIVE, Required.NULL)),
      createdAt: z
        .date(genMsgError('createdAt', Type.DATE, Required.TRUE)),
      attendeeId: z
        .number(genMsgError('attendeeId', Type.NUMBER, Required.TRUE))
        .int(genMsgError('attendeeId', Type.INT, Required.NULL))
        .positive(genMsgError('attendeeId', Type.POSITIVE, Required.NULL)),
      checkInId: z
        .string(genMsgError('checkInId', Type.STRING, Required.TRUE)),
    }),
  }
};

const getAttendeeByEmailSchema = {
  summary: 'Registrar participante pelo id do evento',
  tags: ['Participante'],
  body: z
    .object({
      name: z
        .string(genMsgError('name', Type.STRING, Required.TRUE))
        .min(4, genMsgError('name', Type.MIN, Required.NULL, '4'))
        .max(64, genMsgError('name', Type.MAX, Required.NULL, '64')),
      email: z
        .string(genMsgError('email', Type.STRING, Required.TRUE))
        .email(genMsgError('email', Type.EMAIL, Required.NULL)),
    })
    .describe(
      'name: string, mínimo 4 caracteres, máximo 64 caracteres\nemail: string',
    ),
  params: z.object({
    eventId: z
      .string(genMsgError('eventId', Type.STRING, Required.TRUE))
      .uuid(genMsgError('eventId', Type.UUID, Required.NULL)),
  }),
  response: {
    201: z.object({
      attendeeId: z
        .number(genMsgError('attendeeId', Type.NUMBER, Required.TRUE))
        .int(genMsgError('attendeeId', Type.INT, Required.NULL))
        .positive(genMsgError('attendeeId', Type.POSITIVE, Required.NULL)),
    }),
  }
};

export {
  getAttendeeBadgeSchema,
  getAttendeeCheckInSchema,
  getAttendeeByEmailSchema
};
