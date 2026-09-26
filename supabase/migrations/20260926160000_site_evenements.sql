-- Back-office : ce qui a bougé, et le réglage de chacun.
--
-- Les événements viennent de déclencheurs en base et non de l'interface :
-- un article publié directement en SQL doit compter autant qu'un article
-- publié depuis l'écran. L'interface, on oublie de l'appeler ; un
-- déclencheur, non.
--
-- Chaque déclencheur est écrit pour ne JAMAIS échouer. Il se pose sur des
-- tables en service : une exception y empêcherait de publier un article ou
-- de créer une séance. D'où le bloc `exception when others then return ...`
-- de chacun — on préfère perdre une ligne de récapitulatif que bloquer le
-- travail du cabinet.

create table public.site_evenements (
  id uuid primary key default gen_random_uuid(),
  quoi text not null check (quoi in (
    'seance_creee', 'seance_annulee', 'creneau_modifie',
    'article_publie', 'article_a_relire',
    'voeu_pose', 'absence_declaree', 'echange_demande')),
  sujet text not null,
  qui uuid references auth.users (id) on delete set null,
  lien text,
  created_at timestamptz not null default now()
);

create index site_evenements_jour on public.site_evenements (created_at);

alter table public.site_evenements enable row level security;
revoke all on public.site_evenements from anon, authenticated;
-- Personne ne lit cette table depuis le navigateur : les déclencheurs y
-- écrivent, la clé de service la relit. Aucune politique, donc aucun accès.

create table public.site_reglages_mail (
  user_id uuid primary key references auth.users (id) on delete cascade,
  recap boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.site_reglages_mail enable row level security;

-- Chacun lit et écrit sa ligne, et rien d'autre. L'absence de ligne vaut
-- « oui » : on ne crée pas une ligne pour les onze comptes à l'avance.
create policy site_reglages_lecture on public.site_reglages_mail
  for select to authenticated using (user_id = auth.uid());
create policy site_reglages_creation on public.site_reglages_mail
  for insert to authenticated with check (user_id = auth.uid() and public.site_est_equipe());
create policy site_reglages_modification on public.site_reglages_mail
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke all on public.site_reglages_mail from anon;
grant select, insert, update on public.site_reglages_mail to authenticated;

-- Poser un événement. Interne, et silencieuse en cas de problème.
create or replace function public.site__evenement(
  p_quoi text, p_sujet text, p_qui uuid, p_lien text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.site_evenements (quoi, sujet, qui, lien)
  values (p_quoi, left(p_sujet, 300), p_qui, p_lien);
exception when others then
  -- Un récapitulatif manquant ne justifie pas d'empêcher le travail.
  return;
end;
$$;

revoke all on function public.site__evenement(text, text, uuid, text) from public, anon, authenticated;

-- Les articles. Seules les transitions comptent : réenregistrer un article
-- publié ne l'annonce pas une seconde fois.
create or replace function public.site__ev_article()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'publie' and (tg_op = 'INSERT' or old.status is distinct from 'publie') then
    perform public.site__evenement('article_publie', new.title, new.auteur_id, '/admin/actualites');
  elsif new.status = 'relecture' and (tg_op = 'INSERT' or old.status is distinct from 'relecture') then
    perform public.site__evenement('article_a_relire', new.title, new.auteur_id, '/admin/actualites');
  end if;
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_article() from public, anon, authenticated;

create trigger site_ev_article
  after insert or update on public.articles
  for each row execute function public.site__ev_article();

-- Les séances du Klub.
create or replace function public.site__ev_seance()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sujet text;
begin
  v_sujet := new.titre || ', le ' || to_char(new.debut at time zone 'Europe/Paris', 'DD/MM à HH24hMI');
  if tg_op = 'INSERT' then
    perform public.site__evenement('seance_creee', v_sujet, null, '/admin/mugi-klub');
  elsif new.statut = 'annulee' and old.statut is distinct from 'annulee' then
    perform public.site__evenement('seance_annulee', v_sujet, null, '/admin/mugi-klub');
  end if;
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_seance() from public, anon, authenticated;

create trigger site_ev_seance
  after insert or update on public.klub_seances
  for each row execute function public.site__ev_seance();

-- Les créneaux : seul un changement de fond compte, pas un `updated_at`.
create or replace function public.site__ev_creneau()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.titre, new.jour, new.heure, new.duree_min, new.capacite, new.prix_libelle,
      new.inscription_requise, new.actif, new.reservation_url)
     is distinct from
     (old.titre, old.jour, old.heure, old.duree_min, old.capacite, old.prix_libelle,
      old.inscription_requise, old.actif, old.reservation_url) then
    perform public.site__evenement('creneau_modifie', new.titre, null, '/admin/mugi-klub');
  end if;
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_creneau() from public, anon, authenticated;

create trigger site_ev_creneau
  after update on public.klub_creneaux
  for each row execute function public.site__ev_creneau();

-- L'agenda : un vœu posé, une absence déclarée, un échange demandé. Les
-- décisions et les commentaires sont déjà adressés à quelqu'un : les mettre
-- au récapitulatif les dirait deux fois.
create or replace function public.site__ev_voeu()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.site__evenement('voeu_pose',
    public.agenda__libelle_case(new.salle, new.jour, new.moment), new.user_id, '/admin/agenda');
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_voeu() from public, anon, authenticated;

create trigger site_ev_voeu
  after insert on public.agenda_voeux
  for each row execute function public.site__ev_voeu();

create or replace function public.site__ev_absence()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.site__evenement('absence_declaree',
    'du ' || to_char(new.du, 'DD/MM') || ' au ' || to_char(new.au, 'DD/MM'),
    new.user_id, '/admin/agenda');
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_absence() from public, anon, authenticated;

create trigger site_ev_absence
  after insert on public.agenda_absences
  for each row execute function public.site__ev_absence();

create or replace function public.site__ev_echange()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.site__evenement('echange_demande',
    public.agenda__libelle_echange(new.id), new.demandeur_id, '/admin/agenda');
  return new;
exception when others then return new;
end;
$$;

revoke all on function public.site__ev_echange() from public, anon, authenticated;

create trigger site_ev_echange
  after insert on public.agenda_echanges
  for each row execute function public.site__ev_echange();

-- Le type de mail rejoint la file de l'agenda. Son nom devient faux avant sa
-- mécanique : la fusion des deux files est notée dans la spec.
alter table public.agenda_mails drop constraint agenda_mails_type_check;
alter table public.agenda_mails add constraint agenda_mails_type_check
  check (type in ('voeu_valide', 'voeu_refuse', 'retrait_demande', 'retrait_tranche',
                  'commentaire', 'absence',
                  'echange_propose', 'echange_pair', 'echange_tranche',
                  'recap'));

-- Composer le récapitulatif et le déposer dans la file.
--
-- Réservée à la clé de service : elle lit les événements de tout le monde.
-- S'il n'y a rien à dire, elle ne met rien en file — c'est la règle qui fait
-- qu'on ouvrira encore ce mail dans six mois.
create or replace function public.site_recap_du_jour()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_depuis timestamptz := now() - interval '24 hours';
  v_n int;
  v_corps text := '';
  v_gerant record;
  v_mails int := 0;
  v_titres constant jsonb := jsonb_build_object(
    'seance_creee', 'Séances créées',
    'seance_annulee', 'Séances annulées',
    'creneau_modifie', 'Créneaux modifiés',
    'article_publie', 'Articles publiés',
    'article_a_relire', 'Articles à relire',
    'voeu_pose', 'Créneaux demandés dans l''agenda',
    'absence_declaree', 'Absences déclarées',
    'echange_demande', 'Échanges demandés');
  v_ordre constant text[] := array['seance_creee', 'seance_annulee', 'creneau_modifie',
    'article_publie', 'article_a_relire', 'voeu_pose', 'absence_declaree', 'echange_demande'];
  v_type text;
  v_bloc text;
begin
  select count(*) into v_n from public.site_evenements where created_at >= v_depuis;
  if v_n = 0 then return jsonb_build_object('evenements', 0, 'mails', 0); end if;

  foreach v_type in array v_ordre loop
    select string_agg('- ' || e.sujet
             || coalesce(' (' || nullif(coalesce(p.first_name || ' ' || p.last_name, u.email), '') || ')', ''),
             chr(10) order by e.created_at)
      into v_bloc
      from public.site_evenements e
      left join auth.users u on u.id = e.qui
      left join public.profiles p on p.user_id = e.qui
     where e.created_at >= v_depuis and e.quoi = v_type;

    if v_bloc is not null then
      v_corps := v_corps || (v_titres->>v_type) || chr(10) || v_bloc || chr(10) || chr(10);
    end if;
  end loop;

  for v_gerant in
    select s.user_id from public.site_super_admins s
     where coalesce((select r.recap from public.site_reglages_mail r where r.user_id = s.user_id), true)
  loop
    perform public.agenda__mettre_en_file('recap', v_gerant.user_id,
      'Mugitu, ce qui a bougé hier', v_corps);
    v_mails := v_mails + 1;
  end loop;

  return jsonb_build_object('evenements', v_n, 'mails', v_mails);
end;
$$;

revoke all on function public.site_recap_du_jour() from public, anon, authenticated;
