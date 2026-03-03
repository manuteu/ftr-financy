import { useMutation } from "@apollo/client/react"
import { toast } from "sonner"
import { Trash2, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/DeleteCategory"
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories"
import type { Category } from "../types"

interface DeleteCategoryModalProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCategoryModal({
  category,
  open,
  onOpenChange,
}: DeleteCategoryModalProps) {
  const [deleteCategory, { loading }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  })

  const hasTransactions = (category?.transactionCount ?? 0) > 0

  async function handleConfirm() {
    if (!category) return

    try {
      await deleteCategory({ variables: { id: category.id } })
      toast.success(`Categoria "${category.name}" excluída com sucesso.`)
      onOpenChange(false)
    } catch {
      toast.error("Erro ao excluir categoria. Tente novamente.")
    }
  }

  if (hasTransactions) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="flex flex-row items-start justify-between gap-4 text-left">
            <div className="flex flex-col gap-2">
              <div className="flex size-11 items-center justify-center rounded-full bg-yellow-light mb-1">
                <TriangleAlert className="size-5 text-yellow-dark" />
              </div>
              <DialogTitle>Não é possível excluir</DialogTitle>
            </div>
          </DialogHeader>
          <DialogDescription asChild className="my-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                A categoria{" "}
                <span className="font-semibold text-foreground">
                  "{category?.name}"
                </span>{" "}
                possui{" "}
                <span className="font-semibold text-foreground">
                  {category?.transactionCount}{" "}
                  {category?.transactionCount === 1 ? "transação vinculada" : "transações vinculadas"}
                </span>
                .
              </p>
              <p>
                Para excluí-la, primeiro remova ou altere a categoria de todas
                as transações associadas.
              </p>
            </div>
          </DialogDescription>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="flex flex-row items-start justify-between gap-4 text-left">
          <div className="flex flex-col gap-2">
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 mb-1">
              <Trash2 className="size-5 text-destructive" />
            </div>
            <DialogTitle>Excluir categoria</DialogTitle>
          </div>
        </DialogHeader>

        <DialogDescription className="my-4">
          Tem certeza que deseja excluir a categoria{" "}
          <span className="font-semibold text-foreground">
            "{category?.name}"
          </span>
          ? Esta ação não pode ser desfeita.
        </DialogDescription>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            isLoading={loading}
            className="flex-1"
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
