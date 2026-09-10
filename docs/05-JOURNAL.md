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

### En cours

_(les lignes cochées ci-dessous sont passées dans « Fait » au fil de l eau)_

- [x] Inter (48 Ko) et GSAP + ScrollTrigger + DrawSVG + MorphSVG (137 Ko) copiés en local
- [ ] `css/tokens.css` — palette et échelles
- [ ] `css/base.css` — typographie et mise en page
- [ ] `js/a11y.js` — mouvement réduit + détection d'appareil lent
- [ ] `index.html` — squelette
- [ ] `docs/01-DIRECTION-ARTISTIQUE.md`
- [ ] `docs/03-ACCESSIBILITE.md`
- [ ] `docs/04-ARCHITECTURE.md`
- [ ] `docs/07-BENCHMARK.md` — étude de l'existant approfondie
- [ ] Dépôt distant GitHub + mise en ligne GitHub Pages

### Bloqué / en attente de l'utilisateur

- **Création du dépôt distant GitHub.** L'outil `gh` n'est pas installé sur la machine.
  Deux options : l'installer via Homebrew, ou que l'utilisateur crée le dépôt à la main
  sur github.com. Sa clé SSH existe déjà (`~/.ssh/id_ed25519.pub`).

### Prochaine étape immédiate

Récupérer les polices et GSAP en local, puis écrire le système de design.

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
