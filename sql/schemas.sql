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


--------------------------------------------------------
-- enable uuid generator (pgcrypto) if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- index for faster recent queries
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages (created_at DESC);


ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
ON public.messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);



--------------------------------------------------------