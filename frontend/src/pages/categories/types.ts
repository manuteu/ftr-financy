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
    bg: "bg-green-light",
    text: "text-green-dark",
    icon: "bg-green-light text-green-base",
  },
  blue: {
    bg: "bg-blue-light",
    text: "text-blue-dark",
    icon: "bg-blue-light text-blue-base",
  },
  purple: {
    bg: "bg-purple-light",
    text: "text-purple-dark",
    icon: "bg-purple-light text-purple-base",
  },
  pink: {
    bg: "bg-pink-light",
    text: "text-pink-dark",
    icon: "bg-pink-light text-pink-base",
  },
  red: {
    bg: "bg-red-light",
    text: "text-red-dark",
    icon: "bg-red-light text-red-base",
  },
  yellow: {
    bg: "bg-yellow-light",
    text: "text-yellow-dark",
    icon: "bg-yellow-light text-yellow-base",
  },
  orange: {
    bg: "bg-orange-light",
    text: "text-orange-dark",
    icon: "bg-orange-light text-orange-base",
  },
  teal: {
    bg: "bg-teal-light",
    text: "text-teal-dark",
    icon: "bg-teal-light text-teal-base",
  },
};

const FALLBACK_COLORS = CATEGORY_COLORS.blue;

export function getCategoryColors(color: string | null) {
  if (!color) return FALLBACK_COLORS;
  return CATEGORY_COLORS[color as CategoryColor] ?? FALLBACK_COLORS;
}
