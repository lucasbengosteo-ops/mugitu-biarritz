-- Mugi Klub : le praticien et le prix d'un créneau descendent sur ses séances
-- à venir ; un duo est payant ou n'est pas proposé.
-- Suite de 20261013110000_klub_individuel.sql (partie 3).
--
-- 1. Jusqu'ici, klub_admin_encaissement et klub_admin_prix_duo visant un
--    créneau n'écrivaient que le créneau : les séances déjà générées (4
--    semaines) restaient sans praticien ni prix, donc sans paiement en
--    ligne ni duo. Elles reçoivent désormais la même valeur, si elles sont à
--    venir, publiées, non modifiées à la main et du même type que le
--    créneau. Les droits sont ceux du créneau, déjà vérifiés. Les
--    inscriptions gardent leur montant et leur stripe_compte : rien ne les
--    touche ici.
-- 2. Prix duo à 0 € : refusé par klub_admin_prix_duo (KLUB_PRIX) et par une
--    contrainte. klub__inscrire ne met jamais en `paiement` une réservation
--    dont le montant est nul.
--
-- Relevé en production le 13 oct. 2026 : aucune ligne n'a un prix duo à 0 ;
-- les trois corps ci-dessous sont ceux de 20261013110000 (md5 vérifiés).

alter table public.klub_creneaux
  add constraint klub_creneaux_prix_duo_positif check (prix_duo_centimes is null or prix_duo_centimes > 0) not valid;
alter table public.klub_creneaux validate constraint klub_creneaux_prix_duo_positif;
alter table public.klub_seances
  add constraint klub_seances_prix_duo_positif check (prix_duo_centimes is null or prix_duo_centimes > 0) not valid;
alter table public.klub_seances validate constraint klub_seances_prix_duo_positif;

-- Corps repris de la production le 13 oct. 2026, changement : visant un
-- créneau, le praticien et le prix descendent sur ses séances à venir,
-- publiées, non modifiées et du même type (un créneau dont le type a changé
-- peut garder des séances de l'ancien type, qui ont des inscrits : on ne
-- leur impose pas un prix que leurs contraintes refuseraient).
-- Codes : KLUB_DROITS, KLUB_CIBLE, KLUB_ENCAISSEMENT, KLUB_PRIX.
create or replace function public.klub_admin_encaissement(p_cible text, p_id uuid, p_praticien uuid, p_prix_centimes integer)
 returns void
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  v_praticien uuid;
  v_prix integer;
  v_type text;
  v_gerant boolean := coalesce(public.site_est_super_admin(), false);
  v_individuel boolean;
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if p_prix_centimes is not null and (p_prix_centimes < 0 or p_prix_centimes > 100000) then
    raise exception 'KLUB_PRIX';
  end if;

  if p_cible = 'seance' then
    select praticien_id, prix_centimes, type into v_praticien, v_prix, v_type from public.klub_seances where id = p_id for update;
  else
    select praticien_id, prix_centimes, type into v_praticien, v_prix, v_type from public.klub_creneaux where id = p_id for update;
  end if;
  if not found then raise exception 'KLUB_CIBLE'; end if;
  v_individuel := v_type in ('individuel', 'bilan');
  if v_type = 'bilan' and p_prix_centimes is not null then raise exception 'KLUB_PRIX'; end if;

  -- Un praticien se rattache lui-même à ses créneaux individuels et bilans
  -- (spec partie 3, § 5) : seulement à lui-même, seulement si personne
  -- d'autre n'y est rattaché. `coalesce` : p_praticien nul (se détacher)
  -- rend la condition nulle, et `if not null` ne lèverait rien.
  if p_praticien is distinct from v_praticien and not v_gerant then
    if not coalesce(v_individuel
                    and p_praticien = auth.uid()
                    and (v_praticien is null or v_praticien = auth.uid()), false) then
      raise exception 'KLUB_ENCAISSEMENT';
    end if;
  end if;
  if p_prix_centimes is distinct from v_prix and not v_gerant
     and (case when v_individuel then coalesce(p_praticien, v_praticien) else v_praticien end) is distinct from auth.uid() then
    raise exception 'KLUB_ENCAISSEMENT';
  end if;

  if p_cible = 'seance' then
    update public.klub_seances set praticien_id = p_praticien, prix_centimes = p_prix_centimes where id = p_id;
  else
    update public.klub_creneaux set praticien_id = p_praticien, prix_centimes = p_prix_centimes where id = p_id;
    update public.klub_seances set praticien_id = p_praticien, prix_centimes = p_prix_centimes
    where creneau_id = p_id and debut > now() and statut = 'publiee' and not modifiee and type = v_type;
  end if;
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changements : 0 € refusé
-- (KLUB_PRIX : un duo est payant ou n'est pas proposé) ; visant un créneau,
-- le prix duo descend sur ses séances à venir, publiées, non modifiées et du
-- même type.
-- Codes : KLUB_DROITS, KLUB_CIBLE, KLUB_ENCAISSEMENT, KLUB_PRIX, KLUB_DUO.
create or replace function public.klub_admin_prix_duo(p_cible text, p_id uuid, p_prix_duo_centimes integer)
 returns void
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  v_praticien uuid;
  v_type text;
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if p_prix_duo_centimes is not null and (p_prix_duo_centimes <= 0 or p_prix_duo_centimes > 100000) then
    raise exception 'KLUB_PRIX';
  end if;
  if p_cible = 'seance' then
    select praticien_id, type into v_praticien, v_type from public.klub_seances where id = p_id for update;
  else
    select praticien_id, type into v_praticien, v_type from public.klub_creneaux where id = p_id for update;
  end if;
  if not found then raise exception 'KLUB_CIBLE'; end if;
  if v_type <> 'individuel' and p_prix_duo_centimes is not null then raise exception 'KLUB_DUO'; end if;
  if not coalesce(public.site_est_super_admin(), false) and v_praticien is distinct from auth.uid() then
    raise exception 'KLUB_ENCAISSEMENT';
  end if;
  if p_cible = 'seance' then
    update public.klub_seances set prix_duo_centimes = p_prix_duo_centimes where id = p_id;
  else
    update public.klub_creneaux set prix_duo_centimes = p_prix_duo_centimes where id = p_id;
    update public.klub_seances set prix_duo_centimes = p_prix_duo_centimes
    where creneau_id = p_id and debut > now() and statut = 'publiee' and not modifiee and type = v_type;
  end if;
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changement : une
-- réservation dont le montant serait nul (0 € ou sans prix) ne passe jamais
-- en `paiement`, elle suit le chemin sans paiement en ligne. Pour une
-- inscription seule, klub__paiement_en_ligne l'exigeait déjà (prix > 0) ;
-- c'est une garde pour le duo.
create or replace function public.klub__inscrire(p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean, p_origine text, p_si_complet text, p_a_deux boolean, p_accompagnant text)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  s public.klub_seances;
  -- Blancs tolérés comme côté client : tabulation, espace insécable (U+00A0)
  -- et espace fine insécable (U+202F), que trim() et \s ignorent.
  c_blancs constant text := E' \t\r\n' || chr(160) || chr(8239);
  v_email text := lower(btrim(coalesce(p_email, ''), c_blancs));
  v_tel text := regexp_replace(coalesce(p_telephone, ''), '[\s.()' || chr(160) || chr(8239) || '-]', '', 'g');
  v_a_deux boolean := coalesce(p_a_deux, false);
  v_accompagnant text := btrim(coalesce(p_accompagnant, ''), c_blancs);
  v_existant public.klub_inscriptions;
  v_statut text;
  v_id uuid;
  v_mail uuid;
  v_rang integer;
  v_payant boolean;
  v_montant integer;
begin
  if p_origine not in ('site', 'admin') then raise exception 'KLUB_ORIGINE'; end if;
  if char_length(btrim(coalesce(p_prenom, ''), c_blancs)) = 0
     or char_length(btrim(coalesce(p_nom, ''), c_blancs)) = 0 then
    raise exception 'KLUB_NOM';
  end if;
  if v_email !~ '^[^\s@,;]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$' then raise exception 'KLUB_EMAIL'; end if;
  if v_tel !~ '^\+?[0-9]{9,15}$' then raise exception 'KLUB_TELEPHONE'; end if;

  -- Le verrou sérialise les inscriptions d'une même séance : pas de surréservation.
  -- Il est pris avant les comptages ci-dessous pour que la réponse reste
  -- cohérente sous concurrence.
  select * into s from public.klub_seances where id = p_seance for no key update;
  if not found or s.statut <> 'publiee' then raise exception 'KLUB_SEANCE'; end if;
  if not s.inscription_requise then raise exception 'KLUB_LIBRE'; end if;
  if (p_origine = 'site' and s.debut <= now())
     or (p_origine = 'admin' and s.debut + make_interval(mins => s.duree_min::int) <= now()) then
    raise exception 'KLUB_COMMENCEE';
  end if;
  -- À deux : seulement sur un individuel qui propose le duo, avec le nom de
  -- la seconde personne.
  if v_a_deux then
    if s.type <> 'individuel' or s.prix_duo_centimes is null then raise exception 'KLUB_DUO'; end if;
    if char_length(v_accompagnant) = 0 or char_length(v_accompagnant) > 120 then
      raise exception 'KLUB_ACCOMPAGNANT';
    end if;
  end if;
  -- Paiement en ligne : depuis le site seulement. L'admin inscrit d'office,
  -- le paiement se fait alors sur place. Jamais pour un montant nul : une
  -- réservation à 0 € (ou sans montant) suit le chemin sans paiement.
  v_payant := p_origine = 'site' and public.klub__paiement_en_ligne(s)
    and coalesce(case when v_a_deux then 2 * s.prix_duo_centimes else s.prix_centimes end, 0) > 0;

  select * into v_existant from public.klub_inscriptions
  where seance_id = p_seance and email = v_email and statut <> 'annulee';

  if found then
    -- Ajout depuis l'admin : les praticiens lisent déjà toutes les inscriptions,
    -- le doublon leur est signalé tel quel.
    if p_origine = 'admin' then raise exception 'KLUB_DOUBLON'; end if;
    -- Paiement en cours pour cette adresse : on lui laisse le temps de payer,
    -- sans mail. `greatest` : une place gardée 6 h depuis la liste d'attente
    -- n'est jamais raccourcie.
    if v_existant.statut = 'paiement' then
      update public.klub_inscriptions
      set paiement_expire_at = greatest(paiement_expire_at, now() + interval '35 minutes')
      where id = v_existant.id;
      return jsonb_build_object('statut', 'paiement', 'rang', null, 'mail_id', null, 'debut', s.debut, 'titre', s.titre,
                                'inscription_id', v_existant.id);
    end if;
    -- Doublon : le vrai mail est renvoyé au plus une fois par tranche de
    -- 10 minutes ; la réponse est celle d'une nouvelle inscription (plus bas).
    if not exists (
      select 1 from public.klub_mails
      where inscription_id = v_existant.id and type in ('confirmation', 'attente', 'promotion')
        and created_at > now() - interval '10 minutes'
    ) then
      insert into public.klub_mails (type, inscription_id, seance_id)
      values (case when v_existant.statut = 'confirmee' then 'confirmation' else 'attente' end, v_existant.id, p_seance)
      returning id into v_mail;
    end if;
  elsif p_origine = 'site' and (
    (select count(*) from public.klub_inscriptions i
     join public.klub_seances x on x.id = i.seance_id
     where i.email = v_email and i.statut in ('confirmee', 'attente', 'paiement')
       and x.statut = 'publiee' and x.debut > now()) >= 6
    or (select count(*) from public.klub_mails m
        join public.klub_inscriptions i on i.id = m.inscription_id
        where i.email = v_email and m.created_at > now() - interval '24 hours') >= 10
  ) then
    -- Plafond atteint : rien n'est inséré ni mis en file, même réponse
    -- qu'une nouvelle inscription.
    v_mail := null;
  else
    if public.klub__places_prises(p_seance) < s.capacite
       or p_si_complet = 'forcer' then
      v_statut := case when v_payant then 'paiement' else 'confirmee' end;
    else
      v_statut := 'attente';
    end if;
    v_montant := case
      when v_a_deux then 2 * s.prix_duo_centimes
      when v_statut = 'paiement' then s.prix_centimes
    end;
    -- `clock_timestamp()` et non le `now()` par défaut : l'ordre de la liste
    -- d'attente suit la prise du verrou, pas le début de la transaction.
    insert into public.klub_inscriptions (seance_id, prenom, nom, email, telephone, premiere_seance, statut, origine,
                                          created_at, paiement_expire_at, montant_centimes, nb_personnes, accompagnant)
    values (p_seance, left(btrim(p_prenom, c_blancs), 60), left(btrim(p_nom, c_blancs), 60), v_email, v_tel,
            coalesce(p_premiere, false), v_statut, p_origine, clock_timestamp(),
            case when v_statut = 'paiement' then now() + interval '35 minutes' end,
            v_montant,
            case when v_a_deux then 2 else 1 end,
            case when v_a_deux then left(v_accompagnant, 120) end)
    returning id into v_id;
    -- En paiement : la confirmation part quand Stripe notifie le paiement.
    if v_statut <> 'paiement' then
      insert into public.klub_mails (type, inscription_id, seance_id)
      values (case when v_statut = 'confirmee' then 'confirmation' else 'attente' end, v_id, p_seance)
      returning id into v_mail;
    end if;

    if v_statut = 'attente' then
      select count(*) into v_rang
      from public.klub_inscriptions a, public.klub_inscriptions moi
      where moi.id = v_id and a.seance_id = p_seance and a.statut = 'attente'
        and (a.created_at, a.id) <= (moi.created_at, moi.id);
    end if;

    return jsonb_build_object('statut', v_statut, 'rang', v_rang, 'mail_id', v_mail, 'debut', s.debut, 'titre', s.titre,
                              'inscription_id', v_id);
  end if;

  -- Doublon ou plafond : ce qu'une nouvelle inscription recevrait maintenant.
  if public.klub__places_prises(p_seance) < s.capacite
     or p_si_complet = 'forcer' then
    v_statut := 'confirmee';
  else
    v_statut := 'attente';
    v_rang := 1 + (select count(*) from public.klub_inscriptions where seance_id = p_seance and statut = 'attente');
  end if;

  return jsonb_build_object('statut', v_statut, 'rang', v_rang, 'mail_id', v_mail, 'debut', s.debut, 'titre', s.titre,
                            'inscription_id', v_id);
end;
$function$;
