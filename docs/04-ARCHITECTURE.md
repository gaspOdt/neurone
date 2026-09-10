# 04 — Architecture et conventions

---

## Le principe : rien à installer

Pas de compilation, pas de gestionnaire de paquets, pas de `node_modules`.
Ce qui est dans les fichiers est **exactement** ce qui part en ligne.

Quatre raisons, dans l'ordre d'importance :

1. **Le jour de la démonstration.** La police et GSAP sont **copiées dans le
   dépôt**, jamais chargées depuis un CDN : le site fonctionne **sans connexion**.
2. **La reprise par d'autres agents.** Personne n'a rien à installer, aucune
   dépendance ne peut dériver.
3. **Le sprint.** Zéro configuration, on écrit du code utile immédiatement.
4. **L'accessibilité.** Du HTML écrit à la main se contrôle mieux qu'un HTML généré.

Développer :

```bash
python3 -m http.server 8000
```

---

## Les fichiers

```
index.html          La page unique. Toutes les sections s'y enchaînent.
css/
  tokens.css        Couleurs, tailles, durées. LE SEUL endroit où changer le style global
  base.css          Typographie, mise en page, accessibilité, composants
js/
  a11y.js           Mouvement réduit, détection d'appareil lent
  main.js           Point d'entrée, orchestration des animations
assets/
  fonts/            Inter, sous-ensemble latin
  vendor/           GSAP et ses greffons
docs/               La documentation — commencer par 00-CONTEXTE.md
```

---

## Les règles de code

### Jamais de valeur en dur

Toute couleur, taille, durée passe par une variable de `tokens.css`.

**Les durées surtout.** Une transition écrite `transition: opacity 300ms` est
invisible au mode « mouvement réduit », qui ne peut pas l'atteindre. Toujours
`transition: opacity var(--dur-base) var(--ease)`.

### Les couleurs ont deux formes

`--c-X` pour les aplats et les traits, `--c-X-text` dès qu'un mot doit être lu.
Trois des quatre couleurs Okabe-Ito échouent au contraste sur blanc.
Voir [`01-DIRECTION-ARTISTIQUE.md`](01-DIRECTION-ARTISTIQUE.md).

### Toute animation a un état d'arrivée statique

Si le mouvement est coupé — appareil lent, réglage du visiteur, JavaScript en
échec — **le contenu doit rester entier et lisible**. On ne cache jamais une
information derrière une animation.

En pratique : `fromTo()` plutôt que `from()`. Avec `from()`, GSAP lit l'état
courant comme état d'arrivée ; si le CSS a mis l'élément à `opacity: 0`, on
anime de 0 vers 0 et rien n'apparaît. **Ce piège nous a déjà coûté une itération.**

### Le site marche sans JavaScript

Par défaut tout est visible. C'est le JavaScript qui, une fois chargé, pose la
classe `js` sur `<html>` et prend la main pour animer. **Le site n'affiche
jamais une page blanche.**

### Aucune interaction en glisser-déposer seul

Exigence d'accessibilité motrice. Tout ce qui se manipule répond aussi au clic
et au clavier.

---

## Compatibilité : tourner sur un vieux téléphone

**Cible : Safari iOS 14+ et Chrome Android 90+** — les appareils d'environ 2018
et plus récents.

### Interdit

- WebGL, Three.js
- `scroll-timeline`, View Transitions, requêtes de conteneur, `:has()` en dépendance
- `backdrop-filter`, filtres SVG animés — très coûteux sur GPU mobile ancien
- Les boucles Canvas permanentes : une boucle ne tourne que pendant son animation

### Autorisé et privilégié

- **N'animer que `transform` et `opacity`** — les deux seules propriétés que le
  GPU traite sans recalculer la mise en page
- Flexbox et Grid classiques, stables depuis 2017
- GSAP, dont la compatibilité navigateurs est excellente et qui lisse les écarts
- Les variables CSS dans les attributs SVG (`stroke="var(--ink)"`) : **vérifié,
  ça fonctionne**

### Budget de poids : 150 Ko transférés

Mesuré contre les références réelles, pas supposé. Détail et relevés dans
[`07-BENCHMARK.md`](07-BENCHMARK.md). État au jour 1 : **104 Ko**.

### Dégradation automatique

`js/a11y.js` surveille les images réellement produites pendant les 8 premières
secondes. Au-delà de 45 images trop lentes, il bascule seul en mode « mouvement
réduit ».

On ne mesure **pas** la fluidité au chargement : au repos, `requestAnimationFrame`
tourne au rythme de l'écran même sur une machine poussive, la mesure ne voudrait
rien dire.

**Une seule mécanique sert deux besoins** : le confort des personnes sensibles
au mouvement, et la survie sur matériel ancien.

---

## Ajouter une section

1. Ajouter le `<section class="section" id="...">` dans `index.html`, **à sa
   place dans l'ordre** — le récit est linéaire et rien n'apparaît avant son tour.
2. Chaque schéma SVG porte `role="img"`, un `<title>` et un `<desc>` liés par
   `aria-labelledby`.
3. Chaque animation ou activité reçoit son alternative textuelle dépliable
   (`<details class="alt-text">`).
4. Ajouter la fonction d'animation dans `js/main.js`, déclenchée par
   `ScrollTrigger`, et **vérifier qu'elle a bien un état d'arrivée statique**.
5. Passer la liste de vérification de [`03-ACCESSIBILITE.md`](03-ACCESSIBILITE.md).
6. Mettre à jour [`05-JOURNAL.md`](05-JOURNAL.md).

---

## Deux pièges d'environnement, déjà rencontrés

**1. Le lanceur de serveur intégré n'a pas accès au dossier Bureau**
(protection macOS). `python3 -m http.server` y échoue avec `PermissionError` sur
`os.getcwd()`, avant même de lire les arguments. Contournement : lancer le
serveur depuis un terminal normal.

**2. Un panneau navigateur masqué bride `requestAnimationFrame`.** Les animations
GSAP avancent alors au ralenti et les captures paraissent figées à mi-course.
**Ce n'est pas un bug du site.** Pour juger l'état final :

```js
gsap.globalTimeline.getChildren(true, true, true).forEach(t => t.progress(1));
```
