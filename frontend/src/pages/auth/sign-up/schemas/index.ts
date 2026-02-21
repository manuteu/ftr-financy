import { z } from 'zod';

const signInSchema = z.object({
  username: z.string().min(1, 'Digite um usuário válido.'),
  password: z.string().min(6, 'Digite uma senha válida.').max(8, 'Digite uma senha válida.'),
});

export type ISignInSchema = z.infer<typeof signInSchema>;

export { signInSchema };
