export type TransactionType = "receita" | "despesa";

export interface Category {
  value: string;
  label: string;
  type: TransactionType | "ambos";
  color: string;
}

// Categorias pré-definidas (PRD seção 3)
export const CATEGORIES: Category[] = [
  { value: "alimentacao", label: "Alimentação", type: "despesa", color: "#ef4444" },
  { value: "transporte", label: "Transporte", type: "despesa", color: "#f97316" },
  { value: "moradia", label: "Moradia", type: "despesa", color: "#eab308" },
  { value: "lazer", label: "Lazer", type: "despesa", color: "#8b5cf6" },
  { value: "saude", label: "Saúde", type: "despesa", color: "#ec4899" },
  { value: "educacao", label: "Educação", type: "despesa", color: "#06b6d4" },
  { value: "salario", label: "Salário", type: "receita", color: "#22c55e" },
  { value: "freelance", label: "Freelance", type: "receita", color: "#10b981" },
  { value: "outros", label: "Outros", type: "ambos", color: "#64748b" },
];

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function getCategoryColor(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.color ?? "#64748b";
}

export function categoriesForType(type: TransactionType): Category[] {
  return CATEGORIES.filter((c) => c.type === type || c.type === "ambos");
}
