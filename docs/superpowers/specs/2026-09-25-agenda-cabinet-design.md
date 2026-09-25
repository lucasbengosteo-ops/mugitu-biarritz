# Agenda du cabinet : la semaine type et sa validation

Date : 25 septembre 2026
Statut : validé à l'oral, en relecture
Branche : `feature/agenda-cabinet`
Chantier C du découpage du 17 septembre. A (coque et droits) est en production depuis le 25 septembre.

## Objectif

Chacun déclare les demi-journées où il souhaite être au cabinet, dans quelle salle. Les gérants arbitrent, refusent avec un mot, ou valident. Tout le monde voit la semaine de tout le monde.

## Décisions prises

| Sujet | Décision |
|---|---|
| Nature du vœu | Une semaine type qui se répète, pas des dates |
| Granularité | La demi-journée : matin ou après-midi, du lundi au vendredi |
| Salles | Les cinq de Mugicoloc : Lurra, Airea, Etera, Sua, Ura |
| Conflits | Deux vœux peuvent se poser sur la même case ; l'outil le signale, le gérant tranche |
| Métiers | Aucun blocage : la vocation de la salle est un repère, pas une règle |
| Quotas | Aucun ; la grille affiche les compteurs |
| Site public | Hors périmètre : l'agenda reste interne |
| Mails | Seulement les messages adressés à propos d'un vœu ; le reste est le chantier C2 |
| Retrait d'un vœu validé | Sur demande motivée, tranchée par un gérant ; jamais unilatéral |

## Hors périmètre

Les exceptions datées (congés, échanges de créneau, venue exceptionnelle) : la semaine type ne les exprime pas, et c'est assumé pour cette version. La publication des présences sur le site. Les redevances et le prorata que calcule Mugicoloc. Le récapitulatif quotidien et les notifications sur les articles et le Klub : chantier C2. Le parcours de prise en main dans l'admin : chantier C3.

## 1. Ce qui existe déjà

- `public.mugicoloc_planning` et `public.mugicoloc_public_sessions` : les deux tables du simulateur `public/mugicoloc.html`. **Toutes deux vides.** Le simulateur ne sauvegarde rien aujourd'hui. On n'y touche pas, et on ne s'y branche pas : son modèle est un unique blob `jsonb`, fait pour une simulation jetable, pas pour un agenda partagé.
- `public/mugicoloc.html` : source de vérité pour les noms et la vocation des salles. On recopie, on ne dépend pas du fichier.
- `public.site_est_equipe()` et `public.site_est_super_admin()` : les deux niveaux de droits posés au chantier A.
- `lib/brevo.ts` (`EXPEDITEUR`, envoi transactionnel) et la file `klub_mails` traitée par `/api/klub/tache`, cron chaque minute. On réutilise le code d'envoi et la route ; on ne touche ni à la table ni à la logique du Klub.

## 2. Le modèle

### Les salles

Dans le code, `lib/agenda/salles.ts`, sur le motif de `lib/evenements.ts` : une liste qui change une fois par an ne mérite pas d'écran de gestion.

| Identifiant | Nom | Vocation affichée |
|---|---|---|
| `lurra` | Lurra | Thérapie manuelle |
| `airea` | Airea | Thérapie manuelle |
| `etera` | Etera | Lab, psy, diététique |
| `sua` | Sua | Médecine du sport, préparation |
| `ura` | Ura | Récupération, massage |

La vocation est indicative. Elle n'interdit rien : dans le modèle de Mugicoloc, le podologue n'est admis dans aucune des cinq salles, alors qu'il fait partie de l'équipe et posera des vœux. Faire correspondre les rôles de `user_roles` aux métiers de Mugicoloc demanderait d'inventer une table de passage que personne n'a validée. Le gérant arbitre de toute façon : le blocage serait redondant.

### `agenda_voeux`

| Colonne | Type | Note |
|---|---|---|
| `id` | uuid, clé primaire | |
| `user_id` | uuid, référence `auth.users` | l'auteur du vœu |
| `salle` | text | l'un des cinq identifiants, contrainte `check` |
| `jour` | smallint | 1 = lundi … 5 = vendredi, contrainte `check` |
| `moment` | text | `matin` ou `aprem`, contrainte `check` |
| `statut` | text | `propose`, `valide`, `refuse`, `retrait_demande` |
| `decide_par` | uuid, nullable | le gérant qui a tranché |
| `decide_le` | timestamptz, nullable | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

Unicité sur `(user_id, salle, jour, moment)` : une personne ne demande pas deux fois la même case.

Un conflit n'est pas stocké, il se lit : plusieurs vœux vivants — `propose`, `valide` ou `retrait_demande` — sur la même `(salle, jour, moment)`. Un vœu `refuse` ne compte plus dans le conflit — c'est ce qui permet de le fermer.

**Une case ne porte qu'un seul vœu accordé.** Valider un vœu sur une case déjà tenue — par un vœu `valide` ou `retrait_demande` — lève `AGENDA_CASE_PRISE`, et l'écran dit lequel occupe la place. C'est la seule contrainte que l'outil impose au gérant : sans elle, « validé » ne garantit plus une salle à personne, et l'arbitrage n'a servi à rien.

Chacun **supprime librement ses vœux en `propose` ou en `refuse`** : tant que rien n'est accordé, rien n'est dû. La suppression emporte le fil de commentaires.

**Un vœu validé ne se supprime pas tout seul.** Une salle accordée engage le cabinet : l'horaire a pu être annoncé, un autre praticien a pu être refusé sur cette case. Son auteur appelle `agenda_demander_retrait(voeu_id, motif)`, qui passe le vœu en `retrait_demande`, inscrit le motif dans le fil et prévient les gérants. Le gérant accorde le retrait — le vœu est alors supprimé et la case se libère — ou le refuse, et le vœu redevient `valide`, avec un mot dans le fil. La discussion a lieu là où elle laisse une trace.

**Une case reste occupée tant que le retrait n'est pas accordé** : `valide` et `retrait_demande` tiennent la place l'un comme l'autre. Sinon une demande de retrait libérerait la case avant que personne n'ait tranché.

**Modifier un vœu validé le ramène en `propose`**, et efface `decide_par` et `decide_le`. Sans ça, la validation ne veut plus rien dire. La règle est tenue par un déclencheur, pas par l'interface : elle doit valoir aussi pour une écriture directe en base.

### `agenda_commentaires`

| Colonne | Type | Note |
|---|---|---|
| `id` | uuid, clé primaire | |
| `voeu_id` | uuid, référence `agenda_voeux`, `on delete cascade` | |
| `auteur_id` | uuid, référence `auth.users` | |
| `texte` | text, non vide | |
| `created_at` | timestamptz | |

Un fil par vœu. Un refus sans explication ne vaut rien, et la personne doit pouvoir répondre.

### Droits

| Table | Lecture | Écriture |
|---|---|---|
| `agenda_voeux` | toute l'équipe : la vision d'ensemble est le but | chacun crée les siens et supprime ceux qui ne sont ni `valide` ni `retrait_demande` ; seuls les gérants changent `statut`, `decide_par`, `decide_le`, et seuls eux suppriment un vœu accordé |
| `agenda_commentaires` | toute l'équipe | chacun commente ses propres vœux ; les gérants commentent tout ; personne ne modifie ni ne supprime un commentaire posté |

`anon` n'a aucun droit sur ces deux tables. La séparation entre « je change mon vœu » et « je le valide » passe par une fonction `security definer` dédiée, `agenda_decider(voeu_id, statut, commentaire)`, plutôt que par une politique de colonne : une politique `update` ne sait pas distinguer proprement quelles colonnes changent.

## 3. Les écrans

Une rubrique `/admin/agenda`, déjà présente dans le panneau et grisée depuis le chantier A : ce chantier crée la route et retire son `bientot` dans `lib/admin/droits.ts`. Deux vues, une seule grille rendue deux fois.

**Ma semaine.** La grille des cinq salles sur les cinq jours, matin et après-midi. On coche, on décoche. L'état de chaque vœu se lit dans la case : proposé, validé, refusé. C'est ici qu'un praticien passe ses trois minutes.

**Le cabinet.** La même grille, remplie de tout le monde. Chaque case nomme qui la veut. Les cases en conflit ressortent. Un clic ouvre le détail : les vœux posés, leur état, le fil de commentaires, et pour les gérants les boutons valider et refuser. Un compteur par personne dit qui demande beaucoup.

Sur écran étroit, la grille se lit salle par salle plutôt qu'en tableau : dix colonnes ne tiennent pas sur un téléphone.

## 4. Les mails

Cinq messages, tous adressés à une personne précise, tous envoyés par la file existante et la route de cron du Klub, dans une table de file distincte `agenda_mails` de même forme que `klub_mails`.

| Événement | Destinataire | Contenu |
|---|---|---|
| Un vœu est validé | son auteur | la salle, le jour, le moment, et le commentaire s'il y en a un |
| Un vœu est refusé | son auteur | les mêmes, et le motif |
| Un retrait est demandé | les gérants | la case, le motif, et qui demande |
| Un retrait est tranché | l'auteur du vœu | accordé ou refusé, et le mot du gérant |
| Un commentaire est posté | l'auteur du vœu, ou les gérants si c'est l'auteur qui commente | le texte, et le lien vers la case |

On n'envoie rien quand on se commente soi-même, ni quand un gérant valide son propre vœu.

Une table distincte de `klub_mails` est un choix assumé : le Klub est en production depuis trois jours et sa file a fait ses preuves. Fusionner les deux sera un nettoyage du chantier C2, une fois que les deux auront tourné.

## 5. Ce qu'on vérifie

1. **Scénarios SQL** (`supabase/tests/agenda.sql`, transaction annulée) : un praticien crée un vœu et le supprime tant qu'il est `propose` ; il ne change pas le `statut` d'un vœu, ni du sien ni d'un autre ; il ne supprime pas le vœu d'un autre ; il commente le sien et pas celui d'un autre ; un gérant décide et commente n'importe lequel ; valider une case déjà tenue lève `AGENDA_CASE_PRISE` ; modifier un vœu validé le ramène en `propose` ; son auteur ne peut pas le supprimer, ni directement ni en passant par `retrait_demande` ; un retrait accordé libère la case, un retrait refusé la garde ; `anon` ne lit rien.
2. **Tests unitaires** (`node --test`) sur le calcul des conflits et sur le rendu d'une grille : deux vœux vivants sur une case font un conflit, un vœu refusé n'en fait pas.
3. **Contrôle des droits effectifs** : `get_advisors` sécurité sans nouvelle alerte.
4. **Build et lint** : `npm run build`, `npm run lint`, `npm test`.
5. **Parcours en prévisualisation**, avec deux comptes : un praticien pose un vœu, un gérant le refuse avec un motif, le praticien reçoit le mail et répond dans le fil.

## 6. Ce qui reste à décider plus tard

- Les exceptions datées, si la semaine type se révèle trop rigide à l'usage.
- La publication des présences sur le site, une fois la semaine type éprouvée quelques mois.
- Le sort de Mugicoloc : le simulateur reste un outil de projection hors ligne, ou il se branche sur les vœux validés.
- La fusion des files `agenda_mails` et `klub_mails` en une seule.
