# PolySense Analytics — Feuille de route 1275

> Résumé en une page destiné au dossier de labellisation startup
> (décret exécutif n° 1275 relatif au label startup).

## Le produit

PolySense Analytics est un **soft-sensor** (capteur logiciel) basé sur
l'apprentissage automatique, qui estime en temps réel des indicateurs
qualité non mesurables directement en ligne sur les extrudeuses
plastiques industrielles. La première application est l'estimation du
risque de dégradation thermique du PVC sur les extrudeuses à double
vis parallèles. Le produit combine :

- un **modèle ML** (XGBoost) entraîné sur les données procédé
  (températures, pression, couple, débit) — travaux de master
  validés, F1 = 0,85 sur jeu de test synthétique, 0,83 sur jeu
  industriel tiers ;
- un **dashboard temps réel** (web) montrant la valeur actuelle et la
  prévision à 30 minutes des indicateurs (dégradation, jaunissement,
  stabilité, risque HCl) ;
- un **backend d'inférence** (FastAPI + Python) qui sert le modèle à
  partir des variables procédé, avec une API documentée (OpenAPI /
  Swagger).

## La proposition de valeur

Sur une ligne d'extrusion, les indicateurs de qualité (coloration,
stabilité dimensionnelle, dégradation thermique) sont mesurés au
laboratoire a posteriori. Le conducteur de ligne ne dispose que de
variables procédé (T, P, couple, vide) dont il doit inférer l'état par
expérience. Notre soft-sensor transforme ces variables procédé en un
**score de risque temps réel** affiché au conducteur et transmis au
système d'alerte. Bénéfices directs :

- **Réduction du rebut** de 5 à 15 % selon les retours d'extrudeurs
  contactés (objectif N+2, à valider en pilote).
- **Réduction des arrêts non planifiés** pour cause de dégradation
  thermique non détectée à temps.
- **Traçabilité** de l'état qualité en continu (utile pour les
  certifications ISO 9001).

## Le marché

L'Algérie compte plusieurs centaines de lignes d'extrusion plastique
industrielles (PVC, PE, PP), réparties entre une vingtaine de
groupes industriels (ENPC, CPG, Granulat+, Salemat, Aftouch, etc.) et
de nombreux PME. L'Afrique du Nord et l'Afrique subsaharienne
représentent un marché adressable complémentaire. Le modèle de licence
annuelle par ligne (200 000 DZD, soit ~1 500 USD) positionne le
produit à moins d'un quart de travail d'un ingénieur qualité par
ligne, ce qui le rend défendable devant un directeur d'usine.

## Modèle économique

| Année | Lignes servies | CA (DZD) | Salariés |
|---|---:|---:|---:|
| N (pilote) | 1 | 100 000 | 2 |
| N+1 | 3 | 600 000 | 3 |
| N+2 | 11 | 1 700 000 | 4 |
| N+3 | 40 | 5 000 000 | 5 |
| N+4 | 95 | 11 000 000 | 6 |

Le CA suit deux pistes à partir de N+2 :
- **Vente directe** aux plasturgistes algériens (Track A) ;
- **Distribution** via un intégrateur d'automatisme (Track B) à
  l'échelle nationale, puis à l'export à partir de N+3.

L'année de rentabilité opérationnelle est N+3, avec un résultat
positif en N+4 (≈ 4,8 M DZD, soit 36 000 USD).

## L'équipe de départ

- **Fondateur / Directeur technique** : ingénieur diplômé du master
  (PolySense — 2026), auteur du mémoire et du modèle ML.
- **Lead ingénieur ML** : à recruter N (data scientist / ML
  engineer, 3-5 ans d'expérience, profil ENSP / ESI / USTHB).
- **Business developer** : à recruter N+1 (commercial B2B
  industriel, connaissance du secteur plasturgiste algérien).
- **Ingénieurs déploiement** : à partir de N+2, pour gérer
  l'intégration chez les clients (data collection, calibration du
  modèle, formation des opérateurs).

## L'investissement demandé

- **Investissement initial** (N) : 1,1 M DZD (~8 000 USD), intégralement
  couvert par le fondateur et le love money. Pas de levée de fonds
  externe prévue sur l'horizon du plan.
- **Besoin de labellisation 1275** : accompagnement (mentorat, accès
  au marché public via les centrales d'achat, label pour la
  crédibilité commerciale à l'international), exonérations fiscales
  pendant 4 ans, facilitation des procédures CNRC et CNAC.

## La demande

Labellisation startup au titre du décret exécutif 1275, pour :

1. Bénéficier de l'exonération d'IS pendant 4 ans (le résultat N+4
   positif sinon taxé).
2. Obtenir le label qui ouvre les marchés publics algériens (Sonatrach,
   Naftal, etc. — marchés de plasturgie industrielle).
3. Bénéficier du mentorat et de l'écosystème (Algeria Venture, NafasTec,
   incubateurs universitaires) pour structurer la croissance à N+3 et
   au-delà.

## Le plan sur 24 mois

| Trimestre | Jalon |
|---|---|
| Q1 N | Création de la société (SPA ou SARL), labellisation 1275, premier contact avec 5 plasturgistes algériens |
| Q2 N | Signature d'une lettre d'intention avec un premier client pilote |
| Q3 N | Déploiement du pilote (4-6 semaines de collecte de données sur la ligne client) |
| Q4 N | Validation du modèle sur les données réelles du pilote, signature du premier contrat annuel |
| Q1-Q2 N+1 | Onboarding du 2e et 3e client, recrutement du business developer |
| Q3-Q4 N+1 | Levée du premier contact distribution (intégrateur d'automatisme) |
| Q1 N+2 | Signature du contrat de distribution, premières lignes Track B |

## Risques et hypothèses

- **Hypothèse principale** : accès à un premier client pilote en Q2 N
  (sans cela, le plan de croissance directe N+1-N+2 n'est pas
  tenable). Levée de risque : réseau du fondateur, salons Plast Alger
  2025, contact direct avec les groupes plasturgistes.
- **Risque technique** : la calibration du modèle sur les données
  réelles du premier client peut dégrader les performances par
  rapport au benchmark synthétique. Mitigation : le pipeline est conçu
  pour être ré-exécuté tel quel sur les données réelles.
- **Risque commercial** : la croissance Track B dépend d'un accord
  avec un intégrateur qui n'est pas encore identifié. Mitigation :
  exploration en parallèle de 2-3 intégrateurs (ENAC, SGTM,
  partenaires italiens/turcs présents en Algérie).

---

*Document préparé dans le cadre du mémoire de Master « Conception
d'un soft-sensor basé sur l'intelligence artificielle pour la
supervision en temps réel d'une ligne d'extrusion PVC » (KraussMaffei
KMD 90-36), 2025-2026. Voir `plan_financier.tex` pour les tableaux
détaillés.*
