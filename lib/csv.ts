import type { Transaction } from "./types";
import { getCategoryLabel } from "./categories";

export function transactionsToCsv(transactions: Transaction[]): string {
  const header = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];

  const escape = (value: string) => {
    // Envolve em aspas e escapa aspas internas
    return `"${value.replace(/"/g, '""')}"`;
  };

  const rows = transactions.map((t) =>
    [
      t.data,
      escape(t.descricao),
      escape(getCategoryLabel(t.categoria)),
      t.tipo,
      t.valor.toFixed(2).replace(".", ","),
    ].join(";")
  );

  // BOM para Excel reconhecer acentos em UTF-8
  return "﻿" + [header.join(";"), ...rows].join("\n");
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
