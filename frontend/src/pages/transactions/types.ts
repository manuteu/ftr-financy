export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  date: string;
  category: string;
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
