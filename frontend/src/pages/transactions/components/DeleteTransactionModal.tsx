import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/DeleteTransaction";
import { GET_DASHBOARD } from "@/lib/graphql/queries/Dashboard";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { formatCurrency } from "@/utils/formatters";
import type { Transaction } from "../types";

interface DeleteTransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionModal({
  transaction,
  open,
  onOpenChange,
}: DeleteTransactionModalProps) {
  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [{ query: GET_DASHBOARD }, { query: GET_TRANSACTIONS }],
  });

  async function handleConfirm() {
    if (!transaction) return;

    try {
      await deleteTransaction({ variables: { id: transaction.id } });
      toast.success("Transação excluída com sucesso.");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao excluir transação. Tente novamente.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="flex flex-row items-start justify-between gap-4 text-left">
          <div className="flex flex-col gap-2">
            <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 mb-1">
              <Trash2 className="size-5 text-destructive" />
            </div>
            <DialogTitle>Excluir transação</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription>
          Tem certeza que deseja excluir a transação{" "}
          <span className="font-semibold text-foreground">
            "{transaction?.description}"
          </span>{" "}
          de{" "}
          <span className="font-semibold text-foreground">
            {transaction ? formatCurrency(transaction.value) : ""}
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
  );
}
