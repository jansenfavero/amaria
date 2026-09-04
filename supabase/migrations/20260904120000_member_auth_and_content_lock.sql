-- Migration: Member authentication, content locking at 20%, and engagement tracking
-- This migration adds:
-- 1. Member role management for public registration
-- 2. Content access tracking (20% free preview)
-- 3. Comments system (members only)
-- 4. Analytics tables for dashboard metrics

-- ============================================
-- 1. MEMBER PROFILES TABLE
-- ============================================
create table if not exists public.member_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  bio text not null default '',
  avatar_path text not null default '',
  is_founding_member boolean not null default false,
  founding_number integer unique,
  registered_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index member_profiles_founding_idx on public.member_profiles(is_founding_member);
create index member_profiles_registered_idx on public.member_profiles(registered_at desc);

alter table public.member_profiles enable row level security;
revoke all on table public.member_profiles from public, anon, authenticated;
grant select on table public.member_profiles to anon, authenticated;
grant select, insert, update, delete on table public.member_profiles to service_role;

create policy "Public reads member profiles"
on public.member_profiles for select
to anon, authenticated
using (true);

create policy "Members can update their own profile"
on public.member_profiles for update
to authenticated
using (user_id = auth.uid());

-- ============================================
-- 2. CONTENT ACCESS TRACKING (20% RULE)
-- ============================================
create table if not exists public.article_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  article_slug text not null,
  accessed_at timestamptz not null default now(),
  percentage_read numeric(5,2) not null default 0,
  completed boolean not null default false,
  unique(user_id, article_slug)
);

create index article_access_user_idx on public.article_access(user_id);
create index article_access_article_idx on public.article_access(article_slug);
create index article_access_completed_idx on public.article_access(completed);

alter table public.article_access enable row level security;
revoke all on table public.article_access from public, anon, authenticated;
grant select, insert, update on table public.article_access to authenticated;
grant select, insert, update, delete on table public.article_access to service_role;

create policy "Users can read their own access"
on public.article_access for select
to authenticated
using (user_id = auth.uid());

create policy "Users can track their own access"
on public.article_access for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own access"
on public.article_access for update
to authenticated
using (user_id = auth.uid());

-- ============================================
-- 3. COMMENTS SYSTEM (MEMBERS ONLY)
-- ============================================
create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_comment_id uuid references public.article_comments(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  is_edited boolean not null default false,
  likes_count integer not null default 0 check (likes_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index article_comments_article_idx on public.article_comments(article_id);
create index article_comments_user_idx on public.article_comments(user_id);
create index article_comments_parent_idx on public.article_comments(parent_comment_id);
create index article_comments_created_idx on public.article_comments(created_at desc);

alter table public.article_comments enable row level security;
revoke all on table public.article_comments from public, anon, authenticated;
grant select on table public.article_comments to anon, authenticated;
grant insert, update, delete on table public.article_comments to authenticated;
grant select, insert, update, delete on table public.article_comments to service_role;

create policy "Public reads comments"
on public.article_comments for select
to anon, authenticated
using (true);

create policy "Members can create comments"
on public.article_comments for insert
to authenticated
with check (
  user_id = auth.uid() 
  and exists (select 1 from public.member_profiles where user_id = auth.uid())
);

create policy "Users can update their own comments"
on public.article_comments for update
to authenticated
using (user_id = auth.uid());

create policy "Users can delete their own comments"
on public.article_comments for delete
to authenticated
using (user_id = auth.uid());

-- ============================================
-- 4. COMMENT LIKES
-- ============================================
create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.article_comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(comment_id, user_id)
);

create index comment_likes_comment_idx on public.comment_likes(comment_id);
create index comment_likes_user_idx on public.comment_likes(user_id);

alter table public.comment_likes enable row level security;
revoke all on table public.comment_likes from public, anon, authenticated;
grant select, insert, delete on table public.comment_likes to authenticated;
grant select, insert, delete on table public.comment_likes to service_role;

create policy "Public reads comment likes"
on public.comment_likes for select
to anon, authenticated
using (true);

create policy "Members can like comments"
on public.comment_likes for insert
to authenticated
with check (user_id = auth.uid());

create policy "Members can unlike comments"
on public.comment_likes for delete
to authenticated
using (user_id = auth.uid());

-- ============================================
-- 5. ARTICLE LIKES (FREE FOR ALL)
-- ============================================
create table if not exists public.article_likes (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  created_at timestamptz not null default now(),
  unique(article_id, user_id),
  unique(article_id, session_id)
);

create index article_likes_article_idx on public.article_likes(article_id);
create index article_likes_user_idx on public.article_likes(user_id);

alter table public.article_likes enable row level security;
revoke all on table public.article_likes from public, anon, authenticated;
grant select, insert, delete on table public.article_likes to anon, authenticated;
grant select, insert, update, delete on table public.article_likes to service_role;

create policy "Public reads article likes"
on public.article_likes for select
to anon, authenticated
using (true);

create policy "Anyone can like articles"
on public.article_likes for insert
to anon, authenticated
with check (true);

create policy "Users can unlike articles"
on public.article_likes for delete
to anon, authenticated
using (user_id = auth.uid() or session_id IS NOT NULL);

-- ============================================
-- 6. PAGE VIEWS & ANALYTICS
-- ============================================
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  article_slug text,
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  viewed_at timestamptz not null default now(),
  duration_seconds integer default 0,
  device_type text check (device_type in ('desktop', 'mobile', 'tablet')),
  referrer text
);

create index page_views_path_idx on public.page_views(page_path);
create index page_views_article_idx on public.page_views(article_slug);
create index page_views_time_idx on public.page_views(viewed_at desc);
create index page_views_session_idx on public.page_views(session_id);

alter table public.page_views enable row level security;
revoke all on table public.page_views from public, anon, authenticated;
grant insert on table public.page_views to anon, authenticated;
grant select, insert, update, delete on table public.page_views to service_role;

create policy "Anyone can record page views"
on public.page_views for insert
to anon, authenticated
with check (true);

-- ============================================
-- 7. DASHBOARD METRICS VIEW
-- ============================================
create or replace view public.dashboard_metrics as
select 
  -- Total members
  (select count(*) from public.member_profiles) as total_members,
  -- Founding members count
  (select count(*) from public.member_profiles where is_founding_member = true) as founding_members_count,
  -- New members this month
  (select count(*) from public.member_profiles where registered_at >= date_trunc('month', now())) as new_members_this_month,
  -- Total articles published
  (select count(*) from public.articles where status = 'published') as total_articles,
  -- Total page views
  (select count(*) from public.page_views) as total_page_views,
  -- Page views this month
  (select count(*) from public.page_views where viewed_at >= date_trunc('month', now())) as page_views_this_month,
  -- Total article likes
  (select count(*) from public.article_likes) as total_article_likes,
  -- Total comments
  (select count(*) from public.article_comments) as total_comments,
  -- Comments this month
  (select count(*) from public.article_comments where created_at >= date_trunc('month', now())) as comments_this_month,
  -- Articles with full reads (>80%)
  (select count(distinct article_slug) from public.article_access where percentage_read >= 80) as articles_with_full_reads;

grant select on public.dashboard_metrics to authenticated;

-- ============================================
-- 8. TRIGGER FOR AUTO-INCREMENTING FOUNDING MEMBER NUMBER
-- ============================================
create or replace function private.assign_founding_member_number()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  next_number integer;
begin
  if new.is_founding_member = true and new.founding_number is null then
    select coalesce(max(founding_number), 0) + 1 into next_number
    from public.member_profiles
    where is_founding_member = true;
    new.founding_number := next_number;
  end if;
  return new;
end;
$$;

revoke all on function private.assign_founding_member_number() from public, anon, authenticated;

create trigger member_profiles_assign_founding_number
before insert on public.member_profiles
for each row execute function private.assign_founding_member_number();

-- ============================================
-- 9. TRIGGER FOR UPDATING COMMENT LIKES COUNT
-- ============================================
create or replace function private.update_comment_likes_count()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.article_comments set likes_count = likes_count + 1 where id = new.comment_id;
  elsif tg_op = 'DELETE' then
    update public.article_comments set likes_count = greatest(0, likes_count - 1) where id = old.comment_id;
  end if;
  return null;
end;
$$;

revoke all on function private.update_comment_likes_count() from public, anon, authenticated;

create trigger comment_likes_update_count
after insert or delete on public.comment_likes
for each row execute function private.update_comment_likes_count();

-- ============================================
-- 10. ADMIN USER SEED (contato@jansenfavero.com)
-- ============================================
-- Note: This will be handled by the admin setup script
-- The admin user should be created via Supabase Auth UI or CLI
-- Then add to account_access table with role 'admin'

comment on table public.member_profiles is 'Public member profiles with founding member tracking';
comment on table public.article_access is 'Tracks reading progress for 20% content lock rule';
comment on table public.article_comments is 'Comments system - members only';
comment on table public.comment_likes is 'Likes on comments';
comment on table public.article_likes is 'Likes on articles - free for everyone';
comment on table public.page_views is 'Page view analytics for dashboard';
comment on view public.dashboard_metrics is 'Aggregated metrics for admin dashboard';
