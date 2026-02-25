import { useMemo, useState, useCallback } from "react";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { useQuery } from "@apollo/client/react";
import type { Transaction, TransactionFilters } from "../types";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { PAGE_SIZE } from "../components/TransactionsTable";

type GqlTransaction = {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  category: {
    id: string;
    name: string;
    color: string | null;
    icon: string | null;
  } | null;
};

type GetTransactionsData = {
  transactions: GqlTransaction[];
};

function mapTransaction(t: GqlTransaction): Transaction {
  return {
    id: t.id,
    description: t.description,
    value: t.amount,
    type: t.type as Transaction["type"],
    date: t.date,
    category: t.category?.name ?? "Sem categoria",
    categoryId: t.category?.id ?? null,
  };
}

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

  const { data, loading, error } = useQuery<GetTransactionsData>(GET_TRANSACTIONS);

  const allTransactions = useMemo(
    () => (data?.transactions ?? []).map(mapTransaction),
    [data]
  );

  const availableCategories = useMemo(() => {
    const names = new Set(
      allTransactions.map((t) => t.category).filter((c) => c !== "Sem categoria")
    );
    return Array.from(names).sort();
  }, [allTransactions]);

  const filtered = useMemo(
    () => filterTransactions(allTransactions, filters),
    [allTransactions, filters]
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

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

  return {
    filters,
    availableCategories,
    setDescription,
    setType,
    setCategory,
    setPeriod,
    clearFilters,
    transactions: paginated,
    totalCount: filtered.length,
    page,
    setPage,
    loading,
    error,
  };
}
