import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Digite um nome válido.'),
  email: z.string().email('Digite um e-mail válido.'),
});

export type IUpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export { updateProfileSchema };
