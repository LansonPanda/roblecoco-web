insert into storage.buckets (id, name, public)
values ('store-logos', 'store-logos', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload store logos" on storage.objects;

create policy "Authenticated users can upload store logos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'store-logos');
