-- ============================================================
-- Finanças Pessoais — Schema do banco (Supabase / PostgreSQL)
-- Rode este script no SQL Editor do seu projeto Supabase.
-- ============================================================

-- Tabela de transações
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  descricao   text not null check (char_length(descricao) between 1 and 120),
  valor       numeric(12, 2) not null check (valor > 0),
  data        date not null,
  tipo        text not null check (tipo in ('receita', 'despesa')),
  categoria   text not null,
  created_at  timestamptz not null default now()
);

-- Índices para filtros por usuário/data
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_user_data_idx on public.transactions (user_id, data desc);

-- ============================================================
-- Row Level Security: cada usuário só acessa as próprias transações
-- ============================================================
alter table public.transactions enable row level security;

drop policy if exists "Usuário lê suas transações" on public.transactions;
create policy "Usuário lê suas transações"
  on public.transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Usuário insere suas transações" on public.transactions;
create policy "Usuário insere suas transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuário atualiza suas transações" on public.transactions;
create policy "Usuário atualiza suas transações"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Usuário deleta suas transações" on public.transactions;
create policy "Usuário deleta suas transações"
  on public.transactions for delete
  using (auth.uid() = user_id);
