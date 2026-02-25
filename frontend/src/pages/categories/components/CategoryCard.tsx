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
            {category.icon ? (
              <DynamicIcon
                name={category.icon as IconName}
                className="size-5"
              />
            ) : (
              <Tag className="size-5" />
            )}
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
          <h3 className="font-semibold text-foreground">{category.name}</h3>
          <h4 className="text-sm text-muted-foreground">{category?.description ?? "-"}</h4>
          <span
            className={cn(
              "w-fit inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              colors.bg,
              colors.text
            )}
          >
            {category.name}
          </span>
        </div>

        <div className="mt-auto">
          <span className="text-xs text-muted-foreground">
            {category.transactionCount}{" "}
            {category.transactionCount === 1 ? "transação" : "transações"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
