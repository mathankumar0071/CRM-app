-- 1. Create profiles for any Auth users that don't have one yet
insert into public.profiles (id, email, name, role, avatar)
select 
  id, 
  email, 
  split_part(email, '@', 1) as name, 
  'User' as role, 
  'https://i.pravatar.cc/150?u=' || email as avatar
from auth.users
where id not in (select id from public.profiles);

-- 2. Update existing profiles that have NULL names (from manual creation)
update public.profiles
set name = split_part(email, '@', 1)
where name is null;
