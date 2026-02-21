import { useMemo, useState, useCallback } from "react";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import type { Transaction, TransactionFilters } from "../types";
import { PAGE_SIZE } from "../components/TransactionsTable";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    description: "Pagamento de Salário",
    date: "2026-02-17T00:00:00.000Z",
    value: 5423000,
    type: "income",
    category: "Salário",
  },
  {
    id: "2",
    description: "Jantar no Restaurante",
    date: "2026-02-17T00:00:00.000Z",
    value: 12300,
    type: "expense",
    category: "Alimentação",
  },
  {
    id: "3",
    description: "Posto de Gasolina",
    date: "2026-02-18T00:00:00.000Z",
    value: 25000,
    type: "expense",
    category: "Transporte",
  },
  {
    id: "4",
    description: "Freelance",
    date: "2026-02-10T00:00:00.000Z",
    value: 150000,
    type: "income",
    category: "Outros",
  },
  {
    id: "5",
    description: "Supermercado",
    date: "2026-02-15T00:00:00.000Z",
    value: 32000,
    type: "expense",
    category: "Alimentação",
  },
];

function filterTransactions(
  list: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  return list.filter((t) => {
    if (
      filters.description &&
      !t.description
        .toLowerCase()
        .includes(filters.description.trim().toLowerCase())
    ) {
      return false;
    }
    if (filters.type && t.type !== filters.type) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.period) {
      const date = new Date(t.date);
      const start = startOfMonth(filters.period);
      const end = endOfMonth(filters.period);
      if (!isWithinInterval(date, { start, end })) return false;
    }
    return true;
  });
}

const defaultFilters: TransactionFilters = {
  description: "",
  type: "",
  category: "",
  period: null,
};

export function useTransactions() {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterTransactions(MOCK_TRANSACTIONS, filters),
    [filters]
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const setDescription = useCallback((description: string) => {
    setFilters((f) => ({ ...f, description }));
    setPage(1);
  }, []);
  const setType = useCallback((type: TransactionFilters["type"]) => {
    setFilters((f) => ({ ...f, type }));
    setPage(1);
  }, []);
  const setCategory = useCallback((category: string) => {
    setFilters((f) => ({ ...f, category }));
    setPage(1);
  }, []);
  const setPeriod = useCallback((period: Date | null) => {
    setFilters((f) => ({ ...f, period }));
    setPage(1);
  }, []);

  return {
    filters,
    setDescription,
    setType,
    setCategory,
    setPeriod,
    transactions: paginated,
    totalCount: filtered.length,
    page,
    setPage,
  };
}
