-- Mugi Klub : séances individuelles, bilans offerts et réservation à deux.
-- Spec : docs/superpowers/specs/2026-10-13-klub-individuel-design.md (partie 3).
--
-- Relevé en production le 13 oct. 2026, avant d'écrire :
--  - contraintes de type : klub_creneaux_type_check, klub_seances_type_check ;
--  - klub_admin_creer_seance et klub_admin_sauver_creneau ne valident pas le
--    type en plpgsql : la contrainte suffit (check_violation -> KLUB_CHAMP) ;
--  - appelants de klub__inscrire : klub_inscrire et klub_admin_ajouter, seuls ;
--  - reservation_url existe sur les deux tables ;
--  - aucune séance ni aucun créneau des deux nouveaux types.
--
-- Fonctions redéfinies (corps repris de la production, changement en tête de
-- chacune) : klub__heriter_encaissement, klub__inscrire (nouvelle signature),
-- klub_inscrire (nouvelle signature), klub_admin_ajouter, klub__remplir,
-- klub__seance_publique, klub_admin_encaissement. Nouvelle : klub_admin_prix_duo.

-- 1. Les deux nouveaux types.
alter table public.klub_creneaux drop constraint klub_creneaux_type_check;
alter table public.klub_creneaux add constraint klub_creneaux_type_check
  check (type in ('small', 'atelier', 'conf', 'soiree', 'individuel', 'bilan'));
alter table public.klub_seances drop constraint klub_seances_type_check;
alter table public.klub_seances add constraint klub_seances_type_check
  check (type in ('small', 'atelier', 'conf', 'soiree', 'individuel', 'bilan'));

-- 2. Le prix duo, par personne.
alter table public.klub_creneaux
  add column prix_duo_centimes integer check (prix_duo_centimes is null or prix_duo_centimes between 0 and 100000);
alter table public.klub_seances
  add column prix_duo_centimes integer check (prix_duo_centimes is null or prix_duo_centimes between 0 and 100000);

-- 3. Règles des nouveaux types : une réservation par créneau, sur le site ;
-- un bilan est gratuit ; le prix duo n'existe que sur un individuel.
alter table public.klub_creneaux
  add constraint klub_creneaux_individuel check
    (type not in ('individuel', 'bilan') or (capacite = 1 and inscription_requise and reservation_url is null)) not valid,
  add constraint klub_creneaux_bilan_gratuit check
    (type <> 'bilan' or (prix_centimes is null and prix_duo_centimes is null)) not valid,
  add constraint klub_creneaux_prix_duo_individuel check
    (prix_duo_centimes is null or type = 'individuel') not valid;
alter table public.klub_creneaux validate constraint klub_creneaux_individuel;
alter table public.klub_creneaux validate constraint klub_creneaux_bilan_gratuit;
alter table public.klub_creneaux validate constraint klub_creneaux_prix_duo_individuel;

alter table public.klub_seances
  add constraint klub_seances_individuel check
    (type not in ('individuel', 'bilan') or (capacite = 1 and inscription_requise and reservation_url is null)) not valid,
  add constraint klub_seances_bilan_gratuit check
    (type <> 'bilan' or (prix_centimes is null and prix_duo_centimes is null)) not valid,
  add constraint klub_seances_prix_duo_individuel check
    (prix_duo_centimes is null or type = 'individuel') not valid;
alter table public.klub_seances validate constraint klub_seances_individuel;
alter table public.klub_seances validate constraint klub_seances_bilan_gratuit;
alter table public.klub_seances validate constraint klub_seances_prix_duo_individuel;

-- 4. Corps repris de la production le 13 oct. 2026, changement : le prix duo
-- s'hérite du créneau avec le praticien et le prix, dans les mêmes conditions
-- (rien n'est copié si la séance porte déjà l'un des trois).
create or replace function public.klub__heriter_encaissement()
 returns trigger
 language plpgsql
 set search_path to ''
as $function$
declare
  c record;
begin
  if new.creneau_id is null or new.praticien_id is not null or new.prix_centimes is not null
     or new.prix_duo_centimes is not null then return new; end if;
  select praticien_id, prix_centimes, prix_duo_centimes into c from public.klub_creneaux where id = new.creneau_id;
  new.praticien_id := c.praticien_id;
  new.prix_centimes := c.prix_centimes;
  new.prix_duo_centimes := c.prix_duo_centimes;
  return new;
end;
$function$;

-- 5. La réservation à deux. Une inscription existante vaut une personne.
alter table public.klub_inscriptions
  add column nb_personnes smallint not null default 1 check (nb_personnes in (1, 2)),
  add column accompagnant text check (accompagnant is null or char_length(btrim(accompagnant)) between 1 and 120),
  add constraint klub_inscriptions_duo check ((nb_personnes = 2) = (accompagnant is not null));

-- 6. Corps repris de la production le 13 oct. 2026, changements :
--  - deux paramètres en plus, p_a_deux et p_accompagnant (sans valeur par
--    défaut : un appelant oublié échoue au lieu d'inscrire seul) ;
--  - à deux : KLUB_DUO si la séance n'est pas un individuel qui propose le
--    duo, KLUB_ACCOMPAGNANT si le nom de la seconde personne est vide ou
--    dépasse 120 caractères. Vérifié avant toute écriture, doublon compris ;
--  - une nouvelle inscription garde nb_personnes et accompagnant ; le montant
--    d'une place en `paiement` est 2 × prix duo pour un duo ;
--  - un duo garde son montant même sans paiement en ligne (paiement sur place,
--    liste d'attente) : la promotion d'un duo s'y rabat si le créneau ne
--    propose plus le duo (voir klub__remplir). Une inscription seule garde
--    la règle d'avant (montant en `paiement` seulement) ;
--  - un doublon (même adresse, inscription active) garde ses choix d'origine.
create function public.klub__inscrire(p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean, p_origine text, p_si_complet text, p_a_deux boolean, p_accompagnant text)
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
  -- le paiement se fait alors sur place.
  v_payant := p_origine = 'site' and public.klub__paiement_en_ligne(s);

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
-- Mêmes droits que l'ancienne : aucun rôle, seules l'appellent des fonctions
-- security definer.
revoke all on function public.klub__inscrire(uuid, text, text, text, text, boolean, text, text, boolean, text)
  from public, anon, authenticated, service_role;

-- 7. Corps repris de la production le 13 oct. 2026, changements : deux
-- paramètres en fin de liste, avec une valeur par défaut. La route en
-- production appelle avec six arguments nommés : elle continue de marcher.
create function public.klub_inscrire(p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean, p_a_deux boolean default false, p_accompagnant text default null)
 returns jsonb
 language sql
 security definer
 set search_path to ''
as $function$
  select public.klub__inscrire(p_seance, p_prenom, p_nom, p_email, p_telephone, p_premiere, 'site', 'attente',
                               coalesce(p_a_deux, false), p_accompagnant);
$function$;
-- Mêmes droits que l'ancienne : la clé de service seule.
revoke all on function public.klub_inscrire(uuid, text, text, text, text, boolean, boolean, text)
  from public, anon, authenticated;
grant execute on function public.klub_inscrire(uuid, text, text, text, text, boolean, boolean, text) to service_role;
drop function public.klub_inscrire(uuid, text, text, text, text, boolean);

-- Corps repris de la production le 13 oct. 2026, changement : appelle la
-- nouvelle signature de klub__inscrire, toujours seul (l'admin n'inscrit pas
-- à deux ; le choix se fait sur le site).
create or replace function public.klub_admin_ajouter(p_seance uuid, p_prenom text, p_nom text, p_email text, p_telephone text, p_premiere boolean, p_si_complet text)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
begin
  perform public.klub__verifier_droits();
  return public.klub__inscrire(p_seance, p_prenom, p_nom, p_email, p_telephone, p_premiere, 'admin',
                               case when p_si_complet = 'forcer' then 'forcer' else 'attente' end, false, null);
end;
$function$;

-- Plus aucun appelant : l'ancienne signature disparaît.
drop function public.klub__inscrire(uuid, text, text, text, text, boolean, text, text);

-- 8. Corps repris de la production le 13 oct. 2026, changement : un duo promu
-- d'une séance payable en ligne paie 2 × prix duo ; si le créneau ne propose
-- plus le duo, il garde le montant enregistré à son inscription.
create or replace function public.klub__remplir(p_seance uuid)
 returns integer
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  s public.klub_seances;
  v_libres integer;
  v_promus integer := 0;
  v_id uuid;
  v_payant boolean;
begin
  select * into s from public.klub_seances where id = p_seance for no key update;
  if not found or s.statut <> 'publiee' or not s.inscription_requise or s.debut - now() <= interval '2 hours' then
    return 0;
  end if;
  v_payant := public.klub__paiement_en_ligne(s);
  v_libres := s.capacite - public.klub__places_prises(p_seance);
  while v_libres > 0 loop
    v_id := null;
    select id into v_id from public.klub_inscriptions
    where seance_id = p_seance and statut = 'attente'
    order by created_at, id limit 1;
    exit when v_id is null;
    if v_payant then
      update public.klub_inscriptions i
      set statut = 'paiement', paiement_expire_at = least(now() + interval '6 hours', s.debut),
          montant_centimes = case
            when i.nb_personnes = 2 then coalesce(2 * s.prix_duo_centimes, i.montant_centimes)
            else s.prix_centimes
          end
      where i.id = v_id;
      insert into public.klub_mails (type, inscription_id, seance_id) values ('place_liberee', v_id, p_seance);
    else
      update public.klub_inscriptions set statut = 'confirmee' where id = v_id;
      insert into public.klub_mails (type, inscription_id, seance_id) values ('promotion', v_id, p_seance);
    end if;
    v_libres := v_libres - 1;
    v_promus := v_promus + 1;
  end loop;
  return v_promus;
end;
$function$;

-- 9. Corps repris de la production le 13 oct. 2026, changement : ajout de
-- 'prix_duo_centimes'. Rien d'autre.
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
    'prix_duo_centimes', s.prix_duo_centimes,
    'paiement_en_ligne', public.klub__paiement_en_ligne(s),
    'inscription_requise', s.inscription_requise,
    'capacite', s.capacite,
    'statut', s.statut,
    'reservation_url', s.reservation_url,
    'reservation_libelle', s.reservation_libelle,
    'image', s.image,
    'image_focus', s.image_focus,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - public.klub__places_prises(s.id), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$function$;

-- 10. Corps repris de la production le 13 oct. 2026, changements :
--  - un praticien se rattache lui-même à un créneau ou une séance
--    `individuel` ou `bilan` (spec partie 3, § 5), si personne d'autre n'y
--    est rattaché ; jamais à un autre praticien, jamais sur un autre type ;
--  - pour ces deux types, la règle du prix se juge sur le praticien rattaché
--    à l'issue de l'appel (coalesce(p_praticien, v_praticien)) : celui qui
--    vient de se rattacher pose son prix dans le même appel. Pour les autres
--    types, rien ne change ;
--  - un prix sur un bilan lève KLUB_PRIX (au lieu de la violation de la
--    contrainte klub_*_bilan_gratuit, que l'écran ne saurait pas traduire).
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
  end if;
end;
$function$;

-- 11. Le prix duo s'écrit à part : klub_admin_encaissement est appelée avec
-- quatre arguments par le back-office actuel, un cinquième à null par défaut
-- effacerait le prix duo à chaque enregistrement. Mêmes droits que le prix :
-- gérant, ou praticien déjà rattaché (le back-office appelle donc
-- klub_admin_encaissement d'abord).
-- Codes : KLUB_DROITS, KLUB_CIBLE, KLUB_ENCAISSEMENT, KLUB_PRIX, KLUB_DUO.
create or replace function public.klub_admin_prix_duo(p_cible text, p_id uuid, p_prix_duo_centimes integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_praticien uuid;
  v_type text;
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if p_prix_duo_centimes is not null and (p_prix_duo_centimes < 0 or p_prix_duo_centimes > 100000) then
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
  end if;
end;
$$;
revoke all on function public.klub_admin_prix_duo(text, uuid, integer) from public, anon;
grant execute on function public.klub_admin_prix_duo(text, uuid, integer) to authenticated;
