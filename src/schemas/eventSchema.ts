import { z } from 'zod';

const getAttendeesByEventSchema = {
  summary: 'Buscar participantes pelo id do evento',
  tags: ['Eventos'],
  params: z.object({
    eventId: z.string().uuid({
      message: 'UUID inválido',
    }),
  }),
  querystring: z.object({
    page: z.coerce
      .number({
        invalid_type_error: 'O parâmetro page deve ser um número',
      })
      .int({
        message: 'O parâmetro page deve ser um número inteiro',
      })
      .positive({
        message: 'O parâmetro page deve ser um número inteiro positivo',
      })
      .nullish()
      .default(1),
    limit: z.coerce
      .number({
        invalid_type_error:
          'O parâmetro limit deve ser um número inteiro positivo',
      })
      .int({
        message: 'O parâmetro limit deve ser um número inteiro',
      })
      .positive({
        message:
          'O parâmetro limit deve ser um número inteiro positivo',
      })
      .nullish()
      .default(10),
    query: z
      .string({
        invalid_type_error: 'O parâmetro query deve ser um texto',
      })
      .nullish(),
  }),
  response: {
    200: z.object({
      currentPage: z.number().int().positive(),
      totalPages: z.number().int().positive(),
      totalAttendees: z.number().int().positive().nullish().default(0),
      attendees: z.array(
        z.object({
          id: z.number().int().positive(),
          name: z.string().min(4),
          email: z.string().email(),
          createdAt: z.date(),
          eventId: z.string().uuid(),
          checkInAt: z.date().nullish(),
        }),
      ),
    }),
  },
};

const getEventByIdSchema = {
  summary: 'Buscar evento por id',
  tags: ['Eventos'],
  params: z.object({
    eventId: z.string().uuid({
      message: 'UUID inválido',
    }),
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
      attendeesAmount: z.number().int().positive().nullable(),
    }),
  }
};

const createEventSchema = {
  summary: 'Criar evento',
  tags: ['Eventos'],
  body: z
    .object({
      title: z
        .string({
          required_error: 'O campo title é obrigatório',
          invalid_type_error: 'O campo title deve ser um texto',
        })
        .min(4, {
          message: 'O campo title deve ter no mínimo 4 caracteres',
        })
        .max(64, {
          message: 'O campo title deve ter no máximo 64 caracteres',
        }),
      details: z
        .string({
          invalid_type_error: 'O campo details deve ser um texto',
        })
        .nullable(),
      maximumAttendees: z
        .number({
          required_error: 'O campo maximumAttendees é obrigatório',
          invalid_type_error:
            'O campo maximumAttendees deve ser um número inteiro positivo',
        })
        .int({
          message:
            'O campo maximumAttendees deve ser um número inteiro',
        })
        .positive({
          message:
            'O campo maximumAttendees deve ser um número inteiro positivo',
        })
        .nullable(),
      isActive: z.boolean({
        required_error: 'O campo isActive é obrigatório',
        invalid_type_error: 'O campo isActive deve ser um boolean',
      }),
      eventDate: z.string().datetime({
        message:
          'O campo eventDate está com o formato de data inválido',
      }),
    })
    .describe(
      'title: string, mínimo 4 caracteres, máximo 64 caracteres\ndetails: string, não obrigatório\nmaximumAttendees: número inteiro positivo, não obrigatório\nisActive: boolean\neventDate: string no formato 2024-04-18T22:30:00Z',
    ),
  response: {
    201: z.object({
      eventId: z.string().uuid(),
    }),
  }
};

export {
  getAttendeesByEventSchema,
  getEventByIdSchema,
  createEventSchema
};
