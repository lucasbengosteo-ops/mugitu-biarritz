-- Mugi Klub : chaque séance connaît le praticien qui l'encaisse et son prix.
-- Spec : docs/superpowers/specs/2026-10-13-klub-paiement-design.md, § 1 et 2.
--
-- Écriture par une fonction dédiée, comme l'image et la méthode de
-- réservation : on ne retranscrit pas les fonctions d'admin en production.
-- Les tables du Klub n'ont aucune politique d'écriture : tout passe par des
-- fonctions security definer, c'est là que se tiennent les droits.

alter table public.klub_creneaux
  add column praticien_id uuid references auth.users (id) on delete set null,
  add column prix_centimes integer check (prix_centimes is null or prix_centimes between 0 and 100000);

alter table public.klub_seances
  add column praticien_id uuid references auth.users (id) on delete set null,
  add column prix_centimes integer check (prix_centimes is null or prix_centimes between 0 and 100000);

-- Héritage depuis le créneau, comme l'image : klub_tache() liste ses
-- colonnes une par une.
create or replace function public.klub__heriter_encaissement()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  c record;
begin
  if new.creneau_id is null or new.praticien_id is not null or new.prix_centimes is not null then return new; end if;
  select praticien_id, prix_centimes into c from public.klub_creneaux where id = new.creneau_id;
  new.praticien_id := c.praticien_id;
  new.prix_centimes := c.prix_centimes;
  return new;
end;
$$;
revoke all on function public.klub__heriter_encaissement() from public, anon, authenticated;

create trigger klub_seances_heriter_encaissement
  before insert on public.klub_seances
  for each row execute function public.klub__heriter_encaissement();

-- Le compte Stripe de chaque praticien. Écrit par le serveur seul.
create table public.site_comptes_stripe (
  user_id uuid primary key references auth.users (id) on delete cascade,
  compte text not null unique check (compte like 'acct_%'),
  etat text not null default 'verification' check (etat in ('verification', 'pret')),
  updated_at timestamptz not null default now()
);
alter table public.site_comptes_stripe enable row level security;
create policy site_comptes_stripe_lecture on public.site_comptes_stripe
  for select to authenticated
  using (user_id = auth.uid() or public.site_est_super_admin());
revoke all on public.site_comptes_stripe from anon;
revoke insert, update, delete on public.site_comptes_stripe from authenticated;

-- Une séance se paie en ligne quand ces conditions sont réunies.
create or replace function public.klub__paiement_en_ligne(s public.klub_seances)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select s.inscription_requise
     and s.reservation_url is null
     and coalesce(s.prix_centimes, 0) > 0
     and s.praticien_id is not null
     and exists (select 1 from public.site_comptes_stripe c where c.user_id = s.praticien_id and c.etat = 'pret');
$$;
revoke all on function public.klub__paiement_en_ligne(public.klub_seances) from public, anon, authenticated;

-- Poser le praticien et le prix d'une séance ou d'un créneau.
-- Codes : KLUB_DROITS, KLUB_CIBLE, KLUB_ENCAISSEMENT, KLUB_PRIX.
--  - changer le praticien : gérant seulement ;
--  - changer le prix : gérant, ou le praticien déjà rattaché.
create or replace function public.klub_admin_encaissement(
  p_cible text, p_id uuid, p_praticien uuid, p_prix_centimes integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_praticien uuid;
  v_prix integer;
  v_gerant boolean := coalesce(public.site_est_super_admin(), false);
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if p_prix_centimes is not null and (p_prix_centimes < 0 or p_prix_centimes > 100000) then
    raise exception 'KLUB_PRIX';
  end if;

  if p_cible = 'seance' then
    select praticien_id, prix_centimes into v_praticien, v_prix from public.klub_seances where id = p_id for update;
  else
    select praticien_id, prix_centimes into v_praticien, v_prix from public.klub_creneaux where id = p_id for update;
  end if;
  if not found then raise exception 'KLUB_CIBLE'; end if;

  if p_praticien is distinct from v_praticien and not v_gerant then raise exception 'KLUB_ENCAISSEMENT'; end if;
  if p_prix_centimes is distinct from v_prix and not v_gerant and v_praticien is distinct from auth.uid() then
    raise exception 'KLUB_ENCAISSEMENT';
  end if;

  if p_cible = 'seance' then
    update public.klub_seances set praticien_id = p_praticien, prix_centimes = p_prix_centimes where id = p_id;
  else
    update public.klub_creneaux set praticien_id = p_praticien, prix_centimes = p_prix_centimes where id = p_id;
  end if;
end;
$$;
revoke all on function public.klub_admin_encaissement(text, uuid, uuid, integer) from public, anon;
grant execute on function public.klub_admin_encaissement(text, uuid, uuid, integer) to authenticated;

-- Corps repris de la production le 13 oct. 2026, changements : ajout de
-- 'prix_centimes' et 'paiement_en_ligne' dans le JSON. Rien d'autre :
-- praticien_id n'est jamais exposé, ce JSON est public.
create or replace function public.klub__seance_publique(s klub_seances)
returns jsonb
language sql
stable
set search_path to ''
as $function$
  select jsonb_build_object(
    'id', s.id,
    'debut', s.debut,
    'duree_min', s.duree_min,
    'type', s.type,
    'titre', s.titre,
    'description', s.description,
    'intervenant', s.intervenant,
    'prix_libelle', s.prix_libelle,
    'prix_centimes', s.prix_centimes,
    'paiement_en_ligne', public.klub__paiement_en_ligne(s),
    'inscription_requise', s.inscription_requise,
    'capacite', s.capacite,
    'statut', s.statut,
    'reservation_url', s.reservation_url,
    'reservation_libelle', s.reservation_libelle,
    'image', s.image,
    'image_focus', s.image_focus,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee'), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$function$;
