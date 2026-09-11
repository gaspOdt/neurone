# 03 — Accessibilité

## Quelles normes suivre, exactement

Recherche menée le 10 septembre 2026, à la demande de l'utilisateur.

### La réponse courte

**Viser WCAG 2.2 niveau AA.** C'est le socle qui satisfait tout le reste.

### Pourquoi, et comment les normes s'emboîtent

Il n'existe pas une norme par handicap. Il existe **une norme technique de
référence**, et des textes réglementaires qui pointent vers elle.

| Texte | Ce que c'est | Ce qu'il faut en savoir |
|---|---|---|
| **[WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/)** | La norme technique du W3C, publiée en octobre 2023 | **87 critères** : 32 de niveau A, 24 de niveau AA, 31 de niveau AAA. C'est la seule chose qu'on teste réellement |
| **[EN 301 549](https://www.etsi.org/)** | La norme européenne | La version **v4.1.1, publiée le 2 septembre 2026**, intègre WCAG 2.2. Elle étend les exigences au-delà du web (logiciels, matériel) |
| **Acte européen sur l'accessibilité** | Le texte de loi européen | Applicable depuis le **28 juin 2025**. Il ne définit rien techniquement : il renvoie à EN 301 549 |
| **[RGAA 4.1](https://accessibilite.numerique.gouv.fr/)** | La déclinaison française | 106 critères de contrôle. C'est la transposition de WCAG, avec une méthode de test officielle |

**Conclusion pratique : un site conforme WCAG 2.2 AA est conforme au RGAA et à
l'Acte européen.** Inutile de suivre trois référentiels en parallèle.

### Les 6 critères que WCAG 2.2 ajoute à la version 2.1

Ils comptent particulièrement ici, car **trois d'entre eux concernent
directement les troubles moteurs**, c'est-à-dire le public des associations
de patients :

| Critère | Ce qu'il exige | Notre situation |
|---|---|---|
| **2.5.7 Dragging Movements** | Toute action au glisser-déposer doit avoir une alternative | Décidé dès le départ : **aucune interaction du site n'utilise le glisser** |
| **2.5.8 Target Size (Minimum)** | Cibles d'au moins 24 × 24 px | On vise **44 × 44**, bien au-delà |
| **2.4.11 Focus Not Obscured** | L'élément qui a le focus ne doit jamais être caché par un autre | À vérifier : pas de barre flottante qui recouvre le focus |
| **2.4.13 Focus Appearance** | Indicateur de focus suffisamment épais et contrasté | Notre contour fait 3 px |
| **3.2.6 Consistent Help** | L'aide est toujours au même endroit | Le bouton d'animations est toujours dans l'en-tête |
| **3.3.7 Redundant Entry** | Ne pas redemander une information déjà donnée | Sans objet : aucun formulaire |

### Le volet que personne ne traite : le handicap cognitif

WCAG couvre mal les troubles cognitifs et de l'apprentissage. Le W3C publie un
document distinct pour ça : **[Making Content Usable for People with Cognitive
and Learning Disabilities](https://www.w3.org/TR/coga-usable/)** (groupe COGA).

Ce n'est pas une norme opposable, mais **c'est le document le plus pertinent
pour ce site**, parce qu'il s'adresse à des collégiens et à des familles. Ses
principes retenus ici :

- **Langue claire.** Phrases courtes, mots courants, une idée à la fois.
- **Ne pas surcharger.** Ne montrer qu'une chose à la fois. C'est exactement la
  consigne de l'utilisateur sur le rythme de défilement, et sur les parties du
  neurone qui arrivent l'une après l'autre.
- **Ne pas exiger de mémoire.** Ne jamais supposer que le lecteur se souvient
  d'une notion vue trois écrans plus haut.
- **Rendre l'état visible.** Où suis-je, que se passe-t-il, que puis-je faire.
- **Pas de limite de temps.** Aucune.

**Ce qui est notable ici : le rythme lent demandé par l'utilisateur pour des
raisons de confort de lecture est aussi une exigence d'accessibilité cognitive.**
Les deux se rejoignent, comme la palette sémantique rejoignait le daltonisme.

### Ce qu'on ne fera pas

Le **niveau AAA** n'est pas visé. Le W3C lui-même déconseille de l'exiger pour
un site entier : certains critères sont impossibles à tenir sur du contenu
graphique. On respectera cependant plusieurs critères AAA sans le revendiquer,
notamment l'absence de limite de temps et le mouvement contrôlable.

---

## Pourquoi c'est un pôle et pas une finition

Le site s'adresse notamment à des **associations de patients**. Une partie du
public a des troubles de la vision des couleurs, de la motricité, ou une
sensibilité au mouvement. Traiter l'accessibilité en fin de projet reviendrait
à devoir tout redessiner : la palette, les interactions et le balisage sont
concernés dès la première ligne de code.

C'est aussi, très concrètement, **un argument de candidature**. Un institut qui
parle à des patients remarque immédiatement qu'on y a pensé.

---

## Deux conclusions de recherche qui ont orienté le pôle

**1. L'« audiodescription » n'existe pas vraiment sur le web hors vidéo.**
La demande initiale mentionnait l'audiodescription. Sur une page interactive,
son équivalent réel, ce sont les **alternatives textuelles** et le **support des
lecteurs d'écran** : chaque schéma porte une description, chaque animation a un
récit écrit qui dit la même chose. Une narration audio reste possible en bonus,
mais elle ne remplace pas ce socle — elle s'y ajoute.

**2. Pour ce public, la motricité compte au moins autant que la couleur.**
La demande portait surtout sur le daltonisme. Mais un site rempli d'interactions
peut être totalement inutilisable pour quelqu'un qui ne contrôle pas finement un
curseur. **Aucune interaction du site ne repose sur un glisser-déposer.**

---

## Les cinq chantiers

### 1. Couleur

Palette fluo. Détail complet et ratios mesurés dans
[`01-DIRECTION-ARTISTIQUE.md`](01-DIRECTION-ARTISTIQUE.md).

Les quatre règles :

1. **Aucune information n'est jamais portée par la couleur seule.** Chaque
   concept est identifié par **couleur + forme + étiquette**. Le test : une
   capture en noir et blanc doit rester entièrement compréhensible.
2. **Une couleur n'est jamais réutilisée** pour un autre concept.
3. **Le texte est noir, toujours. La couleur passe derrière**, en surligneur.
   Une couleur fluo contraste très bien avec du noir et très mal avec du
   blanc : en fond elle vaut jusqu'à 12:1, en trait fin elle tombe à 1,5:1.
4. **Les aplats fluo sont cernés d'un filet d'encre**, qui porte le contraste
   que la couleur ne peut pas porter. Seul le bleu électrique `#0066FF` tient
   en trait pur, à 4,8:1.

Contrastes : **4,5:1** pour le texte, **3:1** pour les traits et l'interface.

**Une tolérance assumée, mesurée et tracée.** Le magenta d'interface se confond
avec le vert en deutéranopie et avec l'orange en tritanopie, et aucune palette
de quatre couleurs fluo n'échappe à cette collision. C'est acceptable **parce
que le magenta ne porte aucune information scientifique** : il dit « regarde
ici », message déjà porté par l'épaisseur du trait, le cadrage de la caméra et
la graisse du mot. La règle 1 est ce qui rend cette tolérance légitime. Les
couleurs qui portent du sens, elles, restent distinguables dans les trois cas,
avec un écart minimal de 86 pour un seuil de confusion à 60.

### 2. Mouvement

- Respect de `prefers-reduced-motion` (réglage système du visiteur)
- **Et** un bouton visible « Réduire les animations » dans l'en-tête, atteignable
  à tout moment — exigé par WCAG 2.2.2 et 2.3.3, car tout le monde n'a pas réglé
  son système
- Le choix explicite du visiteur est mémorisé et **prime sur le système**
- En mode réduit, **l'information reste, seul le mouvement part**. Les animations
  deviennent leur état d'arrivée.
- **Aucun clignotement au-delà de 3 par seconde** (épilepsie photosensible)

Tout passe par `js/a11y.js` et les variables `--dur-*`. **Ne jamais écrire une
durée en dur dans une transition CSS** : le mode réduit ne pourrait pas l'atteindre.

### 3. Lecteurs d'écran

- Chaque SVG porte `role="img"` avec `<title>` et `<desc>` liés par `aria-labelledby`
- Le `<desc>` **décrit ce qu'on voit**, il ne répète pas la légende
- Chaque animation ou activité est doublée d'une **alternative textuelle
  dépliable** (`<details class="alt-text">`), accessible à tout le monde et pas
  seulement aux lecteurs d'écran
- Les résultats des simulations sont annoncés via `aria-live="polite"`
- Structure de titres continue, sans saut de niveau
- Un lien d'évitement en tout premier élément de la page

### 4. Motricité

**Le chantier le plus critique pour le public visé.**

- **Aucune interaction ne repose sur un glisser-déposer.** Tout ce qui se
  manipule se pilote aussi au clic et au clavier. Si un jour on ajoute un
  curseur à faire glisser, il doit répondre aux flèches du clavier.
- Navigation complète au clavier, dans un ordre logique
- Indicateurs de focus visibles et épais (3 px), jamais supprimés
- Cibles tactiles **≥ 44 × 44 px**
- **Aucune limite de temps** nulle part, y compris dans le quiz

### 5. Bonus, non promis

Narration audio par section. À évaluer en fin de projet : la qualité de la
synthèse vocale française dépend de la machine du visiteur, donc le résultat
n'est pas garanti.

---

## Le lien avec les vieux appareils

**Une seule mécanique sert deux besoins.** La bascule « mouvement réduit » est
aussi ce qui sauve le site sur un téléphone ancien : `js/a11y.js` surveille les
images réellement produites pendant les premières secondes et bascule tout seul
si l'appareil peine.

Autrement dit, le travail d'accessibilité et la contrainte de performance
exigée par l'utilisateur se résolvent avec le même code.

---

## Liste de vérification

À passer **section par section**, pas une seule fois à la fin.

### Clavier
- [ ] Tout le contenu est atteignable à la touche Tab seule, sans souris
- [ ] L'ordre de tabulation suit l'ordre visuel
- [ ] Le focus est toujours visible
- [ ] Aucun piège au clavier
- [ ] Le lien d'évitement fonctionne

### Couleur
- [ ] Capture en noir et blanc : tout reste compréhensible
- [ ] Simulation deutéranopie, protanopie, tritanopie : rien ne se confond
- [ ] Contrastes vérifiés — 4,5:1 texte, 3:1 graphiques
- [ ] Aucun texte n'utilise une couleur `--c-X` sans `-text`

### Mouvement
- [ ] Le bouton « Réduire les animations » fonctionne
- [ ] Le réglage système est respecté
- [ ] En mode réduit, **aucune information n'a disparu**
- [ ] Aucun clignotement rapide

### Lecteurs d'écran
- [ ] Chaque SVG informatif a `<title>` et `<desc>`
- [ ] Chaque animation a son alternative textuelle
- [ ] Testé au VoiceOver de macOS (Cmd+F5)
- [ ] La structure de titres est continue

### Motricité et tactile
- [ ] Aucune interaction n'exige un glisser-déposer
- [ ] Toutes les cibles font au moins 44 × 44 px
- [ ] Aucune limite de temps

### Robustesse
- [ ] JavaScript désactivé : le contenu reste lisible, pas de page blanche
- [ ] Processeur bridé 6× : le site reste utilisable
- [ ] Hors connexion : tout se charge
