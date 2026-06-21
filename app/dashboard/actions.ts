"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TransactionType } from "@/lib/categories";

export type ActionResult = { ok: boolean; error?: string };

function parseForm(formData: FormData) {
  const descricao = String(formData.get("descricao") ?? "").trim();
  const valor = Number(formData.get("valor"));
  const data = String(formData.get("data") ?? "");
  const tipo = String(formData.get("tipo") ?? "") as TransactionType;
  const categoria = String(formData.get("categoria") ?? "");

  if (!descricao) return { error: "Informe uma descrição." as const };
  if (!Number.isFinite(valor) || valor <= 0)
    return { error: "Informe um valor maior que zero." as const };
  if (!data) return { error: "Informe a data." as const };
  if (tipo !== "receita" && tipo !== "despesa")
    return { error: "Tipo inválido." as const };
  if (!categoria) return { error: "Selecione uma categoria." as const };

  return { values: { descricao, valor, data, tipo, categoria } };
}

export async function createTransaction(
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada." };

  const { error } = await supabase
    .from("transactions")
    .insert({ ...parsed.values, user_id: user.id });

  if (error) return { ok: false, error: "Erro ao salvar transação." };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateTransaction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada." };

  const { error } = await supabase
    .from("transactions")
    .update(parsed.values)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: "Erro ao atualizar transação." };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sessão expirada." };

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: "Erro ao excluir transação." };

  revalidatePath("/dashboard");
  return { ok: true };
}
