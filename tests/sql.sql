create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text not null default 'user',
  created_at timestamptz default now()
);


create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer
set search_path = public;




drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();



alter table properties enable row level security;



create policy "Public read published properties"
on properties
for select
using (published = true);



create policy "Admin insert"
on properties
for insert
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin update"
on properties
for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin delete"
on properties
for delete
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);






-- Tour Requests Table
create table if not exists tour_requests (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references properties(id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  message text,
  created_at timestamptz default now()
);

alter table tour_requests enable row level security;

create policy "Anyone can insert tour requests"
on tour_requests
for insert
with check (true);

create policy "Admin read tour requests"
on tour_requests
for select