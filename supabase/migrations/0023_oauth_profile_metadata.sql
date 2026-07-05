-- Google OAuth sign-in: capture the provider's name and avatar when the
-- profile row is auto-created. Google puts them in raw_user_meta_data as
-- full_name/name and avatar_url/picture; the old trigger only read full_name
-- (set by our email signup form), so OAuth users got a blank profile.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    nullif(coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
