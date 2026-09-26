# Mugi Klub : chacun sa méthode de réservation

Date : 26 septembre 2026
Statut : validé à l'oral, en relecture
Branche : `feature/klub-reservation`

## Objectif

Une séance du Mugi Klub peut s'inscrire ailleurs que sur le site. La prépa des danseurs se remplit par un groupe WhatsApp : le planning public doit y renvoyer, au lieu de proposer un formulaire que personne n'utilise.

## Décisions prises

| Sujet | Décision |
|---|---|
| Par défaut | Notre formulaire, comme aujourd'hui |
| Ailleurs | Un lien et son libellé, portés par la séance ou son créneau |
| Places | Aucun compteur quand l'inscription se fait ailleurs |
| Tarif | Rien à faire : le champ est déjà libre et ouvert à toute l'équipe |
| Modèle | Pas de colonne de mode : « ailleurs » est un cas de « pas chez nous » |

## Hors périmètre

La collecte des inscrits depuis un service externe. Les rappels et les listes d'intervenant pour une séance externe : nous n'avons pas ses inscrits, donc il n'y a rien à envoyer. Le paiement en ligne.

## 1. Ce qui existe déjà

`klub_seances` et `klub_creneaux` portent `inscription_requise boolean not null default true`.

| Valeur | Ce que fait le site aujourd'hui |
|---|---|
| `true` | Formulaire d'inscription, places comptées, liste d'attente, mails |
| `false` | « Entrée libre, sans inscription : venez directement au cabinet. » |

`prix_libelle` est un texte libre, modifiable par toute l'équipe depuis `/admin/mugi-klub`, sur la séance comme sur le créneau. **Jean-Baptiste peut donc déjà poser son tarif lui-même, sans développement.** C'est la réponse à la moitié de la demande.

Six fichiers de migration lisent `inscription_requise` : `klub_tables`, `klub_visiteur`, `klub_admin_tache`, `klub_admin_correctifs`, `klub_anti_abus`, `klub_admin_retours`. Les fonctions qu'ils définissent tournent en production, et celles de `klub_admin_correctifs` remplacent leurs homonymes de `klub_admin_tache` : c'est la version la plus récente qui fait foi.

`klub__seance_publique(klub_seances)` construit le JSON que lisent le planning et la page de séance. `places_restantes` y vaut déjà `null` quand `inscription_requise` est faux.

## 2. Le modèle

**Aucune colonne de mode.** « L'inscription se fait ailleurs » est un cas particulier de « l'inscription ne se fait pas chez nous ». Deux colonnes suffisent, sur `klub_seances` et sur `klub_creneaux` :

| Colonne | Type | Note |
|---|---|---|
| `reservation_url` | text, nullable | l'adresse du groupe, du formulaire ou de la billetterie |
| `reservation_libelle` | text, nullable | le texte du bouton ; « S'inscrire » si vide |

Et une contrainte qui rend l'invariant explicite :

```sql
check (reservation_url is null or inscription_requise = false)
```

Les trois états possibles, et il n'y en a pas de quatrième :

| `inscription_requise` | `reservation_url` | Ce que voit le visiteur |
|---|---|---|
| `true` | forcément `null` | Le formulaire, les places, la liste d'attente |
| `false` | `null` | « Entrée libre, sans inscription » |
| `false` | renseignée | Un bouton vers le lien |

**Pourquoi c'est le bon choix.** Les fonctions SQL en production traitent toutes `inscription_requise = false` comme « ne pas inscrire ici » : ne pas compter de place, ne pas accepter d'inscription, ne pas mettre de mail en file. C'est exactement ce qu'il faut pour une séance externe, et il n'y a pas deux sources de vérité à garder d'accord. `places_restantes` est déjà `null` dans ce cas : l'absence de compteur est acquise au niveau des données, pas seulement à l'écran.

**Ce qu'il faut tout de même reprendre.** Les colonnes ne se propagent pas d'elles-mêmes : les fonctions listent les leurs explicitement. Cinq sont à redéfinir, par `create or replace`, sans changer leur signature :

| Fonction | Ce qu'on y ajoute |
|---|---|
| `klub__seance_publique(klub_seances)` | les deux colonnes dans le JSON qu'elle renvoie — c'est elle qui alimente le planning et la page de séance |
| `klub_tache()` | les deux colonnes dans l'insertion qui engendre les séances d'un créneau |
| `klub_admin_creer_seance(jsonb)` | la lecture des deux clés |
| `klub_admin_modifier_seance(uuid, jsonb)` | idem |
| `klub_admin_sauver_creneau(jsonb)` | idem |

Sans la première, le site ne verrait jamais le lien. Sans la deuxième, un créneau externe engendrerait des séances internes — le défaut le plus sournois des cinq, puisqu'il ne se verrait qu'à la semaine suivante.

L'URL est validée à l'écriture : elle doit commencer par `https://`. Un lien en `http://` ou un `javascript:` n'a rien à faire dans un bouton du site public.

### Héritage du créneau

Comme le titre, la durée et le tarif, les deux colonnes descendent du créneau vers les séances qu'il engendre. Modifier une séance la détache de son créneau, comme aujourd'hui.

## 3. Les écrans

### L'admin

Dans le formulaire de séance et celui de créneau, sous la case « inscription requise », deux champs qui n'apparaissent que si elle est décochée : l'adresse et le libellé du bouton. Une phrase dit ce qui va se passer — « les visiteurs seront renvoyés vers ce lien ; le site ne comptera pas les places ».

Décocher « inscription requise » sur une séance qui a déjà des inscrits est déjà refusé par la fonction existante, qui lève `KLUB_LIBRE`. Rien à ajouter : ce garde-fou couvre aussi le passage en externe.

### Le planning public

Sur la carte d'une séance et sur sa page, le libellé de disponibilité remplace « Entrée libre » par le libellé du bouton quand un lien existe. La page de séance affiche le bouton à la place du formulaire, avec `rel="noopener noreferrer"` et `target="_blank"`.

Aucun compteur, aucun « complet », aucune liste d'attente : on ne sait pas qui s'est inscrit ailleurs, et afficher « 4 / 12 » serait faux.

## 4. Ce qu'on vérifie

1. **Scénarios SQL** (`supabase/tests/klub_reservation.sql`, transaction annulée) : on ne pose pas d'URL sur une séance qui garde son formulaire ; une URL en `http://` est refusée ; un créneau transmet ses deux colonnes aux séances qu'il engendre ; le JSON public porte le lien ; une séance externe n'accepte aucune inscription et n'affiche aucune place restante.
2. **Tests unitaires** (`node --test`) sur le libellé de disponibilité : externe l'emporte sur entrée libre, et le libellé par défaut s'applique quand il est vide.
3. **Build et lint** : `npm run build`, `npm run lint`, `npm test`.
4. **Parcours en prévisualisation** : poser un lien WhatsApp sur la prépa des danseurs, vérifier que la carte et la page renvoient dessus et qu'aucun compteur n'apparaît.

## 5. Ce qui reste à décider plus tard

- Récupérer les inscrits d'un service externe, si un jour l'un d'eux le permet.
- Le paiement en ligne, toujours hors périmètre.
