# Mugi Klub : la préparation individuelle et en duo

Date : 13 octobre 2026
Statut : validé à l'oral
Branche : `feature/klub-individuel`, partie de `feature/klub-paiement` (PR #40)

Partie 3 du chantier décidé avec l'équipe le 13 octobre. Elle s'appuie sur les parties 1 et 2 (`docs/superpowers/specs/2026-10-13-klub-paiement-design.md`) : séance rattachée à un praticien, prix en euros, paiement en ligne au praticien, remboursement, liste d'attente payante. La partie 4 (carnet de 10 séances) aura sa propre spécification.

## Objectif

Que Hugo (PPG), Baptiste (course et trail) et Jean-Baptiste (danseurs) proposent en ligne :
- des séances individuelles, seul ou à deux ;
- un bilan de 30 minutes offert, conseillé avant la première séance.

## Décisions prises

| Sujet | Décision |
|---|---|
| Réservation | Le préparateur publie des créneaux ; le client en choisit un et paie |
| Construction | Deux nouveaux types de séance du Klub, qui reprennent tout l'existant |
| Duo | On vient à deux : la personne qui réserve choisit « Seul » ou « À deux », nomme l'autre personne et paie les deux places au tarif duo. Le créneau est pris en entier |
| Bilan | Des créneaux « Bilan offert · 30 min », gratuits, publiés à part ; conseillés, jamais obligatoires |
| Affichage | Une page « Préparation individuelle » qui présente les trois préparateurs et leurs prochains créneaux |
| Consultation médicale | Une option, réservée et facturée par le médecin ; ni vendue ni offerte avec le programme |
| Droits | Un praticien se rattache lui-même aux créneaux individuels et aux bilans qu'il crée |
| Tarifs | Saisis par chaque préparateur ; rien n'est figé dans le code |

## Hors périmètre

- La réservation de la salle dans l'agenda du cabinet : le préparateur la tient par ses vœux de semaine type, comme aujourd'hui.
- Le carnet de 10 séances : partie 4.
- Un agenda de disponibilités où le client choisit son heure dans une plage.

## 1. Deux nouveaux types de séance

Aux types `small`, `atelier`, `conf` et `soiree` s'ajoutent :

| Type | Libellé | Places | Prix |
|---|---|---|---|
| `individuel` | Séance individuelle | 1 (une réservation, seul ou à deux) | Prix seul (`prix_centimes`) et prix duo par personne (`prix_duo_centimes`, vide = duo non proposé) |
| `bilan` | Bilan offert | 1 | Toujours gratuit |

Les créneaux récurrents, la génération des séances, les rappels, l'annulation par lien, la liste d'attente et le back-office s'appliquent sans changement de principe.

**Contraintes en base.**
- `individuel` et `bilan` ont une capacité de 1 et exigent l'inscription.
- Un `bilan` n'a pas de prix (ni seul ni duo).
- `prix_duo_centimes` n'est permis que sur un `individuel`.
- Ces deux types n'acceptent pas de méthode de réservation externe : ils se réservent toujours sur le site.

## 2. La réservation d'une séance individuelle

Le formulaire actuel gagne, pour un créneau `individuel` dont le duo est proposé, un choix **« Seul » / « À deux »**.

- **Seul** : montant = `prix_centimes`.
- **À deux** : le formulaire demande le prénom et le nom de la seconde personne. Montant = 2 × `prix_duo_centimes`, payé par la personne qui réserve. Le bouton l'affiche (« Payer et réserver · 60 € pour deux »).

L'inscription garde `nb_personnes` (1 ou 2) et `accompagnant` (prénom et nom, pour un duo). Le montant enregistré est celui de la réservation entière : le remboursement rend tout.

Paiement, réservation de 35 minutes, confirmation par la notification de Stripe, remboursement jusqu'à 24 h avant, rappel et annulation reprennent les règles de la partie 2. Une seule réservation occupe la place, qu'elle soit seule ou à deux.

**Sans compte Stripe prêt**, le paiement se fait sur place, comme pour les séances collectives. Le choix « Seul / À deux » reste, et la page affiche le montant à régler sur place.

**Liste d'attente.** Elle reste possible sur un créneau individuel pris. La personne promue paie selon le choix fait à son inscription (seul ou à deux).

## 3. Le bilan offert

- Un créneau `bilan` se réserve comme une séance gratuite d'aujourd'hui : confirmation immédiate, mail, rappel.
- Sur un créneau `individuel`, la case existante « Première séance » devient « Première séance avec <préparateur> ». Cochée, elle affiche au-dessus du bouton :
  - « Avant une première séance, <préparateur> propose un bilan de 30 minutes offert. » ;
  - les trois prochains bilans libres de ce préparateur, en liens.

  La réservation reste possible sans passer par un bilan.
- Le bilan ne comprend pas de séance VALD. C'est le choix de l'équipe : on fait le point sur les objectifs, et les mesures viennent ensuite.

## 4. La page « Préparation individuelle »

Adresse : `/mugi-klub/preparation-individuelle`, dans la route `ROUTES` du Klub, et dans le plan du site.

Pour chaque préparateur qui a au moins un créneau `individuel` ou `bilan` dans les 4 semaines à venir, une section qui donne :
- sa photo, son nom, sa discipline (texte issu de sa fiche) et un lien vers sa fiche ;
- ses tarifs, lus sur son prochain créneau individuel : « 40 € la séance · 30 € par personne à deux » ;
- « Bilan de 30 minutes offert avant la première séance » ;
- ses prochains créneaux libres, bilans et séances, au format des cartes du Klub.

Un préparateur sans créneau à venir n'apparaît pas.

Un encart commun, en bas de page :

> Pour un suivi plus complet, une consultation de médecine du sport avec le Dr Basile Carcassonne est possible en complément. Elle est réservée et facturée par le médecin, indépendamment de la préparation.

Avec un lien vers la fiche du médecin.

Le planning du Klub (`/mugi-klub`) n'affiche plus les types `individuel` et `bilan`, et gagne un lien vers cette page.

## 5. Les droits

La partie 1 réserve aux gérants le choix du praticien qui encaisse une séance. Pour les deux nouveaux types, la règle s'assouplit :
- un praticien peut **se rattacher lui-même** à un créneau ou une séance `individuel` ou `bilan`, s'il n'est rattaché à personne d'autre ;
- il ne peut pas rattacher un tel créneau à un autre praticien, ni se rattacher à une séance collective ;
- il change le prix de ses propres séances, comme aujourd'hui ;
- les gérants gardent tous les droits.

La règle vit dans `klub_admin_encaissement`.

## 6. Le back-office

- Créer un créneau ou une séance : les types « Séance individuelle » et « Bilan offert » sont proposés. Pour une séance individuelle :
  - la capacité est fixée à 1 ;
  - un champ « Prix à deux, par personne » apparaît ;
  - le praticien connecté est proposé comme praticien qui encaisse.
- Liste des inscrits : un duo s'affiche « Prénom Nom + Prénom Nom (à deux) », avec le montant.
- Les mails à l'intervenant (liste des inscrits) mentionnent l'accompagnant.

## 7. Les mails

- Confirmation d'un duo : « Séance à deux, avec <accompagnant>. ». Le montant payé est celui des deux places.
- Confirmation d'un bilan : « Bilan offert de 30 minutes avec <préparateur>. Venez en tenue de sport. »
- Les autres mails ne changent pas.

## 8. Ce qu'on vérifie

1. **Tests unitaires** :
   - montant d'une réservation (seul, à deux, duo non proposé) ;
   - libellé des tarifs ;
   - choix des préparateurs affichés sur la page ;
   - textes des mails duo et bilan.
2. **Scénarios SQL** (transaction annulée) :
   - contraintes des deux types ;
   - une réservation à deux prend la place entière ;
   - un duo refusé quand le prix duo est vide ;
   - montant enregistré ;
   - un praticien se rattache à son créneau individuel, mais pas à celui d'un autre ni à un small group ;
   - un bilan reste gratuit, même si on tente d'y poser un prix.
3. **Mode test Stripe** : réservation seule, réservation à deux, annulation remboursée d'un duo (montant entier).
4. **Les scénarios existants** du Klub et du paiement passent toujours.
5. **Build, lint, relecture visuelle** de la page et du formulaire, sur ordinateur et sur téléphone.
