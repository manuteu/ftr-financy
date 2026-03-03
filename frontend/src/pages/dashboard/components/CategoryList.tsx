import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { getCategoryColors } from "@/pages/categories/types";
import type { DashboardCategorySummary } from "../types";
import { useNavigate } from "react-router";

interface CategoryListProps {
  categories: DashboardCategorySummary[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const navigate = useNavigate()

  return (
    <Card className="">
      <CardHeader className="py-4 px-6">
        <CardTitle>Categorias</CardTitle>
        <CardAction>
          <Button variant="ghost" className="text-primary" onClick={() => navigate("/categories")}>
            Gerenciar
            <ChevronRight size={16} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex flex-col gap-5">
          {categories.map((category) => {
            const colors = getCategoryColors(category.color)

            return (
              <div key={category.id} className="flex flex-row items-center justify-between">
                <div className={cn("py-1 px-4 rounded-full", colors.bg)}>
                  <p className={cn("text-sm font-medium", colors.text)}>
                    {category.name}
                  </p>
                </div>
                <div className="flex flex-row items-center  min-w-34 w-auto justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{category.count} itens</p>
                  <p className="text-sm font-semibold text-gray-800">{formatCurrency(category.total)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
