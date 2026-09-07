-- Member platform, editorial CMS, comments and privacy-safe first-party analytics.
-- AMARIA phase 2B.

create table public.member_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique check (char_length(email) between 5 and 254),
  display_name text not null default '' check (char_length(display_name) <= 80),
  avatar_url text not null default '' check (char_length(avatar_url) <= 500),
  founder_number smallint unique check (founder_number between 1 and 100),
  privacy_notice_version text not null check (char_length(privacy_notice_version) between 1 and 80),
  privacy_accepted_at timestamptz not null default now(),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table private.member_founder_counter (
  singleton boolean primary key default true check (singleton),
  last_number smallint not null default 0 check (last_number between 0 and 100)
);
insert into private.member_founder_counter (singleton, last_number)
values (true, 0)
on conflict (singleton) do nothing;
revoke all on table private.member_founder_counter from public, anon, authenticated;

create function private.is_current_member()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select (select private.has_current_session()) and exists (
    select 1
    from public.account_access as access
    where access.user_id = (select auth.uid())
      and access.active
      and access.role in ('member', 'curator', 'admin')
  );
$$;
revoke all on function private.is_current_member() from public, anon, authenticated;
grant execute on function private.is_current_member() to authenticated;

create function private.is_current_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select (select private.has_current_session()) and exists (
    select 1
    from public.account_access as access
    where access.user_id = (select auth.uid())
      and access.active
      and access.role = 'admin'
  );
$$;
revoke all on function private.is_current_admin() from public, anon, authenticated;
grant execute on function private.is_current_admin() to authenticated;

create function private.handle_new_amaria_user()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
declare
  safe_name text;
  notice_version text;
  assigned_role text;
begin
  safe_name := left(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 80);
  notice_version := left(trim(coalesce(new.raw_user_meta_data ->> 'privacy_notice_version', 'membros-2026-09-03')), 80);
  if notice_version = '' then
    notice_version := 'membros-2026-09-03';
  end if;

  assigned_role := case
    when lower(coalesce(new.email, '')) = 'contato@jansenfavero.com' then 'admin'
    else 'member'
  end;

  insert into public.member_profiles (
    id,
    email,
    display_name,
    founder_number,
    privacy_notice_version,
    marketing_opt_in
  ) values (
    new.id,
    lower(coalesce(new.email, '')),
    safe_name,
    null,
    notice_version,
    lower(coalesce(new.raw_user_meta_data ->> 'marketing_opt_in', 'false'))
      in ('true', '1', 'yes')
  ) on conflict (id) do nothing;

  insert into public.account_access (user_id, role, active)
  values (new.id, assigned_role, true)
  on conflict (user_id) do update
  set role = case
    when lower(coalesce(new.email, '')) = 'contato@jansenfavero.com' then 'admin'
    else public.account_access.role
  end,
  active = true;

  return new;
end;
$$;
revoke all on function private.handle_new_amaria_user() from public, anon, authenticated;

create trigger on_auth_user_created_create_amaria_profile
after insert on auth.users
for each row execute function private.handle_new_amaria_user();

create function public.claim_member_founder_number()
returns smallint
language plpgsql security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  assigned_number smallint;
begin
  if current_user_id is null
    or not exists (
      select 1 from auth.users
      where id = current_user_id and email_confirmed_at is not null
    )
    or exists (
      select 1 from public.account_access
      where user_id = current_user_id and role <> 'member'
    ) then
    return null;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(current_user_id::text, 0)
  );

  select founder_number into assigned_number
  from public.member_profiles
  where id = current_user_id;
  if assigned_number is not null then
    return assigned_number;
  end if;

  update private.member_founder_counter
  set last_number = last_number + 1
  where singleton and last_number < 100
  returning last_number into assigned_number;

  if assigned_number is not null then
    update public.member_profiles
    set founder_number = assigned_number
    where id = current_user_id and founder_number is null;
  end if;
  return assigned_number;
end;
$$;
revoke all on function public.claim_member_founder_number() from public, anon, authenticated;
grant execute on function public.claim_member_founder_number() to authenticated;

-- Backfill invited accounts, if any, without trusting user-editable metadata for roles.
do $$
declare
  existing_user record;
begin
  for existing_user in select * from auth.users loop
    insert into public.member_profiles (
      id, email, display_name, founder_number, privacy_notice_version, marketing_opt_in
    )
    values (
      existing_user.id,
      lower(coalesce(existing_user.email, '')),
      left(trim(coalesce(existing_user.raw_user_meta_data ->> 'display_name', '')), 80),
      null,
      'membros-2026-09-03',
      false
    ) on conflict (id) do nothing;

    insert into public.account_access (user_id, role, active)
    values (
      existing_user.id,
      case when lower(coalesce(existing_user.email, '')) = 'contato@jansenfavero.com'
        then 'admin' else 'member' end,
      true
    )
    on conflict (user_id) do update
    set role = case
      when lower(coalesce(existing_user.email, '')) = 'contato@jansenfavero.com'
        then 'admin' else public.account_access.role end;
  end loop;
end;
$$;

create trigger member_profiles_set_updated_at
before update on public.member_profiles
for each row execute function private.set_updated_at();

alter table public.member_profiles enable row level security;
revoke all on table public.member_profiles from public, anon, authenticated;
grant select on table public.member_profiles to authenticated;
grant update (display_name, avatar_url, marketing_opt_in) on table public.member_profiles to authenticated;

create policy "Members read their own profile"
on public.member_profiles for select to authenticated
using (id = (select auth.uid()) and (select private.is_current_member()));

create policy "Admins read member profiles"
on public.member_profiles for select to authenticated
using ((select private.is_current_admin()));

create policy "Members update their own editable profile"
on public.member_profiles for update to authenticated
using (id = (select auth.uid()) and (select private.is_current_member()))
with check (id = (select auth.uid()) and (select private.is_current_member()));

-- A public preview never exposes the complete body through the anonymous Data API.
alter table public.articles
  add column preview_content jsonb not null default '{"schema_version":1,"sections":[]}'::jsonb,
  add column video_url text not null default '',
  add column audio_url text not null default '',
  add column audio_duration_seconds integer check (audio_duration_seconds is null or audio_duration_seconds between 1 and 43200),
  add column updated_by uuid references auth.users(id) on delete set null,
  add constraint articles_preview_content_is_object check (jsonb_typeof(preview_content) = 'object');
create index articles_updated_by_idx on public.articles (updated_by)
where updated_by is not null;

drop policy if exists "Public reads published articles" on public.articles;
revoke all on table public.articles from anon, authenticated;
grant select (
  id, category_id, slug, title, subtitle, excerpt, preview_content,
  hero_image_path, hero_alt, author, curators, keywords, seo_title,
  seo_description, canonical_path, status, featured, reading_minutes,
  word_count, published_at, created_at, updated_at, video_url,
  audio_url, audio_duration_seconds
) on table public.articles to anon;
grant select on table public.articles to authenticated;
grant insert, update, delete on table public.articles to authenticated;

create policy "Visitors read published article previews"
on public.articles for select to anon
using (
  status = 'published'
  and published_at <= now()
  and exists (
    select 1 from public.article_categories as category
    where category.id = category_id and category.status = 'active'
  )
);

create policy "Members read complete published articles"
on public.articles for select to authenticated
using (
  (
    status = 'published'
    and published_at <= now()
    and exists (
      select 1 from public.article_categories as category
      where category.id = category_id and category.status = 'active'
    )
    and (select private.is_current_member())
  )
  or (select private.is_current_admin())
);

create policy "Admins insert articles"
on public.articles for insert to authenticated
with check ((select private.is_current_admin()) and updated_by = (select auth.uid()));
create policy "Admins update articles"
on public.articles for update to authenticated
using ((select private.is_current_admin()))
with check ((select private.is_current_admin()) and updated_by = (select auth.uid()));
create policy "Admins delete articles"
on public.articles for delete to authenticated
using ((select private.is_current_admin()));

grant insert, update, delete on table public.article_categories to authenticated;
create policy "Admins read all article categories"
on public.article_categories for select to authenticated
using ((select private.is_current_admin()));
create policy "Admins insert article categories"
on public.article_categories for insert to authenticated
with check ((select private.is_current_admin()));
create policy "Admins update article categories"
on public.article_categories for update to authenticated
using ((select private.is_current_admin()))
with check ((select private.is_current_admin()));
create policy "Admins delete article categories"
on public.article_categories for delete to authenticated
using ((select private.is_current_admin()));

insert into public.article_categories (name, slug, description, status, sort_order)
values (
  'Estou me perdendo nessa relação',
  'estou-me-perdendo-nessa-relacao',
  'Sinais, limites, segurança e reconexão consigo para relações que pedem um olhar mais atento.',
  'active',
  20
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  status = 'active';

create table public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null check (article_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.article_comments(id) on delete cascade,
  author_name text not null default 'Membro AMARIA' check (char_length(author_name) between 1 and 80),
  body text not null check (char_length(trim(body)) between 3 and 2000),
  status text not null default 'published' check (status in ('published', 'hidden', 'pending')), 
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index article_comments_public_idx on public.article_comments (article_slug, created_at desc) where status = 'published';
create index article_comments_user_idx on public.article_comments (user_id, created_at desc);
create index article_comments_parent_idx on public.article_comments (parent_id)
where parent_id is not null;
create function private.set_comment_author_name()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  select coalesce(
    nullif(trim(profile.display_name), ''),
    split_part(profile.email, '@', 1),
    'Membro AMARIA'
  ) into new.author_name
  from public.member_profiles as profile
  where profile.id = new.user_id;
  new.author_name := left(coalesce(new.author_name, 'Membro AMARIA'), 80);
  return new;
end;
$$;
revoke all on function private.set_comment_author_name() from public, anon, authenticated;
create trigger article_comments_set_author_name
before insert on public.article_comments
for each row execute function private.set_comment_author_name();
create trigger article_comments_set_updated_at
before update on public.article_comments
for each row execute function private.set_updated_at();
alter table public.article_comments enable row level security;
revoke all on table public.article_comments from public, anon, authenticated;
grant select on table public.article_comments to anon, authenticated;
grant insert (article_slug, user_id, parent_id, body) on table public.article_comments to authenticated;
grant update (body) on table public.article_comments to authenticated;
grant delete on table public.article_comments to authenticated;

create policy "Everyone reads published comments"
on public.article_comments for select to anon, authenticated
using (status = 'published');
create policy "Admins read all comments"
on public.article_comments for select to authenticated
using ((select private.is_current_admin()));
create policy "Members create their own comments"
on public.article_comments for insert to authenticated
with check (user_id = (select auth.uid()) and (select private.is_current_member()));
create policy "Members edit their own comments"
on public.article_comments for update to authenticated
using (user_id = (select auth.uid()) and status = 'published' and (select private.is_current_member()))
with check (user_id = (select auth.uid()) and status = 'published' and (select private.is_current_member()));
create policy "Members delete their own comments"
on public.article_comments for delete to authenticated
using ((user_id = (select auth.uid()) and (select private.is_current_member())) or (select private.is_current_admin()));

create function public.admin_moderate_comment(p_comment_id uuid, p_status text)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if not (select private.is_current_admin()) or p_status not in ('published', 'hidden', 'pending') then
    raise insufficient_privilege using message = 'admin access required';
  end if;
  update public.article_comments set status = p_status where id = p_comment_id;
end;
$$;
revoke all on function public.admin_moderate_comment(uuid, text) from public, anon, authenticated;
grant execute on function public.admin_moderate_comment(uuid, text) to authenticated;

create table public.content_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null check (event_name in ('page_view', 'article_view', 'article_share', 'comment_created', 'member_signup')),
  event_path text not null check (event_path ~ '^/[a-zA-Z0-9/_?.=&%-]*$' and char_length(event_path) <= 500),
  article_slug text check (article_slug is null or article_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  event_day date not null default ((now() at time zone 'UTC')::date),
  created_at timestamptz not null default now(),
  unique (visitor_id, event_name, event_path, event_day)
);
create index content_events_time_idx on public.content_events (created_at desc);
create index content_events_article_idx on public.content_events (article_slug, event_name, created_at desc);
create index content_events_user_idx on public.content_events (user_id)
where user_id is not null;
alter table public.content_events enable row level security;
revoke all on table public.content_events from public, anon, authenticated;
grant select on table public.content_events to authenticated;
create policy "Admins read content events"
on public.content_events for select to authenticated
using ((select private.is_current_admin()));

create table public.article_reactions (
  visitor_id uuid not null,
  article_slug text not null check (article_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (visitor_id, article_slug)
);
create index article_reactions_slug_idx on public.article_reactions (article_slug);
create index article_reactions_user_idx on public.article_reactions (user_id)
where user_id is not null;
alter table public.article_reactions enable row level security;
revoke all on table public.article_reactions from public, anon, authenticated;
grant select on table public.article_reactions to authenticated;
create policy "Admins read article reactions"
on public.article_reactions for select to authenticated
using ((select private.is_current_admin()));

create function public.record_content_event(
  p_visitor_id uuid,
  p_event_name text,
  p_event_path text,
  p_article_slug text default null
)
returns void
language plpgsql security definer
set search_path = ''
as $$
begin
  if p_event_name not in ('page_view', 'article_view', 'article_share')
    or p_event_path !~ '^/[a-zA-Z0-9/_?.=&%-]*$'
    or char_length(p_event_path) > 500
    or (p_article_slug is not null and p_article_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$') then
    raise exception 'invalid event';
  end if;

  insert into public.content_events (
    visitor_id, user_id, event_name, event_path, article_slug
  ) values (
    p_visitor_id, (select auth.uid()), p_event_name, p_event_path, p_article_slug
  ) on conflict (visitor_id, event_name, event_path, event_day) do nothing;
end;
$$;
revoke all on function public.record_content_event(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.record_content_event(uuid, text, text, text) to anon, authenticated;

create function public.toggle_article_like(p_visitor_id uuid, p_article_slug text)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  now_liked boolean;
  total_count bigint;
begin
  if p_article_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'invalid article slug';
  end if;

  delete from public.article_reactions
  where visitor_id = p_visitor_id and article_slug = p_article_slug;
  if found then
    now_liked := false;
  else
    insert into public.article_reactions (visitor_id, article_slug, user_id)
    values (p_visitor_id, p_article_slug, (select auth.uid()));
    now_liked := true;
  end if;

  select count(*) into total_count
  from public.article_reactions
  where article_slug = p_article_slug;
  return jsonb_build_object('liked', now_liked, 'count', total_count);
end;
$$;
revoke all on function public.toggle_article_like(uuid, text) from public, anon, authenticated;
grant execute on function public.toggle_article_like(uuid, text) to anon, authenticated;

create function public.get_article_like_state(p_visitor_id uuid, p_article_slug text)
returns jsonb
language sql stable security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'liked', exists (
      select 1 from public.article_reactions
      where visitor_id = p_visitor_id and article_slug = p_article_slug
    ),
    'count', (
      select count(*) from public.article_reactions where article_slug = p_article_slug
    )
  );
$$;
revoke all on function public.get_article_like_state(uuid, text) from public, anon, authenticated;
grant execute on function public.get_article_like_state(uuid, text) to anon, authenticated;

create function public.admin_dashboard_metrics()
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $$
declare
  payload jsonb;
begin
  if not (select private.is_current_admin()) then
    raise insufficient_privilege using message = 'admin access required';
  end if;

  select jsonb_build_object(
    'site_views', (select count(*) from public.content_events where event_name = 'page_view'),
    'article_views', (select count(*) from public.content_events where event_name = 'article_view'),
    'members', (
      select count(*) from public.account_access where role = 'member' and active
    ),
    'new_members_30d', (
      select count(*) from public.account_access
      where role = 'member' and active and created_at >= now() - interval '30 days'
    ),
    'founder_members', (select count(*) from public.member_profiles where founder_number is not null),
    'likes', (select count(*) from public.article_reactions),
    'shares', (select count(*) from public.content_events where event_name = 'article_share'),
    'comments', (select count(*) from public.article_comments where status = 'published'),
    'top_articles', coalesce((
      select jsonb_agg(row_to_json(item) order by item.views desc)
      from (
        select article_slug as slug, count(*) as views
        from public.content_events
        where event_name = 'article_view' and article_slug is not null
        group by article_slug
        order by count(*) desc
        limit 8
      ) item
    ), '[]'::jsonb),
    'daily_views', coalesce((
      select jsonb_agg(row_to_json(day_item) order by day_item.day)
      from (
        select event_day as day, count(*) as views
        from public.content_events
        where event_name in ('page_view', 'article_view')
          and event_day >= (now() at time zone 'UTC')::date - 13
        group by event_day
        order by event_day
      ) day_item
    ), '[]'::jsonb)
  ) into payload;
  return payload;
end;
$$;
revoke all on function public.admin_dashboard_metrics() from public, anon, authenticated;
grant execute on function public.admin_dashboard_metrics() to authenticated;

create function public.delete_my_account(p_confirmation text)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null or p_confirmation <> 'EXCLUIR MINHA CONTA' then
    raise exception 'invalid account deletion request';
  end if;
  delete from auth.users where id = current_user_id;
end;
$$;
revoke all on function public.delete_my_account(text) from public, anon, authenticated;
grant execute on function public.delete_my_account(text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'editorial-media',
  'editorial-media',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif',
    'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg',
    'video/mp4', 'video/webm'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins upload editorial media"
on storage.objects for insert to authenticated
with check (bucket_id = 'editorial-media' and (select private.is_current_admin()));
create policy "Admins update editorial media"
on storage.objects for update to authenticated
using (bucket_id = 'editorial-media' and (select private.is_current_admin()))
with check (bucket_id = 'editorial-media' and (select private.is_current_admin()));
create policy "Admins delete editorial media"
on storage.objects for delete to authenticated
using (bucket_id = 'editorial-media' and (select private.is_current_admin()));

comment on table public.member_profiles is
'Private member directory. Members see only their own profile; administrators see the directory.';
comment on table public.content_events is
'First-party, cookieless-style aggregate events identified by a random first-party UUID; no IP or user agent is stored.';
comment on table public.article_comments is
'Member-only article discussion. Public readers see only comments with published status.';
