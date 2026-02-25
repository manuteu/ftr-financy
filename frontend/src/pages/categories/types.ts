export type CategoryColor =
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "yellow"
  | "orange"
  | "teal";

export interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  transactionCount: number;
  description?: string;
}

export const CATEGORY_COLORS: Record<
  CategoryColor,
  { bg: string; text: string; icon: string }
> = {
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-400",
    icon: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-400",
    icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-800 dark:text-purple-400",
    icon: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  },
  pink: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-800 dark:text-pink-400",
    icon: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400",
  },
  red: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-400",
    icon: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-400",
    icon: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-800 dark:text-orange-400",
    icon: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-800 dark:text-teal-400",
    icon: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
  },
};

const FALLBACK_COLORS = CATEGORY_COLORS.blue;

export function getCategoryColors(color: string | null) {
  if (!color) return FALLBACK_COLORS;
  return CATEGORY_COLORS[color as CategoryColor] ?? FALLBACK_COLORS;
}
