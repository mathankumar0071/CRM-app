-- Fix 500 Error: Infinite Recursion in RLS Policies

-- 1. Create a SECURITY DEFINER function to check admin status without triggering RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'Admin'
  );
$$;

-- 2. Drop the recursive policies
drop policy if exists "Admins can select all profiles" on profiles;
drop policy if exists "Admins can insert profiles" on profiles;
drop policy if exists "Admins can update all profiles" on profiles;
drop policy if exists "Admins can delete all profiles" on profiles;

-- 3. Re-create policies using the safe is_admin() function

create policy "Admins can select all profiles"
on profiles for select
using (
  is_admin()
);

create policy "Admins can insert profiles"
on profiles for insert
with check (
  is_admin()
);

create policy "Admins can update all profiles"
on profiles for update
using (
  is_admin()
);

create policy "Admins can delete all profiles"
on profiles for delete
using (
  is_admin()
);
