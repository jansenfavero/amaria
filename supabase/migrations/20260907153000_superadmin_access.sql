-- Explicit owner-level access for the AMARIA platform administrator.
alter table public.account_access drop constraint if exists account_access_role_check;
alter table public.account_access add constraint account_access_role_check
  check (role in ('superadmin', 'admin', 'curator', 'member'));

create or replace function private.is_current_member()
returns boolean language sql stable security definer set search_path = '' as $$
  select (select private.has_current_session()) and exists (
    select 1 from public.account_access as access
    where access.user_id = (select auth.uid()) and access.active
      and access.role in ('member', 'curator', 'admin', 'superadmin')
  );
$$;

create or replace function private.is_current_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select (select private.has_current_session()) and exists (
    select 1 from public.account_access as access
    where access.user_id = (select auth.uid()) and access.active
      and access.role in ('admin', 'superadmin')
  );
$$;

create or replace function private.handle_new_amaria_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  safe_name text;
  notice_version text;
  assigned_role text;
begin
  safe_name := left(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 80);
  notice_version := left(trim(coalesce(new.raw_user_meta_data ->> 'privacy_notice_version', 'membros-2026-09-03')), 80);
  if notice_version = '' then notice_version := 'membros-2026-09-03'; end if;
  assigned_role := case
    when lower(coalesce(new.email, '')) = 'contato@jansenfavero.com' then 'superadmin'
    else 'member'
  end;

  insert into public.member_profiles (
    id, email, display_name, founder_number, privacy_notice_version, marketing_opt_in
  ) values (
    new.id, lower(coalesce(new.email, '')), safe_name, null, notice_version,
    lower(coalesce(new.raw_user_meta_data ->> 'marketing_opt_in', 'false')) in ('true', '1', 'yes')
  ) on conflict (id) do update set
    email = excluded.email,
    display_name = case when public.member_profiles.display_name = '' then excluded.display_name else public.member_profiles.display_name end;

  insert into public.account_access (user_id, role, active)
  values (new.id, assigned_role, true)
  on conflict (user_id) do update set
    role = case
      when lower(coalesce(new.email, '')) = 'contato@jansenfavero.com' then 'superadmin'
      else public.account_access.role
    end,
    active = true;
  return new;
end;
$$;

update public.account_access as access
set role = 'superadmin', active = true
from auth.users as users
where access.user_id = users.id and lower(users.email) = 'contato@jansenfavero.com';

revoke all on function private.is_current_member() from public, anon, authenticated;
grant execute on function private.is_current_member() to authenticated;
revoke all on function private.is_current_admin() from public, anon, authenticated;
grant execute on function private.is_current_admin() to authenticated;
revoke all on function private.handle_new_amaria_user() from public, anon, authenticated;
