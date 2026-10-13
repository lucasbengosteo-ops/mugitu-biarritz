-- Mugi Klub : la page d'annulation annonce le montant réellement payé.
-- Un duo payé 60 € affichait « Annulation remboursée : 40 € », le prix seul
-- de la séance (constaté au parcours de test Stripe du 13 oct. 2026). Le
-- remboursement, lui, rend bien le paiement entier.
--
-- Corps repris de la production le 13 oct. 2026 ; changement : une clé en
-- plus, `montant_centimes` de l'inscription.
create or replace function public.klub_annulation_infos(p_jeton text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object('prenom', i.prenom, 'statut', i.statut, 'seance', public.klub__seance_publique(s),
                            'paye', i.stripe_paiement is not null,
                            'montant_centimes', i.montant_centimes,
                            'rembourse_si_annule', i.stripe_paiement is not null and s.debut - now() > interval '24 hours')
  from public.klub_inscriptions i
  join public.klub_seances s on s.id = i.seance_id
  where i.jeton = p_jeton;
$$;
