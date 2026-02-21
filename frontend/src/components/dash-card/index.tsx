import { Card, CardContent } from "../ui/card";
import { formatCurrency } from "@/utils/formatters";

interface DashCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

export default function DashCard({ icon, title, value }: DashCardProps) {
  return (
    <Card>
      <CardContent className="py-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
        </div>
        <p className="text-3xl font-bold text-foreground">{formatCurrency(value)}</p>
      </CardContent>
    </Card>
  )
}
