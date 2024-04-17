import { z } from 'zod';
import { genMsgError, Required, Type } from '../helpers/genMsgError';

const userRegisterSchema = {
  summary: 'Criar usuário',
  tags: ['Usuários'],
  body: z.object({
    name: z
      .string(genMsgError('name', Type.STRING, Required.TRUE))
      .min(4, genMsgError('name', Type.MIN, Required.NULL, '4'))
      .max(64, genMsgError('name', Type.MAX, Required.NULL, '64')),
    email: z
      .string(genMsgError('email', Type.STRING, Required.TRUE))
      .email(genMsgError('email', Type.EMAIL, Required.NULL)),
    password: z
      .string(genMsgError('password', Type.STRING, Required.TRUE)),
    confirmPassword: z
      .string(genMsgError('confirmPassword', Type.STRING, Required.TRUE)),
  })
    .refine(data => data.password.length >= 8, {
      path: ['password'],
      message: 'A senha deve ter pelo menos 8 caracteres'
    })
    .refine(data => /[A-Z]/.test(data.password), {
      path: ['password'],
      message: 'A senha deve ter pelo menos uma letra maiúscula'
    })
    .refine(data => /[a-z]/.test(data.password), {
      path: ['password'],
      message: 'A senha deve ter pelo menos uma letra minúscula'
    })
    .refine(data => /\d/.test(data.password), {
      path: ['password'],
      message: 'A senha deve ter pelo menos um número'
    })
    .refine(data => /[@$!%*?&]/.test(data.password), {
      path: ['password'],
      message: 'A senha deve ter pelo menos um caractere especial'
    })
    .refine(data => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Senha e Confirmar Senha devem ser iguais'
    })
    .describe(
      'name: string (mínimo 4 caracteres, máximo 64 caracteres)\nemail: string (deve ter o formato de e-mail)\npassword: string (mínimo 8 caracteres, sendo 1 caractere maiúsculo, 1 caractere minúsculo, 1 número e 1 caractere especial)\n confirmPassword: string (deve ser igual a password)',
    ),
  response: {
    201: z.object({
      userId: z
        .string(genMsgError('id', Type.STRING, Required.TRUE))
        .uuid(genMsgError('id', Type.UUID, Required.NULL)),
    }),
  }
};

export {
  userRegisterSchema
};
