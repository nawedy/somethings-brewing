
-- Table: brew_quiz_results

create table if not exists public.brew_quiz_results (
  id uuid primary key default gen_random_uuid(),
  answers text[] not null,
  result text not null,
  created_at timestamptz default now(),
  customer_id uuid references public.customers(id) on delete set null
);

-- Indexes
create index on public.brew_quiz_results (created_at);
create index on public.brew_quiz_results (result);
create index on public.brew_quiz_results (customer_id);
