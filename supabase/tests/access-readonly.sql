-- Read-only checks: no users, sessions or account records are created.
select
  c.relname,
  c.relrowsecurity as rls_enabled,
  has_table_privilege('anon', c.oid, 'SELECT') as anon_select,
  has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_select,
  has_table_privilege('authenticated', c.oid, 'UPDATE') as authenticated_update,
  has_table_privilege('authenticated', c.oid, 'DELETE') as authenticated_delete
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('account_access', 'privacy_acknowledgements');

select
  has_column_privilege('authenticated', 'public.account_access', 'role', 'INSERT') as can_self_assign_role,
  has_column_privilege('authenticated', 'public.privacy_acknowledgements', 'accepted_at', 'INSERT') as can_set_notice_timestamp,
  has_function_privilege('anon', 'public.current_session_is_active()', 'EXECUTE') as anon_session_rpc;

begin;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated","session_id":"00000000-0000-4000-8000-000000000002"}', true);
select
  public.current_session_is_active() as session_active,
  (select count(*) from public.account_access) as visible_access_rows,
  (select count(*) from public.privacy_acknowledgements) as visible_notice_rows;
rollback;

-- Expected: RLS true, authenticated SELECT true, other privileges false;
-- session_active false and both visible row counts zero.
-- Live A/B isolation and invitation/recovery tests require invited accounts.
