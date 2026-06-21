"use client";

import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/categories";
import type { Transaction } from "@/lib/types";
import { deleteTransaction } from "@/app/dashboard/actions";

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
}

export function TransactionTable({ transactions, onEdit }: Props) {
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Excluir esta transação?")) return;
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result.ok) toast.success("Transação excluída.");
      else toast.error(result.error ?? "Erro ao excluir.");
    });
  }

  if (transactions.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[90px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(t.data)}
              </TableCell>
              <TableCell className="font-medium">{t.descricao}</TableCell>
              <TableCell>
                <Badge variant={t.tipo === "receita" ? "success" : "secondary"}>
                  {getCategoryLabel(t.categoria)}
                </Badge>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-semibold tabular-nums",
                  t.tipo === "receita" ? "text-emerald-600" : "text-red-600"
                )}
              >
                {t.tipo === "receita" ? "+" : "-"}
                {formatCurrency(t.valor)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(t)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    disabled={pending}
                    onClick={() => handleDelete(t.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
