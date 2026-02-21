import { Button } from "@/components/ui/button";
import { Plus, Layers, Receipt, TrendingUp } from "lucide-react";
import { StatCard, CategoryCard } from "./components";
import { useCategories } from "./hooks/useCategories";

export default function Categories() {
  const { categories, stats } = useCategories();

  function handleCreate() {
    // TODO: abrir modal de criar categoria
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Organize suas receitas e despesas por categoria.
          </p>
        </div>
        <Button className="w-fit" onClick={handleCreate}>
          <Plus className="size-4" />
          Nova categoria
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Layers className="size-5 text-muted-foreground" />}
          title="Total de categorias"
          value={stats.totalCategories}
        />
        <StatCard
          icon={<Receipt className="size-5 text-muted-foreground" />}
          title="Total de transações"
          value={stats.totalTransactions}
        />
        <StatCard
          icon={<TrendingUp className="size-5 text-muted-foreground" />}
          title="Categoria mais utilizada"
          value={stats.mostUsedCategory?.title ?? "—"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </main>
  );
}
