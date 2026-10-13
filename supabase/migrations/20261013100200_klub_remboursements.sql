-- Mugi Klub : annulations remboursées. Spec § 4.
-- Spec : docs/superpowers/specs/2026-10-13-klub-paiement-design.md.
--
-- Tous les remboursements passent par une file (remboursement = 'a_faire'),
-- vidée par la tâche minute : l'admin annule depuis le navigateur, qui ne peut
-- pas appeler Stripe, et une file se rejoue sans risque. Une inscription n'est
-- mise en file qu'une fois (remboursement is null), et seulement si elle a été
-- payée (stripe_paiement non nul) : une place en `paiement` ne se rembourse pas.
--
-- Qui met en file :
--   klub__annuler                 client, plus de 24 h avant le début
--   klub_admin_annuler_inscription l'admin, s'il le choisit (p_rembourser)
--   klub_admin_annuler_seance     toute inscription payée de la séance
--   klub_paiement_confirme        paiement arrivé trop tard ('tardif')

alter table public.klub_inscriptions
  add column remboursement text check (remboursement in ('a_faire', 'fait', 'erreur')),
  add column remboursement_tentatives smallint not null default 0,
  add column remboursement_erreur text,
  add column stripe_remboursement text,
  add column rembourse_at timestamptz;

-- updated_at est tenu par le déclencheur klub_inscriptions_touch : une
-- tentative en échec repasse en fin de file.
create index klub_inscriptions_a_rembourser on public.klub_inscriptions (updated_at) where remboursement = 'a_faire';

-- Met une inscription payée en file de remboursement, une fois.
-- Aide interne, appelée par des fonctions security definer seulement :
-- retirée aussi à service_role, comme les autres klub__*.
create or replace function public.klub__a_rembourser(p_inscription uuid)
returns void
language sql
set search_path = ''
as $$
  update public.klub_inscriptions set remboursement = 'a_faire'
  where id = p_inscription and stripe_paiement is not null and remboursement is null;
$$;
revoke all on function public.klub__a_rembourser(uuid) from public, anon, authenticated, service_role;

-- Corps repris de la production le 13 oct. 2026, changements :
--  - annulation par le client plus de 24 h avant le début : l'inscription
--    payée est mise en file de remboursement ;
--  - le JSON d'une annulation gagne 'rembourse' : vrai si le paiement est en
--    file ou déjà remboursé (par exemple depuis le tableau de bord Stripe).
--    Le remboursement d'une annulation par l'admin se décide dans
--    klub_admin_annuler_inscription, pas ici.
create or replace function public.klub__annuler(p_inscription uuid, p_admin boolean)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  v_seance uuid;
  s public.klub_seances;
  i public.klub_inscriptions;
  v_mail uuid;
  v_rembourse boolean;
begin
  select seance_id into v_seance from public.klub_inscriptions where id = p_inscription;
  if v_seance is null then return jsonb_build_object('resultat', 'inconnu'); end if;
  -- Même ordre de verrouillage que l'inscription : la séance d'abord.
  select * into s from public.klub_seances where id = v_seance for no key update;
  if not found then return jsonb_build_object('resultat', 'inconnu'); end if;
  select * into i from public.klub_inscriptions where id = p_inscription for no key update;
  if not found then return jsonb_build_object('resultat', 'inconnu'); end if;
  if i.statut = 'annulee' then return jsonb_build_object('resultat', 'deja', 'seance_id', s.id); end if;
  -- Séance annulée : rien à faire, pour le visiteur comme pour l'admin (pas de
  -- second mail après celui de l'annulation de la séance).
  if s.statut = 'annulee' then return jsonb_build_object('resultat', 'seance_annulee', 'seance_id', s.id); end if;
  if (not p_admin and s.debut <= now())
     or (p_admin and s.debut + make_interval(mins => s.duree_min::int) <= now()) then
    return jsonb_build_object('resultat', 'passee', 'seance_id', s.id);
  end if;
  update public.klub_inscriptions set statut = 'annulee' where id = i.id;
  insert into public.klub_mails (type, inscription_id, seance_id) values ('annulation', i.id, s.id) returning id into v_mail;
  if not p_admin and s.debut - now() > interval '24 hours' then
    perform public.klub__a_rembourser(i.id);
  end if;
  select remboursement in ('a_faire', 'fait') into v_rembourse from public.klub_inscriptions where id = i.id;
  if i.statut in ('confirmee', 'paiement') then perform public.klub__remplir(s.id); end if;
  return jsonb_build_object('resultat', 'annulee', 'seance_id', s.id, 'mail_id', v_mail,
                            'rembourse', coalesce(v_rembourse, false));
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changements :
--  - nouveau paramètre p_rembourser (défaut faux : l'appel sans lui garde le
--    comportement d'avant) ; s'il est vrai et que l'inscription vient d'être
--    annulée, son paiement est mis en file de remboursement ;
--  - le JSON gagne 'rembourse', comme celui de klub__annuler.
-- Le changement de signature crée une nouvelle fonction : l'ancienne est
-- supprimée (aucune fonction en base ne l'appelait, vérifié le 13 oct. 2026 ;
-- le back-office l'appelle avec p_id seul, ce que la nouvelle accepte).
drop function public.klub_admin_annuler_inscription(uuid);

create or replace function public.klub_admin_annuler_inscription(p_id uuid, p_rembourser boolean default false)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  v_r jsonb;
  v_rembourse boolean;
begin
  perform public.klub__verifier_droits();
  v_r := public.klub__annuler(p_id, true);
  -- Seulement une annulation faite par cet appel : ni une séance passée, ni
  -- une inscription déjà annulée ou dont la séance l'est (déjà en file).
  if v_r->>'resultat' = 'annulee' then
    if coalesce(p_rembourser, false) then perform public.klub__a_rembourser(p_id); end if;
    select remboursement in ('a_faire', 'fait') into v_rembourse from public.klub_inscriptions where id = p_id;
    v_r := v_r || jsonb_build_object('rembourse', coalesce(v_rembourse, false));
  end if;
  return v_r;
end;
$function$;
-- Mêmes droits que l'ancienne : authenticated seul (les droits se vérifient
-- dans klub__verifier_droits).
revoke all on function public.klub_admin_annuler_inscription(uuid, boolean) from public, anon, authenticated, service_role;
grant execute on function public.klub_admin_annuler_inscription(uuid, boolean) to authenticated;

-- Corps repris de la production le 13 oct. 2026, changement : chaque
-- inscription payée de la séance est mise en file de remboursement, y compris
-- celle d'une personne qui avait annulé à moins de 24 h (la séance n'a pas
-- lieu). Le nombre renvoyé reste celui des mails `seance_annulee`.
create or replace function public.klub_admin_annuler_seance(p_id uuid)
 returns integer
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  s public.klub_seances;
  v_n integer;
begin
  perform public.klub__verifier_droits();
  select * into s from public.klub_seances where id = p_id for no key update;
  if not found then raise exception 'KLUB_SEANCE'; end if;
  if s.statut = 'annulee' then return 0; end if;
  update public.klub_seances set statut = 'annulee' where id = p_id;
  -- Les mails pas encore partis n'ont plus de sens, sauf la confirmation
  -- d'une annulation demandée par l'inscrit.
  update public.klub_mails set statut = 'abandonne', reserve_at = null
  where seance_id = p_id and statut = 'a_envoyer' and type <> 'annulation';
  with ins as (
    insert into public.klub_mails (type, inscription_id, seance_id)
    select 'seance_annulee', i.id, p_id from public.klub_inscriptions i
    where i.seance_id = p_id and i.statut in ('confirmee', 'attente', 'paiement')
    returning 1
  )
  select count(*) into v_n from ins;
  perform public.klub__a_rembourser(i.id) from public.klub_inscriptions i
  where i.seance_id = p_id and i.stripe_paiement is not null and i.remboursement is null;
  return v_n;
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changement : un paiement
-- 'tardif' (réservation expirée, inscription annulée, ou séance plus publiée)
-- est mis en file de remboursement avant de répondre.
create or replace function public.klub_paiement_confirme(p_session text, p_paiement text, p_montant integer)
 returns text
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  i public.klub_inscriptions;
  v_seance_statut text;
begin
  select * into i from public.klub_inscriptions where stripe_session = p_session;
  if not found then return 'inconnu'; end if;
  select statut into v_seance_statut from public.klub_seances where id = i.seance_id for no key update;
  select * into i from public.klub_inscriptions where id = i.id for no key update;

  if i.stripe_paiement is not null then return 'deja'; end if;

  update public.klub_inscriptions
  set stripe_paiement = p_paiement, montant_centimes = p_montant, paye_at = now()
  where id = i.id;

  if i.statut = 'paiement' and v_seance_statut = 'publiee' then
    update public.klub_inscriptions set statut = 'confirmee', paiement_expire_at = null where id = i.id;
    insert into public.klub_mails (type, inscription_id, seance_id) values ('confirmation', i.id, i.seance_id);
    return 'confirmee';
  end if;
  perform public.klub__a_rembourser(i.id);
  return 'tardif';
end;
$function$;

-- Corps repris de la production le 13 oct. 2026, changements : ajout de
-- 'paye' et 'rembourse_si_annule', pour que la page d'annulation dise avant
-- confirmation si la séance sera remboursée ou due.
create or replace function public.klub_annulation_infos(p_jeton text)
 returns jsonb
 language sql
 stable security definer
 set search_path to ''
as $function$
  select jsonb_build_object('prenom', i.prenom, 'statut', i.statut, 'seance', public.klub__seance_publique(s),
                            'paye', i.stripe_paiement is not null,
                            'rembourse_si_annule', i.stripe_paiement is not null and s.debut - now() > interval '24 hours')
  from public.klub_inscriptions i
  join public.klub_seances s on s.id = i.seance_id
  where i.jeton = p_jeton;
$function$;

-- La file, pour la tâche minute.
create or replace function public.klub_remboursements_a_faire(p_limite integer)
returns table (inscription_id uuid, compte text, paiement text)
language sql
security definer
set search_path = ''
as $$
  select id, stripe_compte, stripe_paiement from public.klub_inscriptions
  where remboursement = 'a_faire'
  order by updated_at
  limit greatest(least(coalesce(p_limite, 10), 50), 1);
$$;

-- Résultat d'une tentative : un identifiant Stripe, ou une erreur.
-- Après 5 échecs, l'inscription passe en 'erreur' et n'est plus retentée.
create or replace function public.klub_remboursement_resultat(
  p_inscription uuid, p_remboursement text, p_erreur text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_remboursement is not null then
    update public.klub_inscriptions
    set remboursement = 'fait', stripe_remboursement = p_remboursement, rembourse_at = now(), remboursement_erreur = null
    where id = p_inscription and remboursement = 'a_faire';
  else
    update public.klub_inscriptions
    set remboursement_tentatives = remboursement_tentatives + 1,
        remboursement_erreur = left(p_erreur, 500),
        remboursement = case when remboursement_tentatives + 1 >= 5 then 'erreur' else 'a_faire' end
    where id = p_inscription and remboursement = 'a_faire';
  end if;
end;
$$;

-- Notification `charge.refunded` : un remboursement fait depuis le tableau
-- de bord Stripe du praticien est aussi constaté.
create or replace function public.klub_paiement_rembourse(p_paiement text, p_remboursement text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.klub_inscriptions
  set remboursement = 'fait', stripe_remboursement = coalesce(stripe_remboursement, p_remboursement),
      rembourse_at = coalesce(rembourse_at, now())
  where stripe_paiement = p_paiement and remboursement is distinct from 'fait';
$$;

revoke all on function public.klub_remboursements_a_faire(integer) from public, anon, authenticated;
revoke all on function public.klub_remboursement_resultat(uuid, text, text) from public, anon, authenticated;
revoke all on function public.klub_paiement_rembourse(text, text) from public, anon, authenticated;
grant execute on function public.klub_remboursements_a_faire(integer) to service_role;
grant execute on function public.klub_remboursement_resultat(uuid, text, text) to service_role;
grant execute on function public.klub_paiement_rembourse(text, text) to service_role;

-- Comptes Stripe : création et état, par le serveur.
create or replace function public.site_compte_stripe_enregistrer(p_user uuid, p_compte text, p_etat text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.site_comptes_stripe (user_id, compte, etat) values (p_user, p_compte, p_etat)
  on conflict (user_id) do update set compte = excluded.compte, etat = excluded.etat, updated_at = now();
$$;

create or replace function public.site_compte_stripe_etat(p_compte text, p_etat text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.site_comptes_stripe set etat = p_etat, updated_at = now() where compte = p_compte;
$$;
revoke all on function public.site_compte_stripe_enregistrer(uuid, text, text) from public, anon, authenticated;
revoke all on function public.site_compte_stripe_etat(text, text) from public, anon, authenticated;
grant execute on function public.site_compte_stripe_enregistrer(uuid, text, text) to service_role;
grant execute on function public.site_compte_stripe_etat(text, text) to service_role;
