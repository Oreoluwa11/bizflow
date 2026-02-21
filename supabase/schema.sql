-- Create a table for public profiles (optional, but good for user metadata)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  updated_at timestamp with time zone
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create expenses table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  amount numeric not null,
  category text not null, -- 'needs', 'wants', 'savings'
  is_fixed boolean default false,
  is_paid boolean default false,
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table expenses enable row level security;

create policy "Individuals can view their own expenses." on expenses
  for select using (auth.uid() = user_id);

create policy "Individuals can create expenses." on expenses
  for insert with check (auth.uid() = user_id);

create policy "Individuals can update their own expenses." on expenses
  for update using (auth.uid() = user_id);

create policy "Individuals can delete their own expenses." on expenses
  for delete using (auth.uid() = user_id);

-- Create goals table
create table goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table goals enable row level security;

create policy "Individuals can view their own goals." on goals
  for select using (auth.uid() = user_id);

create policy "Individuals can create goals." on goals
  for insert with check (auth.uid() = user_id);

create policy "Individuals can update their own goals." on goals
  for update using (auth.uid() = user_id);

create policy "Individuals can delete their own goals." on goals
  for delete using (auth.uid() = user_id);
