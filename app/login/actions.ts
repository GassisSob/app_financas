"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string } | { message: string } | null;

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    return { error: "A senha precisa ter ao menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Este e-mail já está cadastrado. Faça login." };
    }
    return { error: "Não foi possível criar a conta. Tente outro e-mail." };
  }

  // Proteção do Supabase contra descoberta de e-mails: ao cadastrar um e-mail
  // que JÁ existe, ele retorna sucesso (sem erro), mas com identities vazio e
  // sem sessão. Detectamos isso e orientamos a fazer login.
  if (data.user && (data.user.identities?.length ?? 0) === 0) {
    return { error: "Este e-mail já está cadastrado. Faça login." };
  }

  // Quando a confirmação de e-mail está ativada, o signUp não cria sessão.
  // Avisamos o usuário em vez de redirecionar silenciosamente para o login.
  if (!data.session) {
    return {
      message:
        "Conta criada! Enviamos um link de verificação para o seu e-mail. Confirme o cadastro e depois faça login. Não encontrou? Verifique também a caixa de spam/lixo eletrônico.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
