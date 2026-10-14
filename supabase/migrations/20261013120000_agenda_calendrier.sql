-- Agenda du cabinet : un jeton secret par personne, pour abonner son propre
-- calendrier (Google Agenda, iPhone, Outlook) à sa présence au cabinet.
-- Spec admin UI § 2, « L'abonnement calendrier ».
--
-- Le jeton est l'unique clé de l'adresse
-- `/api/agenda/calendrier/<jeton>.ics`, appelée sans session par le
-- calendrier externe. La route le lit avec la clé de service ; dans le
-- navigateur, chacun ne voit que sa propre ligne et ne l'écrit que par la
-- fonction ci-dessous.

create table public.agenda_calendrier_jetons (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- 32 octets aléatoires en hexadécimal : la forme exacte que la route accepte.
  jeton text not null unique check (jeton ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

alter table public.agenda_calendrier_jetons enable row level security;

create policy agenda_calendrier_jetons_lecture on public.agenda_calendrier_jetons
  for select to authenticated using (user_id = auth.uid());

-- Les privilèges par défaut de Supabase ouvrent toute nouvelle table à anon
-- et à authenticated : on referme. authenticated ne garde que la lecture.
revoke all on public.agenda_calendrier_jetons from anon;
revoke insert, update, delete, truncate, references, trigger on public.agenda_calendrier_jetons from authenticated;

-- Le jeton de l'appelant, créé s'il n'existe pas ; remplacé si p_nouveau,
-- ce qui coupe l'ancienne adresse.
--
-- Sans p_nouveau, l'insertion ne remplace jamais une ligne existante : deux
-- appels simultanés rendent le même jeton au lieu de s'écraser l'un l'autre.
create or replace function public.agenda_mon_jeton_calendrier(p_nouveau boolean default false)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_jeton text := encode(extensions.gen_random_bytes(32), 'hex');
begin
  perform public.agenda__verifier_equipe();

  if coalesce(p_nouveau, false) then
    insert into public.agenda_calendrier_jetons (user_id, jeton) values (auth.uid(), v_jeton)
    on conflict (user_id) do update set jeton = excluded.jeton, created_at = now();
    return v_jeton;
  end if;

  insert into public.agenda_calendrier_jetons (user_id, jeton) values (auth.uid(), v_jeton)
  on conflict (user_id) do nothing;
  select j.jeton into v_jeton from public.agenda_calendrier_jetons j where j.user_id = auth.uid();
  return v_jeton;
end;
$$;

revoke all on function public.agenda_mon_jeton_calendrier(boolean) from public, anon;
grant execute on function public.agenda_mon_jeton_calendrier(boolean) to authenticated;
