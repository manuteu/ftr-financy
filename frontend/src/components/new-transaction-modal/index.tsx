import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, CircleArrowDown, CircleArrowUp, Plus } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client/react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/CreateTransaction"
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories"
import { GET_DASHBOARD } from "@/lib/graphql/queries/Dashboard"
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/Transactions"

const newTransactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Descrição obrigatória"),
  date: z.date({ error: "Data obrigatória" }),
  amount: z.number({ error: "Valor obrigatório" }).positive("O valor deve ser positivo"),
  categoryId: z.string().optional(),
})

type NewTransactionSchema = z.infer<typeof newTransactionSchema>

type CategoryData = {
  id: string
  name: string
  color: string | null
  icon: string | null
}

type GetCategoriesData = {
  categories: CategoryData[]
}

interface NewTransactionModalProps {
  trigger?: React.ReactNode
}

export function NewTransactionModal({ trigger }: NewTransactionModalProps) {
  const [open, setOpen] = useState(false)

  const { data: categoriesData } = useQuery<GetCategoriesData>(GET_CATEGORIES, {
    skip: !open,
  })

  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD }, { query: GET_TRANSACTIONS }],
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewTransactionSchema>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      type: "expense",
      description: "",
      categoryId: undefined,
    },
  })

  async function onSubmit(data: NewTransactionSchema) {
    try {
      await createTransaction({
        variables: {
          description: data.description,
          amount: data.amount,
          type: data.type,
          date: data.date,
          categoryId: data.categoryId ?? null,
        },
      })
      toast.success("Transação criada com sucesso!")
      reset()
      setOpen(false)
    } catch {
      toast.error("Erro ao criar transação. Tente novamente.")
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) reset()
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" className="text-green-800 w-full">
            <Plus size={16} />
            Nova transação
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>
            Registre uma nova receita ou despesa na sua conta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-1 rounded-lg border p-1">
                <button
                  type="button"
                  onClick={() => field.onChange("income")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    field.value === "income"
                      ? "bg-green-100 text-green-700"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <CircleArrowUp size={16} />
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("expense")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    field.value === "expense"
                      ? "bg-red-100 text-red-700"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <CircleArrowDown size={16} />
                  Despesa
                </button>
              </div>
            )}
          />

          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço no restaurante"
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <span className="text-sm text-destructive">{errors.description.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Data</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {field.value
                        ? format(field.value, "dd/MM/yyyy")
                        : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <span className="text-sm text-destructive">{errors.date.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              aria-invalid={!!errors.amount}
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <span className="text-sm text-destructive">{errors.amount.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Categoria</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesData?.categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Salvar transação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
