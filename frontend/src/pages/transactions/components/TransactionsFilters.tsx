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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatMonthYear } from "@/utils/formatters";
import { CalendarIcon, X } from "lucide-react";
import { startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import type { TransactionFilters as Filters, TransactionType } from "../types";
import { TRANSACTION_TYPES } from "../types";

interface TransactionsFiltersProps {
  filters: Filters;
  categories: string[];
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
    !!filters.description || !!filters.type || !!filters.category || !!filters.period;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="filter-description">Descrição</Label>
            <Input
              id="filter-description"
              placeholder="Buscar por descrição..."
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
              value={filters.category || "all"}
              onValueChange={(v) => onCategoryChange(v === "all" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.period && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {periodDisplay}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.period ?? undefined}
                  onSelect={(date) =>
                    onPeriodChange(date ? startOfMonth(date) : null)
                  }
                  defaultMonth={filters.period ?? new Date()}
                  captionLayout="dropdown"
                />
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
