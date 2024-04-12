import { z } from 'zod';

const getAttendeeBadgeSchema = {
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
  }
};

const getAttendeeCheckInSchema = {
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
  }
};

const getAttendeeByEmailSchema = {
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
      email: z.string().email({
        message: 'Formato de e-mail inválido',
      }),
    })
    .describe(
      'name: string, mínimo 4 caracteres, máximo 64 caracteres\nemail: string',
    ),
  params: z.object({
    eventId: z.string().uuid({
      message: 'UUID inválido',
    }),
  }),
  response: {
    201: z.object({
      attendeeId: z.number().int().positive(),
    }),
  }
};

export {
  getAttendeeBadgeSchema,
  getAttendeeCheckInSchema,
  getAttendeeByEmailSchema
};
