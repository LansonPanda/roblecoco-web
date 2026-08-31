alter table if exists public.stores
add column if not exists status varchar(20) not null default 'pending';

update public.stores
set status = case
	when lower(status) = 'active' then 'approved'
	when lower(status) = 'approved' then 'approved'
	when lower(status) = 'pending' then 'pending'
	else 'pending'
end;

alter table if exists public.stores
alter column status set default 'pending';
