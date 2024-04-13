import { z } from 'zod';

import genError, { Required, Type } from '../helpers/genError';

const getAttendeeBadgeSchema = {
  summary: 'Buscar informações do participante pelo id',
  tags: ['Participante'],
  params: z.object({
    attendeeId: z.coerce
      .number(genError('attendeeId', Type.NUMBER, Required.TRUE))
      .int(genError('attendeeId', Type.INT, Required.NULL))
      .positive(genError('attendeeId', Type.POSITIVE, Required.NULL)),
    checkInId: z
      .string(genError('checkInId', Type.STRING, Required.TRUE)),
  }),
  response: {
    200: z.object({
      checkInId: z
        .string(genError('checkInId', Type.STRING, Required.TRUE)),
      name: z
        .string(genError('name', Type.STRING, Required.TRUE))
        .min(4, genError('name', Type.MIN, Required.NULL, '4'))
        .max(64, genError('name', Type.MAX, Required.NULL, '64')),
      email: z
        .string(genError('email', Type.STRING, Required.TRUE))
        .email(genError('email', Type.EMAIL, Required.NULL)),
      eventTitle: z
        .string(genError('eventTitle', Type.STRING, Required.TRUE))
        .min(4, genError('eventTitle', Type.MIN, Required.NULL, '4'))
        .max(64, genError('eventTitle', Type.MAX, Required.NULL, '64')),
      checkInURL: z
        .string(genError('checkInURL', Type.STRING, Required.TRUE))
        .url(genError('checkInURL', Type.URL, Required.NULL)),
      eventDate: z
        .date(genError('eventDate', Type.DATE, Required.TRUE)),
    }),
  }
};

const getAttendeeCheckInSchema = {
  summary: 'Fazer check-in do participante pelo id',
  tags: ['Check-in'],
  params: z.object({
    attendeeId: z.coerce
      .number(genError('attendeeId', Type.NUMBER, Required.TRUE))
      .int(genError('attendeeId', Type.INT, Required.NULL))
      .positive(genError('attendeeId', Type.POSITIVE, Required.NULL)),
    checkInId: z
      .string(genError('checkInId', Type.STRING, Required.TRUE)),
  }),
  response: {
    201: z.object({
      id: z
        .number(genError('id', Type.NUMBER, Required.TRUE))
        .int(genError('id', Type.INT, Required.NULL))
        .positive(genError('id', Type.POSITIVE, Required.NULL)),
      createdAt: z
        .date(genError('createdAt', Type.DATE, Required.TRUE)),
      attendeeId: z
        .number(genError('attendeeId', Type.NUMBER, Required.TRUE))
        .int(genError('attendeeId', Type.INT, Required.NULL))
        .positive(genError('attendeeId', Type.POSITIVE, Required.NULL)),
      checkInId: z
        .string(genError('checkInId', Type.STRING, Required.TRUE)),
    }),
  }
};

const getAttendeeByEmailSchema = {
  summary: 'Registrar participante pelo id do evento',
  tags: ['Participante'],
  body: z
    .object({
      name: z
        .string(genError('name', Type.STRING, Required.TRUE))
        .min(4, genError('name', Type.MIN, Required.NULL, '4'))
        .max(64, genError('name', Type.MAX, Required.NULL, '64')),
      email: z
        .string(genError('email', Type.STRING, Required.TRUE))
        .email(genError('email', Type.EMAIL, Required.NULL)),
    })
    .describe(
      'name: string, mínimo 4 caracteres, máximo 64 caracteres\nemail: string',
    ),
  params: z.object({
    eventId: z
      .string(genError('eventId', Type.STRING, Required.TRUE))
      .uuid(genError('eventId', Type.UUID, Required.NULL)),
  }),
  response: {
    201: z.object({
      attendeeId: z
        .number(genError('attendeeId', Type.NUMBER, Required.TRUE))
        .int(genError('attendeeId', Type.INT, Required.NULL))
        .positive(genError('attendeeId', Type.POSITIVE, Required.NULL)),
    }),
  }
};

export {
  getAttendeeBadgeSchema,
  getAttendeeCheckInSchema,
  getAttendeeByEmailSchema
};
