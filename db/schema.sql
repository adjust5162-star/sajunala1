create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saju_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  input_hash text not null,
  saju_result jsonb not null,
  pillars_json jsonb not null default '{}'::jsonb,
  five_elements_json jsonb not null default '{}'::jsonb,
  ten_gods_json jsonb not null default '{}'::jsonb,
  twelve_shinsal_json jsonb not null default '{}'::jsonb,
  daewoon_json jsonb not null default '[]'::jsonb,
  sewoon_json jsonb not null default '[]'::jsonb,
  warnings_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, input_hash)
);

alter table public.saju_results add column if not exists pillars_json jsonb not null default '{}'::jsonb;
alter table public.saju_results add column if not exists five_elements_json jsonb not null default '{}'::jsonb;
alter table public.saju_results add column if not exists ten_gods_json jsonb not null default '{}'::jsonb;
alter table public.saju_results add column if not exists twelve_shinsal_json jsonb not null default '{}'::jsonb;
alter table public.saju_results add column if not exists daewoon_json jsonb not null default '[]'::jsonb;
alter table public.saju_results add column if not exists sewoon_json jsonb not null default '[]'::jsonb;
alter table public.saju_results add column if not exists warnings_json jsonb not null default '[]'::jsonb;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  saju_result_id uuid references public.saju_results(id) on delete set null,
  report_type text not null default 'basic',
  report_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id uuid references public.reports(id) on delete set null,
  provider text,
  provider_payment_id text,
  status text not null default 'pending',
  amount_krw integer not null default 0,
  payment_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saju_results_user_id_idx on public.saju_results(user_id);
create index if not exists saju_results_input_hash_idx on public.saju_results(input_hash);
create index if not exists reports_user_id_idx on public.reports(user_id);
create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_provider_payment_id_idx on public.payments(provider_payment_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists saju_results_set_updated_at on public.saju_results;
create trigger saju_results_set_updated_at
before update on public.saju_results
for each row execute function public.set_updated_at();

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
before update on public.reports
for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.saju_results enable row level security;
alter table public.reports enable row level security;
alter table public.payments enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
on public.profiles for delete
using (auth.uid() = id);

drop policy if exists "Users can read own saju results" on public.saju_results;
create policy "Users can read own saju results"
on public.saju_results for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own saju results" on public.saju_results;
create policy "Users can insert own saju results"
on public.saju_results for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own saju results" on public.saju_results;
create policy "Users can update own saju results"
on public.saju_results for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saju results" on public.saju_results;
create policy "Users can delete own saju results"
on public.saju_results for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own reports" on public.reports;
create policy "Users can read own reports"
on public.reports for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own reports" on public.reports;
create policy "Users can insert own reports"
on public.reports for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own reports" on public.reports;
create policy "Users can update own reports"
on public.reports for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own reports" on public.reports;
create policy "Users can delete own reports"
on public.reports for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own payments" on public.payments;
create policy "Users can read own payments"
on public.payments for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own pending payments" on public.payments;
create policy "Users can insert own pending payments"
on public.payments for insert
with check (auth.uid() = user_id and status = 'pending');

-- No update/delete policies for payments: normal users cannot update or delete rows.
-- TODO: add future trusted webhook or service-role payment update path after payment provider selection.
