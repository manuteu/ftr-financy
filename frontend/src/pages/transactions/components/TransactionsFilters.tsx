import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatMonthYear } from "@/utils/formatters";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionFilters as Filters, TransactionType } from "../types";
import { TRANSACTION_TYPES } from "../types";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i);

interface TransactionsFiltersProps {
  filters: Filters;
  categories: { id: string; name: string }[];
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: TransactionType | "") => void;
  onCategoryChange: (value: string) => void;
  onPeriodChange: (value: Date | null) => void;
  onClear: () => void;
}

export function TransactionsFilters({
  filters,
  categories,
  onDescriptionChange,
  onTypeChange,
  onCategoryChange,
  onPeriodChange,
  onClear,
}: TransactionsFiltersProps) {
  const periodDisplay = filters.period
    ? formatMonthYear(filters.period)
    : "Selecione";

  const hasActiveFilters =
    !!filters.description || !!filters.type || !!filters.categoryId || !!filters.period;

  return (
    <Card>
      <CardContent className="py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="filter-description">Descrição</Label>
            <Input
              id="filter-description"
              placeholder="Buscar por descrição"
              value={filters.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={filters.type || "all"}
              onValueChange={(v) =>
                onTypeChange(v === "all" ? "" : (v as TransactionType))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {TRANSACTION_TYPES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={filters.categoryId || "all"}
              onValueChange={(v) => onCategoryChange(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className={cn(
                    "w-full justify-start text-left font-normal text-base",
                    !filters.period && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {periodDisplay}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto" align="start">
                <div className="flex gap-2">
                  <Select
                    value={
                      filters.period !== null
                        ? String(filters.period.getMonth())
                        : "all"
                    }
                    onValueChange={(v) => {
                      if (v === "all") {
                        onPeriodChange(null);
                        return;
                      }
                      const month = parseInt(v, 10);
                      const year =
                        filters.period?.getFullYear() ?? new Date().getFullYear();
                      onPeriodChange(new Date(year, month, 1));
                    }}
                  >
                    <SelectTrigger className="min-w-[130px] text-sm">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {MONTHS.map((name, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={
                      filters.period !== null
                        ? String(filters.period.getFullYear())
                        : "all"
                    }
                    onValueChange={(v) => {
                      if (v === "all") {
                        onPeriodChange(null);
                        return;
                      }
                      const year = parseInt(v, 10);
                      const month =
                        filters.period?.getMonth() ?? new Date().getMonth();
                      onPeriodChange(new Date(year, month, 1));
                    }}
                  >
                    <SelectTrigger className="min-w-[100px] text-sm">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={String(y)}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground"
            >
              <X className="mr-1 size-3.5" />
              Limpar filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
