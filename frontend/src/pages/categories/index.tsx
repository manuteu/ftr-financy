import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Layers, Receipt, TrendingUp } from "lucide-react";
import { StatCard, CategoryCard, DeleteCategoryModal } from "./components";
import { useCategories } from "./hooks/useCategories";
import { NewCategoryModal } from "@/components/new-category-modal";
import type { Category } from "./types";

export default function Categories() {
  const { categories, stats, loading } = useCategories();
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  function handleEdit(_category: Category) {
    // TODO: abrir modal de edição
  }

  function handleDelete(category: Category) {
    setCategoryToDelete(category);
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
        <NewCategoryModal
          trigger={
            <Button className="w-fit">
              <Plus className="size-4" />
              Nova categoria
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-2 py-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-7 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
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
              value={stats.mostUsedCategory?.name ?? "—"}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="flex gap-1">
                      <Skeleton className="size-8 rounded-md" />
                      <Skeleton className="size-8 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))
          : categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
      </div>
      <DeleteCategoryModal
        category={categoryToDelete}
        open={!!categoryToDelete}
        onOpenChange={(open) => { if (!open) setCategoryToDelete(null) }}
      />
    </main>
  );
}
