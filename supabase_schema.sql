-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users not null,
  email text,
  name text,
  role text default 'User',
  phone text,
  avatar text,
  updated_at timestamp with time zone,
  primary key (id),
  constraint username_length check (char_length(name) >= 3)
);

alter table profiles enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Public profiles are viewable by everyone.') then
    create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can insert their own profile.') then
    create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Users can update own profile.') then
    create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );
  end if;
end $$;

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup (Drop first to avoid error)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create leads table
create table if not exists leads (
  id uuid default uuid_generate_v4() primary key,
  name text,
  email text,
  phone text,
  source text,
  status text default 'New',
  assigned_to uuid references profiles(id),
  purpose text,
  notes text,
  last_contacted timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table leads enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'Leads are viewable by everyone.') then
    create policy "Leads are viewable by everyone." on leads for select using ( true );
  end if;
  
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'Authenticated users can insert leads.') then
    create policy "Authenticated users can insert leads." on leads for insert with check ( auth.role() = 'authenticated' );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'Authenticated users can update leads.') then
    create policy "Authenticated users can update leads." on leads for update using ( auth.role() = 'authenticated' );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'leads' and policyname = 'Authenticated users can delete leads.') then
    create policy "Authenticated users can delete leads." on leads for delete using ( auth.role() = 'authenticated' );
  end if;
end $$;

-- Create tasks table
create table if not exists tasks (
  id uuid default uuid_generate_v4() primary key,
  title text,
  lead_id uuid references leads(id),
  assigned_to uuid references profiles(id),
  due_date date,
  priority text,
  status text default 'Pending',
  created_at timestamp with time zone default now()
);

alter table tasks enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'tasks' and policyname = 'Tasks are viewable by everyone.') then
    create policy "Tasks are viewable by everyone." on tasks for select using ( true );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'tasks' and policyname = 'Authenticated users can insert tasks.') then
    create policy "Authenticated users can insert tasks." on tasks for insert with check ( auth.role() = 'authenticated' );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'tasks' and policyname = 'Authenticated users can update tasks.') then
      create policy "Authenticated users can update tasks." on tasks for update using ( auth.role() = 'authenticated' );
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'tasks' and policyname = 'Authenticated users can delete tasks.') then
      create policy "Authenticated users can delete tasks." on tasks for delete using ( auth.role() = 'authenticated' );
  end if;
end $$;


-- Create activities table
create table if not exists activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  action text,
  timestamp timestamp with time zone default now()
);

alter table activities enable row level security;

do $$
begin
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'activities' and policyname = 'Activities are viewable by everyone.') then
        create policy "Activities are viewable by everyone." on activities for select using ( true );
    end if;

    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'activities' and policyname = 'Authenticated users can insert activities.') then
        create policy "Authenticated users can insert activities." on activities for insert with check ( auth.role() = 'authenticated' );
    end if;
end $$;
