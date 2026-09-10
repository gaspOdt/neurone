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
python3 -m http.server 8000    # python -m http.server 8000 sur Windows
```

---

## Deux machines : macOS et Windows

Le projet a démarré sur macOS et se poursuit aussi sur un PC Windows. Il doit
tourner **à l'identique** sur les deux, sans réglage à refaire en changeant de
poste. Trois choses le garantissent, et il faut les préserver.

### 1. Aucun chemin absolu, jamais

`outils-dessin-neurone.py` déduit la racine du dépôt de sa propre position :

```python
RACINE = os.path.dirname(os.path.abspath(__file__))
```

Un chemin écrit en dur, comme le `/Users/...` qui s'y trouvait, rend l'outil
inutilisable dès qu'on change de machine, de compte ou de dossier. Les chemins
se composent avec `os.path.join`, jamais par concaténation de `/`.

### 2. Le navigateur se cherche, il ne se suppose pas

`outils-test-navigateur.py` appelle `trouver_chrome()`, qui balaie les
emplacements habituels de macOS, de Windows et de Linux, puis le `PATH`. La
variable d'environnement `CHROME` a toujours le dernier mot.

### 3. Les fins de ligne sont figées en LF par `.gitattributes`

```
* text=auto eol=lf
```

Sans cette règle, git livre les fichiers en CRLF sur Windows et en LF sur
macOS. Le moindre enregistrement produit alors un diff de fichier **entier**,
sur une machine et pas sur l'autre, et les vraies modifications deviennent
introuvables. `eol=lf` impose le LF dans le dépôt **et** dans la copie de
travail, quel que soit le réglage `core.autocrlf` du poste.

Corollaire côté Python : tout fichier du dépôt réécrit par un outil doit
l'être avec `newline="\n"`, sinon Python remet du CRLF sur Windows.

```python
io.open(chemin, "w", encoding="utf-8", newline="\n").write(s)
```

### Ce qui change quand même d'une machine à l'autre

| | macOS | Windows |
|---|---|---|
| La commande Python | `python3` | `python` |
| Le lanceur de serveur intégré | **n'a pas accès au Bureau**, voir plus bas | fonctionne |

Rien d'autre. Aucune commande du projet n'a de variante par système au delà
du nom de l'interpréteur.

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

### Le défilement est le seul déclencheur

Aucune apparition ne se déclenche après un simple délai. Deux conséquences
concrètes :

- Chaque temps de l'ouverture occupe presque toute la hauteur de l'écran. Si
  deux tenaient ensemble à l'écran, ils apparaîtraient ensemble quoi qu'on
  code : c'est la mise en page qui garantit la règle, pas le JavaScript.
- Remonter rejoue le mouvement à l'envers. Un élément sorti par le BAS du champ
  est rembobiné ; un élément sorti par le HAUT a simplement été dépassé et
  reste visible.

### Un piège coûteux, déjà payé deux fois

`element.hidden = true` **ne fonctionne pas sur un élément SVG** : `hidden`
appartient à `HTMLElement`, pas à `SVGElement`. L'affectation crée une
propriété JavaScript inerte sans jamais poser l'attribut. Pire, une
vérification qui relit `element.hidden` confirme la valeur qu'on vient
d'écrire, donc le bug passe le test.

**Leçon générale : ne jamais vérifier un état en relisant la valeur qu'on a
soi-même posée.** Vérifier ce que le navigateur calcule, par exemple
`getComputedStyle(el).display` ou les dimensions réellement peintes.

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

## Trois pièges d'environnement, déjà rencontrés

**1. Le lanceur de serveur intégré n'a pas accès au dossier Bureau**
(protection macOS). `python3 -m http.server` y échoue avec `PermissionError` sur
`os.getcwd()`, avant même de lire les arguments. Contournement : lancer le
serveur depuis un terminal normal.

**2. Un panneau navigateur masqué ne rend pas la page, et TOUT ce qui dépend
du défilement y est mort.**

Cause racine, identifiée après plusieurs fausses pistes : les événements de
défilement, `requestAnimationFrame` et les rappels d'`IntersectionObserver`
sont tous produits pendant **l'étape de rendu** de la boucle d'événements.
Quand la page n'est pas peinte, cette étape est sautée, donc aucun des trois
ne se déclenche. Mesuré : `window.scrollTo(0, 1200)` change bien `scrollY`
mais ne produit **zéro** événement `scroll`.

**La solution : `outils-test-navigateur.py`.**

Cet outil lance un vrai Chrome, qui rend réellement les pages, et lui envoie
de VRAIS événements de molette par le protocole DevTools. Les événements
`scroll` sont donc produits par le navigateur lui-même, exactement comme sous
le doigt d'un visiteur. Plus rien n'échappe au test.

```bash
python3 -m http.server 8000 --bind 127.0.0.1 &   # dans un terminal normal
python3 outils-test-navigateur.py                # la batterie complète
python3 outils-test-navigateur.py --montrer      # avec la fenêtre visible
python3 outils-test-navigateur.py --url=http://127.0.0.1:8123   # autre port
```

**Un seul numéro de port dans tout le projet : 8000.** La batterie visait le
8001 alors que le README et `launch.json` servaient le 8000, si bien que
suivre la procédure documentée ne testait rien : Chrome chargeait une page
d'erreur et les vérifications échouaient avec des détails illisibles, sans
qu'aucun message ne parle de port.

`--bind 127.0.0.1` n'est pas cosmétique non plus. Sans lui, le serveur écoute
sur toutes les interfaces : le pare-feu de Windows ouvre alors une fenêtre
modale au premier lancement, ce qui, le jour de la démonstration, se
superpose au site devant le jury, et la pièce de candidature est exposée à
tout le réseau local.

**Aucune dépendance à installer** : le client WebSocket tient en une
soixantaine de lignes de bibliothèque standard, ce qui respecte la règle du
projet. Il sert aussi à prendre de vraies captures d'écran, ce que le panneau
intégré ne sait pas faire.

Ce qu'il vérifie aujourd'hui, **9 contrôles, tous verts** :

1. Au chargement, un seul temps est visible
2. Après 4 secondes sans toucher à rien, rien n'a bougé
3. La molette fait apparaître les temps un par un
4. Remonter les fait disparaître un par un, et l'état revient exactement au départ
5. La caméra visite les parties dans l'ordre, symétriquement
6. Aucune erreur de console

**3. Chrome en mode headless annonce de lui-même
`prefers-reduced-motion: reduce`.**

Le site fait alors exactement ce qu'on lui demande : il coupe le mouvement et
affiche tout. La batterie de tests concluait donc « échec, les cinq temps sont
visibles au chargement », en croyant mesurer un visiteur ordinaire. **Le site
était juste, c'est la mesure qui était fausse.** Le contrôle numéro 1 ne
pouvait pas passer, et les contrôles 3 et 4 passaient sans rien vérifier.

L'outil impose désormais la préférence, au lieu de la subir :

```python
self.commande("Emulation.setEmulatedMedia", {
    "features": [{"name": "prefers-reduced-motion",
                  "value": "reduce" if reduire_mouvement else "no-preference"}]})
```

Le paramètre `reduire_mouvement` de `Navigateur` permet du même coup de tester
le mode réduit **pour de vrai**, ce qui est une ligne de la liste de
vérification d'accessibilité.

**Leçon générale, la même que pour `element.hidden` : ne jamais faire confiance
à l'environnement de test sur ce qu'il déclare être.** Un test qui échoue peut
accuser un site qui a raison, et un test qui passe peut ne rien mesurer du
tout. Ici les deux se produisaient en même temps.

Corollaire, découvert au même moment : le contrôle « aucune erreur de console »
interrogeait `window.__erreurs`, **que rien ne remplissait jamais**. Il était
donc vert sur une page entièrement cassée. L'outil installe maintenant son
propre collecteur avec `Page.addScriptToEvaluateOnNewDocument`, avant que le
premier script de la page ne s'exécute.

`js/apparitions.js` et `js/parcours.js` exposent en plus leurs fonctions de
calcul sur `window`, ce qui permet de tester la logique seule sans dépendre du
rendu. Les captures
d'écran reviennent alors **entièrement blanches**, et les actions qui attendent
un rendu — défilement, survol — expirent. Les animations GSAP rampent aussi,
faute de `requestAnimationFrame`. **Rien de tout cela n'est un bug du site.**

Comment travailler quand même :

- **Ne jamais mettre `requestAnimationFrame` sur le chemin critique** d'un
  comportement lié au défilement. Il ne part pas quand la page n'est pas
  peinte, ce qui fige le comportement en plus de le rendre invérifiable. Le
  navigateur limite déjà les événements de défilement à environ un par image.
- **Ne jamais faire dépendre un état initial d'un rappel asynchrone.** Le
  premier affichage se calcule directement avec `getBoundingClientRect`, et
  l'observateur ne gère que la suite. Sinon la page peut s'ouvrir vide.
- **Vérifier par le DOM plutôt que par l'image** — c'est de toute façon plus
  rigoureux. Positions, opacités, attributs ARIA, état des groupes SVG.
- Faire défiler avec `window.scrollBy()`, jamais avec l'action de défilement
  du navigateur.
- Attention à `scroll-behavior: smooth` : après `scrollTo`, la position n'est
  pas atteinte immédiatement.
- Pour juger l'état final d'une animation :

```js
gsap.globalTimeline.getChildren(true, true, true).forEach(t => t.progress(1));
```
