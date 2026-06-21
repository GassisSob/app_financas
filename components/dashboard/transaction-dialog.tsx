"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoriesForType,
  type TransactionType,
} from "@/lib/categories";
import type { Transaction } from "@/lib/types";
import { createTransaction, updateTransaction } from "@/app/dashboard/actions";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionDialog({ open, onOpenChange, transaction }: Props) {
  const isEdit = Boolean(transaction);
  const [tipo, setTipo] = useState<TransactionType>(
    transaction?.tipo ?? "despesa"
  );
  const [categoria, setCategoria] = useState<string>(
    transaction?.categoria ?? ""
  );
  const [pending, startTransition] = useTransition();

  // Reinicializa o estado quando muda a transação editada / reabre
  const key = transaction?.id ?? "new";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("tipo", tipo);
    formData.set("categoria", categoria);

    startTransition(async () => {
      const result = transaction
        ? await updateTransaction(transaction.id, formData)
        : await createTransaction(formData);

      if (result.ok) {
        toast.success(isEdit ? "Transação atualizada!" : "Transação adicionada!");
        onOpenChange(false);
      } else {
        toast.error(result.error ?? "Algo deu errado.");
      }
    });
  }

  const categories = categoriesForType(tipo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>

        <form key={key} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={tipo === "despesa" ? "default" : "outline"}
              onClick={() => {
                setTipo("despesa");
                setCategoria("");
              }}
            >
              Despesa
            </Button>
            <Button
              type="button"
              variant={tipo === "receita" ? "default" : "outline"}
              onClick={() => {
                setTipo("receita");
                setCategoria("");
              }}
            >
              Receita
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              maxLength={120}
              defaultValue={transaction?.descricao ?? ""}
              placeholder="Ex: Mercado, Salário..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={transaction?.valor ?? ""}
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                name="data"
                type="date"
                defaultValue={transaction?.data ?? todayISO()}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending || !categoria}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
