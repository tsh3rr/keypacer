-- Keep-alive for the free tier. Supabase pauses free projects it sees as
-- inactive. The read-only queries the keep-alive workflow sent so far did
-- not count: staging was paused two days after its last ones. Each ping now
-- also writes one row, through this function, so the database sees a real
-- write. Anyone may call it (the workflow uses the publishable key), but it
-- only ever updates this single row, and at most once every ten minutes, so
-- calling it more often changes nothing.

create table public.keep_alive (
  id smallint primary key default 1 check (id = 1),
  pinged_at timestamptz not null default now(),
  pings bigint not null default 0
);

comment on table public.keep_alive is 'Last keep-alive write; only keep_alive() changes it.';

-- Only the function below reads or writes it: no API role has access.
alter table public.keep_alive enable row level security;
revoke all on public.keep_alive from public, anon, authenticated;

insert into public.keep_alive (id) values (1);

create function public.keep_alive() returns void
language sql volatile security definer set search_path = '' as $$
  update public.keep_alive set pinged_at = now(), pings = pings + 1
    where id = 1 and pinged_at < now() - interval '10 minutes';
$$;

revoke execute on function public.keep_alive() from public;
grant execute on function public.keep_alive() to anon, authenticated;
