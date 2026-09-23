# Back-office : coque à panneau latéral et droits

Date : 23 septembre 2026
Statut : validé à l'oral, en relecture
Branche : `feature/admin-coque`
Chantier A du découpage validé le 17 septembre : A (coque et droits), D (Mugi Klub : images et planning), B (éditeur d'articles), C (agenda du cabinet).

## Objectif

Donner au back-office une coque unique avec panneau latéral, une page d'arrivée qui montre ce qui demande une action, et deux niveaux de droits : l'équipe et les super-admins. Les écrans existants gardent leur contenu, ils se rangent dedans.

## Décisions prises

| Sujet | Décision |
|---|---|
| Panneau | Blanc et épuré, rubrique active surlignée en turquoise |
| Arrivée | Tableau de bord sur `/admin` |
| Super-admins | Lucas et Jean-Baptiste, via une liste propre au site |
| Articles | Chacun modifie les siens, les super-admins modifient tout |
| Mugi Klub | Ouvert à toute l'équipe, comme aujourd'hui |
| Praticiens | Réservé aux super-admins |
| Événements | Annuaire dans le code (Alba 2026, concours Avirun), sans gestionnaire |

## Hors périmètre

L'éditeur d'articles (chantier B), l'agenda du cabinet (chantier C), les images et le planning du Klub (chantier D), un gestionnaire d'événements, la gestion des comptes praticiens depuis l'admin.

## 1. Droits

### Ce qui existe déjà

- `public.user_roles` (rôles de l'app praticiens : `admin`, `kine`, `osteo`, `medecin`, `psycho`, `dieticien`, `podologue`, `preparateur`, `sportif`). 12 comptes, un seul rôle `admin` (Lucas).
- `public.is_practitioner()` : vrai dès qu'une ligne `user_roles` existe. Utilisée par la RLS des articles et de `practitioner_overrides`.
- `public.klub__est_equipe()` : vrai pour une ligne `user_roles` dont le rôle n'est pas `sportif`. Créée pour le Klub.
- `public.has_role(user_id, role)` : utilisée par l'admin des actualités pour savoir qui est `admin`.

Le rôle `admin` sert à l'app praticiens : **on ne l'attribue à personne d'autre**, et on ne s'en sert pas pour le site.

### Ce qu'on ajoute

**Table `site_super_admins`**

| Colonne | Type | Note |
|---|---|---|
| `user_id` | uuid, clé primaire, référence `auth.users` | |
| `note` | text | à quoi sert ce compte, pour s'y retrouver |
| `created_at` | timestamptz | |

Garnie à la migration avec Lucas (`lucas.bengosteo@gmail.com`) et Jean-Baptiste (`jbc.kine@gmail.com`). RLS activée, lecture réservée aux super-admins, aucune écriture par l'interface : on ajoute un super-admin par une migration.

**Deux fonctions, `security definer`, `set search_path = ''`**

| Fonction | Renvoie vrai quand |
|---|---|
| `public.site_est_equipe()` | le compte connecté a une ligne `user_roles` dont le rôle n'est pas `sportif` |
| `public.site_est_super_admin()` | le compte connecté est dans `site_super_admins` |

`klub__est_equipe()` devient un appel à `site_est_equipe()` : une seule définition de « l'équipe » pour tout le site. Exécution accordée à `authenticated`, refusée à `anon`.

**Propriétaire d'un article**

`public.articles` gagne `auteur_id uuid references auth.users`. Les 23 articles existants sont attribués à Lucas. Les nouveaux articles prennent `auth.uid()` à la création.

La signature affichée sur le site reste la colonne `author` (un objet avec le nom, le métier, la fiche) : elle ne change pas, et on continue de publier un article signé Hugo ou Baptiste. `auteur_id` ne sert qu'aux droits.

**Nouvelles politiques RLS**

| Table | Lecture | Écriture |
|---|---|---|
| `articles` | inchangée : le public voit les articles publiés ou programmés arrivés à échéance ; l'équipe voit tout | création par l'équipe avec `auteur_id = auth.uid()` ; modification et suppression par le propriétaire ou un super-admin |
| `practitioner_overrides` | inchangée : lecture publique, c'est le contenu des fiches | réservée aux super-admins |
| `site_super_admins` | super-admins | aucune |
| tables `klub_*` | inchangées : lecture par l'équipe | inchangées : par les fonctions `klub_admin_*`, qui vérifient l'équipe |

Un praticien qui interrogerait la base directement obtient donc la même chose que ce que son écran lui montre.

## 2. La coque

### Routes

| Route | Écran | Accès |
|---|---|---|
| `/admin` | Tableau de bord | équipe |
| `/admin/actualites` | Actualités (existant) | équipe |
| `/admin/mugi-klub` | Mugi Klub (existant) | équipe |
| `/admin/evenements` | Annuaire des événements | équipe |
| `/admin/praticiens` | Praticiens (existant) | super-admin |

Les adresses existantes ne changent pas. `/admin/praticiens` reste atteignable, mais affiche un message d'accès refusé en dehors des super-admins, et la base ne renvoie rien de toute façon.

### Structure

- `app/admin/layout.tsx` : un layout qui rend `components/admin/AdminCoque.tsx`.
- `AdminCoque` (client) porte la session, l'écran de connexion, le panneau et l'en-tête. Sans session, il rend `AdminLogin` à la place du contenu. Les écrans deviennent de simples enfants.
- Chaque écran existant perd son bloc connexion, son en-tête bleu et `AdminNav`. `components/admin/AdminNav.tsx` est supprimé.
- `components/admin/acces.ts` : un hook qui expose `{ etat, utilisateur, estEquipe, estSuperAdmin }`, alimenté par la session et les deux fonctions, et utilisé par la coque comme par les écrans.

### Le panneau

Blanc, 196 px, bordure à droite. De haut en bas :

- la marque « mugitu admin » ;
- **Tableau de bord** ;
- **Contenu** : Actualités, Mugi Klub ;
- **Cabinet** : Agenda (visible, désactivé, marqué « bientôt » jusqu'au chantier C) ;
- **Événements** ;
- **Super-admin** : Praticiens, seulement pour Lucas et JB ;
- en bas : le prénom et le nom du compte, un lien « Voir le site », « Se déconnecter ».

La rubrique active est surlignée en turquoise. Chaque lien a un état visible au clavier.

Sur écran étroit (moins de 900 px), le panneau sort du flux : un bouton en haut à gauche l'ouvre par-dessus le contenu, un voile ferme au clic, la touche Échap aussi. La rubrique choisie referme le panneau.

### Le tableau de bord

Quatre blocs, chacun disparaît quand il n'a rien à dire. Si les quatre sont vides : « Rien ne demande votre attention. »

| Bloc | Contenu | Clic |
|---|---|---|
| Mugi Klub, 7 prochains jours | chaque séance publiée : jour, heure, titre, `confirmés / capacité`, et le nombre en attente | ouvre la séance dans l'admin du Klub |
| À traiter | mails du Klub en erreur, articles en relecture, séances complètes avec liste d'attente | ouvre l'écran concerné sur l'élément |
| Mes articles | brouillons et articles programmés dont on est propriétaire (tous, pour un super-admin) | ouvre l'article dans l'éditeur |
| Aujourd'hui au cabinet | réservé au chantier C ; d'ici là, une phrase d'attente et rien d'autre | — |

En tête : « Bonjour <prénom> », la date du jour, et deux raccourcis, « Nouvel article » et « Nouvelle séance ».

Les données viennent de trois lectures : les séances des 7 prochains jours avec leurs inscriptions, les mails du Klub en erreur, les articles hors publiés. Chaque bloc gère son erreur de chargement sans casser les autres.

## 3. Les écrans

### Événements (nouveau)

Un annuaire, pas un gestionnaire. Les événements vivent dans `lib/evenements.ts`, un fichier qu'on complète à la main. Chaque fiche : nom, dates, statut (à venir, passé), une phrase de rappel, et ses liens.

**Alba Deep Fitness Race 2026** — 12 et 13 septembre 2026, passé.
Liens : la page des jeux, le règlement, l'outil de stand, l'affiche QR.
La fiche affiche le nombre de participants et de scores encore en base, et l'échéance du **13 octobre 2026** annoncée par le règlement. Un bouton « Supprimer les données des jeux » est proposé aux seuls super-admins : il demande de confirmer, puis vide `jeux_participants`, `jeux_scores` et `jeux_tirages` par une fonction dédiée qui vérifie `site_est_super_admin()`. Une fois les tables vides, la fiche l'indique et le bouton disparaît.

**Concours Avirun 2K26** — passé.
Liens : la page publique et sa version basque. Le compteur lit les commentaires d'un post Instagram, il n'y a aucune donnée à gérer. La fiche le dit.

### Actualités

- La liste gagne la mention du propriétaire et un filtre « Mes articles ».
- Les boutons de modification et de suppression ne s'activent que sur ses propres articles, sauf pour un super-admin.
- Un super-admin peut changer le propriétaire d'un article, dans le même écran que la signature affichée.
- L'éditeur lui-même est repris au chantier B.

### Praticiens

Contenu inchangé. L'écran vérifie `site_est_super_admin()` et affiche sinon « Cette rubrique est réservée à Lucas et Jean-Baptiste. »

### Mugi Klub

Inchangé, hors la disparition de son en-tête au profit de la coque.

## 4. Ce qu'on vérifie

1. **Scénarios SQL** (`supabase/tests/admin.sql`, transaction annulée) : un praticien ordinaire ne lit pas `site_super_admins` ; il crée un article et le modifie ; il ne modifie ni ne supprime celui d'un autre ; il n'écrit pas dans `practitioner_overrides` ; un super-admin fait les trois ; `anon` ne peut exécuter aucune des deux fonctions.
2. **Contrôle des droits effectifs** : `get_advisors` sécurité sans nouvelle alerte.
3. **Build et lint** : `npm run build`, `npm run lint`, `npm test`.
4. **Parcours en prévisualisation**, avec un compte praticien de test : le panneau ne montre pas Praticiens, `/admin/praticiens` refuse, un article d'un autre n'est pas modifiable, le tableau de bord n'affiche que ses brouillons.

## 5. Ce qui reste à décider plus tard

- Le bloc « Aujourd'hui au cabinet » attend le chantier C.
- Un gestionnaire d'événements (créer un stand, ses épreuves, son QR) reste à ouvrir quand un prochain stand se profile.
- La gestion des comptes praticiens depuis l'admin (inviter, désactiver) n'est pas prévue : elle se fait dans Supabase.
