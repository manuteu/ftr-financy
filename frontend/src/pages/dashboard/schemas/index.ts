import { z } from "zod"

export const newTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Descrição obrigatória"),
  date: z.date({ error: "Data obrigatória" }),
  amount: z.number({ error: "Valor obrigatório" }).positive("O valor deve ser positivo"),
  categoryId: z.string().optional(),
})

export type NewTransactionSchema = z.infer<typeof newTransactionSchema>
