-- Mugi Klub : la route qui envoie vers Stripe doit savoir si la session déjà
-- créée est encore ouverte. Une session dure 31 min, une place proposée à la
-- liste d'attente est gardée 6 h : réutiliser l'adresse sans vérifier
-- renverrait vers une page de paiement expirée.
--
-- Corps repris de la production le 13 oct. 2026 ; changement : deux clés en
-- plus, l'identifiant de la session et le compte Stripe sur lequel elle a été
-- créée (le praticien de la séance a pu changer depuis).
create or replace function public.klub_paiement_infos(p_inscription uuid, p_jeton text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'inscription_id', i.id, 'email', i.email, 'jeton', i.jeton,
    'montant_centimes', i.montant_centimes, 'expire_at', i.paiement_expire_at,
    'session_url', i.stripe_session_url,
    'session_id', i.stripe_session, 'session_compte', i.stripe_compte,
    'seance_id', s.id, 'titre', s.titre, 'debut', s.debut,
    'compte', c.compte)
  from public.klub_inscriptions i
  join public.klub_seances s on s.id = i.seance_id
  join public.site_comptes_stripe c on c.user_id = s.praticien_id and c.etat = 'pret'
  where (i.id = p_inscription or i.jeton = p_jeton)
    and i.statut = 'paiement' and i.paiement_expire_at > now()
    and s.statut = 'publiee';
$$;
