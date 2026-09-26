# Mugi Klub : les images et le nouveau planning

Date : 26 septembre 2026
Statut : validé à l'oral, en relecture
Branche : `feature/klub-images-planning`
Chantier D du découpage du 17 septembre.

## Objectif

Le planning public du Mugi Klub devient une invitation plutôt qu'un horaire. Chaque séance peut porter une image, et la page met en avant la prochaine séance, trie par type, et montre d'un coup d'œil ce qu'il faut savoir pour s'inscrire.

## Ce qui ne va pas aujourd'hui

Le Klub ne publie que la prépa des danseurs, deux fois par semaine. Chaque semaine affiche donc deux petites cartes de texte perdues dans une grille de colonnes vides, derrière des flèches qui cachent les semaines suivantes. Aucune image. Le prix et la description ne s'obtiennent qu'en cliquant.

## Décisions prises

| Sujet | Décision |
|---|---|
| Forme | Une liste chronologique illustrée, sur le modèle de la page Événements de thera.family |
| Semaines | Plus de flèches : toutes les séances des quatre semaines, groupées par date |
| À la une | La prochaine séance, en grand, en tête de page |
| Filtres | Par type — small group, atelier, conférence —, seulement s'il y en a plus d'un |
| Image | Sur la séance ou son créneau, avec un point focal, comme les couvertures d'articles |
| Sans image | Un panneau à la couleur du type : c'est l'état du lancement, pas un cas limite |
| Lien sortant | « S'inscrire ↗ » quand l'inscription se fait ailleurs, comme sur Théra |
| Identité | La structure vient de Théra, l'apparence reste celle de Mugitu |

## Hors périmètre

Les séances passées : un visiteur n'a rien à faire d'une séance qui a eu lieu. La galerie de photos d'une séance. Le choix des images lui-même, qui revient à Lucas et à Jean-Baptiste. La traduction en basque.

## 1. Ce que Théra nous apprend

La page `thera.family/evenements` fait trois choses que le planning du Klub ne fait pas :

1. **Un événement « à la une »** : titre en très grand, date, heure et lieu en icônes, deux boutons — « Découvrir » et « S'inscrire » avec l'icône de lien sortant —, et l'image à droite.
2. **Des filtres par type**, en pastilles, avec le nombre d'événements de chacun.
3. **Des cartes où l'image domine** : l'image pleine largeur en haut, une pastille de couleur pour le type, le titre, la date et le lieu en icônes, « Découvrir → ».

On reprend ces trois idées. On ne reprend ni la police, ni la palette, ni les coins arrondis de Théra : le Klub vit dans le site de Mugitu et doit en avoir l'air.

## 2. Le modèle

### Deux colonnes, sur les séances et les créneaux

| Colonne | Type | Note |
|---|---|---|
| `image` | text, nullable | l'adresse publique du fichier dans le bucket `site-medias` |
| `image_focus` | text, défaut `'50% 50%'` | le point focal, en `object-position` |

C'est le modèle des couvertures d'articles (`cover`, `cover_focus`), et la même raison le justifie : une même image est recadrée à plusieurs formats — large dans la carte « à la une », carrée dans la liste —, et `object-fit: cover` coupe au centre, ce qui décapite un sujet placé haut.

L'adresse doit commencer par `https://`, contrainte en base, comme le lien de réservation.

### Héritage depuis le créneau

Même problème que pour le lien de réservation : `klub_tache()` engendre les séances en listant ses colonnes, donc une image posée sur un créneau ne descendrait jamais. Même réponse : un **déclencheur `before insert` neuf**, `klub__heriter_image`, qui prend l'image et son point focal du créneau quand ceux de la séance sont vides. Aucune fonction existante n'est réécrite.

### L'écriture depuis l'admin

Même détour que pour la réservation : une fonction dédiée, `klub_admin_image(p_cible, p_id, p_image, p_focus)`, que l'écran appelle après avoir enregistré le reste. Les trois fonctions d'écriture du Klub restent intactes.

### Le JSON public

`klub__seance_publique` gagne les deux clés. C'est la seule fonction existante reprise — celle qui a déjà été reprise pour la réservation, vingt lignes.

## 3. L'admin

Le formulaire de séance et celui de créneau gagnent le composant `ImageDrop` des articles, avec ses aperçus de recadrage — adaptés aux deux formats du planning : « À la une » (environ 16/9) et « Dans la liste » (carré). Glisser une image, régler le point focal, enregistrer.

Une séance hérite de l'image de son créneau. La modifier sur une séance la détache de son créneau, comme toute autre colonne aujourd'hui.

## 4. La page publique

De haut en bas, sous le bandeau d'en-tête existant :

**À la une.** La prochaine séance à venir qui n'est ni annulée ni passée. Grande image à droite — ou le panneau de couleur —, et à gauche le type en pastille, le titre en grand, le jour et l'heure, l'intervenant, le prix, les places ou « S'inscrire ↗ », et deux boutons : « Découvrir » vers la page de la séance, et l'action principale.

**Les filtres.** Des pastilles par type présent dans les quatre semaines, avec leur compte, plus « Tout ». Masquées s'il n'y a qu'un type — c'est le cas aujourd'hui, et une rangée de filtres à une seule valeur ne filtre rien.

**La liste.** Toutes les séances des quatre semaines, sauf celle à la une, groupées sous un intitulé de date — « Lundi 29 septembre ». Chaque carte : l'image carrée à gauche, puis la pastille de type, le titre, l'heure et la durée, l'intervenant, le prix, et en bas la disponibilité et l'action. Sur téléphone, l'image passe au-dessus.

**Sans image**, la carte montre un panneau à la couleur du type, avec le libellé du type en grand et en transparence. Ça doit tenir seul : à l'ouverture de la page, aucune séance n'a d'image.

**Aucune séance à venir** : une phrase, et rien d'autre.

Une séance annulée reste dans la liste, barrée et sans action, comme aujourd'hui.

## 5. Ce qu'on vérifie

1. **Scénarios SQL** (`supabase/tests/klub_images.sql`, transaction annulée) : une adresse qui n'est pas en `https://` est refusée ; un créneau transmet son image et son point focal à la séance qu'il engendre ; une séance qui a déjà la sienne ne l'écrase pas ; le JSON public porte les deux clés ; `klub_admin_image` est réservée à l'équipe.
2. **Tests unitaires** (`node --test`) sur la préparation du planning, qui est une fonction pure : le choix de la séance à la une, le groupement par date, le compte par type, le masquage des filtres à un seul type, l'exclusion de la séance à la une de la liste.
3. **Build et lint.**
4. **Relecture visuelle** au navigateur, en local, sur un bureau et sur un téléphone : sans image, avec une image, avec un lien de réservation externe.

## 6. Ce qui reste à décider plus tard

- Les images elles-mêmes. Lucas a un accès Envato et a déjà délégué le choix des couvertures d'articles ; pour les séances, une photo de Jean-Baptiste avec les danseurs vaudra sans doute mieux qu'une image de banque.
- Une page par type de séance, si le Klub en publie assez pour qu'elle ait du sens.
