import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewTransactionModal } from "@/components/new-transaction-modal";
import { DeleteTransactionModal, TransactionsFilters, TransactionsTable } from "./components";
import { useTransactions } from "./hooks/useTransactions";
import type { Transaction } from "./types";

export default function Transactions() {
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    filters,
    availableCategories,
    setDescription,
    setType,
    setCategoryId,
    setPeriod,
    clearFilters,
    transactions,
    totalCount,
    page,
    setPage,
    loading,
  } = useTransactions();

  function handleEdit(transaction: Transaction) {
    setTransactionToEdit(transaction);
    setModalOpen(true);
  }

  function handleDelete(transaction: Transaction) {
    setTransactionToDelete(transaction);
  }

  function handleModalOpenChange(open: boolean) {
    setModalOpen(open);
    if (!open) setTransactionToEdit(null);
  }

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas transações financeiras.
          </p>
        </div>
        <Button
          className="w-fit"
          onClick={() => {
            setTransactionToEdit(null);
            setModalOpen(true);
          }}
        >
          <Plus className="size-4" />
          Nova transação
        </Button>
      </div>

      <NewTransactionModal
        transaction={transactionToEdit}
        open={modalOpen}
        onOpenChange={handleModalOpenChange}
      />

      <DeleteTransactionModal
        transaction={transactionToDelete}
        open={!!transactionToDelete}
        onOpenChange={(open) => {
          if (!open) setTransactionToDelete(null);
        }}
      />

      <TransactionsFilters
        filters={filters}
        categories={availableCategories}
        onDescriptionChange={setDescription}
        onTypeChange={setType}
        onCategoryChange={setCategoryId}
        onPeriodChange={setPeriod}
        onClear={clearFilters}
      />

      <TransactionsTable
        transactions={transactions}
        page={page}
        totalCount={totalCount}
        loading={loading}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
}
