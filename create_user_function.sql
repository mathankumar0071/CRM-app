-- Enable pgcrypto for password hashing
create extension if not exists pgcrypto;

-- 1. Update the handle_new_user function to also set the role from metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'avatar',
    coalesce(new.raw_user_meta_data->>'role', 'User') -- Use role from metadata or default to 'User'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the RPC function to create users (Admin only)
-- First, drop the old function if it exists to allow parameter renaming
drop function if exists create_user_with_password(text, text, text, text);

-- Now create it with the new parameter names
create or replace function create_user_with_password(
  _email text,
  _password text,
  _name text,
  _role text default 'User'
)
returns uuid
language plpgsql
security definer
as $$
declare
  new_user_id uuid;
  current_user_role text;
begin
  -- Check if the caller is an admin
  select role into current_user_role from public.profiles where id = auth.uid();
  
  if current_user_role != 'Admin' then
    raise exception 'Only admins can create new users';
  end if;

  -- Generate new UUID
  new_user_id := gen_random_uuid();
  
  -- Insert into auth.users
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) values (
    new_user_id,
    '00000000-0000-0000-0000-000000000000', -- Default instance_id
    'authenticated',
    'authenticated',
    _email,
    crypt(_password, gen_salt('bf')), -- Hash password
    now(), -- Auto confirm email
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('name', _name, 'role', _role), -- Pass role to trigger
    now(),
    now()
  );

  return new_user_id;
end;
$$;
