import { z } from 'zod';

const signUpSchema = z.object({
  name: z.string().min(1, 'Digite um nome válido.'),
  email: z.string().email('Digite um email válido.'),
  password: z.string().min(6, 'Digite uma senha válida.').max(8, 'Digite uma senha válida.'),
});

export type ISignUpSchema = z.infer<typeof signUpSchema>;

export { signUpSchema };
