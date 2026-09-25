-- Agenda : refermer les deux fonctions internes laissées ouvertes.
--
-- Postgres accorde EXECUTE à PUBLIC par défaut. Les migrations du socle
-- révoquent sur les fonctions appelées depuis le navigateur mais ont oublié
-- ces deux-là. Ni l'une ni l'autre ne fuite quoi que ce soit — la première
-- ne lit que ses paramètres, la seconde échoue hors contexte de déclencheur
-- — mais le motif du dépôt est de ne rien laisser ouvert par défaut.
--
-- Révoquer sur une fonction de déclencheur ne la désarme pas : Postgres
-- vérifie le privilège à la création du déclencheur, pas à chaque ligne.
-- Vérifié sur la base : l'auto-attribution est toujours refusée.

revoke all on function public.agenda__libelle_case(text, smallint, text) from public, anon, authenticated;
revoke all on function public.agenda__garde_transition() from public, anon, authenticated;
