drop policy if exists "Public read active products" on public.products;
drop policy if exists "Public reads active products" on public.products;
drop policy if exists "Public read products" on public.products;
drop policy if exists "Public read all products" on public.products;

create policy "Public read all products" on public.products
for select to anon, authenticated
using (true);
