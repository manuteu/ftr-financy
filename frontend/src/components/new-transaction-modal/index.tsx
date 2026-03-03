import { useState, useEffect } from "react"
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
import { formatCentsToDisplay, parseDisplayToCents } from "@/utils/formatters"
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/CreateTransaction"
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/UpdateTransaction"
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories"
import { GET_DASHBOARD } from "@/lib/graphql/queries/Dashboard"
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/Transactions"
import type { Transaction } from "@/pages/transactions/types"

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Descrição obrigatória"),
  date: z.date({ error: "Data obrigatória" }),
  amount: z.number({ error: "Valor obrigatório" }).min(1, "O valor deve ser maior que zero"),
  categoryId: z.string().optional(),
})

type TransactionSchema = z.infer<typeof transactionSchema>

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
  /** Transação a ser editada. Quando definida, o modal opera em modo edição. */
  transaction?: Transaction | null
  /** Controla abertura do modal (usado no modo edição). */
  open?: boolean
  /** Callback quando o modal abre/fecha (usado no modo edição). */
  onOpenChange?: (open: boolean) => void
}

const getDefaultFormValues = (): Partial<TransactionSchema> => ({
  type: "expense",
  description: "",
  date: new Date(),
  categoryId: undefined,
})

function transactionToFormValues(transaction: Transaction): TransactionSchema {
  return {
    type: transaction.type,
    description: transaction.description,
    date: new Date(transaction.date),
    amount: transaction.value,
    categoryId: transaction.categoryId ?? undefined,
  }
}

export function NewTransactionModal({
  trigger,
  transaction,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: NewTransactionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isEditMode = !!transaction
  const isControlled = controlledOpen !== undefined && controlledOnOpenChange !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen

  const { data: categoriesData } = useQuery<GetCategoriesData>(GET_CATEGORIES, {
    skip: !open,
  })

  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD }, { query: GET_TRANSACTIONS }],
  })

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD }, { query: GET_TRANSACTIONS }],
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaultFormValues(),
  })

  useEffect(() => {
    if (open && transaction) {
      reset(transactionToFormValues(transaction))
    } else if (open && !transaction) {
      reset(getDefaultFormValues())
    } else if (!open) {
      reset(getDefaultFormValues())
    }
  }, [open, transaction, reset])

  async function onSubmit(data: TransactionSchema) {
    try {
      if (isEditMode && transaction) {
        await updateTransaction({
          variables: {
            id: transaction.id,
            description: data.description,
            amount: data.amount,
            type: data.type,
            date: data.date,
            categoryId: data.categoryId ?? null,
          },
        })
        toast.success("Transação atualizada com sucesso!")
      } else {
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
      }
      reset()
      setOpen(false)
    } catch {
      toast.error(
        isEditMode ? "Erro ao atualizar transação. Tente novamente." : "Erro ao criar transação. Tente novamente."
      )
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) reset()
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="ghost" className="text-primary w-full">
              <Plus size={16} />
              Nova transação
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md gap-6 p-6 border-border rounded-xl">
        <DialogHeader className="flex flex-row items-start justify-between gap-4 text-left">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-base font-semibold text-foreground leading-6">
              {isEditMode ? "Editar transação" : "Nova transação"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-5">
              {isEditMode ? "Atualize os dados da transação" : "Registre sua despesa ou receita"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2 rounded-xl border border-border p-2">
                <button
                  type="button"
                  onClick={() => field.onChange("expense")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-3 rounded-lg py-2.5 text-base font-medium transition-colors",
                    field.value === "expense"
                      ? "bg-gray-100 border-2 border-destructive text-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <CircleArrowDown size={16} className={field.value === "expense" ? "text-destructive" : ""} />
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("income")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-3 rounded-lg py-2.5 text-base font-medium transition-colors",
                    field.value === "income"
                      ? "bg-gray-100 border-2 border-primary text-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <CircleArrowUp size={16} className={field.value === "income" ? "text-primary" : ""} />
                  Receita
                </button>
              </div>
            )}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Descrição
            </Label>
            <Input
              id="description"
              placeholder="Ex. Almoço no restaurante"
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <span className="text-sm text-destructive">{errors.description.message}</span>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label className="text-sm font-medium text-foreground">Data</Label>
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
                          "w-full justify-start text-left font-normal rounded-lg h-12",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value
                          ? format(field.value, "dd/MM/yyyy")
                          : "Selecione"}
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
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                Valor
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                  R$
                </span>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      className="rounded-lg pl-10 text-base"
                      aria-invalid={!!errors.amount}
                      value={field.value ? formatCentsToDisplay(field.value) : ""}
                      onChange={(e) => {
                        const cents = parseDisplayToCents(e.target.value)
                        field.onChange(cents)
                      }}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </div>
              {errors.amount && (
                <span className="text-sm text-destructive">{errors.amount.message}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">Categoria</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <SelectTrigger className="w-full rounded-lg h-auto py-3.5 px-3.5">
                    <SelectValue placeholder="Selecione" />
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

          <Button type="submit" size="lg" className="w-full rounded-lg text-base font-medium mt-2" isLoading={isSubmitting}>
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
