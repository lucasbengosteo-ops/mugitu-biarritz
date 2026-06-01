# Revue de traduction basque — points à valider

Traduction réalisée par Claude (non locuteur natif). À faire relire par un·e
locuteur·rice basque avant publication. Liste des points sensibles :

## Termes médicaux / professionnels

| FR | EU proposé | À valider |
|---|---|---|
| Kinésithérapie du sport | Kirol kinesiterapia | OK selon Wikipedia, mais "kinesiterapia"/"kinesiologia" possibles |
| Médecine du sport | Kirol medikuntza | OK |
| Ostéopathie du sport | Kirol osteopatia | OK |
| Préparation physique | Prestakuntza fisikoa | Alternative : "Prestaketa fisikoa" |
| Mésothérapie · PRP | Mesoterapia · PRP | Termes médicaux gardés tels quels |
| Athletic trainer | Athletic trainer | Loan anglais, idem en FR |
| Dry needling | Dry needling | Loan anglais idem |
| Réathlétisation | Berrathletizazioa | Néologisme — alternative : "kirolera itzultzea" |
| Endométriose | Endometriosia | OK |

## Termes spécifiques course à pied

| FR | EU proposé | À valider |
|---|---|---|
| Foulée / Analyse de foulée | Oin-pausoa / Oin-pausoaren analisia | "Pausoa" = pas. "Zantzua" possible. À confirmer. |
| Coureur | Korrikalaria | OK |
| Course à pied | Korrika / Lasterketa | "Korrika" pour l'action, "lasterketa" pour la compétition |
| Suivi du coureur | Korrikalariaren jarraipena | OK |

## Marketing / titres

| FR | EU proposé | Note |
|---|---|---|
| La maison du mouvement | Mugimenduaren etxea | OK — fidèle |
| Centre pluridisciplinaire | Diziplina anitzeko gunea | "Zentro multidiziplinarra" possible, plus international |
| La maison du mouvement (slogan) | Mugimenduaren etxea | Litt. "la maison du mouvement" |
| Prendre rendez-vous | Hitzordua hartu | OK |
| Réserver en ligne | Sarean hitzordua hartu | Alternative : "Linean erreserbatu" |
| Voir le profil Instagram | Instagrameko profila ikusi | OK |

## Concours / juridique (à valider impérativement)

Le règlement (`concoursPage.rule*`) traduit littéralement. Points sensibles :

- **"légalement majeur"** → "adin nagusikoa" — OK
- **"représentant légal"** → "legezko ordezkaria" — OK mais pourrait être plus formel
- **"non échangeables, non cessibles, non remboursables"** → "ezin trukatuzkoak, ezin lagatzekoak, ezin itzultzekoak" — formulation pataude, peut être améliorée
- **"Tirage au sort"** → "Zozketa" — OK (terme standard)
- **"par message privé sur Instagram"** → "Instagrameko mezu pribatu bidez" — OK
- **"Instagram qui ne peut être tenu pour responsable"** → "ez du inolako ardurarik" — OK

## Tournures de phrase

Plusieurs paragraphes ont été reformulés pour respecter la grammaire basque
(SOV — sujet-objet-verbe), ce qui peut donner un rythme différent du français.
Si une phrase paraît bizarre, comparer avec le FR original.

Exemples à vérifier :
- Histoire / "Le projet est né d'un constat..." → "Egitasmoak iturri argia
  du..." (litt. "Le projet a une source claire") — un peu libre, peut être
  reformulé.
- Andrew description avec balises `<strong>` — vérifier que la position de
  `<strong>Andrew®</strong>` reste cohérente.

## Pluriels inclusifs

Le français utilise "gagnant·es", "tiré·es au sort". Le basque ne marque pas
le genre dans les noms, donc plus simple :
- "gagnants" → "irabazleak"
- "tirés au sort" → "zozketatuak"

Pas besoin d'écriture inclusive en basque.

## Points de style

- Ordutegia / dates : format "Astelehena — Ostirala: 8:00 — 19:00" choisi
  (point pour les heures comme en EU/FR). À adapter si convention différente.
- "App.mugitu.pro" : laissé tel quel (nom de marque).
- "@mugitu_biarritz" / "@jublamont_lacliniqueducoureur" : laissés tels quels.

---

**Action attendue** : relire le fichier `lib/dictionaries/eu.ts` en parallèle
avec `lib/dictionaries/fr.ts`. Les clés doivent rester identiques. Modifier
uniquement les valeurs des chaînes.
