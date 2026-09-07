-- Keep each authenticated SELECT path in a single permissive policy.
-- This preserves the same access model while avoiding repeated policy work.

drop policy if exists "Members read their own profile" on public.member_profiles;
drop policy if exists "Admins read member profiles" on public.member_profiles;
create policy "Members read own profile or admins read directory"
on public.member_profiles for select to authenticated
using (
  (id = (select auth.uid()) and (select private.is_current_member()))
  or (select private.is_current_admin())
);

drop policy if exists "Public reads active article categories" on public.article_categories;
drop policy if exists "Admins read all article categories" on public.article_categories;
create policy "Visitors read active article categories"
on public.article_categories for select to anon
using (status = 'active');
create policy "Members read active categories or admins read all"
on public.article_categories for select to authenticated
using (status = 'active' or (select private.is_current_admin()));

drop policy if exists "Everyone reads published comments" on public.article_comments;
drop policy if exists "Admins read all comments" on public.article_comments;
create policy "Visitors read published comments"
on public.article_comments for select to anon
using (status = 'published');
create policy "Members read published comments or admins read all"
on public.article_comments for select to authenticated
using (status = 'published' or (select private.is_current_admin()));
