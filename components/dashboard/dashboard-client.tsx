"use client";

import { useMemo, useState } from "react";
import { Download, LogOut, Plus, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import type { Transaction } from "@/lib/types";
import { transactionsToCsv, downloadCsv } from "@/lib/csv";
import { ThemeToggle } from "@/components/theme-toggle";
import { SummaryCards } from "./summary-cards";
import { CategoryChart } from "./category-chart";
import { TransactionTable } from "./transaction-table";
import { TransactionDialog } from "./transaction-dialog";

interface Props {
  email: string;
  transactions: Transaction[];
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function DashboardClient({ email, transactions }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("todas");

  // Lista de períodos (ano-mês) disponíveis nas transações
  const periodos = useMemo(() => {
    const set = new Set<string>();
    for (const t of transactions) set.add(t.data.slice(0, 7)); // YYYY-MM
    const arr = Array.from(set).sort().reverse();
    return arr;
  }, [transactions]);

  const [periodo, setPeriodo] = useState<string>("todos");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (periodo !== "todos" && t.data.slice(0, 7) !== periodo) return false;
      if (categoria !== "todas" && t.categoria !== categoria) return false;
      if (
        search.trim() &&
        !t.descricao.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;
      return true;
    });
  }, [transactions, periodo, categoria, search]);

  const { receitas, despesas, saldo } = useMemo(() => {
    let r = 0;
    let d = 0;
    for (const t of filtered) {
      if (t.tipo === "receita") r += t.valor;
      else d += t.valor;
    }
    return { receitas: r, despesas: d, saldo: r - d };
  }, [filtered]);

  function handleEdit(t: Transaction) {
    setEditing(t);
    setDialogOpen(true);
  }

  function handleNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function handleExport() {
    const csv = transactionsToCsv(filtered);
    downloadCsv(`transacoes-${periodo}.csv`, csv);
  }

  function formatPeriodo(p: string) {
    const [ano, mes] = p.split("-");
    return `${MESES[Number(mes) - 1]} / ${ano}`;
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Finanças Pessoais</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {email}
            </span>
            <ThemeToggle />
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="icon" type="submit" title="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container space-y-6 py-6">
        {/* Título + ações */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas receitas e despesas
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4" />
              Nova transação
            </Button>
          </div>
        </div>

        {/* Cards de resumo */}
        <SummaryCards receitas={receitas} despesas={despesas} saldo={saldo} />

        {/* Gráfico */}
        <CategoryChart transactions={filtered} />

        {/* Filtros */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os períodos</SelectItem>
              {periodos.map((p) => (
                <SelectItem key={p} value={p}>
                  {formatPeriodo(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <TransactionTable transactions={filtered} onEdit={handleEdit} />
      </main>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editing}
      />
    </div>
  );
}
