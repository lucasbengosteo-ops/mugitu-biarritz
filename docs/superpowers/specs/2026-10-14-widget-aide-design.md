# Le widget d'aide : orienter et répondre aux questions pratiques, sur toutes les pages

Date : 14 octobre 2026
Statut : validé à l'oral
Branche : `feature/widget-aide`
S'appuie sur : `docs/superpowers/specs/2026-10-14-orientation-design.md` (« Par où commencer ? », en production)

## Objectif

Une bulle en bas à droite de chaque page publique, sur le modèle du widget du site d'Andrew : un accueil, une discussion, des articles. La discussion oriente vers le bon praticien (le parcours déjà en ligne) et répond aux questions pratiques sur le cabinet à partir des seules pages du site.

La section « Par où commencer ? » de l'accueil reste en place.

## Décisions prises

| Sujet | Décision |
|---|---|
| Onglet « Messages » | Orientation et questions pratiques. Pas de messagerie avec l'équipe |
| Source des réponses pratiques | Les pages pratiques du site, données en entier à l'IA à chaque question. Chaque réponse cite sa page |
| Ce que l'IA ne sait pas | Elle le dit et renvoie vers la page contact. Elle n'invente jamais un tarif, un horaire, un remboursement |
| Question médicale | Pas de conseil médical. Le widget propose le parcours d'orientation |
| Pages | Toutes les pages publiques, sauf le back-office, l'écran du stand des jeux et les pages de paiement et d'annulation du Mugi Klub |
| Données | Mêmes règles que l'orientation : des mesures sans texte libre ; le texte gardé 90 jours seulement avec l'accord du visiteur |
| IA | Le compte Mistral du site (`MISTRAL_API_KEY`), jamais celui de Corpus |

## Hors périmètre

- Écrire à l'équipe depuis le widget, une messagerie, des réponses humaines.
- Une recherche dans tout le contenu par vecteurs (actualités comprises) : plus tard, avec la bibliothèque de Corpus.
- Garder une conversation d'une visite à l'autre.

## 1. Le widget

### La bulle

En bas à droite, 56 px, sarcelle Mugitu avec une icône de discussion ; elle devient une croix quand le widget est ouvert. Elle ne recouvre jamais un bouton de la page : marge de 16 px, et une marge basse plus grande sur les pages qui ont une barre collante en bas (à mesurer).

### Le panneau

- Ordinateur : un panneau de 400 × 640 px au plus, ancré au-dessus de la bulle, coins arrondis, ombre.
- Téléphone : plein écran, avec un bouton « Fermer » en haut. La page dessous ne défile pas tant qu'il est ouvert.
- `role="dialog"`, titre lisible par les lecteurs d'écran, Échap ferme, le focus revient à la bulle.
- En tête : l'icône Accueil à gauche, les onglets « Messages » et « Articles » au centre, comme sur le modèle.
- L'état (onglet, conversation) vit dans la page : il survit à une navigation entre pages du site (composant monté dans la mise en page racine), pas à un rechargement.

### Accueil

- « Bonjour, comment pouvons-nous vous aider ? »
- Trois raccourcis : « Trouver qui consulter » (ouvre Messages sur le parcours d'orientation), « Prendre rendez-vous » (la page de l'équipe), « Venir au cabinet » (adresse, page zone d'intervention).
- « Questions fréquentes » : les trois premières questions de la FAQ, chacune ouvre sa réponse dans l'onglet Articles.

### Messages

Une discussion. À l'ouverture, une bulle du cabinet : « Comment pouvons-nous vous aider ? », puis des questions toutes prêtes à toucher :
- « Je ne sais pas qui consulter »
- « Faut-il une ordonnance ? »
- « Est-ce remboursé ? »
- « Comment venir au cabinet ? »
- « C'est quoi le Mugi Klub ? »

Un champ de saisie en bas (500 caractères), avec la mention « Ne donnez pas votre nom ni vos coordonnées. » et la case « Aider Mugitu à améliorer l'outil » (non cochée, mêmes termes que la section de l'accueil).

**L'orientation dans la discussion.** « Je ne sais pas qui consulter », ou une question que le serveur reconnaît comme une demande d'orientation, déroule les mêmes étapes que la section de l'accueil, sous forme de messages avec des boutons de réponse : ce qui vous amène, où, depuis quand, votre sport, les signes d'alerte. Le résultat s'affiche en cartes compactes (métier, praticiens, « Prendre rendez-vous »). Mêmes règles, mêmes alertes, même route `POST /api/orientation`.

**Une question pratique.** Envoyée à `POST /api/aide/question`. La réponse arrive en une bulle : deux à quatre phrases, puis les liens des pages citées (« Source : Questions fréquentes »). Si l'IA ne trouve pas la réponse dans les pages : « Je n'ai pas cette information. Vous pouvez écrire au cabinet », avec le lien vers `/contact`.

**Une question médicale** (« Dois-je mettre de la glace ? », « Est-ce grave ? ») : « Je ne peux pas donner d'avis médical. Je peux vous aider à trouver qui consulter. » avec le bouton qui lance l'orientation.

**Les alertes passent avant tout.** Le texte de chaque message passe par les règles d'alerte et de détresse de l'orientation (`detecterAlerte`, `detecterDetresse`) avant tout appel à l'IA : écran 15 ou 112, ou encadré 3114.

### Articles

- Une recherche « Trouver une réponse… », sans IA : sur les titres et le texte des questions fréquentes, des pathologies et des actualités publiées, insensible aux accents.
- Trois rubriques : Questions fréquentes, Pathologies, Actualités, avec le nombre d'articles.
- Une question fréquente s'ouvre dans le widget (sa réponse en texte) avec un lien « Voir la page ». Une pathologie ou une actualité ouvre sa page.

## 2. Les réponses pratiques

### Le corpus

`lib/aide/corpus.ts` assemble, en texte brut sans balises, chaque passage avec un identifiant et un lien :
- chaque question de la FAQ (`getInstitutionnel("faq")`), découpée par question ;
- la page zone d'intervention (accès depuis Biarritz, Anglet, Bayonne, Saint-Jean-de-Luz) ;
- la page contact (comment prendre rendez-vous, écrire au centre) ;
- « Nos soins » (les métiers, ce qu'ils font) ;
- le Mugi Klub : la présentation de la page `/mugi-klub` et de la préparation individuelle ;
- les tarifs affichés sur les fiches praticien (`FICHE_DATA[…].tarifs`, avec les retouches du back-office), un passage par praticien.

Les données structurées de `app/layout.tsx` (téléphone, horaires) n'en font pas partie : elles ne sont pas vérifiées.

Un test vérifie que le corpus tient sous 12 000 mots et que chaque passage a un lien qui existe.

### L'appel

Route `POST /api/aide/question` : `{ texte, consentement, historique? }`, où `historique` reprend au plus les deux derniers échanges pratiques (question et réponse) pour une question de suivi.

1. Limite d'appels : la même fonction que l'orientation (`orientation_limiter`), même empreinte, même plafond partagé de 20 par heure.
2. Alerte et détresse : réponse immédiate sans IA.
3. Mistral (`mistral-small-latest`, JSON) avec : les consignes (répondre seulement à partir des passages fournis ; citer leurs identifiants ; vouvoiement, sans marque de genre, sans écriture inclusive ; pas d'avis médical ; dire « je ne sais pas » plutôt qu'inventer) ; le corpus ; la question entre balises, présentée comme une donnée.
4. Réponse attendue : `{ "type": "reponse" | "inconnu" | "medical" | "orientation", "texte": "…", "sources": ["faq-ordonnance", …] }`.
5. Validation : sources inconnues retirées ; une réponse de type `reponse` sans source valide devient `inconnu` ; texte limité à 600 caractères et passé au filtre des mots interdits de l'orientation (diagnostic, médicaments) ; un texte refusé devient `inconnu`.
6. Sans clé, délai dépassé ou réponse illisible : `inconnu`, avec les liens FAQ et contact.

Le type `orientation` demande au widget de lancer le parcours d'orientation (la question décrit un problème de santé à orienter).

## 3. Ce qu'on garde

Projet Supabase `nuehdfyscqnkckudkqhe`, mêmes principes que l'orientation (écriture par fonctions réservées à `service_role`, lecture par les super-admins).

**`aide_questions`** : `id`, `cree_le`, `type` (reponse, inconnu, medical, orientation, alerte, detresse), `sources` (identifiants cités), `page` (le chemin où le widget était ouvert), `utile` (le visiteur a touché « Oui » ou « Non » sous la réponse, sinon null), `consentement`.

**`aide_textes`** : la question et la réponse, seulement si la case est cochée ; effacées après 90 jours par le ménage quotidien de l'orientation (fonction étendue).

Sous chaque réponse pratique : « Cette réponse vous a aidé ? Oui · Non », qui remplit `utile`.

Les ouvertures du widget et les onglets ne sont pas mesurés : seules les questions le sont.

Le paragraphe de la page de confidentialité est étendu au widget.

## 4. Dans le back-office

La page « Par où commencer » reçoit un onglet « Questions » :
- par semaine : nombre de questions, part sans réponse (`inconnu`), part jugée utile ;
- les sources les plus citées ;
- les textes gardés avec accord, avec leur réponse et le vote. C'est là qu'on voit ce qui manque à la FAQ.

## 5. Ce qu'on vérifie

1. **Tests unitaires** : découpage de la FAQ en passages ; taille et liens du corpus ; validation de la réponse (sources inconnues, réponse sans source, texte trop long, mots interdits, JSON illisible) ; alerte et détresse avant l'IA ; recherche des articles insensible aux accents.
2. **Scénarios SQL** (transaction annulée) : droits des deux tables, vote `utile` noté une fois, ménage à 90 jours.
3. **Jeu d'essai sur la vraie IA** : une vingtaine de questions (ordonnance, remboursement, mutuelle, accès en bus, parking, Mugi Klub, prix d'une séance d'ostéopathie, question hors sujet, question médicale, texte qui donne des ordres, signe d'alerte), résultats en tableau pour Lucas.
4. **Écrans** : 375 px et ordinateur, sans débordement ; clavier (ouverture, onglets, Échap, retour du focus) ; la bulle ne masque rien sur l'accueil, l'équipe, une fiche praticien, une pathologie, le Mugi Klub ; elle n'apparaît pas sur les pages exclues.
5. Build (l'accueil reste statique), lint, tests.

## Ce qu'il faut de ton côté, Lucas

Rien de nouveau côté clés : le widget utilise `MISTRAL_API_KEY` et `ORIENTATION_SEL`, déjà en place. Relire le jeu d'essai avant la mise en ligne.
