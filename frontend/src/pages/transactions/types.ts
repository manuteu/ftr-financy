export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
};

export interface Transaction {
  id: string;
  description: string;
  date: string;
  category: Category;
  categoryId: string | null;
  type: TransactionType;
  value: number;
}

export interface TransactionFilters {
  description: string;
  type: TransactionType | "";
  categoryId: string;
  period: Date | null;
}

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "income", label: "Receita" },
  { value: "expense", label: "Despesa" },
];
