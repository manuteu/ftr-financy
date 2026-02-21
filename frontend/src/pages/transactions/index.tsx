import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TransactionsFilters, TransactionsTable } from "./components";
import { useTransactions } from "./hooks/useTransactions";

export default function Transactions() {
  const {
    filters,
    setDescription,
    setType,
    setCategory,
    setPeriod,
    transactions,
    totalCount,
    page,
    setPage,
  } = useTransactions();

  function handleEdit() {
    // TODO: abrir modal/drawer de edição
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
        <Button className="w-fit">
          <Plus className="size-4" />
          Nova transação
        </Button>
      </div>

      <TransactionsFilters
        filters={filters}
        onDescriptionChange={setDescription}
        onTypeChange={setType}
        onCategoryChange={setCategory}
        onPeriodChange={setPeriod}
      />

      <TransactionsTable
        transactions={transactions}
        page={page}
        totalCount={totalCount}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
}
