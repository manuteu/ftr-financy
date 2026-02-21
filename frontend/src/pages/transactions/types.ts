export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  date: string;
  category: string;
  type: TransactionType;
  value: number;
}

export interface TransactionFilters {
  description: string;
  type: TransactionType | "";
  category: string;
  period: Date | null;
}

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "income", label: "Receita" },
  { value: "expense", label: "Despesa" },
];

export const CATEGORIES = [
  "Salário",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação",
  "Outros",
] as const;
