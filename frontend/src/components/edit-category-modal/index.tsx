import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@apollo/client/react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CategoryForm } from "@/components/category-form"
import { categoryFormSchema, type CategoryFormSchema } from "@/components/category-form/schema"
import { UPDATE_CATEGORY } from "@/lib/graphql/mutations/UpdateCategory"
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories"
import type { Category } from "@/pages/categories/types"

interface EditCategoryModalProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCategoryModal({ category, open, onOpenChange }: EditCategoryModalProps) {
  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  })

  const form = useForm<CategoryFormSchema>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "briefcase-business",
      color: "green",
    },
  })

  const { reset, handleSubmit, formState: { errors, isSubmitting }, control, register } = form

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
        description: category.description ?? "",
        icon: (category.icon ?? "briefcase-business") as CategoryFormSchema["icon"],
        color: (category.color ?? "green") as CategoryFormSchema["color"],
      })
    }
  }, [category, open, reset])

  async function onSubmit(data: CategoryFormSchema) {
    if (!category) return
    try {
      await updateCategory({
        variables: {
          id: category.id,
          name: data.name,
          color: data.color,
          icon: data.icon,
          description: data.description ?? null,
        },
      })
      toast.success("Categoria atualizada com sucesso!")
      reset()
      onOpenChange(false)
    } catch {
      toast.error("Erro ao atualizar categoria. Tente novamente.")
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) reset()
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg gap-6 p-6 border-border rounded-xl">
        <DialogHeader className="flex flex-row items-start justify-between gap-4 text-left">
          <div className="flex flex-col gap-0.5">
            <DialogTitle className="text-base font-semibold text-foreground leading-6">
              Editar categoria
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-5">
              Atualize os dados da categoria
            </DialogDescription>
          </div>
        </DialogHeader>

        <CategoryForm
          control={control}
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          submitLabel="Salvar alterações"
        />
      </DialogContent>
    </Dialog>
  )
}
