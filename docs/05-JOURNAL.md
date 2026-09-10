# 05 — Journal de bord

> **Ce fichier est mis à jour en continu, pas en fin de session.**
> Si un agent est interrompu, la section « État actuel » ci-dessous doit suffire
> à reprendre sans rien perdre. La tenir à jour est une obligation, pas une courtoisie.

---

## État actuel

**Dernière mise à jour :** 10 septembre 2026, jour 3.

**En ligne :** <https://gaspodt.github.io/neurone/>

**Le projet se développe désormais sur deux machines**, un Mac et un PC
Windows, et tourne à l'identique sur les deux. Voir la section « Deux machines »
de [`04-ARCHITECTURE.md`](04-ARCHITECTURE.md).

### Ce qui existe

| | |
|---|---|
| Ouverture | **Quatre temps**, un par écran. Constat, cause, temps écoulé, question |
| Accent graphique | La **courbe du potentiel d'action**, la vraie forme du signal. Elle annonce la section « Tout ou rien », où le visiteur la déclenchera lui-même |
| Le parcours | **Un seul neurone** pour tout le site, collé en haut de l'écran pendant que le texte défile. La caméra se déplace vers la partie dont on parle |
| Déclenchement | **Le défilement, et rien d'autre.** Aucune apparition après un simple délai |
| Retour en arrière | Remonter rejoue le mouvement à l'envers |
| Poids | **93 Ko** transférés, budget 150 |

### Feuille de route

| Étape | État |
|---|---|
| Ouverture et parcours du neurone | fait |
| Section « Au repos », les charges à travers la membrane | à faire |
| Section « Tout ou rien », le seuil et l'interrupteur | à faire |
| Section « Ça file », la propagation puis la myéline | à faire |
| Section « Le saut », la synapse | à faire |
| Quiz final | à faire |
| **Agent d'audit technique** | à faire, avant-dernier |
| **Agent d'audit scientifique** | à faire, **après l'audit technique** |
| Parcours de démonstration 3 minutes | à faire, en dernier |

### Les deux audits de fin de projet

**1. Audit technique.** Un agent parcourt le site déployé et vérifie qu'il
fonctionne : interactions, console, hors connexion, matériel ancien, sans
JavaScript, et la liste complète d'accessibilité. Produit `08-RAPPORT-TEST.md`.

**2. Audit scientifique, après le technique.** Un agent distinct vérifie que
**tout ce qui est affirmé est vrai**. C'est un contrôle différent, qui demande
un autre regard : un site peut fonctionner parfaitement et raconter des
bêtises. Il doit contrôler :

- Chaque affirmation chiffrée, une par une, avec sa source. Par exemple
  « moins d'un centième de seconde », « presque un mètre », « des milliers
  de messages en même temps »
- Les simplifications pédagogiques : sont-elles **fausses**, ou seulement
  **incomplètes** ? Une simplification incomplète est légitime, une
  simplification fausse ne l'est pas
- Le vocabulaire : les termes techniques employés le sont-ils correctement
- Les schémas : le dessin du neurone est-il anatomiquement défendable
- Ce qui est passé sous silence et qui pourrait induire en erreur

Il produit `09-AUDIT-SCIENTIFIQUE.md` et **ne corrige rien lui-même** : il
signale, et les corrections sont décidées ensuite. Sa sortie doit distinguer
clairement les erreurs à corriger des choix de vulgarisation assumés.

### Trois limites de l'environnement de développement

1. **Le lanceur de serveur du navigateur intégré n'a pas accès au Bureau**
   (protection macOS, sans objet sur Windows). Lancer le serveur depuis un
   terminal normal.
2. **Le panneau navigateur masqué ne peint pas la page, et `IntersectionObserver`
   n'y déclenche jamais ses rappels.** Les captures reviennent blanches et le
   comportement au défilement est invérifiable depuis ici. **Le test sur
   téléphone réel reste le seul contrôle vraiment valable.** Ce n'est pas un
   bug du site.
3. **Chrome en mode headless annonce de lui-même `prefers-reduced-motion:
   reduce`.** Le site coupait donc le mouvement pendant les tests, et la
   batterie l'accusait d'afficher tout d'un coup. Corrigé le jour 3 : l'outil
   impose la préférence au lieu de la subir. Détail dans
   [`04-ARCHITECTURE.md`](04-ARCHITECTURE.md).

### Prochaine étape

Section « Au repos » : les charges positives et négatives que le visiteur fait
passer de part et d'autre de la membrane.

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

### 10 septembre 2026 — Session 2 : jour 3, portage sur une deuxième machine

Le travail reprend depuis un **PC Windows 11**, le dépôt venant d'y être cloné.
Aucune ligne du site lui même n'a changé : il est en HTML, CSS et JavaScript,
il n'a jamais rien eu de spécifique à un système. **C'est l'outillage qui ne
tournait pas**, et il ne tournait donc plus qu'à moitié sur le Mac non plus.

Quatre corrections, toutes valables des deux côtés :

| Ce qui bloquait | Correction |
|---|---|
| `outils-dessin-neurone.py` contenait `RACINE = "/Users/gaspard/..."` | La racine se déduit de `__file__` |
| `outils-test-navigateur.py` contenait le chemin du Chrome de macOS | `trouver_chrome()` balaie les trois systèmes, `CHROME` a le dernier mot |
| `.claude/launch.json` pointait sur un dossier temporaire du Mac, disparu | `python3 -m http.server 8000` |
| Les fins de ligne divergeaient entre les deux postes | `.gitattributes` fige le LF partout |

**Deux bugs de l'outil de test découverts au passage, et c'est le vrai
apport de la session.** Le premier faisait échouer un test sur un site qui
avait raison, le second faisait passer un test qui ne mesurait rien :

1. Chrome headless annonce `prefers-reduced-motion: reduce`. Le site coupait
   donc le mouvement, et le contrôle « un seul temps visible au chargement »
   échouait forcément. La préférence est maintenant imposée par
   `Emulation.setEmulatedMedia`.
2. Le contrôle « aucune erreur de console » lisait `window.__erreurs`, que
   **rien ne remplissait**. Il était vert quoi qu'il arrive. Un collecteur est
   désormais injecté avant le premier script de la page.

Deux améliorations de robustesse : le port de débogage est demandé au système
au lieu d'être figé à 9222, ce qui évitait de se connecter à un Chrome resté
d'un essai précédent, et le profil temporaire de Chrome est enfin supprimé.

**Résultat : 9 contrôles sur 9 au vert**, sous Windows, pour la première fois.

Détail à noter pour qui reprend : le `.gitconfig` du PC contenait
`gaspard.oudinotàgmail.com`, le `à` de la touche 0 d'un clavier AZERTY à la
place du `@`. Les commits faits depuis ce poste n'auraient pas été rattachés
au compte GitHub. L'identité est corrigée **au niveau du dépôt**, donc le
`.gitconfig` global de la machine reste à corriger pour les autres projets.
