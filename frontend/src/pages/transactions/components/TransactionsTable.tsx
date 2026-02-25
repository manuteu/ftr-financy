import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { SquarePen, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction } from "../types";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

const PAGE_SIZE = 10;

interface TransactionsTableProps {
  transactions: Transaction[];
  page: number;
  totalCount: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  page,
  totalCount,
  loading = false,
  onPageChange,
  onEdit,
  onDelete,
}: TransactionsTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="uppercase text-xs">
              <TableHead className="text-left">Descrição</TableHead>
              <TableHead className="text-center">Data</TableHead>
              <TableHead className="text-center">Categoria</TableHead>
              <TableHead className="text-center">Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium flex items-center gap-4">
                    <div className={cn(`size-10 shrink-0 flex items-center justify-center rounded-lg bg-${transaction.category.color}-100`)}>
                      <DynamicIcon
                        name={transaction.category.icon as IconName}
                        className={cn(`text-${transaction.category.color}-800`)}
                        size={16}
                      />
                    </div>
                    <p className="text-base font-medium">{transaction.description}</p>
                  </TableCell>
                  <TableCell className="text-center">{formatDate(transaction.date)}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(`px-3 py-1 bg-${transaction.category.color}-100 text-${transaction.category.color}-800 font-medium rounded-full`)}>
                      {transaction.category.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-sm font-medium flex items-center gap-2 justify-center",
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      <DynamicIcon
                        name={transaction.type === "income" ? "circle-arrow-up" : "circle-arrow-down"}
                        className={cn(transaction.type === "income" ? "text-green-600" : "text-red-600")}
                        size={16}
                      />
                      {transaction.type === "income" ? "Entrada" : "Saída"}
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-semibold"
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    <span className="ml-1">
                      {formatCurrency(transaction.value)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Excluir"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDelete(transaction)}
                      >
                        <Trash className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        aria-label="Editar"
                        onClick={() => onEdit(transaction)}
                      >
                        <SquarePen className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t px-6 h-18">
        <p className="text-sm text-muted-foreground">
          {page} de {totalPages} | {totalCount} {totalCount !== 1 ? "resultados" : "resultado"}
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
                aria-disabled={page <= 1}
                className={cn(page <= 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(p);
                    }}
                    isActive={page === p}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
                aria-disabled={page >= totalPages}
                className={cn(
                  page >= totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export { PAGE_SIZE };
