import { z } from "zod"

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(50, "Máximo 50 caracteres"),
  description: z.string().max(100, "Máximo 100 caracteres").optional(),
  icon: z.string().min(1, "Selecione um ícone"),
  color: z.string().min(1, "Selecione uma cor"),
})

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>
