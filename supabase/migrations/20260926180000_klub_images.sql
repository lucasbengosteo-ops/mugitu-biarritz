-- Mugi Klub : une image par séance ou par créneau.
--
-- Modèle des couvertures d'articles (`cover`, `cover_focus`) : une même image
-- est recadrée à plusieurs formats — large à la une, carrée dans la liste —
-- et `object-fit: cover` coupe au centre, ce qui décapite un sujet placé haut.
-- D'où le point focal.
--
-- Même chemin que le lien de réservation : un déclencheur pour l'héritage et
-- une fonction dédiée pour l'écriture, plutôt que de retranscrire trois
-- fonctions plpgsql qui tournent en production.

alter table public.klub_seances
  add column image text,
  add column image_focus text not null default '50% 50%';

alter table public.klub_creneaux
  add column image text,
  add column image_focus text not null default '50% 50%';

alter table public.klub_seances add constraint klub_seances_image_https
  check (image is null or image like 'https://%');
alter table public.klub_creneaux add constraint klub_creneaux_image_https
  check (image is null or image like 'https://%');

-- Héritage depuis le créneau : `klub_tache()` liste ses colonnes une par une,
-- une image posée sur un créneau ne descendrait jamais sans ce déclencheur.
create or replace function public.klub__heriter_image()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  c record;
begin
  if new.creneau_id is null or new.image is not null then return new; end if;

  select image, image_focus into c from public.klub_creneaux where id = new.creneau_id;
  if c.image is null then return new; end if;

  new.image := c.image;
  new.image_focus := c.image_focus;
  return new;
end;
$$;

revoke all on function public.klub__heriter_image() from public, anon, authenticated;

create trigger klub_seances_heriter_image
  before insert on public.klub_seances
  for each row execute function public.klub__heriter_image();

-- Poser ou retirer l'image d'une séance ou d'un créneau.
-- Codes levés : KLUB_DROITS (par klub__verifier_droits), KLUB_CIBLE, KLUB_URL.
create or replace function public.klub_admin_image(
  p_cible text, p_id uuid, p_image text, p_focus text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_image text := nullif(btrim(coalesce(p_image, '')), '');
  v_focus text := coalesce(nullif(btrim(coalesce(p_focus, '')), ''), '50% 50%');
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if v_image is not null and v_image not like 'https://%' then raise exception 'KLUB_URL'; end if;

  if p_cible = 'seance' then
    update public.klub_seances set image = v_image, image_focus = v_focus where id = p_id;
  else
    update public.klub_creneaux set image = v_image, image_focus = v_focus where id = p_id;
  end if;
  if not found then raise exception 'KLUB_CIBLE'; end if;
end;
$$;

revoke all on function public.klub_admin_image(text, uuid, text, text) from public, anon;
grant execute on function public.klub_admin_image(text, uuid, text, text) to authenticated;

-- Le JSON public porte les deux clés. Corps repris de la version en
-- production, deux clés en plus et rien d'autre.
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
    'image', s.image,
    'image_focus', s.image_focus,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee'), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$$;
