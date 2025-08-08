create or replace function set_admin_role(target_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Ensure only admins can run this function
  if not exists (
    select 1 from public.customers
    where id = auth.uid()
    and role = 'admin'
  ) then
    raise exception 'Only admins can assign admin role';
  end if;

  -- Update role of target user
  update public.customers
  set role = 'admin'
  where id = target_user_id;
end;
$$;



grant execute on function set_admin_role(uuid) to authenticated;
