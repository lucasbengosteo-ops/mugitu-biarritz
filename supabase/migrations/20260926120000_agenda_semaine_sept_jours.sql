-- Agenda : la semaine va du lundi au dimanche.
--
-- Le cabinet reçoit aussi le samedi et le dimanche. Le modèle s'arrêtait au
-- vendredi, hérité du simulateur Mugicoloc qui ne comptait que les jours
-- ouvrés. Deux objets à reprendre : la contrainte sur `jour`, et la fonction
-- qui nomme une case, dont le tableau de jours n'avait que cinq entrées et
-- renvoyait donc « Sua,  matin » sans jour pour un samedi.

alter table public.agenda_voeux drop constraint agenda_voeux_jour_check;
alter table public.agenda_voeux add constraint agenda_voeux_jour_check
  check (jour between 1 and 7);

create or replace function public.agenda__libelle_case(p_salle text, p_jour smallint, p_moment text)
returns text
language sql
immutable
set search_path = ''
as $$
  select initcap(p_salle) || ', '
      || (array['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'])[p_jour] || ' '
      || case p_moment when 'matin' then 'matin' else 'après-midi' end;
$$;

revoke all on function public.agenda__libelle_case(text, smallint, text) from public, anon, authenticated;
