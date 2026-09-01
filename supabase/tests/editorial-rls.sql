begin;

do $$
begin
  if exists (
    select 1
    from information_schema.role_table_grants
    where table_schema = 'public'
      and table_name in ('article_categories', 'articles')
      and grantee in ('anon', 'authenticated')
      and privilege_type <> 'SELECT'
  ) then
    raise exception 'Public editorial roles must be read-only';
  end if;

  if not exists (
    select 1
    from pg_class as relation
    join pg_namespace as namespace on namespace.oid = relation.relnamespace
    where namespace.nspname = 'public'
      and relation.relname = 'articles'
      and relation.relrowsecurity
  ) then
    raise exception 'RLS must be enabled on public.articles';
  end if;
end;
$$;

rollback;
