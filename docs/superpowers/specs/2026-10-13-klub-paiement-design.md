# Mugi Klub : payer sa séance en ligne, directement au praticien

Date : 13 octobre 2026
Statut : validé à l'oral
Branche : `feature/klub-paiement`

Première livraison d'un chantier en quatre parties, décidé avec l'équipe le 13 octobre :

1. **Le socle** : chaque séance rattachée à un praticien, un prix en euros.
2. **Le paiement** : chaque praticien relie son compte Stripe ; l'inscription se paie en ligne et se rembourse.
3. **L'individuel et le duo** : Hugo, Baptiste et Jean-Baptiste publient des créneaux pour une ou deux personnes, précédés d'un bilan de 30 minutes offert.
4. **Le carnet de 10 séances** : un solde de séances par client.

Ce document couvre les parties 1 et 2. Les parties 3 et 4 auront chacune leur spécification.

## Objectif

Qu'une personne qui s'inscrit à une séance payante du Klub la paie en ligne. L'argent doit arriver directement sur le compte du praticien qui l'anime, sans passer par Mugitu.

## Décisions prises

| Sujet | Décision |
|---|---|
| Encaissement | Une page de paiement Stripe (Checkout), payée directement sur le compte Stripe du praticien |
| Part de Mugitu | Aucune. Le praticien est le vendeur, il encaisse tout, moins les frais Stripe |
| Compte du praticien | Un compte Stripe à lui, relié depuis le back-office ; il le gère depuis son propre tableau de bord Stripe |
| Prix | Un montant en euros saisi par séance, par l'équipe. La grille n'est pas figée dans le code |
| Séance d'essai | Aucune pour les small groups : 15 € dès la première séance |
| Annulation par le client | Remboursée automatiquement jusqu'à 24 h avant le début, due ensuite |
| Annulation par le praticien | Toujours remboursée |
| Liste d'attente | La première personne reçoit un lien de paiement, la place lui est gardée quelques heures, puis passe à la suivante |
| Sans compte Stripe prêt | Paiement sur place, comme aujourd'hui |

## Hors périmètre

- Les séances individuelles et en duo, le bilan offert : partie 3.
- Le carnet de 10 séances : partie 4.
- Les factures au nom du praticien. Stripe envoie un reçu au client ; une facture se fait à la demande, par le praticien.
- La consultation chez le médecin du sport en option d'un programme individuel. Elle reste une consultation réservée et facturée par le médecin, hors du Klub (voir « Point de vigilance »).

## 1. Le socle : la séance connaît son praticien et son prix

Aujourd'hui, l'intervenant d'une séance n'est qu'un nom et une adresse e-mail saisis à la main, et le prix un texte affiché (« 15 € »).

**Le praticien.** Créneaux et séances reçoivent `praticien_id`, une référence à `auth.users` (le compte du praticien, jamais `profiles.id`). Une séance créée depuis un créneau hérite du praticien de ce créneau, comme elle hérite déjà de l'image et de la méthode de réservation. Le nom affiché reste `intervenant`, modifiable : un atelier peut être animé par un invité tout en étant encaissé par un praticien.

**Le prix.** Créneaux et séances reçoivent `prix_centimes`, un entier positif ou nul. Le libellé affiché devient calculé (« 15 € ») quand le prix est renseigné. Un libellé libre reste possible pour une séance sans prix (« Gratuit », « Prix libre »).

**Qui modifie quoi.** Changer le praticien d'une séance, c'est changer qui encaisse. Une règle en base, et pas seulement dans l'écran :
- un gérant (Lucas, Jean-Baptiste) rattache n'importe quelle séance à n'importe quel praticien ;
- un praticien peut modifier le prix et les textes de ses propres séances ;
- il ne peut ni rattacher une séance à lui-même, ni modifier le prix d'une séance qui n'est pas la sienne.

Même mécanique que l'agenda et les articles : un déclencheur `before update` qui refuse, avec un code d'erreur traduit dans l'écran.

## 2. Le compte Stripe de chaque praticien

**Relier son compte.** Dans le back-office, chaque praticien voit une carte « Encaisser en ligne » avec un bouton « Relier mon compte Stripe ». Il est envoyé chez Stripe pour créer son compte, ou utiliser un compte existant. Stripe lui demande sa pièce d'identité, son SIRET et son IBAN. Puis il revient sur le back-office.

Le compte est de type **Standard** : le praticien a son propre tableau de bord Stripe, ses virements, ses litiges et ses reçus. Mugitu n'a pas accès à ses données bancaires.

**L'état du compte**, affiché sur la carte :
- « À relier » : aucun compte ;
- « En vérification » : compte créé, Stripe n'autorise pas encore les paiements ;
- « Prêt à encaisser » : les paiements sont autorisés.

L'état est tenu à jour par les notifications de Stripe (`account.updated`), pas par le retour du navigateur.

**Où c'est rangé.** Une table `site_comptes_stripe` : le compte de l'utilisateur (`user_id`, clé), l'identifiant du compte Stripe, son état, la date de mise à jour. Seul le serveur l'écrit, avec la clé de service. Le praticien lit sa propre ligne ; les gérants lisent toutes les lignes.

## 3. L'inscription payante

**Quand la séance est payante en ligne.** Les trois conditions réunies : un prix supérieur à zéro, un praticien rattaché, et son compte « prêt à encaisser ». Sinon l'inscription se passe comme aujourd'hui, et la page dit « paiement sur place ». Une séance à méthode de réservation externe (WhatsApp, autre site) n'est pas concernée.

**Le parcours.**
1. Le visiteur remplit le formulaire actuel.
2. Une place lui est réservée pour 30 minutes : l'inscription est créée avec un nouveau statut, `paiement`, qui compte dans les places prises.
3. Le site crée une session de paiement Stripe sur le compte du praticien, valable 30 minutes, et y envoie le visiteur.
4. Stripe notifie le serveur du paiement (`checkout.session.completed`). L'inscription passe en `confirmee`, le mail de confirmation part.
5. Le visiteur revient sur une page « Paiement reçu » ou « Paiement abandonné ».

C'est la notification de Stripe qui confirme, jamais le retour du navigateur : un visiteur qui ferme l'onglet après avoir payé est inscrit.

**Si le paiement n'aboutit pas.** À l'expiration de la session (`checkout.session.expired`), ou au plus tard par la tâche minute du Klub, l'inscription en `paiement` depuis plus de 30 minutes passe en `annulee`. La place se libère et la liste d'attente avance.

**Inscriptions existantes.** Rien ne change pour les inscriptions déjà enregistrées ni pour les séances sans paiement en ligne.

## 4. Annulation et remboursement

- **Par le client, plus de 24 h avant le début**, depuis le lien de son mail : l'inscription est annulée et le paiement remboursé en entier, automatiquement.
- **Moins de 24 h avant** : l'annulation reste possible pour libérer la place, mais la séance est due. La page d'annulation le dit avant que le client confirme.
- **Séance annulée par le praticien** : chaque inscrit payé est remboursé en entier, automatiquement, et le mail d'annulation le dit.
- **Annulation d'une inscription depuis le back-office** : le praticien choisit de rembourser ou non.

Le remboursement passe par le compte Stripe du praticien. Les frais Stripe du paiement initial ne sont pas rendus par Stripe ; ils restent à la charge du praticien.

Chaque inscription garde l'identifiant de son paiement Stripe et, le cas échéant, celui du remboursement. Un remboursement ne peut être déclenché qu'une fois.

## 5. La liste d'attente

Aujourd'hui, une place libérée confirme automatiquement la première personne en attente. Pour une séance payante en ligne, cette personne ne peut pas être débitée sans son accord :
1. elle passe en `paiement` et reçoit un mail « Une place s'est libérée » avec un lien de paiement ;
2. la place lui est gardée **6 heures**, et jamais au-delà du début de la séance ;
3. sans paiement dans ce délai, elle passe en `annulee` et la place va à la suivante.

Le lien du mail renvoie au site, qui crée une session de paiement neuve. Un lien ouvert après le délai dit que la place a été proposée à quelqu'un d'autre.

## 6. Les notifications de Stripe

Une route `POST /api/stripe/webhook` reçoit les événements des comptes reliés. Elle vérifie la signature de Stripe avant toute lecture, et refuse ce qu'elle ne sait pas vérifier.

Événements traités : `checkout.session.completed`, `checkout.session.expired`, `account.updated`, `charge.refunded`.

Stripe peut envoyer un événement plusieurs fois ou dans le désordre. Chaque traitement est donc **idempotent** : une inscription déjà confirmée ne l'est pas deux fois, un mail ne part pas deux fois.

## 7. Ce qu'il faut de ton côté, Lucas

Je ne crée pas de compte et je ne manipule aucune clé. À faire par toi, dans cet ordre :
1. Créer le compte Stripe de Mugitu, le compte « plateforme ».
2. Y activer Connect, avec des comptes Standard.
3. Déclarer l'adresse de notification `https://www.mugitu-biarritz.fr/api/stripe/webhook`, pour les événements des comptes reliés.
4. Poser dans Vercel la clé secrète et le secret de signature des notifications. Je donnerai les noms exacts des variables.

Tout se développe et se vérifie d'abord en **mode test** Stripe, sans argent réel.

## 8. Ce qu'on vérifie

1. **Tests unitaires** (`node --test`) : calcul du libellé de prix, règle des 24 h, éligibilité d'une séance au paiement en ligne, délai de la liste d'attente.
2. **Scénarios SQL** (transaction annulée) :
   - la place réservée compte dans les places prises ;
   - une réservation expirée libère sa place et fait avancer la liste d'attente ;
   - une confirmation reçue deux fois ne confirme qu'une fois ;
   - un praticien ne peut pas se rattacher la séance d'un autre, ni en changer le prix ;
   - un gérant le peut.
3. **Mode test Stripe**, avec les cartes de test de Stripe :
   - paiement réussi ;
   - carte refusée ;
   - paiement abandonné puis expiré ;
   - annulation à plus de 24 h, remboursée ;
   - annulation à moins de 24 h, non remboursée ;
   - séance annulée par le praticien, tous remboursés ;
   - promotion depuis la liste d'attente.
4. **Les scénarios existants** du Klub, de l'admin et des notifications passent toujours.
5. **Build et lint.**

## Point de vigilance, à porter à l'équipe

Le code de déontologie médicale interdit à un médecin d'abaisser ses honoraires dans un but de concurrence (art. R.4127-67) et le compérage (art. R.4127-23). Une consultation de médecine du sport offerte, ou vendue avec un programme de préparation physique, s'en approche. La version retenue pour la partie 3 :
- le bilan offert est celui du préparateur physique ;
- la consultation médicale reste une option, réservée et facturée normalement par le médecin.

C'est à confirmer par Basile.
