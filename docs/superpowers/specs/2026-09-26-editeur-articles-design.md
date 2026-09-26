# Back-office : écrire un article comme un document

Date : 26 septembre 2026
Statut : validé à l'oral
Branche : `feature/editeur-articles`
Chantier B, le dernier du découpage du 17 septembre.

## Objectif

Rendre la rédaction d'un article claire. On écrit l'article de haut en bas, dans l'ordre où il sera lu, avec un aperçu fidèle de la page publique ; les réglages passent dans un panneau à part.

## Ce qui ne va pas aujourd'hui

- **Un formulaire de base de données, pas un outil d'écriture.** Six blocs empilés, une vingtaine de champs ; le texte de l'article n'arrive qu'au troisième bloc, après les réglages de publication.
- **Aucun aperçu.** Impossible de savoir où atterrissent le cas concret ou les chiffres clés.
- **Un texte brut** avec une convention invisible — « un paragraphe par ligne vide » — et aucune mise en forme.
- **Trois notions qui se chevauchent** — catégorie, surtitre, mots-clés — et du jargon d'édition, « chapô ».
- **Un temps de lecture saisi à la main.**
- **Un trou de fonctionnement.** Seuls les gérants peuvent changer le statut d'un article : un praticien ne peut pas passer le sien en « à relire », alors que c'est l'événement que le récapitulatif quotidien annonce. Et la restriction n'existe que dans l'écran — la base laisse le propriétaire écrire n'importe quel statut, y compris « publié ».

## Décisions prises

| Sujet | Décision |
|---|---|
| Forme | Un document à gauche, un panneau de réglages à droite |
| Aperçu | Un bouton « Écrire / Aperçu » au-dessus du document |
| Mise en forme | Des marques simples dans le texte : `**gras**`, `*italique*`, `[texte](lien)`, lignes en `- ` pour une liste |
| Stockage | Inchangé : `sections[].p` reste une liste de chaînes |
| Articles existants | Aucun ne change d'apparence — vérifié sur les 412 textes en base |
| Temps de lecture | Calculé, plus saisi |
| Référencement | Préremplit depuis le titre et l'introduction, ce que la page publique faisait déjà en silence |
| Statut | Le propriétaire passe son article de brouillon à « à relire » et retour ; publier et programmer restent aux gérants — dans la base, pas seulement dans l'écran |

## Hors périmètre

Un éditeur riche à la souris, façon Notion. Les images dans le corps d'un article. Un historique des versions. La relecture à plusieurs.

## 1. Les marques

### Ce qu'elles font

| On tape | On obtient |
|---|---|
| `**mot**` | **gras** |
| `*mot*` | *italique* |
| `[texte](https://…)` ou `[texte](/chemin)` | un lien |
| des lignes qui commencent toutes par `- ` | une liste à puces |
| une ligne vide | un nouveau paragraphe, comme aujourd'hui |

Tout le reste reste du texte. Un lien vers autre chose que `https://` ou un chemin interne commençant par `/` reste du texte : pas de `javascript:`, pas de `http://`.

**Pas de `_` pour l'italique.** Un paragraphe existant contient un tiret bas ; l'utiliser comme marque le déformerait.

La reconnaissance automatique existante — `@pseudo` vers Instagram, `exemple.com` vers le site — continue de s'appliquer au texte qui n'est pas déjà dans une marque. Un lien écrit entre crochets l'emporte sur elle.

### Pourquoi c'est sûr

Vérifié en base le 26 septembre : sur les **313 paragraphes** des sections et les **99 textes** des cas concrets, exercices et réponses de FAQ, **aucun** ne contient `**`, `*…*`, `[…](…)`, un tiret en début de ligne ni de balise HTML. Aucun article en ligne ne change d'apparence.

### Comment c'est rendu

Une fonction pure, `lib/articles/marques.ts`, découpe un texte en blocs — paragraphe ou liste — et chaque bloc en morceaux portant leurs attributs : gras, italique, lien. Un composant les rend en éléments React. **Aucun HTML brut** : React échappe tout, et un texte ne peut rien injecter dans la page.

Le cas concret, le corps de l'exercice et les réponses de la FAQ passent par le même rendu.

## 2. L'écran

### Le document, à gauche

Dans l'ordre de lecture de la page publique :

1. **Le titre**, en grand, sans cadre de champ.
2. **L'introduction** — l'ancien « chapô » —, avec une phrase : c'est ce qu'on lit sur la carte et dans Google.
3. **Les sections**, chacune un intitulé et son texte, avec la légende des marques sous le texte.
4. **Les blocs complémentaires**, repliés tant qu'ils sont vides : un cas concret, un exercice, des chiffres clés, des questions fréquentes. Chacun dit en une phrase où il apparaît sur la page.

Au-dessus, deux onglets : **Écrire** et **Aperçu**. L'aperçu rend le corps de l'article **avec les composants mêmes de la page publique**, extraits dans `components/site/ArticleCorps.tsx` et utilisés des deux côtés. C'est ce qui garantit qu'il est fidèle : il n'y a qu'un seul rendu.

### Le panneau de réglages, à droite

- **Classement** : catégorie ; surtitre, expliqué — « la petite ligne au-dessus du titre, facultative » ; mots-clés.
- **Couverture**, avec son point focal.
- **Publication** : statut, date, auteur, mise à la une, propriétaire. Un praticien ne voit que Brouillon et À relire ; les gérants voient tout.
- **Référencement** : titre et description, avec en grisé ce que Google verra s'ils restent vides, et un compteur de caractères.
- **Temps de lecture estimé**, calculé, en lecture seule.

Sur écran étroit, le panneau passe sous le document.

## 3. Le statut, tenu en base

Un déclencheur `before insert or update` sur `articles`, `articles__garde_statut` :

- si la personne connectée **n'est pas** gérante,
- et que le statut devient `programme` ou `publie`, ou que `featured` change,
- alors l'écriture est refusée avec le code `ARTICLE_STATUT`.

**Sans personne connectée — une écriture en SQL, un script, la clé de service —, rien n'est refusé.** C'est la même règle que les événements du récapitulatif : un article publié directement en base doit rester possible.

Corriger une coquille dans un article déjà publié reste permis à son propriétaire : le déclencheur ne regarde que le passage **vers** un statut public, pas la modification d'un article qui l'est déjà.

## 4. Ce qu'on vérifie

1. **Tests unitaires** (`node --test`) sur `marques.ts` : chaque marque, leurs combinaisons, les liens refusés, les listes, la cohabitation avec la reconnaissance automatique, et le texte brut rendu à l'identique.
2. **Scénarios SQL** (`supabase/tests/articles_statut.sql`, transaction annulée) : un praticien passe son article en « à relire » et retour ; il ne le publie pas, ne le programme pas, ne le met pas à la une ; il corrige un article déjà publié ; un gérant publie ; une écriture sans session publie.
3. **Les scénarios existants** qui touchent aux articles — `admin.sql` et `notifications.sql` — passent toujours.
4. **Build et lint.**
5. **Relecture visuelle** : un article existant rendu à l'identique sur la page publique ; l'éditeur sur bureau et sur téléphone ; l'aperçu fidèle.
