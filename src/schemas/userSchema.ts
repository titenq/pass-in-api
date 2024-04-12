import { z } from 'zod';

const passwordSchema = z.string().refine(password => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  const hasMinLength = password.length >= 8;

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasMinLength;
}, {
  message: 'A senha deve ter pelo menos 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial'
});

const createUserSchema = z.object({
  email: z.string({
    required_error: 'O campo email é obrigatório',
    invalid_type_error: 'O campo email deve ser um texto',
  }),
  password: passwordSchema,
  name: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

const createUserResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});
