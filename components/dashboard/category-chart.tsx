"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getCategoryColor, getCategoryLabel } from "@/lib/categories";
import type { Transaction } from "@/lib/types";

interface Props {
  transactions: Transaction[];
}

export function CategoryChart({ transactions }: Props) {
  // Gráfico de despesas por categoria (PRD: gráfico de pizza por categoria)
  const byCategory = new Map<string, number>();
  for (const t of transactions) {
    if (t.tipo !== "despesa") continue;
    byCategory.set(t.categoria, (byCategory.get(t.categoria) ?? 0) + t.valor);
  }

  const data = Array.from(byCategory.entries())
    .map(([categoria, valor]) => ({
      categoria,
      name: getCategoryLabel(categoria),
      value: valor,
      color: getCategoryColor(categoria),
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Despesas por categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            Sem despesas no período selecionado.
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="h-[260px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {data.map((d) => (
                      <Cell key={d.categoria} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="w-full space-y-2 md:w-1/2">
              {data.map((d) => (
                <li
                  key={d.categoria}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    {d.name}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(d.value)}
                    <span className="ml-2 text-muted-foreground">
                      {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
