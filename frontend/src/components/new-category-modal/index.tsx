import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Tag } from "lucide-react"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { useMutation } from "@apollo/client/react"
import { toast } from "sonner"

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
import { cn } from "@/lib/utils"
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/CreateCategory"
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories"

const PREDEFINED_ICONS: IconName[] = [
  "briefcase-business",
  "car-front",
  "heart-pulse",
  "piggy-bank",
  "shopping-cart",
  "ticket",
  "utensils",
  "paw-print",
  "house",
  "gift",
  "dumbbell",
  "book-open",
  "baggage-claim",
  "mailbox",
  "receipt-text",
  "tag",
]

const PREDEFINED_COLORS = [
  { value: "green", bg: "bg-green-500", ring: "ring-green-600" },
  { value: "blue", bg: "bg-blue-500", ring: "ring-blue-600" },
  { value: "purple", bg: "bg-purple-500", ring: "ring-purple-600" },
  { value: "pink", bg: "bg-pink-500", ring: "ring-pink-600" },
  { value: "red", bg: "bg-red-500", ring: "ring-red-600" },
  { value: "orange", bg: "bg-orange-500", ring: "ring-orange-600" },
  { value: "yellow", bg: "bg-yellow-400", ring: "ring-yellow-500" },
] as const

const newCategorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(50, "Máximo 50 caracteres"),
  description: z.string().max(100, "Máximo 100 caracteres").optional(),
  icon: z.string().min(1, "Selecione um ícone"),
  color: z.string().min(1, "Selecione uma cor"),
})

type NewCategorySchema = z.infer<typeof newCategorySchema>

interface NewCategoryModalProps {
  trigger?: React.ReactNode
}

export function NewCategoryModal({ trigger }: NewCategoryModalProps) {
  const [open, setOpen] = useState(false)

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewCategorySchema>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
      color: "",
    },
  })

  async function onSubmit(data: NewCategorySchema) {
    try {
      await createCategory({
        variables: {
          name: data.name,
          color: data.color,
          icon: data.icon,
          description: data.description ?? null,
        },
      })
      toast.success("Categoria criada com sucesso!")
      reset()
      setOpen(false)
    } catch {
      toast.error("Erro ao criar categoria. Tente novamente.")
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) reset()
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? <Button>Nova categoria</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Ex: Alimentação"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <span className="text-sm text-destructive">{errors.name.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="description">
              Descrição{" "}
              <span className="text-xs text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="description"
              placeholder="Ex: Restaurantes, supermercado e delivery"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-sm text-destructive">{errors.description.message}</span>
            )}
          </div>

          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Ícone</Label>
                <div className="grid grid-cols-8 gap-1.5">
                  {PREDEFINED_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => field.onChange(iconName)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-md border transition-colors",
                        field.value === iconName
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <DynamicIcon name={iconName} className="size-4" fallback={() => <Tag className="size-4" />} />
                    </button>
                  ))}
                </div>
                {errors.icon && (
                  <span className="text-sm text-destructive">{errors.icon.message}</span>
                )}
              </div>
            )}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <Label>Cor</Label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => field.onChange(color.value)}
                      className={cn(
                        "h-8 w-10 rounded-md transition-all",
                        color.bg,
                        field.value === color.value
                          ? `ring-2 ring-offset-2 ${color.ring} scale-110`
                          : "opacity-70 hover:opacity-100"
                      )}
                    />
                  ))}
                </div>
                {errors.color && (
                  <span className="text-sm text-destructive">{errors.color.message}</span>
                )}
              </div>
            )}
          />

          <DialogFooter>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Salvar categoria
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
