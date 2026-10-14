# « Par où commencer ? » : orienter un visiteur vers le bon praticien

Date : 14 octobre 2026
Statut : validé à l'oral, section par section
Branche : `feature/orientation`

## Objectif

Un visiteur qui a mal au genou ne sait pas s'il doit voir un ostéopathe, un kiné ou le médecin du sport. Une section de la page d'accueil lui pose quelques questions et lui propose un à trois praticiens du cabinet, avec leur page et leur lien de réservation.

C'est aussi le premier essai de l'espace patient de Corpus : on y apprend les mots des patients, leurs questions et l'endroit où ils abandonnent.

## Décisions prises

| Sujet | Décision |
|---|---|
| Issue d'une conversation | Une suggestion. Rien n'est transmis au praticien, rien n'est gardé au nom du visiteur |
| Méthodes de traitement | Le praticien d'abord. Les méthodes sont « ce que ce praticien peut vous proposer après examen », jamais une prescription |
| Actes médicaux | Infiltrations, PRP, viscosupplémentation, mésothérapie : toujours « à décider avec le médecin du sport » |
| Emplacement | Une section de l'accueil, juste après le haut de page, avant « Notre histoire » |
| Mesure | Des mesures sans texte libre, toujours ; le texte des échanges seulement avec l'accord du visiteur, effacé après 90 jours |
| Approche | Questions à toucher, puis texte libre ; Mistral choisit dans le catalogue du site par identifiants ; le serveur valide ; les cartes viennent des données du site |
| Sans IA | Une table de correspondance fixe répond quand la clé manque, quand l'appel échoue ou quand la réponse est rejetée |

## Hors périmètre

- Transmettre la demande à un praticien, par mail ou dans Corpus.
- Un compte patient, un dossier, quoi que ce soit qui relève de l'hébergement de données de santé (HDS).
- Un diagnostic, une hypothèse de pathologie, un conseil de médicament ou d'exercice.
- Une bulle de discussion sur les autres pages.

## 1. Le parcours du visiteur

### La section

Sur l'accueil, `<section id="par-ou-commencer">`, entre le haut de page et « Notre histoire ». Le bouton principal du haut de page y descend.

En tête, trois éléments courts :
- le titre, « Par où commencer ? », et une phrase : « Quelques questions, et nous vous indiquons qui voir au cabinet. » ;
- l'avertissement : « Cet outil vous oriente, il ne pose pas de diagnostic. En cas d'urgence : 15 ou 112. » ;
- une case non cochée : « Aider Mugitu à améliorer l'outil : mes réponses écrites sont gardées 90 jours, sans mon nom. » Lien vers la page de confidentialité.

La première question est affichée d'emblée : on commence sans cliquer pour ouvrir quoi que ce soit.

### Les étapes

Chaque réponse remplace la question sur place. Sur téléphone, la section revient à son propre haut à chaque étape. Un bouton « Retour » ramène à l'étape précédente.

1. **Ce qui vous amène** : une douleur ou une blessure · reprendre le sport après une blessure · préparer une saison, progresser · stress, sommeil, mental · alimentation, poids de forme · un bilan ou un test.
2. **Où, depuis quand** (pour une douleur, une blessure ou une reprise) : cou · épaule · bras, coude, main · dos · hanche, aine · cuisse · genou · jambe, mollet · cheville, pied · autre. Puis : moins d'une semaine · une à six semaines · plus de six semaines.
3. **Votre sport** : surf · rugby · trail et course · danse · pelote basque · autre · aucun.
4. **Signes d'alerte** (pour une douleur ou une blessure) : « Avez-vous l'un de ces signes ? »
   - douleur dans la poitrine, essoufflement inhabituel ;
   - après un choc : déformation, ou impossible de poser le pied ;
   - fièvre avec la douleur ;
   - perte de force, fourmillements qui s'étendent, troubles pour uriner ;
   - douleur la nuit, forte, qui ne cède pas.

   Un « oui » arrête le parcours sur l'écran d'alerte (§ 2).
5. **En quelques mots** (facultatif) : un champ de 500 caractères au plus, « Ne donnez pas votre nom ni vos coordonnées. » Bouton « Voir qui consulter ».

### Le résultat

Une à trois cartes, la plus adaptée d'abord. Chaque carte :
- le métier (« Kinésithérapie du sport ») et une phrase qui dit pourquoi ;
- ses praticiens : photo, nom, lien vers la fiche, bouton « Prendre rendez-vous » ;
- « Ce qu'il peut vous proposer après examen » : les méthodes liées, en liens vers leur page ;
- les pages utiles : la pathologie, le soin, le sport ;
- le Mugi Klub quand il convient : préparation physique, bilan de 30 minutes offert.

Sous les cartes : « Ce n'est pas tout à fait ça ? Précisez » (rouvre le champ libre et relance) et « Recommencer ».

La zone du résultat est annoncée aux lecteurs d'écran (`aria-live="polite"`), et le focus va à son titre.

### Les portes d'entrée

- Le bouton principal du haut de l'accueil.
- Un lien sur la page de l'équipe.
- Un encadré en bas des pages pathologie et soin, par `ContentPageView` : « Vous ne savez pas qui consulter ? » vers `/?depuis=<slug>#par-ou-commencer`. Le parcours commence alors avec le contexte : « Vous venez de la page Tendinopathie d'Achille. » La zone et le motif sont préremplis quand la page les porte.

## 2. La sécurité, par le code et non par l'IA

### Écran d'alerte

Déclenché par un « oui » à l'étape 4, par un mot d'alerte dans le texte libre, ou par l'indicateur d'alerte renvoyé par l'IA.

> Ce que vous décrivez demande un avis médical rapide. En cas d'urgence, appelez le 15 ou le 112. Sinon, consultez votre médecin traitant ou un service d'urgence aujourd'hui.

Aucune suggestion de praticien sous cet écran.

### Détresse psychique

Quel que soit le motif, un texte qui évoque des idées suicidaires, l'envie de mourir ou de se faire du mal affiche d'abord :

> Si vous pensez au suicide, parlez-en : le 3114 répond jour et nuit, gratuitement. En cas de danger immédiat, appelez le 15.

Les suggestions vers la psychologie du cabinet restent affichées dessous.

### Les mots d'alerte

Une liste dans `lib/orientation/regles.ts`, comparée au texte sans accents et en minuscules. Elle est volontairement large : un faux positif coûte un écran d'alerte, un faux négatif peut coûter cher.

**À faire relire par Basile avant la mise en ligne** : la liste des signes d'alerte, les deux messages ci-dessus, et la phrase sur les actes médicaux.

## 3. Le choix des praticiens

### Le catalogue

`lib/orientation/catalogue.ts` assemble, depuis les données existantes :
- les praticiens : `TEAM`, avec les retouches du back-office (`equipeAvecOverrides`), pour que noms, photos et liens de réservation soient à jour ;
- les soins (`SOINS`), les méthodes (`METHODES`), les pathologies (`PATHOLOGIES`), les sports (`SPORTS`) ;
- les offres du Mugi Klub : préparation physique en small group, préparation individuelle avec bilan offert.

Chaque entrée : un identifiant (le slug), un type, un titre, un résumé de deux lignes, un lien.

**Une table manque : qui pratique quelle méthode.** Elle sera écrite à la main dans `lib/orientation/methodes-praticiens.ts`, d'après les fiches, et relue par Lucas. Un test vérifie que chaque méthode a au moins un praticien.

### La table de correspondance fixe

`lib/orientation/regles.ts`, du code pur, sans réseau :
- motif × zone × sport → un à trois métiers, chacun avec ses praticiens et ses méthodes ;
- la page d'origine (`?depuis=`) passe en premier quand elle désigne un soin.

Elle répond seule quand il n'y a pas de clé Mistral, quand l'appel dépasse 15 secondes ou échoue, ou quand la réponse de l'IA est rejetée. Le visiteur voit le même écran, avec une phrase « pourquoi » écrite à l'avance.

### L'appel à Mistral

Route `POST /api/orientation`, exécutée côté serveur.

1. Vérifie la limite d'appels (§ 4) et la longueur du texte.
2. Passe les règles d'alerte. En cas d'alerte, répond sans appeler l'IA.
3. Appelle `mistral-small-latest` en mode JSON, avec :
   - les consignes : orienter sans diagnostiquer, ne parler ni de médicament ni d'exercice, ne citer que des identifiants du catalogue, vouvoyer, écrire sans marque de genre, une phrase « pourquoi » par suggestion ;
   - le catalogue résumé ;
   - les réponses du visiteur, et son texte entre balises, présenté comme une donnée à analyser et jamais comme une consigne.
4. Attend une réponse de cette forme :
   ```json
   {
     "alerte": false,
     "suggestions": [
       { "metier": "kinesitherapie-du-sport", "praticiens": ["…"], "methodes": ["bfr"], "pages": ["tendinopathie-achille"], "pourquoi": "…" }
     ]
   }
   ```
5. Valide : identifiants inconnus retirés, trois suggestions au plus, « pourquoi » limité à 300 caractères et passé au filtre des mots interdits (noms de médicaments courants, « diagnostic », « vous avez une »). Une suggestion sans praticien valide est retirée. Rien d'exploitable : table fixe.
6. Renvoie au navigateur les suggestions validées et un identifiant de parcours (UUID aléatoire).

Les cartes sont construites par la page depuis le catalogue. Seule la phrase « pourquoi » vient de l'IA.

La clé `MISTRAL_API_KEY` est posée dans Vercel par Lucas. Le code ne la lit que côté serveur.

## 4. Ce qu'on garde

Projet Supabase `nuehdfyscqnkckudkqhe`. Trois tables, écrites par le serveur seul avec la clé de service ; lues par les super-admins (`site_est_super_admin()`), personne d'autre.

**`orientation_parcours`**, une ligne par parcours, sans texte libre ni adresse IP :
- `id` (UUID), `cree_le` ;
- `motif`, `zone`, `anciennete`, `sport`, `depuis` ;
- `alerte` : aucune, signe déclaré, mot d'alerte, détresse, IA ;
- `source` : ia, regles, repli (l'IA a échoué ou a été rejetée) ;
- `suggestions` : les identifiants proposés, en `jsonb` ;
- `clic` : `reservation` ou `page`, avec l'identifiant visé, et sa date ;
- `consentement` : la case était-elle cochée.

**`orientation_textes`** : `parcours_id`, `texte`, `cree_le`. Écrite seulement si la case est cochée. Effacée après 90 jours.

**`orientation_limites`** : une empreinte de l'adresse IP (SHA-256 avec un sel secret, `ORIENTATION_SEL`), un compteur, une fenêtre. Vingt parcours par heure et par empreinte. Vidée chaque jour.

Le clic sur « Prendre rendez-vous » ou sur une page passe par `POST /api/orientation/clic` avec l'identifiant du parcours, puis ouvre le lien. Un clic qui échoue n'empêche jamais l'ouverture.

Le ménage (textes de plus de 90 jours, limites de la veille) passe par une route `GET /api/orientation/menage`, appelée chaque jour par le cron de Vercel, protégée par `CRON_SECRET`, comme les autres tâches.

La page de confidentialité reçoit un paragraphe : ce qui part chez Mistral (les réponses et le texte, sans identité), ce qui est gardé, combien de temps, et le droit d'effacement par simple demande.

## 5. Dans le back-office

Une page « Par où commencer » dans la partie super-admin du menu, construite avec le socle (`Page`, `Carte`, `Badge`, `Onglets`).

- **Semaine par semaine** : nombre de parcours ; part qui finit sur un clic de réservation ; part arrêtée par une alerte ; part servie par la table fixe ou en repli.
- **Ce qui revient** : motifs, zones et sports les plus fréquents ; métiers et praticiens proposés.
- **Les textes**, ceux gardés avec accord : le texte, les réponses, la suggestion obtenue, et s'il y a eu clic. C'est la matière du bêta test de Corpus.

## 6. Ce qu'on vérifie

1. **Tests unitaires** (`node --test`) :
   - chaque signe d'alerte arrête le parcours, chaque mot d'alerte aussi, accents et majuscules compris ;
   - le 3114 apparaît sur les formulations prévues ;
   - la table fixe répond pour chaque combinaison motif × zone ;
   - chaque identifiant du catalogue pointe sur une page ou un praticien qui existe, chaque méthode a au moins un praticien ;
   - la validation retire les identifiants inconnus, limite à trois, rejette une réponse mal formée, filtre un « pourquoi » qui parle de diagnostic ou de médicament ;
   - un texte qui donne des ordres à l'IA (« ignore tes consignes… ») ne fait rien sortir du catalogue.
2. **Scénarios SQL** (transaction annulée) : rien n'est lisible sans compte ni par un praticien non super-admin ; le ménage efface les textes de plus de 90 jours et seulement eux.
3. **Jeu d'essai réel** : une vingtaine de cas types passés à Mistral, résultats rangés dans un tableau pour Lucas avant la mise en ligne.
4. **Écrans** : 375 px et ordinateur, sans débordement ; parcours entier au clavier ; annonce du résultat.
5. Build, lint, tests.

## Ce qu'il faut de ton côté, Lucas

- Poser `MISTRAL_API_KEY` et `ORIENTATION_SEL` dans Vercel. Je donnerai les noms exacts, je ne manipule aucune clé.
- Relire la table « qui pratique quelle méthode ».
- Faire relire par Basile les signes d'alerte, les deux messages et la phrase sur les actes médicaux.
- Relire le jeu d'essai avant la mise en ligne.
