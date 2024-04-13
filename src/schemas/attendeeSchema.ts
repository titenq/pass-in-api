import { z } from 'zod';

const getAttendeeBadgeSchema = {
  summary: 'Buscar informações do participante pelo id',
  tags: ['Participante'],
  params: z.object({
    attendeeId: z.coerce
      .number({
        required_error: 'O parâmetro attendeeId é obrigatório',
        invalid_type_error: 'O parâmetro attendeeId deve ser um número inteiro positivo',
      })
      .int({
        message: 'O parâmetro attendeeId deve ser um número inteiro',
      })
      .positive({
        message: 'O parâmetro attendeeId deve ser um número inteiro positivo',
      }),
    checkInId: z
      .string({
        required_error: 'O parâmetro checkInId é obrigatório',
        invalid_type_error: 'O parâmetro checkInId deve ser um texto',
      }),
  }),
  response: {
    200: z.object({
      checkInId: z
        .string({
          required_error: 'checkInId é obrigatório',
          invalid_type_error: 'checkInId deve ser um texto',
        }),
      name: z
        .string({
          required_error: 'name é obrigatório',
          invalid_type_error: 'name deve ser um texto',
        })
        .min(4, {
          message: 'name deve ter no mínimo 4 caracteres'
        })
        .max(64, {
          message: 'name deve ter no máximo 64 caracteres'
        }),
      email: z
        .string({
          required_error: 'email é obrigatório',
          invalid_type_error: 'email deve ser um texto',
        })
        .email({
          message: 'Formato de e-mail inválido'
        }),
      eventTitle: z
        .string({
          required_error: 'eventTitle é obrigatório',
          invalid_type_error: 'eventTitle deve ser um texto',
        })
        .min(4, {
          message: 'eventTitle deve ter no mínimo 4 caracteres'
        })
        .max(64, {
          message: 'eventTitle deve ter no máximo 64 caracteres'
        }),
      checkInURL: z
        .string({
          required_error: 'checkInURL é obrigatório',
          invalid_type_error: 'checkInURL deve ser um texto',
        })
        .url({
          message: 'Formato de URL inválido'
        }),
      eventDate: z
        .date({
          required_error: 'eventDate é obrigatório',
          invalid_type_error: 'eventDate com formato inválido'
        }),
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
        invalid_type_error: 'O parâmetro attendeeId deve ser um número inteiro positivo',
      })
      .int({
        message: 'O parâmetro attendeeId deve ser um número inteiro',
      })
      .positive({
        message: 'O parâmetro attendeeId deve ser um número inteiro positivo',
      }),
    checkInId: z
      .string({
        required_error: 'O parâmetro checkInId é obrigatório',
        invalid_type_error: 'O parâmetro checkInId deve ser um texto',
      }),
  }),
  response: {
    201: z.object({
      id: z
        .number({
          required_error: 'id é obrigatório',
          invalid_type_error: 'id deve ser um número'
        })
        .int({
          message: 'id deve ser um número inteiro'
        })
        .positive({
          message: 'id deve ser um número positivo'
        }),
      createdAt: z
        .date({
          required_error: 'createdAt é obrigatório',
          invalid_type_error: 'createdAt com formato inválido'
        }),
      attendeeId: z
        .number({
          required_error: 'attendeeId é obrigatório',
          invalid_type_error: 'attendeeId deve ser um número'
        })
        .int({
          message: 'attendeeId deve ser um número inteiro'
        })
        .positive({
          message: 'attendeeId deve ser um número positivo'
        }),
      checkInId: z
        .string({
          required_error: 'checkInId é obrigatório',
          invalid_type_error: 'checkInId deve ser um texto',
        }),
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
      email: z
        .string({
          invalid_type_error: 'O campo email deve ser um texto',
          required_error: 'O campo email é obrigatório',
        })
        .email({
          message: 'Formato de e-mail inválido',
        }),
    })
    .describe(
      'name: string, mínimo 4 caracteres, máximo 64 caracteres\nemail: string',
    ),
  params: z.object({
    eventId: z
      .string({
        invalid_type_error: 'O campo eventId deve ser um texto',
        required_error: 'O campo eventId é obrigatório',
      })
      .uuid({
        message: 'UUID inválido',
      }),
  }),
  response: {
    201: z.object({
      attendeeId: z
        .number({
          invalid_type_error: 'attendeeId deve ser um número',
          required_error: 'attendeeId é obrigatório',
        })
        .int({
          message: 'attendeeId deve ser um número inteiro'
        })
        .positive({
          message: 'attendeeId deve ser um número positivo'
        }),
    }),
  }
};

export {
  getAttendeeBadgeSchema,
  getAttendeeCheckInSchema,
  getAttendeeByEmailSchema
};
