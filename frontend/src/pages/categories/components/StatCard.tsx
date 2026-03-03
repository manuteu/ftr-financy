import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

export function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-row items-start gap-4 py-6">
        <div className="mt-1">
          {icon}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
