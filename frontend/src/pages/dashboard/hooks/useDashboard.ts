import { useQuery } from "@apollo/client/react"
import { GET_DASHBOARD } from "@/lib/graphql/queries/Dashboard"
import type { DashboardData, DashboardTransaction } from "../types"

type GetDashboardQueryData = {
  transactions: DashboardTransaction[]
}

function computeDashboardData(transactions: DashboardTransaction[]): DashboardData {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const totalBalance = transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount
  }, 0)

  const monthlyIncome = thisMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)

  const monthlyExpenses = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)

  const recentTransactions = transactions.slice(0, 5)

  const categoryMap = new Map<string, { name: string; color: string; total: number; count: number }>()

  transactions
    .filter((t) => t.type === "expense" && t.category)
    .forEach((t) => {
      if (!t.category) return
      const existing = categoryMap.get(t.category.id)
      if (existing) {
        existing.total += t.amount
        existing.count++
      } else {
        categoryMap.set(t.category.id, {
          name: t.category.name,
          color: t.category.color ?? "green",
          total: t.amount,
          count: 1,
        })
      }
    })

  const categorySummaries = Array.from(categoryMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return { totalBalance, monthlyIncome, monthlyExpenses, recentTransactions, categorySummaries }
}

export function useDashboard() {
  const { data, loading, error } = useQuery<GetDashboardQueryData>(GET_DASHBOARD)

  const dashboardData = data?.transactions ? computeDashboardData(data.transactions) : null

  return { dashboardData, loading, error }
}
