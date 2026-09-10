# 05 — Journal de bord

> **Ce fichier est mis à jour en continu, pas en fin de session.**
> Si un agent est interrompu, la section « État actuel » ci-dessous doit suffire
> à reprendre sans rien perdre. La tenir à jour est une obligation, pas une courtoisie.

---

## État actuel

**Dernière mise à jour :** 10 septembre 2026, jour 1

**Où on en est :** jour 1 du sprint — fondations du dépôt.

### Fait

- [x] Dépôt Git local initialisé, branche `main`
- [x] Arborescence créée (`docs/`, `css/`, `js/`, `sections/`, `assets/`)
- [x] `docs/00-CONTEXTE.md` — brief initial mot pour mot + journal des décisions
- [x] `README.md`
- [x] `docs/05-JOURNAL.md` (ce fichier)
- [x] Inter (48 Ko) et GSAP + ScrollTrigger + DrawSVG + MorphSVG (137 Ko) en local
- [x] `css/tokens.css` — palette sémantique, contrastes mesurés et documentés
- [x] `css/base.css` — typographie, mise en page, socle d'accessibilité
- [x] `js/a11y.js` — mouvement réduit + détection d'appareil lent
- [x] `js/main.js` — point d'entrée, animation de l'ouverture
- [x] `index.html` — squelette + section 0 (la question d'ouverture)
- [x] Vérifié dans le navigateur : Inter se charge, aucune erreur console
- [x] `docs/01-DIRECTION-ARTISTIQUE.md`
- [x] `docs/03-ACCESSIBILITE.md`
- [x] `docs/04-ARCHITECTURE.md`
- [x] `docs/07-BENCHMARK.md` — avec relevés de poids réels
- [x] Dépôt distant GitHub créé et code poussé (dépôt public)

### En cours

Rien. **Le jour 1 est terminé et vérifié en ligne.**

### Le site est en ligne

<https://gaspodt.github.io/neurone/>

Vérifications passées le 10 septembre 2026, sur le site déployé :

| Contrôle | Résultat |
|---|---|
| Les 8 ressources répondent | `200`, servies en gzip |
| Poids transféré | **106 Ko** (budget 150 Ko) |
| Police Inter | chargée, corps de texte à 21 px |
| Erreurs console | aucune |
| Bouton « Réduire les animations » | bascule, change son libellé, met à jour `aria-pressed`, mémorise le choix, réversible |
| Repli sans JavaScript | le contenu reste visible (`opacity: 1`) |
| Cibles tactiles | 44 px et 49 px — au-dessus du minimum |
| Rendu mobile et bureau | correct sur les deux |

### Budget de poids — mesuré

Relevé sur les références réelles plutôt que supposé. Ciechanowski tient en
51 Ko, Parable of the Polygons en 25 Ko, TensorFlow Playground en 111 Ko.
**Notre site au jour 1 : 104 Ko transférés**, dont 91 % de tiers (police 47 Ko,
GSAP 47 Ko) et seulement 7 Ko de code propre. Budget retenu : **150 Ko**.
Décision de l'utilisateur : **le vrai juge est son téléphone**, on ajustera
seulement si ça rame. Détail dans `07-BENCHMARK.md`.

### Deux pièges d'environnement, à connaître

1. **Le lanceur de serveur du navigateur intégré n'a pas accès au Bureau**
   (protection macOS) : `python3 -m http.server` échoue sur `os.getcwd()`.
   Lancer le serveur depuis un terminal normal.
2. **Un panneau navigateur masqué bride `requestAnimationFrame`** : les
   animations GSAP rampent et les captures semblent figées. Ce n'est PAS un
   bug du site. Pour juger l'état final :
   `gsap.globalTimeline.getChildren(true,true,true).forEach(t=>t.progress(1))`

### Point de faiblesse assumé

Le schéma du neurone de la section 0 est un **provisoire**, posé pour vérifier
que le tracé animé fonctionne. Il est maigre et sans caractère. Le remplacer par
un vrai dessin au trait, dans l'esprit de Cajal, est la première tâche du jour 2.

### Prochaine étape immédiate

Jour 2 : section 1 (anatomie révélée une partie à la fois) et section 2
(les charges de part et d'autre de la membrane).

---

## Historique des sessions

### 10 septembre 2026 — Session 1 : conception

Longue phase de conception avec l'utilisateur, conforme à sa demande d'un
« gros brainstorming initial ». Plan complet validé.

**Le fait déterminant remonté pendant cette session :** le site est une **pièce de candidature**,
présentée en **3 minutes** en démonstration live. Cela n'était pas dans le brief initial
et a reconfiguré tout le projet. Échéance : moins d'une semaine.

Décisions majeures : sujet resserré sur le neurone et le potentiel d'action, public collégiens,
fond blanc, police Inter, palette sémantique une-couleur-par-concept, stack sans build,
GitHub Pages, et un pôle accessibilité complet.

Recherche menée sur : l'état de l'art de la vulgarisation interactive, GSAP (gratuit depuis
avril 2025), le domaine public des dessins de Cajal, les palettes Okabe-Ito, `prefers-reduced-motion`,
le RGAA 4.1, et l'accessibilité des SVG.

**Incident à noter :** une première série de commentaires de l'utilisateur sur le plan, écrite
dans l'interface de relecture, n'est jamais parvenue à l'agent et a été perdue. Elle est
arrivée bien plus tard, ancrée sur une version périmée du plan. **Le fil de conversation est
le canal fiable.**

### 10 septembre 2026 — Session 1 (suite) : jour 1 du sprint

Démarrage de l'implémentation. Voir « État actuel » ci-dessus.
