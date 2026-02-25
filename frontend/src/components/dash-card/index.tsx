import { Card, CardContent } from "../ui/card";
import { formatCurrency } from "@/utils/formatters";

interface DashCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  loading?: boolean;
}

export default function DashCard({ icon, title, value, loading }: DashCardProps) {
  return (
    <Card>
      <CardContent className="py-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
        </div>
        {loading ? (
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-3xl font-bold text-foreground">{formatCurrency(value)}</p>
        )}
      </CardContent>
    </Card>
  )
}
