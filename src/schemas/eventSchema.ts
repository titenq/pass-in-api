import { z } from 'zod';

const getAttendeesByEventSchema = {
  summary: 'Buscar participantes pelo id do evento',
  tags: ['Eventos'],
  params: z.object({
    eventId: z
      .string({
        required_error: 'eventId é obrigatório',
        invalid_type_error: 'eventId deve ser um texto'
      })
      .uuid({
        message: 'UUID inválido',
      }),
  }),
  querystring: z.object({
    page: z.coerce
      .number({
        invalid_type_error: 'O parâmetro page deve ser um número inteiro positivo',
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
        invalid_type_error: 'O parâmetro limit deve ser um número inteiro positivo',
      })
      .int({
        message: 'O parâmetro limit deve ser um número inteiro',
      })
      .positive({
        message: 'O parâmetro limit deve ser um número inteiro positivo',
      })
      .nullish()
      .default(10),
    query: z.string({
      invalid_type_error: 'O parâmetro query deve ser um texto',
    })
      .nullish(),
  }),
  response: {
    200: z.object({
      currentPage: z
        .number({
          required_error: 'currentPage é obrigatório',
          invalid_type_error: 'currentPage deve ser um número inteiro positivo'
        })
        .int({
          message: 'currentPage deve ser um número inteiro'
        })
        .positive({
          message: 'currentPage deve ser um número inteiro positivo'
        }),
      totalPages: z
        .number({
          invalid_type_error: 'totalPages deve ser um número inteiro positivo'
        })
        .int({
          message: 'totalPages deve ser um número inteiro'
        })
        .positive({
          message: 'totalPages deve ser um número inteiro positivo'
        }),
      totalAttendees: z
        .number({
          invalid_type_error: 'totalAttendees deve ser um número inteiro não negativo'
        })
        .int({
          message: 'totalAttendees deve ser um número inteiro'
        })
        .nonnegative({
          message: 'totalAttendees não pode ser um número negativo'
        })
        .nullish()
        .default(0),
      attendees: z.array(
        z.object({
          id: z
            .number({
              required_error: 'id é obrigatório',
              invalid_type_error: 'id deve ser um número inteiro positivo'
            })
            .int({
              message: 'id deve ser um número inteiro'
            })
            .positive({
              message: 'id deve ser um número positivo'
            }),
          name: z
            .string({
              required_error: 'name é obrigatório',
              invalid_type_error: 'name deve ser um texto'
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
              invalid_type_error: 'email deve ser uma string'
            })
            .email({
              message: 'Formato de e-mail inválido'
            }),
          createdAt: z
            .date({
              required_error: 'createdAt é obrigatório',
              invalid_type_error: 'createdAt com formato inválido'
            }),
          eventId: z
            .string({
              required_error: 'eventId é obrigatório',
              invalid_type_error: 'eventId deve ser um texto'
            })
            .uuid({
              message: 'UUID inválido'
            }),
          checkInAt: z
            .date({
              invalid_type_error: 'checkInAt com formato inválido'
            })
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
      .string({
        required_error: 'eventId é obrigatório',
        invalid_type_error: 'eventId deve ser um texto'
      })
      .uuid({
        message: 'UUID inválido',
      }),
  }),
  response: {
    200: z.object({
      id: z
        .string({
          required_error: 'id é obrigatório',
          invalid_type_error: 'id deve ser um texto'
        })
        .uuid({
          message: 'UUID inválido',
        }),
      title: z
        .string({
          required_error: 'title é obrigatório',
          invalid_type_error: 'title deve ser um texto'
        }),
      details: z
        .string({
          invalid_type_error: 'details deve ser um texto'
        })
        .nullish(),
      maximumAttendees: z
        .number({
          invalid_type_error: 'maximumAttendees deve ser um número'
        })
        .int({
          message: 'maximumAttendees deve ser um número inteiro'
        })
        .positive({
          message: 'maximumAttendees deve ser um número inteiro positivo'
        })
        .nullish(),
      isActive: z
        .boolean({
          required_error: 'isActive é obrigatório',
          invalid_type_error: 'isActive deve ser um booleano'
        }),
      slug: z
        .string({
          required_error: 'slug é obrigatório',
          invalid_type_error: 'slug deve ser um texto'
        }),
      createdAt: z
        .date({
          required_error: 'createdAt é obrigatório',
          invalid_type_error: 'createdAt com formato inválido'
        }),
      attendeesAmount: z
        .number({
          invalid_type_error: 'attendeesAmount deve ser um número',
        })
        .int({
          message: 'attendeesAmount deve ser um número inteiro'
        })
        .nonnegative({
          message: 'attendeesAmount não pode ser um número negativo'
        })
        .default(0),
      eventDate: z
        .date({
          required_error: 'eventDate é obrigatório',
          invalid_type_error: 'eventDate com formato inválido'
        })
    }),
  }
};

const createEventSchema = {
  summary: 'Criar evento',
  tags: ['Eventos'],
  body: z.object({
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
      .nullish(),
    maximumAttendees: z
      .number({
        invalid_type_error: 'O campo maximumAttendees deve ser um número',
      })
      .int({
        message: 'O campo maximumAttendees deve ser um número inteiro',
      })
      .positive({
        message: 'O campo maximumAttendees deve ser um número inteiro positivo',
      })
      .nullish(),
    isActive: z
      .boolean({
        required_error: 'O campo isActive é obrigatório',
        invalid_type_error: 'O campo isActive deve ser um boolean',
      }),
    eventDate: z
      .date({
        required_error: 'eventDate é obrigatório',
        invalid_type_error: 'eventDate com formato inválido'
      }),
  })
    .describe(
      'title: string, mínimo 4 caracteres, máximo 64 caracteres\ndetails: string, não obrigatório\nmaximumAttendees: número inteiro positivo, não obrigatório\nisActive: boolean\neventDate: string no formato 2024-04-18T22:30:00Z',
    ),
  response: {
    201: z.object({
      eventId: z
        .string({
          required_error: 'eventId é obrigatório',
          invalid_type_error: 'eventId deve ser um texto',
        })
        .uuid({
          message: 'UUID inválido'
        }),
    }),
  }
};

export {
  getAttendeesByEventSchema,
  getEventByIdSchema,
  createEventSchema
};
