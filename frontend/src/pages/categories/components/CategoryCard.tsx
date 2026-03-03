import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Tag } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import type { Category } from "../types";
import { getCategoryColors } from "../types";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const colors = getCategoryColors(category.color);

  const itemLabel =
    category.transactionCount === 1 ? "item" : "itens";

  return (
    <Card className="flex flex-col border border-border rounded-xl">
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="flex items-start justify-between w-full">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              colors.bg
            )}
          >
            {category.icon ? (
              <DynamicIcon
                name={category.icon as IconName}
                className={cn("size-4", colors.text)}
              />
            ) : (
              <Tag className={cn("size-4", colors.text)} />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Excluir categoria"
              className="h-8 w-8 rounded-lg border-border text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              onClick={() => onDelete(category)}
            >
              <Trash2 className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Editar categoria"
              className="h-8 w-8 rounded-lg border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => onEdit(category)}
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <h3 className="text-base font-semibold text-gray-800 leading-6">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-5 line-clamp-2 min-h-10">
            {category?.description ?? "-"}
          </p>
        </div>

        <div className="flex items-center justify-between w-full">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
              colors.bg,
              colors.text
            )}
          >
            {category.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {category.transactionCount} {itemLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
