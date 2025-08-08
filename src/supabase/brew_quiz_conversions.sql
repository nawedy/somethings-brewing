
-- Table: brew_quiz_conversions

create table if not exists public.brew_quiz_conversions (
  id uuid primary key default gen_random_uuid(),
  quiz_result_id uuid references public.brew_quiz_results(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  action text not null check (action in ('view', 'add_to_cart', 'purchase')),
  created_at timestamptz default now()
);

-- Indexes for performance
create index on public.brew_quiz_conversions (quiz_result_id);
create index on public.brew_quiz_conversions (product_id);
create index on public.brew_quiz_conversions (created_at);
