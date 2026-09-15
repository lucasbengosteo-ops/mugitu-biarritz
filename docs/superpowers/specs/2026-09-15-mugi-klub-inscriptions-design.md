# Mugi Klub : inscriptions en ligne aux séances

Date : 15 septembre 2026
Statut : validé à l'oral, en relecture
Branche : `feature/klub-inscriptions`

## Objectif

Mettre en ligne les premières séances du Mugi Klub. Un visiteur voit le planning réel, s'inscrit sans créer de compte et paie sur place. Les places sont comptées, une liste d'attente prend le relais quand une séance est complète, et l'équipe gère le tout depuis l'admin existant.

## Décisions prises

| Sujet | Décision |
|---|---|
| Périmètre | Inscription en ligne, paiement sur place |
| Planning | Créneaux hebdomadaires (small groups) et séances ponctuelles (ateliers, conférences, soirées) |
| Inscription | Formulaire simple, sans compte : prénom, nom, e-mail, téléphone |
| Séance complète | Liste d'attente avec promotion automatique |
| Tarifs | Ceux de la page Préparation physique : 15 € la séance, 10 € la séance d'essai, 15 € l'essai à deux, groupes de 4 à 5 |
| Architecture | Tout sur l'infrastructure du site : Supabase (projet `nuehdfyscqnkckudkqhe`), Brevo, Vercel |

## Hors périmètre

Paiement en ligne, comptes adhérents, abonnements et cartes de séances, SMS, inscription de plusieurs personnes en un seul envoi, sanction des absences, version basque.

## 1. Données

Les trois tables remplacent `klub_events`, dont les 15 lignes sont fictives. `klub_events`, `lib/klub-events.ts` et `components/site/MugiKlubPlanning.tsx` sont supprimés à la fin du chantier.

Toutes les heures sont stockées en `timestamptz` et calculées dans le fuseau `Europe/Paris`, pour que le passage à l'heure d'hiver ne décale pas les séances.

### `klub_creneaux` : modèles hebdomadaires

| Colonne | Type | Note |
|---|---|---|
| `id` | uuid | |
| `jour` | smallint | 1 = lundi … 7 = dimanche |
| `heure` | time | heure de Paris |
| `duree_min` | smallint | |
| `type` | text | `small`, `atelier`, `conf`, `soiree` |
| `titre` | text | |
| `description` | text | |
| `intervenant` | text | nom affiché |
| `intervenant_email` | text, nullable | reçoit la liste des inscrits |
| `capacite` | smallint, nullable | nul si l'inscription n'est pas requise |
| `prix_libelle` | text | ex. « 15 € · essai 10 € » |
| `inscription_requise` | boolean | |
| `actif` | boolean | faux = en pause |
| `created_at`, `updated_at` | timestamptz | |

### `klub_seances` : séances datées

Mêmes champs descriptifs que le créneau (`type`, `titre`, `description`, `intervenant`, `intervenant_email`, `duree_min`, `capacite`, `prix_libelle`, `inscription_requise`), recopiés à la génération pour qu'une séance puisse être modifiée seule. S'y ajoutent :

| Colonne | Type | Note |
|---|---|---|
| `id` | uuid | sert d'adresse publique |
| `creneau_id` | uuid, nullable | nul pour une séance ponctuelle |
| `debut` | timestamptz | |
| `statut` | text | `publiee` ou `annulee` |
| `modifiee` | boolean | vrai dès qu'on la modifie seule : le créneau ne l'écrase plus |

Contrainte d'unicité sur `(creneau_id, debut)` pour que la génération soit rejouable sans doublon.

### `klub_inscriptions`

| Colonne | Type | Note |
|---|---|---|
| `id` | uuid | |
| `seance_id` | uuid | |
| `prenom`, `nom` | text | |
| `email` | text | stocké en minuscules |
| `telephone` | text | |
| `premiere_seance` | boolean | case « C'est ma première séance au Klub » |
| `statut` | text | `confirmee`, `attente`, `annulee` |
| `present` | boolean | coché par l'équipe pendant la séance |
| `origine` | text | `site` ou `admin` |
| `jeton` | text | aléatoire, 32 octets, sert au lien d'annulation |
| `created_at`, `updated_at` | timestamptz | `created_at` fixe le rang en liste d'attente |

Index unique partiel sur `(seance_id, email)` quand `statut <> 'annulee'` : une adresse ne peut tenir qu'une inscription active par séance. Après une annulation, elle peut se réinscrire.

### `klub_mails` : file d'envoi

| Colonne | Type | Note |
|---|---|---|
| `id` | uuid | |
| `type` | text | voir la section 4 |
| `inscription_id` | uuid, nullable | |
| `seance_id` | uuid | |
| `envoyer_apres` | timestamptz | |
| `statut` | text | `a_envoyer`, `envoye`, `erreur`, `abandonne` |
| `tentatives` | smallint | |
| `derniere_erreur` | text | |
| `created_at`, `envoye_at` | timestamptz | |

Le contenu du mail n'est pas stocké : il est construit au moment de l'envoi à partir de la séance et de l'inscription, donc une séance modifiée entre-temps part avec les bonnes informations. Index unique `nulls not distinct` sur `(type, inscription_id, seance_id)`, limité aux types `rappel` et `liste_intervenant`, : ces mails ne partent qu'une fois.

## 2. Règles

**Génération.** Chaque créneau actif produit ses séances sur les 28 jours à venir. La génération est rejouable : elle n'insère que les séances manquantes.

**Modifier un créneau.** Les changements s'appliquent aux séances futures du créneau qui n'ont aucune inscription active et ne sont pas marquées `modifiee`. Les autres restent telles quelles ; l'admin affiche combien de séances n'ont pas été mises à jour.

**Mettre un créneau en pause.** Les séances futures sans inscription active sont supprimées. Celles qui ont des inscrits restent, et l'équipe décide de les annuler ou non.

**S'inscrire.** Dans une seule transaction, la séance est verrouillée (`select … for update`) :
1. séance inexistante, annulée, déjà commencée ou sans inscription requise → refus avec un code d'erreur ;
2. adresse déjà inscrite (hors annulées) → aucune nouvelle ligne, le mail correspondant est remis en file (confirmation ou attente) et la réponse est identique à une première inscription ;
3. places confirmées < capacité → `confirmee` ;
4. sinon → `attente`, avec le rang.

Le verrou garantit que deux envois simultanés sur la dernière place donnent une confirmation et une mise en attente.

Une place libérée à moins de 2 heures du début (règle suivante) peut être prise par un nouveau visiteur alors que des personnes attendent. C'est voulu : elles n'auraient pas le temps de lire le mail.

**Annuler (visiteur).** Possible jusqu'au début de la séance, par le jeton. L'inscription passe à `annulee`. Si elle était `confirmee` et que le début est à plus de 2 heures, la plus ancienne inscription `attente` passe à `confirmee` et un mail `promotion` est mis en file. Toujours sous verrou de la séance.

**Augmenter la capacité (admin).** Même promotion, autant de fois que de places ajoutées, avec le même seuil de 2 heures.

**Annuler une séance (admin).** Statut `annulee`, un mail `seance_annulee` par inscription active (confirmée ou en attente). Les inscriptions gardent leur statut pour l'historique.

**Modifier une séance avec inscrits (admin).** Si la date, l'heure, la durée ou l'intervenant changent, un mail `seance_modifiee` part à chaque inscription active. Une modification du texte seul (titre, description, prix) n'envoie rien.

**Conservation.** Les séances terminées depuis plus de 12 mois sont supprimées avec leurs inscriptions et leurs mails.

## 3. Sécurité

Même principe que les jeux et la newsletter.

- RLS activée sur les quatre tables. Aucune politique pour `anon`.
- `authenticated` avec `is_practitioner()` : lecture et écriture directes sur `klub_creneaux` et `klub_seances` ; lecture sur `klub_inscriptions` et `klub_mails`. Les écritures qui touchent aux places passent par des fonctions.
- Fonctions `security definer`, `set search_path = ''` :

| Fonction | Exécutable par | Rôle |
|---|---|---|
| `klub_planning(du, au)` | anon | séances publiées sur la période, avec `places_restantes` et `nb_attente`, sans aucune donnée personnelle |
| `klub_seance(id)` | anon | une séance, mêmes champs |
| `klub_annulation_infos(jeton)` | anon | séance et prénom liés au jeton, rien d'autre |
| `klub_inscrire(...)` | service_role | règle d'inscription, met le mail en file, renvoie statut, rang et id du mail |
| `klub_annuler(jeton)` | service_role | règle d'annulation et promotion |
| `klub_admin_ajouter(...)` | authenticated, contrôle `is_practitioner()` | inscription `origine = admin` ; si complet, choix entre attente et dépassement de capacité |
| `klub_admin_annuler_inscription(id)` | idem | même règle que l'annulation visiteur |
| `klub_admin_capacite(seance_id, capacite)` | idem | changement de capacité et promotions |
| `klub_admin_annuler_seance(id)` | idem | annulation et mails |
| `klub_admin_modifier_seance(...)` | idem | modification, `modifiee = true`, mails si nécessaire |
| `klub_admin_sauver_creneau(...)` | idem | création ou modification et propagation |
| `klub_tache()` | service_role | génération, mise en file des rappels et listes intervenant, purge |

- Aucune fonction accessible à `anon` ne renvoie une adresse e-mail, un téléphone ou un jeton autre que celui fourni. C'est la faille corrigée sur `newsletter_relance`, à ne pas reproduire.
- Nouvelles variables Vercel : `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement, jamais préfixée `NEXT_PUBLIC_`) et `CRON_SECRET`. Redéployer après les avoir posées.

## 4. Mails

Expéditeur `bonjour@mugitu-biarritz.fr` via `lib/newsletter.ts` (fonction d'envoi Brevo existante, à extraire dans `lib/brevo.ts`). Vouvoiement. Rédaction selon `~/Documents/marqueurs-langage-ia-brief-design.md`.

| Type | Quand | Destinataire | Contenu |
|---|---|---|---|
| `confirmation` | inscription confirmée | la personne | date, heure, durée, intervenant, adresse 3 avenue Kléber, prix payé sur place, pièce jointe `.ics`, lien d'annulation |
| `attente` | mise en attente | la personne | rang, annonce d'un second mail si une place se libère, lien pour se retirer de la liste |
| `promotion` | sortie de liste d'attente | la personne | place confirmée, mêmes éléments que `confirmation` |
| `annulation` | annulation par la personne ou par l'équipe | la personne | confirmation courte, lien vers le planning |
| `rappel` | veille à 18 h (Paris) | inscrits confirmés | rappel, lien d'annulation en avant ; non envoyé si l'inscription date d'après 18 h la veille |
| `seance_modifiee` | modification qui compte | inscriptions actives | ce qui change, lien d'annulation |
| `seance_annulee` | annulation par l'équipe | inscriptions actives | annulation, lien vers le planning |
| `liste_intervenant` | 2 h avant le début | `intervenant_email` | prénom, nom, téléphone, mention première séance, liste d'attente ; seulement s'il y a au moins un inscrit |

Le lien d'annulation mène à `/mugi-klub/annulation?jeton=…`.

## 5. Envoi et tâche planifiée

- **Envoi immédiat.** Les routes d'inscription et d'annulation envoient le mail qu'elles viennent de mettre en file dès la réponse partie (`after()` de Next). Succès → `envoye`. Échec → la ligne reste `a_envoyer` et la tâche reprend.
- **Tâche.** `vercel.json` déclare un cron `* * * * *` sur `/api/klub/tache` (plan Pro vérifié le 15 septembre 2026). La route refuse toute requête sans `Authorization: Bearer ${CRON_SECRET}`. Elle appelle `klub_tache()`, puis envoie les mails `a_envoyer` dont `envoyer_apres <= now()`, par lots de 50.
- **Échecs.** Trois tentatives, espacées de 1, 5 puis 15 minutes, puis `erreur`. L'admin affiche les mails en erreur avec un bouton pour relancer.
- L'appel chaque minute garde aussi la base Supabase éveillée.

## 6. Parcours du visiteur

### Routes

À ajouter dans `lib/routes.ts` : `klubSeance(id)`, `klubAnnulation`.

| Route | Rendu |
|---|---|
| `/mugi-klub` | planning, `revalidate = 60`, plus `revalidatePath` après chaque écriture |
| `/mugi-klub/seance/[id]` | page de la séance et formulaire, même cache |
| `/mugi-klub/annulation` | dynamique, `robots: noindex` |
| `POST /api/klub/inscription` | |
| `POST /api/klub/annulation` | |
| `GET /api/klub/tache` | cron |

### Planning

Séances des quatre semaines à venir, semaine par semaine, avec navigation. Chaque carte affiche l'état : « 3 places sur 5 », « Complet, liste d'attente ouverte », « Entrée libre », « Annulée » (barrée, visible jusqu'à la date prévue). Le voile `KlubBientot` est retiré de la page.

Corrections de contenu dans `lib/klub.ts` et `app/mugi-klub/page.tsx` : suppression de l'abonnement à 59 €/mois, de la carte de 10 séances à 120 €, du sauna et de la remise sur les soins ; affichage des tarifs de la section « Décisions » ; les boutons vers `app.mugitu.pro` pointent vers le planning.

### Page de séance

Date, heure, durée, intervenant, description, prix, lieu. Formulaire : prénom, nom, e-mail, téléphone (format français ou international), case « C'est ma première séance au Klub », champ piège invisible. Mention « Le paiement se fait sur place » et lien vers la politique de confidentialité. Pour l'essai à deux, chaque personne s'inscrit séparément.

### Réponses

| Cas | Écran |
|---|---|
| Confirmée | « C'est noté pour mardi 22 septembre à 12 h 30 », rappel du mail |
| Attente | « Vous êtes 2ᵉ sur la liste d'attente » |
| Déjà inscrit | même écran que la première inscription, mail renvoyé |
| Commencée, annulée, introuvable | message et lien vers les prochaines séances |
| Champ invalide | erreur sous le champ |
| Brevo indisponible | écran normal ; le mail part via la file |

Les codes d'erreur suivent le modèle de `lib/jeux.ts` (`ERREURS`, `codeErreur()`).

### Annulation

La page affiche la séance et le prénom, avec un bouton « Libérer ma place » ou « Quitter la liste d'attente ». Ouvrir le lien n'annule rien, parce que certaines messageries visitent les liens pour les analyser. Jeton inconnu, séance passée ou inscription déjà annulée : message adapté.

## 7. Admin

`/admin/mugi-klub`, connexion existante, `components/admin/KlubAdmin.tsx` réécrit en deux onglets. On garde le modèle de mise à jour fonctionnelle (`onChange((d) => …)`) corrigé en PR #23.

**Créneaux.** Liste, création, modification, pause. Après enregistrement, message du type « 6 séances mises à jour, 2 conservées car elles ont des inscrits ».

**Séances.** Les 28 jours à venir, groupés par jour, avec le remplissage (« 4/5 · 2 en attente »). Création d'une séance ponctuelle. Détail d'une séance :
- inscrits confirmés avec téléphone, mention première séance, case présent ;
- liste d'attente dans l'ordre ;
- ajout manuel ;
- annulation d'une inscription ;
- modification de la séance et de sa capacité ;
- annulation de la séance, avec confirmation qui indique le nombre de personnes prévenues.

Un encart signale les mails en erreur.

## 8. Confidentialité

La page `/confidentialite` gagne une section Mugi Klub : données collectées, finalité (organiser les séances et prévenir les participants), destinataires (équipe Mugitu, intervenant de la séance), conservation 12 mois après la séance, droits par écrit à `contact@mugitu-biarritz.fr`. L'inscription au Klub n'inscrit pas à la lettre d'information.

## 9. Tests

Pas de framework de test dans le dépôt. Les vérifications sont :

1. **Scénarios SQL** dans `supabase/tests/klub.sql`, exécutés dans une transaction annulée à la fin : dernière place disputée par deux sessions, promotion à plus de 2 heures, absence de promotion à moins de 2 heures, adresse déjà inscrite, réinscription après annulation, séance commencée, génération rejouée sans doublon, propagation d'un créneau qui épargne les séances avec inscrits, purge.
2. **Contrôle des droits** : `anon` ne peut ni lire les tables ni appeler les fonctions `service_role` ; aucune fonction `anon` ne renvoie de donnée personnelle. `get_advisors` sécurité sans nouvelle alerte.
3. **Build et lint** : `npm run build`, `npm run lint`.
4. **Production** : séance test créée depuis l'admin, inscription avec l'adresse de Lucas, mise en attente avec une seconde adresse, annulation, réception de la promotion, du rappel et de la liste intervenant. La séance test et ses lignes sont supprimées ensuite.

## 10. Mise en service

1. Migration des tables, fonctions et politiques.
2. Variables `SUPABASE_SERVICE_ROLE_KEY` et `CRON_SECRET` posées par Lucas dans Vercel.
3. Déploiement de la branche, tests de la section 9.
4. Saisie des vrais créneaux par l'équipe dans l'admin.
5. Retrait du voile et suppression de `klub_events` une fois le planning rempli.
