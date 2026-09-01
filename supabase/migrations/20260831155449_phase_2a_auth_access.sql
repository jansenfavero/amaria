-- Phase 2A: invite-only team access. Does not provision any Auth user.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

-- A revoked session must not retain access for the remaining JWT lifetime.
-- SECURITY DEFINER is confined to a non-exposed schema, with no caller inputs.
create function private.has_current_session()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from auth.sessions as session
    where session.user_id = (select auth.uid())
      and session.id::text = (select auth.jwt() ->> 'session_id')
      and (session.not_after is null or session.not_after > now())
  );
$$;
revoke all on function private.has_current_session() from public, anon, authenticated;
grant execute on function private.has_current_session() to authenticated;

-- Data API exposes only a boolean about the caller's own session.
create function public.current_session_is_active()
returns boolean
language sql stable security invoker
set search_path = ''
as $$ select private.has_current_session(); $$;
revoke all on function public.current_session_is_active() from public, anon, authenticated;
grant execute on function public.current_session_is_active() to authenticated;

create table public.account_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'curator', 'member')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.account_access enable row level security;
revoke all on table public.account_access from public, anon, authenticated;
grant select on table public.account_access to authenticated;
create policy "Accounts read only their own access"
on public.account_access for select to authenticated
using (
  user_id = (select auth.uid())
  and (select private.has_current_session())
);
comment on table public.account_access is
'Server-managed roles. No client, including an admin, can insert, edit or delete access grants.';

create table public.privacy_acknowledgements (
  user_id uuid not null references auth.users(id) on delete cascade,
  notice_version text not null check (char_length(notice_version) between 1 and 80),
  accepted_at timestamptz not null default now(),
  primary key (user_id, notice_version)
);
alter table public.privacy_acknowledgements enable row level security;
revoke all on table public.privacy_acknowledgements from public, anon, authenticated;
grant select on table public.privacy_acknowledgements to authenticated;
grant insert (user_id, notice_version) on public.privacy_acknowledgements to authenticated;
create policy "Accounts read only their own acknowledgements"
on public.privacy_acknowledgements for select to authenticated
using (
  user_id = (select auth.uid())
  and (select private.has_current_session())
);
create policy "Accounts acknowledge only for themselves"
on public.privacy_acknowledgements for insert to authenticated
with check (
  user_id = (select auth.uid())
  and (select private.has_current_session())
);
comment on table public.privacy_acknowledgements is
'Versioned acknowledgement of the internal team privacy notice, not marketing consent. Timestamp is server-owned.';
