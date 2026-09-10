# 05 — Journal de bord

> **Ce fichier est mis à jour en continu, pas en fin de session.**
> Si un agent est interrompu, la section « État actuel » ci-dessous doit suffire
> à reprendre sans rien perdre. La tenir à jour est une obligation, pas une courtoisie.

---

## État actuel

**Dernière mise à jour :** 10 septembre 2026, fin du jour 2.

**En ligne :** <https://gaspodt.github.io/neurone/>

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

### Deux limites de l'environnement de développement

1. **Le lanceur de serveur du navigateur intégré n'a pas accès au Bureau**
   (protection macOS). Lancer le serveur depuis un terminal normal.
2. **Le panneau navigateur masqué ne peint pas la page, et `IntersectionObserver`
   n'y déclenche jamais ses rappels.** Les captures reviennent blanches et le
   comportement au défilement est invérifiable depuis ici. **Le test sur
   téléphone réel est donc le seul contrôle valable pour tout ce qui dépend du
   défilement.** Ce n'est pas un bug du site.

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
