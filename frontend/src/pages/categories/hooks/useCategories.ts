import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import type { Category } from "../types";
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";

type GqlCategory = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
};

type GqlTransaction = {
  id: string;
  category: { id: string } | null;
};

type GetCategoriesData = { categories: GqlCategory[] };
type GetTransactionsData = { transactions: GqlTransaction[] };

export interface CategoriesStats {
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: Category | null;
}

export function useCategories() {
  const { data: categoriesData, loading: loadingCategories } =
    useQuery<GetCategoriesData>(GET_CATEGORIES);

  const { data: transactionsData, loading: loadingTransactions } =
    useQuery<GetTransactionsData>(GET_TRANSACTIONS);

  const categories = useMemo((): Category[] => {
    const gqlCategories = categoriesData?.categories ?? [];
    const transactions = transactionsData?.transactions ?? [];

    const countMap = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.category?.id) {
        countMap.set(t.category.id, (countMap.get(t.category.id) ?? 0) + 1);
      }
    });

    return gqlCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      transactionCount: countMap.get(cat.id) ?? 0,
      description: cat.description ?? undefined,
    }));
  }, [categoriesData, transactionsData]);

  const stats = useMemo((): CategoriesStats => {
    const totalCategories = categories.length;
    const totalTransactions = categories.reduce(
      (acc, c) => acc + c.transactionCount,
      0
    );
    const mostUsedCategory =
      categories.length === 0
        ? null
        : categories.reduce<Category | null>(
            (max, c) =>
              !max || c.transactionCount > max.transactionCount ? c : max,
            null
          );

    return { totalCategories, totalTransactions, mostUsedCategory };
  }, [categories]);

  return {
    categories,
    stats,
    loading: loadingCategories || loadingTransactions,
  };
}
