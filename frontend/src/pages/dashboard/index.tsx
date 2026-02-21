import DashCard from "@/components/dash-card";
import { CategoryList, RecentTransactionsList } from "./components";
import { CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";

export default function Dashboard() {
  return (
    <main className="grid grid-cols-3 gap-6 p-4">
      <DashCard icon={<Wallet className="text-purple-700" size={20} />} title="Saldo total" value={10000} />
      <DashCard icon={<CircleArrowUp className="text-green-700" size={20} />} title="Receitas do mês" value={10000} />
      <DashCard icon={<CircleArrowDown className="text-red-700" size={20} />} title="Despesas do mês" value={10000} />
      <div className="col-span-2">
        <RecentTransactionsList />
      </div>
      <div className="col-span-1">
        <CategoryList />
      </div>
    </main>
  )
}
