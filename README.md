# Site de vulgarisation — le neurone et le potentiel d'action

Un site interactif qui raconte comment un neurone transmet l'information, pour des collégiens.
Pensé pour le mobile d'abord, sans aucune étape de compilation, et conçu pour rester
utilisable par tout le monde : daltonisme, lecteurs d'écran, troubles moteurs,
troubles cognitifs, vieux téléphones.

**En ligne :** <https://gaspodt.github.io/neurone/>

> **Le nom du site n'est pas encore choisi.** Le dépôt s'appelle `neurone` en attendant.

## Où en est le projet

L'ouverture et le parcours du neurone existent. Restent quatre sections
scientifiques, le quiz, et les deux audits de fin de projet.
**L'état détaillé et à jour est dans [`docs/05-JOURNAL.md`](docs/05-JOURNAL.md).**

---

## Démarrer en 30 secondes

Aucune installation. Python 3 suffit — il est déjà présent sur macOS.

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

C'est tout. Pas de `npm install`, pas de build, pas de dépendances à mettre à jour.
Ce que vous voyez dans les fichiers est exactement ce qui part en ligne.

---

## Organisation

```
index.html                  La page unique. Toutes les sections s'y enchaînent
outils-dessin-neurone.py    Régénère le contenu à partir des dessins canoniques
outils-test-navigateur.py   Pilote un vrai Chrome pour tester le défilement
css/
  tokens.css                Couleurs, tailles, durées. Le SEUL endroit où changer le style
  base.css                  Typographie, mise en page, accessibilité, composants
js/
  a11y.js                   Mouvement réduit et détection d'appareil lent
  apparitions.js            Le défilement fait apparaître, et remonter rembobine
  parcours.js               Le neurone collé à l'écran, la caméra qui le visite
  main.js                   Point d'entrée
assets/
  fonts/                    Inter, copiée localement pour fonctionner hors connexion
  vendor/                   GSAP, copiée localement pour la même raison
docs/                       La documentation. Voir ci-dessous
```

### Un seul dessin de neurone

Il n'existe qu'un neurone dans tout le site, produit par
`outils-dessin-neurone.py`. **Ne pas modifier le SVG directement dans
`index.html`** : modifier le script, puis le relancer.

```bash
python3 outils-dessin-neurone.py
```

---

## La documentation

**Commencer par [`docs/00-CONTEXTE.md`](docs/00-CONTEXTE.md).** Il contient le brief initial
mot pour mot et le journal de toutes les décisions avec leurs raisons. Toute personne ou tout
agent qui reprend le projet doit le lire en premier.

| Fichier | Contenu |
|---|---|
| [`00-CONTEXTE.md`](docs/00-CONTEXTE.md) | Le brief initial et le journal des décisions |
| [`01-DIRECTION-ARTISTIQUE.md`](docs/01-DIRECTION-ARTISTIQUE.md) | Palette, typographie, règles du trait |
| [`02-CONTENU.md`](docs/02-CONTENU.md) | Le texte scientifique de chaque section, avec ses sources |
| [`03-ACCESSIBILITE.md`](docs/03-ACCESSIBILITE.md) | Les cinq chantiers et la liste de vérification |
| [`04-ARCHITECTURE.md`](docs/04-ARCHITECTURE.md) | Conventions de code, compatibilité, comment ajouter une section |
| [`05-JOURNAL.md`](docs/05-JOURNAL.md) | Journal de bord, une entrée par session de travail |
| [`06-DEMO-3MIN.md`](docs/06-DEMO-3MIN.md) | Le parcours de démonstration, minuté |
| [`07-BENCHMARK.md`](docs/07-BENCHMARK.md) | L'étude de l'existant |
| [`08-RAPPORT-TEST.md`](docs/08-RAPPORT-TEST.md) | Le rapport de l'audit technique |
| [`09-AUDIT-SCIENTIFIQUE.md`](docs/09-AUDIT-SCIENTIFIQUE.md) | Le rapport de l'audit scientifique |

---

## Trois contraintes qui expliquent presque tous les choix techniques

**1. Le site doit fonctionner sans connexion internet.**
Il sera présenté en direct devant un jury. Une salle de réunion avec un mauvais wifi ne doit
pas pouvoir gâcher la démonstration. C'est pourquoi la police et GSAP sont **copiées dans le
dépôt** au lieu d'être chargées depuis un CDN.

**2. Le site doit tourner sur un vieux téléphone.**
Un membre du jury peut l'ouvrir sur son propre appareil. Pas de WebGL, pas d'API récentes,
uniquement des animations de `transform` et `opacity`, et une bascule automatique en mode
allégé si l'appareil peine. Budget total : **150 Ko transférés**, mesuré contre les références réelles (voir `docs/07-BENCHMARK.md`). Au jour 1 nous sommes à 104 Ko.

**3. Le site doit rester utilisable par tout le monde.**
Objectif : **WCAG 2.2 niveau AA**, ce qui satisfait aussi le RGAA français et l'Acte
européen sur l'accessibilité. Palette sûre pour le daltonisme, aucune information portée
par la couleur seule, alternatives textuelles pour chaque animation, navigation complète
au clavier, et **aucune interaction qui exige un glisser-déposer**. Le volet cognitif suit
le document COGA du W3C. Voir [`docs/03-ACCESSIBILITE.md`](docs/03-ACCESSIBILITE.md).

**Une règle de conception qui découle des trois :** le défilement est le seul déclencheur
d'apparition. Rien ne se produit après un simple délai, donc personne ne peut rater une
information parce qu'il lisait trop lentement.

---

## Tester

```bash
python3 outils-test-navigateur.py
```

Lance un vrai Chrome, lui envoie de vrais mouvements de molette, et vérifie
que les apparitions suivent le défilement dans les deux sens. Aucune
dépendance à installer. Ajouter `--montrer` pour voir la fenêtre.

## Mettre en ligne

Le site est hébergé par **GitHub Pages**. Chaque `git push` sur `main` met la version en ligne
à jour automatiquement, en une minute environ.

```bash
git add -A && git commit -m "votre message" && git push
```
