import DashCard from "@/components/dash-card";
import { CategoryList, RecentTransactionsList } from "./components";
import { CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";

export default function Dashboard() {
  const { dashboardData, loading } = useDashboard()

  return (
    <main className="grid grid-cols-3 gap-6 p-4">
      <DashCard
        icon={<Wallet className="text-purple-700" size={20} />}
        title="Saldo total"
        value={dashboardData?.totalBalance ?? 0}
        loading={loading}
      />
      <DashCard
        icon={<CircleArrowUp className="text-green-700" size={20} />}
        title="Receitas do mês"
        value={dashboardData?.monthlyIncome ?? 0}
        loading={loading}
      />
      <DashCard
        icon={<CircleArrowDown className="text-red-700" size={20} />}
        title="Despesas do mês"
        value={dashboardData?.monthlyExpenses ?? 0}
        loading={loading}
      />
      <div className="col-span-2">
        <RecentTransactionsList transactions={dashboardData?.recentTransactions ?? []} />
      </div>
      <div className="col-span-1">
        <CategoryList categories={dashboardData?.categorySummaries ?? []} />
      </div>
    </main>
  )
}
