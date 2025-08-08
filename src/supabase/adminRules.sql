/*Here are the Supabase **Row Level Security (RLS) policies** to enforce that only users with an `admin` role can read or write to the `brew_quiz_conversions` and `brew_quiz_results` tables.
*/
---

### ✅ Step 1: Enable RLS on the Tables

```sql
alter table public.brew_quiz_results enable row level security;
alter table public.brew_quiz_conversions enable row level security;
```

---

### ✅ Step 2: Create Admin Role Check Policy

```sql
create policy "Admins only - select & insert on quiz results"
on public.brew_quiz_results
for select, insert
using (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.customers
    where customers.id = auth.uid()
    and customers.role = 'admin'
  )
);

create policy "Admins only - select & insert on quiz conversions"
on public.brew_quiz_conversions
for select, insert
using (
  auth.role() = 'authenticated'
  and exists (
    select 1 from public.customers
    where customers.id = auth.uid()
    and customers.role = 'admin'
  )
);
```

---

### ✅ Step 3: Add Role Column to Users Table (if not already present)

```sql
alter table public.customers
add column if not exists role text default 'customer';
```

Set `role = 'admin'` manually for approved accounts:

```sql
update public.customers set role = 'admin' where email = 'your.admin@email.com';
```

---

