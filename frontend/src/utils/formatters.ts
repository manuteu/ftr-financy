export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100)
}

/** Formata centavos para string de exibição: 1002 → "10,02" */
export const formatCentsToDisplay = (cents: number): string => {
  const reais = cents / 100
  const [intPart, decPart = ""] = reais.toFixed(2).split(".")
  const intWithThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${intWithThousands},${decPart}`
}

/** Converte string formatada para centavos: "10,02" → 1002 */
export const parseDisplayToCents = (display: string): number => {
  const digits = display.replace(/\D/g, "")
  return parseInt(digits || "0", 10)
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

/** Formata data para exibição "Novembro/2026" */
export const formatMonthYear = (date: Date) => {
  const str = date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return str.replace(/ de /g, "/").replace(/^./, (c) => c.toUpperCase());
};