import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Plus } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


export function RecentTransactionsList() {

  const recentTransactions = [
    {
      description: "Pagamento de Salário",
      date: "2026-02-17T00:00:00.000Z",
      value: 54230,
      type: "income",
      category: "Salário",
      icon: "wallet",
      color: "green",
    },
    {
      description: "Jantar no Restaurante",
      date: "2026-02-17T00:00:00.000Z",
      value: 1230,
      type: "expense",
      category: "Alimentação",
      icon: "utensils",
      color: "red",
    },
    {
      description: "Posto de Gasolina",
      date: "2026-02-17T00:00:00.000Z",
      value: 1230,
      type: "expense",
      category: "Transporte",
      icon: "fuel",
      color: "blue",
    },
  ]

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
    <Card className="gap-0">
      <CardHeader className="py-4 px-6">
        <CardTitle>Transações recentes</CardTitle>
        <CardAction>
          <Button variant="ghost" className="text-green-800 items-center">
            Ver todas
            <ChevronRight size={20} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex flex-col">
          {recentTransactions.map((transaction) => {
            const colors = colorMap[transaction.color as keyof typeof colorMap]

            return (
              <>
                <div key={transaction.description} className="flex flex-row items-center justify-between px-6 py-4">
                  <div className="flex flex-row items-center gap-3 flex-1">
                    <Button variant="ghost" className={colors.bg} size="icon">
                      <DynamicIcon name={transaction.icon as IconName} className={colors.text} />
                    </Button>
                    <div className="flex flex-col">
                      <p className="text-base font-medium ">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className={`py-1 px-4 ${colors.bg} rounded-full`}>
                    <p className={`text-sm font-medium ${colors.text}`}>
                      {transaction.category}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-2 ml-[5%]">
                    <p className="text-sm font-medium text-gray-800">{formatCurrency(transaction.value)}</p>
                    <DynamicIcon size={16} name={transaction.type === "income" ? "circle-arrow-up" : "circle-arrow-down"} className={cn(transaction.type === "income" ? "text-green-700" : "text-red-700")} />
                  </div>
                </div>
                <Separator />
              </>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="p-2">
        <Button variant="ghost" className="text-green-800 w-full">
          <Plus size={16} />
          Nova transação
        </Button>
      </CardFooter>
    </Card>
  )
}
