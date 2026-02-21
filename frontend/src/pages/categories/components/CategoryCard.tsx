import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "../types";
import { CATEGORY_COLORS } from "../types";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const colors = CATEGORY_COLORS[category.color];

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              colors.icon
            )}
          >
            <Tag className="size-5" />
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Editar categoria"
              onClick={() => onEdit(category)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Excluir categoria"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-foreground">{category.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              colors.bg,
              colors.text
            )}
          >
            {category.title}
          </span>
          <span className="text-xs text-muted-foreground">
            {category.transactionCount} transação
            {category.transactionCount !== 1 ? "ões" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
