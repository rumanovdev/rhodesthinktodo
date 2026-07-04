-- 0021: Prevent privilege / trust-flag escalation via direct PostgREST writes.
--
-- ROOT CAUSE: the `profiles` and `listings` UPDATE policies are
--   USING (auth.uid() = id / owner_id)  with NO WITH CHECK,
-- and the `authenticated` role holds UPDATE on every column (Supabase default).
-- Postgres uses the USING expression as the implicit WITH CHECK, so a logged-in
-- user can PATCH their OWN row and flip sensitive columns — bypassing the Astro
-- app entirely:
--   * profiles.is_admin  -> full admin takeover (middleware trusts is_admin,
--                           which then runs the service-role client).
--   * listings.is_verified / is_featured -> fraudulent trust/promo signals.
--   * listings.owner_id  -> (already blocked by the implicit check, pinned here too).
--
-- FIX: BEFORE INSERT/UPDATE triggers that pin these columns for any caller whose
-- JWT role is NOT `service_role`. The admin server + service client (getServiceClient)
-- use the service_role key, so admin management still works. Owners never write
-- these columns through the app, so create/edit flows are unaffected.
--
-- SAFETY: the triggers NEVER raise or reject — they only overwrite the sensitive
-- NEW columns. So they cannot break any create/edit flow; a normal write of other
-- columns passes through untouched. The role check uses current_setting(..., true)
-- (missing_ok) so it returns NULL rather than erroring when no JWT is present.
--
-- NOTE: the Supabase Management API / SQL editor runs as `postgres` with no JWT
-- claims (role resolves to ''), i.e. non-service, so these triggers also pin the
-- flags for direct-SQL writes. To verify/feature a listing outside the app, use
-- the service_role key or `alter table ... disable trigger` transiently.

-- Resolve the caller's JWT role without ever erroring (unset -> NULL -> '').
create or replace function public.jwt_role() returns text
language sql stable as $$
  select coalesce((nullif(current_setting('request.jwt.claims', true), ''))::jsonb ->> 'role', '');
$$;

-- ---- profiles.is_admin -------------------------------------------------------
create or replace function public.tg_guard_profile_flags() returns trigger
language plpgsql set search_path = public as $$
begin
  if public.jwt_role() <> 'service_role' then
    if tg_op = 'INSERT' then
      new.is_admin := false;
    else
      new.is_admin := old.is_admin;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_guard_profile_flags on public.profiles;
create trigger trg_guard_profile_flags
  before insert or update on public.profiles
  for each row execute function public.tg_guard_profile_flags();

-- ---- listings.is_verified / is_featured / owner_id ---------------------------
create or replace function public.tg_guard_listing_flags() returns trigger
language plpgsql set search_path = public as $$
begin
  if public.jwt_role() <> 'service_role' then
    if tg_op = 'INSERT' then
      new.is_verified := false;
      new.is_featured := false;
    else
      new.is_verified := old.is_verified;
      new.is_featured := old.is_featured;
      new.owner_id    := old.owner_id;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_guard_listing_flags on public.listings;
create trigger trg_guard_listing_flags
  before insert or update on public.listings
  for each row execute function public.tg_guard_listing_flags();
