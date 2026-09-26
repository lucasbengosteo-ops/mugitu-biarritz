-- Mugi Klub : l'inscription peut se faire ailleurs.
--
-- La prépa des danseurs se remplit par un groupe WhatsApp. Le planning
-- public doit y renvoyer, au lieu de proposer un formulaire que personne
-- n'utilise.
--
-- Aucune colonne de mode : « ailleurs » est un cas particulier de « pas
-- d'inscription chez nous ». Les fonctions en production traitent déjà
-- `inscription_requise = false` comme « ne pas compter de place, ne pas
-- accepter d'inscription, ne rien mettre en file » — exactement ce qu'il
-- faut ici. La contrainte rend l'invariant explicite : il n'y a que trois
-- états, et pas de quatrième.

alter table public.klub_seances
  add column reservation_url text,
  add column reservation_libelle text;

alter table public.klub_creneaux
  add column reservation_url text,
  add column reservation_libelle text;

-- Un lien n'a de sens que si l'inscription ne se fait pas chez nous.
alter table public.klub_seances add constraint klub_seances_reservation
  check (reservation_url is null or inscription_requise = false);
alter table public.klub_creneaux add constraint klub_creneaux_reservation
  check (reservation_url is null or inscription_requise = false);

-- Un bouton du site public ne pointe que vers du https. Un `http://` ou un
-- `javascript:` n'a rien à y faire.
alter table public.klub_seances add constraint klub_seances_reservation_https
  check (reservation_url is null or reservation_url like 'https://%');
alter table public.klub_creneaux add constraint klub_creneaux_reservation_https
  check (reservation_url is null or reservation_url like 'https://%');

-- Héritage depuis le créneau.
--
-- `klub_tache()` engendre les séances en listant ses colonnes une par une :
-- les deux nouvelles ne descendraient jamais. Plutôt que de retranscrire
-- cette fonction, qui tourne en production, un déclencheur remplit les
-- colonnes vides depuis le créneau. Ça vaut pour la génération d'aujourd'hui
-- comme pour toute autre à venir.
create or replace function public.klub__heriter_reservation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  c record;
begin
  if new.creneau_id is null then return new; end if;
  if new.reservation_url is not null then return new; end if;

  select reservation_url, reservation_libelle into c
    from public.klub_creneaux where id = new.creneau_id;
  if c.reservation_url is null then return new; end if;

  -- On n'hérite que si la séance est cohérente avec un lien : sinon la
  -- contrainte refuserait la ligne et la génération entière échouerait.
  if new.inscription_requise then return new; end if;

  new.reservation_url := c.reservation_url;
  new.reservation_libelle := coalesce(new.reservation_libelle, c.reservation_libelle);
  return new;
end;
$$;

revoke all on function public.klub__heriter_reservation() from public, anon, authenticated;

create trigger klub_seances_heriter_reservation
  before insert on public.klub_seances
  for each row execute function public.klub__heriter_reservation();

-- Poser ou retirer le lien, sur une séance ou sur un créneau.
--
-- Fonction dédiée plutôt que trois réécritures : `klub_admin_creer_seance`,
-- `klub_admin_modifier_seance` et `klub_admin_sauver_creneau` font entre
-- 1 200 et 3 500 caractères de plpgsql et tournent en production. L'écran
-- appelle celle-ci après avoir enregistré le reste.
--
-- Codes levés : KLUB_DROITS (par klub__verifier_droits), KLUB_CIBLE,
-- KLUB_URL, KLUB_RESERVATION_REQUISE.
create or replace function public.klub_admin_reservation(
  p_cible text, p_id uuid, p_url text, p_libelle text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url text := nullif(btrim(coalesce(p_url, '')), '');
  v_libelle text := nullif(btrim(coalesce(p_libelle, '')), '');
  v_requise boolean;
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if v_url is not null and v_url not like 'https://%' then raise exception 'KLUB_URL'; end if;

  if p_cible = 'seance' then
    select inscription_requise into v_requise from public.klub_seances where id = p_id;
    if not found then raise exception 'KLUB_CIBLE'; end if;
    if v_url is not null and v_requise then raise exception 'KLUB_RESERVATION_REQUISE'; end if;
    update public.klub_seances
       set reservation_url = v_url,
           reservation_libelle = case when v_url is null then null else v_libelle end
     where id = p_id;
  else
    select inscription_requise into v_requise from public.klub_creneaux where id = p_id;
    if not found then raise exception 'KLUB_CIBLE'; end if;
    if v_url is not null and v_requise then raise exception 'KLUB_RESERVATION_REQUISE'; end if;
    update public.klub_creneaux
       set reservation_url = v_url,
           reservation_libelle = case when v_url is null then null else v_libelle end
     where id = p_id;
  end if;
end;
$$;

revoke all on function public.klub_admin_reservation(text, uuid, text, text) from public, anon;
grant execute on function public.klub_admin_reservation(text, uuid, text, text) to authenticated;

-- Le JSON public porte les deux colonnes. Sans ça, le site ne verrait
-- jamais le lien. Corps repris de la version en production, deux clés en
-- plus et rien d'autre.
create or replace function public.klub__seance_publique(s public.klub_seances)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'id', s.id,
    'debut', s.debut,
    'duree_min', s.duree_min,
    'type', s.type,
    'titre', s.titre,
    'description', s.description,
    'intervenant', s.intervenant,
    'prix_libelle', s.prix_libelle,
    'inscription_requise', s.inscription_requise,
    'capacite', s.capacite,
    'statut', s.statut,
    'reservation_url', s.reservation_url,
    'reservation_libelle', s.reservation_libelle,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee'), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$$;
