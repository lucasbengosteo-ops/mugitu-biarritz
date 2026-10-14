# Back-office : une interface claire, et un agenda partagé lisible

Date : 13 octobre 2026
Statut : validé à l'oral (audit présenté, fonctions d'agenda choisies par Lucas)
Branche : `feature/admin-ui`

## Pourquoi

Audit du 13 octobre, mesuré à 375 px de large (téléphone) et sur ordinateur.

**Toutes les pages**
- Aucun cadre de page : le contenu colle aux bords sur téléphone, et au menu sur ordinateur.
- Quatre pages sur six débordent sur téléphone : Agenda (428 px pour 375), Mugi Klub (447), Actualités (486), Praticiens (596).
- Sur téléphone : pas de barre d'en-tête, un bouton « ☰ Menu » en caractère texte, pas de titre de page, un menu glissant sans bouton pour le fermer.
- Les icônes du menu sont des carrés gris identiques.
- Beaucoup de textes à 10–12 px, gris clair sur crème.
- Chaque page a ses propres boutons, cartes et onglets.

**L'agenda partagé**
- Cinq grilles empilées, une par salle : pour savoir qui est là mardi, il faut faire défiler cinq grilles.
- Pas de vue de la semaine d'une personne.
- Rien ne distingue les personnes à l'œil : des noms complets dans de petites cases grises.
- Les états (accordé, demandé, conflit) ne sont expliqués par aucune légende.

## Décisions

| Sujet | Décision |
|---|---|
| Identité visuelle | Celle du site : bleu nuit `#003850`, sarcelle `#04A49B`, crème `#FDF8F4`, blanc. Rien de nouveau, rien d'importé |
| Icônes | `lucide-react`, déjà installé ; un seul trait, une seule taille par niveau |
| Mise en forme | Des composants partagés dans `components/admin/ui/` et des classes dans `app/globals.css`, écrites téléphone d'abord puis `@media (min-width: 700px)` et `(min-width: 1024px)` |
| Taille de texte | 14 px minimum pour le contenu, 12 px pour les mentions secondaires ; contraste AA (4,5:1) |
| Cibles tactiles | 44 px minimum sur téléphone |
| Agenda | Une vue « Semaine » en un tableau, une vue jour par jour sur téléphone, « Qui est là aujourd'hui », « Par praticien », créneaux libres qu'on demande d'un tap, abonnement calendrier |

## Hors périmètre

- Le contenu et les règles des écrans (rien ne change dans ce qu'on peut faire, sauf l'agenda).
- Un thème sombre.
- L'éditeur d'articles et l'écran des jeux du stand, sauf leur débordement éventuel.

## 1. Le socle commun

**Le cadre de page** (`components/admin/ui/Page.tsx`) : titre, phrase d'introduction facultative, actions à droite (dessous sur téléphone), puis le contenu. Marges de 16 px sur téléphone, 32 px au-delà, largeur maximale 1200 px.

**La coque**
- Ordinateur (≥ 1024 px) : le menu latéral, comme aujourd'hui, avec de vraies icônes et l'élément actif bien marqué.
- Téléphone et tablette : une barre d'en-tête collante (logo, titre de la page, bouton de menu de 44 px avec une icône). Le menu glisse depuis la gauche, avec un bouton « Fermer », la touche Échap, et le focus qui revient au bouton à la fermeture.

**Les composants** (`components/admin/ui/`) : `Bouton` (principal, secondaire, discret, danger ; état « en cours »), `Carte`, `Onglets` (défilent horizontalement sur téléphone au lieu de passer à la ligne), `Badge` (avec texte, jamais la couleur seule), `Message` (info, succès, erreur), `Champ` (libellé visible, aide, erreur sous le champ). Les écrans existants les adoptent à mesure qu'on y touche ; aucun écran ne garde un débordement.

## 2. L'agenda partagé

### Les personnes ont une couleur

Chaque personne a une couleur stable, tirée d'une palette de 10 teintes lisibles (texte blanc ou bleu nuit à 4,5:1), attribuée dans l'ordre alphabétique des noms. Une pastille montre ses initiales ; le nom complet est toujours disponible (libellé accessible, et en clair à côté sur ordinateur). La couleur n'est jamais le seul repère : les initiales sont toujours écrites.

### Les onglets

1. **Aujourd'hui** — qui est au cabinet aujourd'hui, matin et après-midi, dans quelle salle ; qui est en congé ; puis demain. C'est l'onglet d'ouverture.
2. **Semaine** — le tableau du cabinet pour une semaine datée (flèches, « Cette semaine »).
   - Ordinateur : salles en lignes, jours en colonnes, chaque jour coupé en matin et après-midi ; chaque case montre la pastille de qui la tient. Colonne du jour mise en avant.
   - Téléphone : une rangée de jours (Lun… Dim, le jour courant sélectionné), puis pour le jour choisi les cinq salles, matin et après-midi, en cartes pleine largeur.
   - Une légende des personnes au-dessus : toucher un nom surligne ses créneaux et estompe les autres ; le retoucher annule.
   - Un interrupteur « Créneaux libres » met en avant les cases libres. Toucher une case libre ouvre « Demander Sua, mardi matin ? » : la demande est un vœu, comme aujourd'hui.
   - Toucher une case tenue ouvre le détail existant (fil de commentaires, échange, retrait).
   - États expliqués par une légende : accordé, demandé (en attente), conflit, échange ponctuel, absent.
3. **Par praticien** — une ligne par personne, les sept jours en colonnes, et dans chaque jour la salle du matin et de l'après-midi. Sur téléphone, une carte par personne, ses jours en liste.
4. **Mes demandes** — l'actuelle « Ma semaine » : ses vœux, leur état, cocher et décocher.
5. **Congés** et **Échanges** — inchangés dans le fond, remis au propre.

### L'abonnement calendrier

Chacun peut ajouter **sa** présence au cabinet à son calendrier (Google Agenda, calendrier de l'iPhone, Outlook).
- Une adresse privée par personne : `https://www.mugitu-biarritz.fr/api/agenda/calendrier/<jeton>.ics`. Le jeton est aléatoire (32 octets), créé à la première demande, et peut être régénéré, ce qui coupe l'ancienne adresse.
- Le fichier couvre les 8 semaines à venir. Il tient compte des échanges ponctuels et des congés : un créneau cédé n'y figure pas, un créneau reçu y figure, un jour de congé n'y figure pas.
- Horaires des demi-journées : matin 8 h – 14 h, après-midi 14 h – 20 h, heure de Paris. Ce sont des repères pour l'agenda, réglables en un endroit (`lib/agenda/horaires.ts`).
- Chaque événement : « Sua · cabinet Mugitu », lieu « 3 avenue Kléber, 64200 Biarritz ».
- Dans l'onglet « Mes demandes » : un bouton « Ajouter à mon calendrier » qui affiche l'adresse, un bouton « Copier », et trois lignes d'aide (Google, iPhone, Outlook).
- Le jeton est rangé dans une table lue par son seul propriétaire ; la route lit avec la clé de service, ne renvoie que la présence de la personne, et répond 404 à un jeton inconnu.

## 3. Ce qu'on vérifie

1. **Tests unitaires** : attribution des couleurs, présence d'un jour, semaine d'une personne, créneaux libres, génération du fichier calendrier (exceptions, congés, fuseau).
2. **Scénarios SQL** : un jeton n'est lisible que par son propriétaire ; la régénération remplace l'ancien.
3. **Aucun débordement** à 375 px sur les six pages du back-office (mesuré : largeur du document = largeur de l'écran).
4. **Relecture visuelle** de chaque page à 375 px et sur ordinateur ; navigation au clavier dans la coque et l'agenda.
5. Build, lint, tests.
