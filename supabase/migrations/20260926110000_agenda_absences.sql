-- Agenda du cabinet : les absences.
--
-- Purement déclaratif : on ne demande pas la permission de prendre ses
-- congés. Chacun pose et retire les siennes, les gérants peuvent en retirer
-- une pour faire le ménage, toute l'équipe les lit. Les gérants reçoivent un
-- mail : c'est une information dont ils ont besoin pour tenir le cabinet,
-- pas une décision à prendre.
--
-- Une absence ne libère pas la case. Elle la marque absente sur les semaines
-- concernées. Qui veut en profiter passera par une demande d'échange
-- ponctuelle (chantier C1c) : l'arbitrage reste au même endroit.

create table public.agenda_absences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  du date not null,
  au date not null,
  motif text,
  created_at timestamptz not null default now(),
  constraint agenda_absences_ordre check (au >= du)
);

-- Les plages qui se chevauchent sont permises : ce qui compte est « telle
-- personne est-elle absente tel jour », et l'union de deux plages répond
-- aussi bien qu'une seule.
create index agenda_absences_personne on public.agenda_absences (user_id, du, au);
create index agenda_absences_periode on public.agenda_absences (du, au);

alter table public.agenda_absences enable row level security;

create policy agenda_absences_lecture on public.agenda_absences
  for select to authenticated using (public.site_est_equipe());

create policy agenda_absences_creation on public.agenda_absences
  for insert to authenticated
  with check (public.site_est_equipe() and user_id = auth.uid());

create policy agenda_absences_suppression on public.agenda_absences
  for delete to authenticated
  using (public.site_est_equipe() and (user_id = auth.uid() or public.site_est_super_admin()));

-- Pas de politique de modification : une plage se retire et se repose. Une
-- absence modifiable demanderait de reprévenir les gérants à chaque retouche.

revoke all on public.agenda_absences from anon;
grant select, insert, delete on public.agenda_absences to authenticated;

-- Le type de mail « absence » rejoint la file. Remplacer la contrainte est
-- la seule modification d'un objet existant que ce chantier s'autorise.
alter table public.agenda_mails drop constraint agenda_mails_type_check;
alter table public.agenda_mails add constraint agenda_mails_type_check
  check (type in ('voeu_valide', 'voeu_refuse', 'retrait_demande', 'retrait_tranche',
                  'commentaire', 'absence'));

-- Prévenir les gérants, à la pose comme au retrait. `security definer`
-- parce que `agenda__mettre_en_file` leur est fermée, et que la fonction
-- lit `auth.users` et `profiles`.
create or replace function public.agenda__absence_signaler()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ligne record := coalesce(new, old);
  v_pose boolean := new is not null;
  v_nom text;
  v_gerant record;
  v_periode text;
begin
  select coalesce(p.first_name || ' ' || p.last_name, u.email) into v_nom
    from auth.users u
    left join public.profiles p on p.user_id = u.id
   where u.id = v_ligne.user_id;

  v_periode := case
    when v_ligne.du = v_ligne.au then 'le ' || to_char(v_ligne.du, 'DD/MM/YYYY')
    else 'du ' || to_char(v_ligne.du, 'DD/MM/YYYY') || ' au ' || to_char(v_ligne.au, 'DD/MM/YYYY')
  end;

  for v_gerant in select user_id from public.site_super_admins loop
    perform public.agenda__mettre_en_file('absence', v_gerant.user_id,
      case when v_pose
        then 'Absence déclarée : ' || coalesce(v_nom, '?') || ', ' || v_periode
        else 'Absence retirée : ' || coalesce(v_nom, '?') || ', ' || v_periode end,
      coalesce(nullif(btrim(coalesce(v_ligne.motif, '')), ''), 'Sans motif précisé.'));
  end loop;

  return v_ligne;
end;
$$;

revoke all on function public.agenda__absence_signaler() from public, anon, authenticated;

create trigger agenda_absences_signaler
  after insert or delete on public.agenda_absences
  for each row execute function public.agenda__absence_signaler();
