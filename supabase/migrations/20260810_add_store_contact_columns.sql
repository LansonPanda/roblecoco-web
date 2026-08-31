alter table if exists public.stores
add column if not exists phone varchar(20),
add column if not exists email varchar(255);