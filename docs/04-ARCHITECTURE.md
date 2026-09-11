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
  recit.js          TOUT le récit : le texte qui s'empile, les tracés asservis
                    au défilement, le neurone qui grandit, la caméra
  seuil.js          Le curseur du seuil : messages, niveau du corps, impulsion
  myeline.js        Le défi du chronomètre : la gaine, l'impulsion, le temps
  synapse.js        Les messagers qui traversent le vide
  quiz.js           L'acte 3 : les questions qui s'empilent, le verdict
  main.js           Point d'entrée
assets/
  fonts/            Inter, sous-ensemble latin
  vendor/           GSAP et ses greffons
outils-dessin-neurone.py    Régénère le contenu de index.html
outils-test-navigateur.py   Pilote un vrai Chrome et passe la batterie
docs/               La documentation, commencer par 00-CONTEXTE.md
```

**Pourquoi un seul fichier pour le récit.** L'ouverture et le parcours étaient
deux modules, quand ils étaient deux sections. Ils n'en font plus qu'une, pour
une raison de fond : le neurone doit être LE MÊME du début à la fin, sans
coupure. Deux modules se seraient contredits sur sa taille et sa position, et
c'est exactement ce qui est arrivé pendant l'écriture (voir plus bas).

---

## Les règles de code

### Jamais de valeur en dur

Toute couleur, taille, durée passe par une variable de `tokens.css`.

**Les durées surtout.** Une transition écrite `transition: opacity 300ms` est
invisible au mode « mouvement réduit », qui ne peut pas l'atteindre. Toujours
`transition: opacity var(--dur-base) var(--ease)`.

### La couleur ne se pose jamais sur le texte

**Le texte est noir, toujours. La couleur passe derrière**, en surligneur. Dans
le dessin, les traits sont à l'encre et la couleur s'emploie en aplats cernés
d'un filet d'encre.

Une seule exception : **le bleu électrique `#0066FF`**, seule couleur dont le
contraste sur blanc autorise un trait pur. C'est lui qui porte le signal.

Voir [`01-DIRECTION-ARTISTIQUE.md`](01-DIRECTION-ARTISTIQUE.md) pour les
mesures.

### Deux colonnes dès qu'il y a de la largeur

Au-delà de **60em**, le texte et le dessin passent côte à côte au lieu d'être
empilés.

Ce n'est pas un raffinement, c'est une correction. Empiler fonctionne sur un
téléphone, haut et étroit. Sur un écran large et court, le texte s'étale en
hauteur et il ne reste au dessin que des miettes : mesuré, le neurone tombait
à **trente pixels de large** sur une fenêtre de 1440 par 722, alors que la
place ne manquait pas.

**Le calcul de la taille du dessin dépend entièrement de ce mode.** En empilé,
il vaut « ce qui reste entre les deux blocs de texte ». En deux colonnes, le
dessin a sa propre colonne et prend toute la hauteur utile. Garder la formule
empilée en deux colonnes redonnait un neurone minuscule. Voir `hauteurIntro`
dans `js/recit.js`.

### Le défilement est le seul déclencheur

Aucune apparition ne se déclenche après un simple délai. Deux conséquences
concrètes :

- Chaque temps de l'ouverture occupe presque toute la hauteur de l'écran. Si
  deux tenaient ensemble à l'écran, ils apparaîtraient ensemble quoi qu'on
  code : c'est la mise en page qui garantit la règle, pas le JavaScript.
- Remonter rejoue le mouvement à l'envers. Un élément sorti par le BAS du champ
  est rembobiné ; un élément sorti par le HAUT a simplement été dépassé et
  reste visible.

### Un piège coûteux, déjà payé trois fois : SVG n'est pas HTML

`element.hidden = true` **ne fonctionne pas sur un élément SVG** : `hidden`
appartient à `HTMLElement`, pas à `SVGElement`. L'affectation crée une
propriété JavaScript inerte sans jamais poser l'attribut. Pire, une
vérification qui relit `element.hidden` confirme la valeur qu'on vient
d'écrire, donc le bug passe le test.

**Le même piège, repayé une troisième fois : `svg.offsetHeight` et
`svg.offsetTop` n'existent pas non plus.** Ils appartiennent eux aussi à
`HTMLElement`. Sur un `<svg>`, la lecture rend `undefined`, le calcul retombe
silencieusement sur sa valeur plancher, et le neurone d'introduction faisait
110 px au lieu de 219. Aucune erreur, aucun message : juste un dessin deux
fois trop petit.

Sur un élément SVG, mesurer avec **`getBoundingClientRect()`**, qui existe
partout. Attention toutefois : il tient compte des transformations. Pour lire
une position de MISE EN PAGE indépendante des transformations, il faut un
élément HTML, et c'est la raison pour laquelle le neurone est enveloppé dans
un `<div class="porte-neurone">` dont on lit l'`offsetTop`.

**Leçon générale : ne jamais vérifier un état en relisant la valeur qu'on a
soi-même posée.** Vérifier ce que le navigateur calcule, par exemple
`getComputedStyle(el).display` ou les dimensions réellement peintes.

### Un élément ne peut pas avoir deux propriétaires pour une même propriété

Le porte-neurone est DEUX choses à la fois : un temps qui apparaît, et l'objet
que la bascule déplace vers le haut de l'écran. Les deux animaient sa position
en `y`, et l'apparition gagnait : elle repartait vers `y = 0` pendant les six
dixièmes de seconde suivantes, en emportant le déplacement de la bascule.

Le symptôme était trompeur : en défilement normal, le déplacement se produit
bien après l'apparition, donc tout marchait. Le défaut n'apparaissait qu'en
sautant directement à une position lointaine, c'est à dire **exactement ce que
fait un test automatisé**. Un cas de plus où l'outil de test voyait juste et où
l'on aurait pu croire qu'il se trompait.

**Règle : une propriété animée a un seul propriétaire.** Ici l'apparition ne
touche plus qu'à l'opacité, et la position appartient à la bascule seule.

### Les déclarations `const` et `let` avant tout retour anticipé

`initRecit()` sort très tôt en mode « mouvement réduit », mais branche quand
même la caméra et les boutons. Deux fois, ces branchements ont lu une
constante déclarée plus bas dans la fonction et levé une `ReferenceError` :
la zone morte temporelle. Le contenu restait entier, mais la caméra ne
fonctionnait plus **pour exactement les visiteurs qu'on cherche à ménager**.

Tout l'état est donc déclaré en tête de fonction, avant le premier `return`,
et les constantes qui n'ont pas besoin du contexte sortent carrément du corps
de la fonction.

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

## Vérifier : la seule méthode qui ait tenu

Ce projet a produit **quatre fausses validations** avant d'arriver à une
méthode fiable. Elles sont consignées ici parce qu'elles se reproduiront
sinon, et parce qu'elles ont chacune coûté du temps à l'utilisateur.

### La faute qui revient : vérifier ce qu'on a soi-même posé

La batterie a annoncé **quatorze succès sur quatorze pendant que la page était
blanche**. Elle mesurait des opacités, c'est-à-dire exactement les valeurs que
le code venait d'écrire. Un élément à `opacity: 1` placé à `-133px` passe ce
contrôle et reste invisible.

**Ne jamais conclure d'une propriété qu'on a soi-même affectée.** Le même
piège a été payé trois fois, sous trois formes différentes :

| Ce qu'on lisait | Pourquoi ça ne prouvait rien |
|---|---|
| `element.hidden` sur un SVG | La propriété appartient à `HTMLElement` : l'affectation crée un champ inerte et ne pose jamais l'attribut. La relire confirme ce qu'on vient d'écrire |
| `getComputedStyle(el).opacity` | Ne dit pas si l'élément est dans l'écran |
| Position et taille | Ne disent pas si les traits du SVG sont dessinés. Une boîte vide a des dimensions |
| `elementFromPoint` | Ne dit pas si la boîte contient autre chose que du vide |

### Les trois contrôles qui, eux, ne mentent pas

Tous les trois sont dans `outils-test-navigateur.py`.

**1. Compter les pixels non blancs de la capture.** Si le compte est nul, le
visiteur voit une page blanche, quelles qu'aient été les valeurs posées.
Décodage PNG en bibliothèque standard, `encre(chemin)` renvoie une proportion.
C'est le seul contrôle qui ne se soit jamais laissé tromper.

**2. Détecter les chevauchements.** `chevauchements(nav)` compare deux à deux
les rectangles des éléments visibles. Il a trouvé du premier coup la
superposition silhouette / neurone que l'utilisateur signalait.

> **Il doit utiliser l'opacité EFFECTIVE, cumulée sur tous les ancêtres.** Sa
> première version lisait l'opacité propre et signalait un titre pourtant déjà
> effacé par son conteneur. Un faux positif dans l'outil qui traque les faux
> positifs.

**3. Regarder les images.** Non négociable. Les deux défauts les plus visibles
du projet, un titre débordant par le haut et un neurone de trente pixels,
n'apparaissaient dans **aucune** mesure.

### Tester à plusieurs tailles, toujours

Tout a longtemps été vérifié en émulation iPhone uniquement, pendant que
l'utilisateur regardait sur un écran d'ordinateur. Trois tailles au minimum :
**390 × 844**, **1440 × 722**, et une fenêtre courte type **1280 × 620**, qui
est le cas le plus dur.

---

## Les pièges déjà payés

Chacun a coûté au moins une itération. Aucun ne produit d'erreur visible.

| Piège | Symptôme | Règle |
|---|---|---|
| `element.hidden` sur un SVG | Les parties du neurone restaient toutes visibles | Passer par une classe |
| `offsetHeight` sur un SVG | Le dessin faisait 110 px au lieu de 219 | `getBoundingClientRect()` |
| **`align-items` par défaut en flex** | Le SVG était **étiré** et la taille calculée par le script ignorée : silhouette de 1495 px de haut | Poser `align-items: center` sur tout conteneur flex qui reçoit un SVG dimensionné par le script |
| **`scrollIntoView` sur un élément collé** | Écran blanc après le clic : un élément collé ne bouge pas à l'écran et sa position dans le flux est ailleurs | Déplacer le défilement d'une distance calculée |
| **`svh` contre `innerHeight`** | Un bloc apparaissait sans qu'on ait défilé : `svh` est mesuré barre d'adresse déployée, `innerHeight` grandit quand elle se rétracte | Bande de déclenchement étroite au centre |
| **Centrage d'un contenu plus haut que la fenêtre** | Le débordement se répartit en haut ET en bas, donc le début sort de l'écran. La page s'ouvrait sur du vide | `justify-content: flex-start` |
| **Remplacement de bloc trop large** | Une fonction encore appelée quatre fois avait été supprimée, le script mourait au chargement | Vérifier que chaque fonction appelée existe encore après une réécriture |
| **`max-height` de repli sur un élément dimensionné par le script** | Le neurone ne grandissait plus à la bascule, 340 px avant comme après : un `max-height: 340px` prévu pour le visiteur sans JavaScript plafonnait en silence la hauteur écrite en ligne | Tout repli de taille se scope à `html.no-js` |
| **Règle de plein écran non scopée à `html.js`** | Sans JavaScript, la classe `entre` n'est jamais posée : le bloc du bouton restait en plein écran pour toujours, tout le récit derrière un cache blanc | Toute règle qui attend une classe posée par le script se scope à `html.js` |
| **Déclaration après le retour anticipé, quatrième fois** | Le mémo des flèches du signal afférent, `afferentsVisibles`, était déclaré juste avant la fonction qui s'en sert, donc après le retour anticipé du mouvement réduit : `ReferenceError` à la première vue sur les dendrites, flèches jamais montrées pour ces visiteurs. Invisible en mode normal, où la batterie passait | La règle ne souffre aucune exception, et la batterie ne la couvre pas : **sonder le mouvement réduit à chaque nouvel état** de `initRecit`, pas seulement en fin de pièce |
| **Un nom de classe générique déjà pris** | Le `fieldset` du quiz, classe `question`, s'affichait en 28 px gras : `.question` est la question de l'ouverture, stylée en titre depuis le premier jour, et le fieldset en héritait | Avant de créer une classe, chercher son nom dans `base.css` ; préfixer ce qui appartient à une section, `quiz-question` |
| **Déclaration après le retour anticipé, troisième fois** | `affiche` était écrit par `toutMontrer()`, appelée avant sa déclaration en mouvement réduit : `ReferenceError`, page figée pour ces visiteurs | Tout l'état d'`initRecit` se déclare avant le premier `return`, sans exception |

---

## Ce que l'interface impose à la mise en page

**Le texte et le dessin se disputent la hauteur.** Dans une scène collée, tout
ce que prend le texte est retiré au dessin. Deux conséquences durables :

- **La taille du titre est un choix d'architecture, pas de goût.** À 4,5rem il
  occupait 476 des 650 pixels utiles et écrasait le dessin à zéro. Il est
  plafonné à 2,4rem pour cette raison.
- **Deux dessins ne doivent jamais occuper deux places.** La silhouette et le
  neurone partagent une case de grille, parce qu'ils ne sont jamais montrés
  ensemble. Quand ils additionnaient leurs hauteurs, la scène débordait.

**Corollaire : ils partagent donc la même règle de taille.** Leur donner deux
calculs différents a produit une silhouette correcte à côté d'un neurone de
trente pixels. Voir `hauteurDessin` dans `js/recit.js`.

---

## Ajouter une section

> **AVERTISSEMENT, à lire avant de taper la première ligne.**
> `index.html` est un fichier **généré**. Tout ce qui se trouve entre
> `<main id="contenu">` et `</main>` est réécrit intégralement à chaque
> exécution de `outils-dessin-neurone.py`. **Une section écrite à la main
> dans `index.html` sera détruite au prochain lancement, sans le moindre
> avertissement.** Le `<head>`, le `<footer>` et les balises `<script>`, eux,
> ne sont pas touchés et s'éditent bien dans `index.html`.

1. Ajouter la section **dans `outils-dessin-neurone.py`**, à sa place dans
   l'ordre : le récit est linéaire et rien n'apparaît avant son tour. Puis
   relancer le script.
2. Chaque schéma SVG porte `role="img"`, un `<title>` et un `<desc>` liés par
   `aria-labelledby`.
3. Chaque animation ou activité reçoit son alternative textuelle dépliable
   (`<details class="alt-text">`).
4. Écrire l'animation en la faisant **découler de la position de défilement**,
   comme le fait `js/recit.js`, et **vérifier qu'elle a bien un état d'arrivée
   statique**.
   **Ne pas utiliser `ScrollTrigger`**, malgré ce que dit encore
   `01-DIRECTION-ARTISTIQUE.md` : le greffon est dans le dépôt mais n'est
   **pas chargé** par `index.html`, et l'ajouter coûterait 17,8 Ko compressés,
   soit un tiers du budget restant, pour une mécanique que le projet a
   délibérément abandonnée (voir la note d'`apparitions.js`, reprise dans
   `recit.js`).
5. Vérifier les **deux replis** : sans JavaScript, et en mouvement réduit. La
   scène collée y redevient un bloc de page normal, sans quoi tout se
   chevauche. C'est une erreur déjà commise.
6. Passer la liste de vérification de [`03-ACCESSIBILITE.md`](03-ACCESSIBILITE.md).
7. Relancer `outils-test-navigateur.py` et **ajouter les contrôles de la
   nouvelle section**. La batterie ne doit jamais dépendre du NOMBRE de
   paragraphes : elle l'a été, et l'arrivée d'un sixième temps la faisait
   échouer alors que le site marchait.
8. Mettre à jour [`05-JOURNAL.md`](05-JOURNAL.md).

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

---

## Une seule mise en page

Il n'y a **pas** de mise en page pour grand écran. Le site a une seule colonne,
celle du téléphone, bornée à `34rem` et centrée. Décision prise le 11 septembre
2026 pour tenir le calendrier, enregistrée dans `00-CONTEXTE.md`.

Ce qui la met en oeuvre, et qu'il ne faut pas défaire sans savoir pourquoi :

| Où | Quoi |
|---|---|
| `css/base.css` | `.recit .wrap { max-width: 34rem }` borne le texte |
| `css/base.css` | `.recit-scene { max-width: 34rem; margin-inline: auto }` borne **la scène elle-même** |
| `js/recit.js` | `hauteurDessin()` et `hauteurParcours()` n'ont plus qu'une branche |

Le second point est le moins évident. Borner seulement le contenu de la scène ne
suffit pas : le titre du schéma et les boutons prennent la largeur de leur
contenu et restent alors collés à gauche pendant que le dessin et le texte se
centrent. On obtient trois alignements différents sur le même écran. En bornant
la scène, tout ce qu'elle porte se range sur la même colonne, et cette colonne
est exactement celle du texte qui défile dessous.

## Ce que le détecteur de recouvrements ne voit pas

`chevauchements()` dans `outils-test-navigateur.py` a été repris deux fois, et
les deux versions se sont trompées. Il faut connaître leurs angles morts, sans
quoi on lui accorde une confiance qu'il ne mérite pas.

**Comparer les boîtes** produit des faux positifs et des faux négatifs :

- Faux positifs. Une boîte n'est pas de l'encre. Le conteneur du dessin est bien
  plus haut que le dessin, et le texte de l'acte 1 défile *derrière* la scène
  collée, qui est opaque. Deux boîtes se croisent, rien ne se voit. Le détecteur
  a signalé neuf fois de suite un défaut inexistant.
- Faux négatifs, plus graves. Sur grand écran, les phrases passaient sous le
  dessin opaque et se coupaient en plein mot. Aucune boîte ne débordait de la
  sienne. **Il a fallu regarder une capture pour s'en apercevoir.**

**Interroger le point** (`elementFromPoint` sur les rectangles de ligne obtenus
par un `Range`) répond à la bonne question, « cette phrase est-elle à moitié
recouverte ? », mais a son propre angle mort, mesuré et non supposé : il a été
mis en échec sur le défaut ci-dessus **réintroduit exprès pour le tester**, et
n'a rien signalé. `elementFromPoint` ignore ce qui porte `pointer-events: none`,
donc un élément opaque et non cliquable recouvre sans être vu.

**La conclusion pratique, qui n'a pas bougé de tout le projet : regarder les
captures reste obligatoire.** Aucune des deux mesures ne remplace l'oeil, et
les deux défauts les plus visibles du projet n'ont été trouvés que comme ça.
