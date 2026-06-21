# 💰 Finanças Pessoais

Web app de gestão financeira pessoal: registre receitas e despesas, categorize, e acompanhe um dashboard com resumo mensal, gráfico por categoria, filtros e exportação CSV.

Construído com **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Supabase** (Auth + PostgreSQL + RLS) e **Recharts**.

## ✨ Funcionalidades

- 🔐 **Autenticação** por e-mail/senha (Supabase Auth) com proteção de rotas via middleware
- 📊 **Dashboard** com cards de Receita, Despesa e Saldo + gráfico de pizza por categoria
- ✏️ **CRUD de transações** (criar, editar, excluir) — descrição, valor, data, tipo e categoria
- 🏷️ **Categorias pré-definidas** (Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Salário, Freelance, Outros)
- 🔎 **Filtros** por período (mês/ano), por categoria e **busca** por descrição
- 📥 **Exportar CSV** das transações filtradas
- 📱 **Responsivo** (desktop e mobile)
- 🛡️ **Row Level Security**: cada usuário só vê e gerencia as próprias transações

## 🚀 Setup

### 1. Pré-requisitos
- Node.js 18+ e uma conta no [Supabase](https://supabase.com)

### 2. Instalar dependências
```bash
npm install
```

### 3. Criar o projeto no Supabase
1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra **SQL Editor** e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) (cria a tabela `transactions`, índices e políticas de RLS).
3. Em **Authentication → Providers → Email**, mantenha o provider habilitado.
   - Para testar sem confirmação de e-mail, desative **"Confirm email"** em **Authentication → Sign In / Providers → Email** (recomendado para uso em aula).

### 4. Variáveis de ambiente
Copie o exemplo e preencha com os dados do seu projeto (**Project Settings → API**):
```bash
cp .env.local.example .env.local
```
```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 5. Rodar localmente
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000), crie uma conta e comece a registrar transações.

## ☁️ Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Importe o repositório na [Vercel](https://vercel.com).
3. Em **Settings → Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. A integração contínua fará novo deploy a cada push.

## 🗂️ Estrutura

```
app/
  layout.tsx              # layout raiz + Toaster
  page.tsx                # redireciona conforme sessão
  login/                  # tela de login/cadastro + server actions de auth
  auth/signout/route.ts   # logout
  dashboard/
    page.tsx              # server component: busca usuário e transações
    actions.ts            # server actions: create/update/delete (com RLS)
components/
  ui/                     # componentes shadcn/ui (button, card, dialog, select...)
  dashboard/              # dashboard-client, cards, gráfico, tabela, diálogo
lib/
  supabase/               # clients (browser/server/middleware)
  categories.ts           # categorias pré-definidas
  csv.ts                  # exportação CSV
  types.ts                # tipos de domínio
  utils.ts                # cn, formatação de moeda/data (pt-BR)
supabase/schema.sql       # tabela + RLS
middleware.ts             # proteção de rotas
```

## 🧱 Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · shadcn/ui (Radix) · Supabase · PostgreSQL · Recharts · Vercel
