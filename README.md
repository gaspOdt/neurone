# Site de vulgarisation — le neurone et le potentiel d'action

Un site interactif qui raconte comment un neurone transmet l'information, pour des collégiens.
Pensé pour le mobile d'abord, sans aucune étape de compilation, et conçu pour rester
utilisable par tout le monde — daltonisme, lecteurs d'écran, troubles moteurs, vieux téléphones.

> **Le nom du site n'est pas encore choisi.** Le dépôt s'appelle `neurone` en attendant.

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
index.html              La page unique — toutes les sections s'y enchaînent
css/
  tokens.css            Les couleurs, tailles et espacements. Le seul endroit où on change le style global
  base.css              Typographie, mise en page, accessibilité de base
js/
  a11y.js               Mouvement réduit, détection d'appareil lent, préférences du visiteur
  main.js               Point d'entrée
sections/               Une section du récit par fichier
assets/
  fonts/                Inter, copiée localement pour fonctionner hors connexion
  vendor/               GSAP, copiée localement pour la même raison
docs/                   La documentation du projet — voir ci-dessous
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
| [`08-RAPPORT-TEST.md`](docs/08-RAPPORT-TEST.md) | Le rapport de l'agent testeur |

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
Palette sûre pour le daltonisme, aucune information portée par la couleur seule, alternatives
textuelles pour chaque animation, navigation complète au clavier, et **aucune interaction qui
exige un glisser-déposer**. Voir [`docs/03-ACCESSIBILITE.md`](docs/03-ACCESSIBILITE.md).

---

## Mettre en ligne

Le site est hébergé par **GitHub Pages**. Chaque `git push` sur `main` met la version en ligne
à jour automatiquement, en une minute environ.

```bash
git add -A && git commit -m "votre message" && git push
```
