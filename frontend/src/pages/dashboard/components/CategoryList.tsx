import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { DashboardCategorySummary } from "../types";
import { useNavigate } from "react-router";

interface CategoryListProps {
  categories: DashboardCategorySummary[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const navigate = useNavigate()
  const colorMap = {
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-700",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
    },
  }

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>Categorias</CardTitle>
        <CardAction>
          <Button variant="ghost" className="text-green-800" onClick={() => navigate("/categories")}>
            Gerenciar
            <ChevronRight size={16} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          {categories.map((category) => {
            const colors = colorMap[category.color as keyof typeof colorMap] ?? colorMap.green

            return (
              <div key={category.id} className="flex flex-row items-center justify-between">
                <div className={`py-1 px-4 ${colors.bg} rounded-full`}>
                  <p className={`text-sm font-medium ${colors.text}`}>
                    {category.name}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-6">
                  <p className="text-sm font-medium text-gray-500">{category.count} itens</p>
                  <p className="text-sm font-medium text-gray-500">{formatCurrency(category.total)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
