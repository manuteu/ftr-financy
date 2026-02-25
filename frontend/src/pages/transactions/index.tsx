import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewTransactionModal } from "@/components/new-transaction-modal";
import { TransactionsFilters, TransactionsTable } from "./components";
import { useTransactions } from "./hooks/useTransactions";

export default function Transactions() {
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

  function handleEdit() {
    // TODO: abrir modal de edição
  }

  function handleDelete() {
    // TODO: confirmar e chamar API
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie todas as suas transações financeiras.
          </p>
        </div>
        <NewTransactionModal
          trigger={
            <Button className="w-fit">
              <Plus className="size-4" />
              Nova transação
            </Button>
          }
        />
      </div>

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
