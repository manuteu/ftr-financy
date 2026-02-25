import { useMemo, useState, useCallback } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { useQuery } from "@apollo/client/react";
import type { Transaction, TransactionFilters } from "../types";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories";
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
  };
};

type GetTransactionsData = {
  transactions: {
    transactions: GqlTransaction[];
    totalCount: number;
  };
};

type GqlCategory = { id: string; name: string };
type GetCategoriesData = { categories: GqlCategory[] };

function mapTransaction(t: GqlTransaction): Transaction {
  return {
    id: t.id,
    description: t.description,
    value: t.amount,
    type: t.type as Transaction["type"],
    date: t.date,
    category: t.category,
    categoryId: t.category?.id ?? null,
  };
}

const defaultFilters: TransactionFilters = {
  description: "",
  type: "",
  categoryId: "",
  period: null,
};

export function useTransactions() {
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [page, setPage] = useState(1);

  const variables = useMemo(() => ({
    description: filters.description || undefined,
    type: filters.type || undefined,
    categoryId: filters.categoryId || undefined,
    startDate: filters.period ? startOfMonth(filters.period) : undefined,
    endDate: filters.period ? endOfMonth(filters.period) : undefined,
    page,
    pageSize: PAGE_SIZE,
  }), [filters, page]);

  const { data, loading, error } = useQuery<GetTransactionsData>(GET_TRANSACTIONS, {
    variables,
  });

  const { data: categoriesData } = useQuery<GetCategoriesData>(GET_CATEGORIES);

  const transactions = useMemo(
    () => (data?.transactions.transactions ?? []).map(mapTransaction),
    [data]
  );

  const totalCount = data?.transactions.totalCount ?? 0;

  const availableCategories = useMemo(
    () => categoriesData?.categories ?? [],
    [categoriesData]
  );

  const setDescription = useCallback((description: string) => {
    setFilters((f) => ({ ...f, description }));
    setPage(1);
  }, []);

  const setType = useCallback((type: TransactionFilters["type"]) => {
    setFilters((f) => ({ ...f, type }));
    setPage(1);
  }, []);

  const setCategoryId = useCallback((categoryId: string) => {
    setFilters((f) => ({ ...f, categoryId }));
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
    setCategoryId,
    setPeriod,
    clearFilters,
    transactions,
    totalCount,
    page,
    setPage,
    loading,
    error,
  };
}
