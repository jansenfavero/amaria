-- Editorial foundation for public articles and a future private CMS.
-- The first collection remains code-first; these tables are ready for a
-- controlled import when the administrative editor is implemented.

create table public.article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  status text not null default 'draft'
    check (status in ('draft', 'active', 'archived')),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.article_categories(id)
    on update cascade on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 10 and 180),
  subtitle text not null default '',
  excerpt text not null default '',
  content jsonb not null default '{"schema_version":1,"sections":[]}'::jsonb,
  hero_image_path text not null default '',
  hero_alt text not null default '',
  author text not null default 'AMAR.IA',
  curators text[] not null default array[]::text[],
  keywords text[] not null default array[]::text[],
  seo_title text not null default '',
  seo_description text not null default '',
  canonical_path text not null default '',
  status text not null default 'draft'
    check (status in (
      'draft',
      'in_review',
      'ready',
      'scheduled',
      'published',
      'archived'
    )),
  featured boolean not null default false,
  reading_minutes smallint check (reading_minutes between 1 and 120),
  word_count integer check (word_count >= 0),
  version integer not null default 1 check (version > 0),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_published_date_required check (
    status <> 'published' or published_at is not null
  ),
  constraint articles_content_is_object check (jsonb_typeof(content) = 'object')
);

create index article_categories_public_idx
  on public.article_categories (status, sort_order, name);
create index articles_category_status_idx
  on public.articles (category_id, status, published_at desc);
create index articles_publication_idx
  on public.articles (published_at desc)
  where status = 'published';
create index articles_keywords_idx
  on public.articles using gin (keywords);

create function private.set_editorial_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.version = old.version + 1;
  return new;
end;
$$;

revoke all on function private.set_editorial_updated_at()
  from public, anon, authenticated;

create function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at()
  from public, anon, authenticated;

create trigger article_categories_set_updated_at
before update on public.article_categories
for each row execute function private.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function private.set_editorial_updated_at();

alter table public.article_categories enable row level security;
alter table public.articles enable row level security;

revoke all on table public.article_categories
  from public, anon, authenticated, service_role;
revoke all on table public.articles
  from public, anon, authenticated, service_role;

grant select on table public.article_categories to anon, authenticated;
grant select on table public.articles to anon, authenticated;
grant select, insert, update, delete on table public.article_categories
  to service_role;
grant select, insert, update, delete on table public.articles
  to service_role;

create policy "Public reads active article categories"
on public.article_categories
for select
to anon, authenticated
using (status = 'active');

create policy "Public reads published articles"
on public.articles
for select
to anon, authenticated
using (
  status = 'published'
  and published_at <= now()
  and exists (
    select 1
    from public.article_categories as category
    where category.id = category_id
      and category.status = 'active'
  )
);

insert into public.article_categories (
  name,
  slug,
  description,
  status,
  sort_order
)
values (
  'Buscando um relacionamento',
  'buscando-um-relacionamento',
  'Clareza, critérios e escolhas mais conscientes para mulheres que desejam construir uma relação séria.',
  'active',
  10
)
on conflict (slug) do nothing;

comment on table public.article_categories is
'Editorial taxonomy. Public roles can read active rows; only trusted server code can write.';
comment on table public.articles is
'CMS-ready editorial records. Public roles can read only published, non-future rows in active categories.';
comment on column public.articles.content is
'Versioned structured JSON content. The web collection remains code-first until the private editor is implemented.';
