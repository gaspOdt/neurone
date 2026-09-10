# 03 — Accessibilité

> **Objectif : WCAG 2.1 niveau AA**, soit l'équivalent du
> [RGAA 4.1](https://accessibilite.numerique.gouv.fr/) français, qui en est
> la transposition officielle (106 critères).

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

Palette **Okabe-Ito**, standard scientifique du daltonisme. Détail complet et
ratios mesurés dans [`01-DIRECTION-ARTISTIQUE.md`](01-DIRECTION-ARTISTIQUE.md).

Les trois règles :

1. **Aucune information n'est jamais portée par la couleur seule.** Chaque
   concept est identifié par **couleur + forme + étiquette**. Le test : une
   capture en noir et blanc doit rester entièrement compréhensible.
2. **Une couleur n'est jamais réutilisée** pour un autre concept.
3. **Les couleurs graphiques ne servent jamais au texte.** Trois des quatre
   couleurs Okabe-Ito échouent au contraste sur fond blanc. Utiliser les
   variantes `--c-X-text`.

Contrastes : **4,5:1** pour le texte, **3:1** pour les traits et l'interface.

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
