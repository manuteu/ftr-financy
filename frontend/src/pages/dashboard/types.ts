export interface DashboardTransactionCategory {
  id: string
  name: string
  color: string | null
  icon: string | null
}

export interface DashboardTransaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  date: string
  category?: DashboardTransactionCategory | null
}

export interface DashboardCategorySummary {
  id: string
  name: string
  color: string
  total: number
  count: number
}

export interface DashboardData {
  totalBalance: number
  monthlyIncome: number
  monthlyExpenses: number
  recentTransactions: DashboardTransaction[]
  categorySummaries: DashboardCategorySummary[]
}
