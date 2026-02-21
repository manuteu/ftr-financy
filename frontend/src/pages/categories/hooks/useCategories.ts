import { useMemo } from "react";
import type { Category } from "../types";

const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    title: "Alimentação",
    description: "Restaurantes, supermercado e delivery",
    color: "green",
    transactionCount: 24,
  },
  {
    id: "2",
    title: "Transporte",
    description: "Combustível, Uber e manutenção do carro",
    color: "blue",
    transactionCount: 12,
  },
  {
    id: "3",
    title: "Salário",
    description: "Renda fixa mensal",
    color: "purple",
    transactionCount: 1,
  },
  {
    id: "4",
    title: "Lazer",
    description: "Streaming, jogos e entretenimento",
    color: "red",
    transactionCount: 8,
  },
  {
    id: "5",
    title: "Saúde",
    description: "Planos, medicamentos e consultas",
    color: "teal",
    transactionCount: 5,
  },
  {
    id: "6",
    title: "Educação",
    description: "Cursos e materiais de estudo",
    color: "orange",
    transactionCount: 3,
  },
  {
    id: "7",
    title: "Casa",
    description: "Contas de luz, água e internet",
    color: "yellow",
    transactionCount: 6,
  },
  {
    id: "8",
    title: "Outros",
    description: "Despesas diversas",
    color: "blue",
    transactionCount: 15,
  },
];

export interface CategoriesStats {
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: Category | null;
}

export function useCategories() {
  const categories = useMemo(() => MOCK_CATEGORIES, []);

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

    return {
      totalCategories,
      totalTransactions,
      mostUsedCategory,
    };
  }, [categories]);

  return { categories, stats };
}
