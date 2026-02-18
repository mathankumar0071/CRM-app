-- Enable RLS on profiles if not already enabled
alter table profiles enable row level security;

-- Allow Admins to select all profiles (viewable by everyone is already there, but ensuring admin access)
create policy "Admins can select all profiles"
on profiles for select
using (
  auth.uid() in (
    select id from profiles where role = 'Admin'
  )
);

-- Allow Admins to insert new profiles
create policy "Admins can insert profiles"
on profiles for insert
with check (
  auth.uid() in (
    select id from profiles where role = 'Admin'
  )
);

-- Allow Admins to update any profile
create policy "Admins can update all profiles"
on profiles for update
using (
  auth.uid() in (
    select id from profiles where role = 'Admin'
  )
);

-- Allow Admins to delete any profile
create policy "Admins can delete all profiles"
on profiles for delete
using (
  auth.uid() in (
    select id from profiles where role = 'Admin'
  )
);
