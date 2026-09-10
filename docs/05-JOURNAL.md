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

### En cours

- [ ] `docs/01-DIRECTION-ARTISTIQUE.md`
- [ ] `docs/03-ACCESSIBILITE.md`
- [ ] `docs/04-ARCHITECTURE.md`
- [ ] `docs/07-BENCHMARK.md` — étude de l'existant approfondie
- [ ] Dépôt distant GitHub + mise en ligne GitHub Pages

### Bloqué / en attente de l'utilisateur

- **Création du dépôt distant GitHub.** `gh` n'est pas installé et GitHub ne
  permet pas de créer un dépôt via SSH. L'authentification SSH fonctionne
  (identité `gaspOdt`), donc le push marchera dès que le dépôt vide existera.
  L'utilisateur doit le créer sur <https://github.com/new>, nom `neurone`,
  **sans README ni .gitignore ni licence**.

### Deux pièges rencontrés, à connaître pour la suite

1. **Le lanceur de serveur du navigateur intégré n'a pas accès au Bureau**
   (protection macOS). `python3 -m http.server` échoue avec `PermissionError`
   sur `os.getcwd()`. Contournement : lancer le serveur depuis un terminal
   normal, et pointer le navigateur dessus.
2. **Le panneau navigateur masqué bride `requestAnimationFrame`**, donc les
   animations GSAP avancent au ralenti et les captures d'écran paraissent
   figées à mi-course. Ce n'est PAS un bug du site. Pour juger l'état final :
   `gsap.globalTimeline.getChildren(true,true,true).forEach(t=>t.progress(1))`.

### Prochaine étape immédiate

Pousser sur GitHub dès que le dépôt distant existe, activer GitHub Pages,
puis rédiger les documents de direction artistique, d'accessibilité et
d'architecture.

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
