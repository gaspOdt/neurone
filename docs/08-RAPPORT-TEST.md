# 08 — Audit technique : protocole et rapport

> **État : l'audit n'a pas encore eu lieu.**
> Ce document contient pour l'instant **le protocole**, c'est à dire ce que
> l'agent d'audit devra vérifier et comment. La section « Résultats » est vide
> et le restera jusqu'à ce que l'audit soit mené. **Ne jamais y écrire un
> résultat qui n'a pas été constaté.**

---

## Quand, et par qui

L'audit technique est l'**avant-dernière** étape du projet, juste après la
dernière section et le quiz, et **avant l'audit scientifique**
(`09-AUDIT-SCIENTIFIQUE.md`). Cet ordre n'est pas arbitraire : il ne sert à
rien de vérifier l'exactitude d'un texte que le visiteur n'arrive pas à
atteindre.

Il est mené par un **agent dédié, qui n'a pas écrit le site**. C'est le point
important : quelqu'un qui a codé une chose la teste comme il l'a codée, pas
comme on s'en sert.

## Ce qu'il vérifie, et ce qu'il ne vérifie pas

**Il vérifie que le site FONCTIONNE.** Interactions, console, hors connexion,
matériel ancien, absence de JavaScript, et la liste complète d'accessibilité.

**Il ne vérifie pas que le site DIT VRAI.** C'est un contrôle entièrement
différent, qui demande un autre regard, et il fait l'objet de
`09-AUDIT-SCIENTIFIQUE.md`. **Un site peut fonctionner parfaitement et
raconter des bêtises.**

---

## Ce qui est déjà couvert automatiquement

`outils-test-navigateur.py` lance un vrai Chrome et passe **9 contrôles**.
L'auditeur les relance, constate qu'ils sont verts, et **ne les refait pas à
la main** :

```bash
python3 -m http.server 8000 --bind 127.0.0.1   # python sur Windows
python3 outils-test-navigateur.py              # python sur Windows
```

1. Au chargement, un seul temps est visible
2. Après 4 secondes sans rien toucher, rien n'a bougé
3. La molette fait apparaître les temps un par un
4. Les cinq temps apparaissent
5. La descente ne fait qu'ajouter
6. La remontée ne fait que retirer
7. L'état revient exactement au départ
8. La caméra visite les parties dans l'ordre
9. Aucune erreur de console

**Deux avertissements à l'auditeur, payés par l'expérience du projet :**

- Chrome en mode headless annonce de lui même `prefers-reduced-motion: reduce`.
  L'outil impose désormais la valeur voulue, mais **tout contrôle manuel fait
  dans un navigateur headless doit vérifier dans quel mode il se trouve**,
  sans quoi il mesure autre chose que ce qu'il croit.
- Le contrôle « aucune erreur de console » a longtemps été vert **parce qu'il
  ne mesurait rien**. Devant un test qui passe, toujours se demander ce qui
  se passerait s'il devait échouer.

---

## Le protocole, chantier par chantier

> Chaque ligne doit pouvoir être **cochée ou non**, sans jugement. Une ligne
> qui demande une appréciation est mal écrite.

### A. Le socle

- [ ] Le site se charge sans erreur de console, en local et sur l'URL en ligne
- [ ] Aucune requête ne part vers un domaine tiers (onglet Réseau, tout est local)
- [ ] Le poids transféré total est **sous 150 Ko**, viewport mobile
- [ ] Chaque fichier CSS et JS porte bien son paramètre `?v=` de version
- [ ] Aucun fichier du dépôt n'est orphelin, c'est à dire référencé nulle part
- [ ] Le HTML passe le validateur du W3C sans erreur

### B. Hors connexion

- [ ] Mode avion activé, le site se charge et fonctionne **entièrement**
- [ ] La police Inter s'affiche, et pas une police de repli
- [ ] Les animations GSAP fonctionnent
- [ ] Aucune requête en échec dans l'onglet Réseau

### C. Sans JavaScript

- [ ] JavaScript désactivé, **aucune page blanche**
- [ ] Tout le texte de toutes les sections est lisible
- [ ] Tous les schémas SVG sont visibles
- [ ] Aucune information n'a disparu par rapport à la version avec JavaScript
- [ ] Les alternatives textuelles s'ouvrent, `details` étant du HTML natif

### D. Matériel ancien et lent

- [ ] Processeur bridé **6 fois**, le site reste utilisable
- [ ] La bascule automatique en mode allégé se déclenche, message
      `[a11y] Appareil jugé lent` en console
- [ ] Une fois basculé, **aucune information n'a disparu**
- [ ] Testé sur un **vrai appareil ancien**, pas seulement sur un navigateur bridé
- [ ] Cible tenue : Safari iOS 14 et Chrome Android 90

### E. Clavier

- [ ] Tout le contenu est atteignable à la touche Tab seule, sans souris
- [ ] L'ordre de tabulation suit l'ordre visuel
- [ ] Le focus est **toujours** visible, contour de 3 px
- [ ] Le focus n'est **jamais** recouvert par le dessin collé en haut (WCAG 2.4.11)
- [ ] Aucun piège au clavier, on peut toujours ressortir d'un composant
- [ ] Le lien d'évitement fonctionne et amène bien au contenu
- [ ] Toute interaction pilotable à la souris l'est aussi au clavier

### F. Couleur et daltonisme

- [ ] Capture d'écran en **noir et blanc** : tout reste compréhensible
- [ ] Simulation **deutéranopie**, **protanopie**, **tritanopie** : rien ne se confond
- [ ] Contrastes mesurés : **4,5:1** pour le texte, **3:1** pour les traits
- [ ] **Aucun texte** n'utilise une couleur `--c-X` sans son suffixe `-text`
- [ ] Chaque concept est identifié par **couleur, forme et étiquette** ensemble
- [ ] Aucune couleur n'est réutilisée pour un second concept

### G. Mouvement

- [ ] Le bouton « Réduire les animations » fonctionne dans les deux sens
- [ ] Le réglage système `prefers-reduced-motion` est respecté
- [ ] Le choix explicite du visiteur **prime** sur le réglage système
- [ ] Le choix est mémorisé d'une visite à l'autre
- [ ] En mode réduit, **aucune information n'a disparu**
- [ ] Aucun clignotement au delà de **3 par seconde**
- [ ] Aucune durée écrite en dur dans une transition CSS, tout passe par `--dur-*`

### H. Lecteurs d'écran

- [ ] Chaque SVG informatif porte `role="img"`, un `<title>` et un `<desc>`
      liés par `aria-labelledby`
- [ ] Chaque `<desc>` **décrit ce qu'on voit**, il ne répète pas la légende
- [ ] Chaque animation ou activité a son alternative textuelle dépliable
- [ ] Les résultats des simulations sont annoncés en `aria-live="polite"`
- [ ] La structure de titres est continue, sans saut de niveau
- [ ] Testé au **VoiceOver** de macOS (Cmd+F5)
- [ ] Testé à **NVDA** sous Windows, qui n'a pas les mêmes angles morts

### I. Motricité et tactile

- [ ] **Aucune** interaction n'exige un glisser déposer
- [ ] Toutes les cibles font au moins **44 × 44 px**
- [ ] **Aucune limite de temps**, nulle part, quiz compris
- [ ] Testé au doigt sur un vrai téléphone, pas seulement à la souris

### J. Le défilement, la règle centrale du site

- [ ] **Rien n'apparaît après un simple délai.** Sans défilement, rien ne bouge
- [ ] Remonter rejoue bien le mouvement à l'envers
- [ ] Aucun bloc n'apparaît en même temps qu'un autre
- [ ] Vérifié **barre d'adresse rétractée ET déployée** sur téléphone, car
      `svh` et `innerHeight` ne bougent pas ensemble
- [ ] Vérifié en paysage
- [ ] Vérifié à un niveau de zoom de 200 %

---

## Le format du rapport

Pour chaque problème constaté :

| Champ | Contenu |
|---|---|
| **Gravité** | bloquant pour la démonstration, gênant, ou cosmétique |
| **Où** | fichier et ligne, ou section du site |
| **Comment le reproduire** | la suite de gestes exacte, refaisable par un autre |
| **Constaté sur** | navigateur, système, appareil, taille d'écran |
| **Ce que ça casse** | l'effet réel pour un visiteur, pas la cause supposée |

**L'agent d'audit ne corrige rien lui même.** Il constate, il documente, et les
corrections sont décidées ensuite. Un auditeur qui corrige perd son regard
extérieur sur ce qu'il vient de toucher.

---

## Résultats

**Vide. L'audit n'a pas encore été mené.**

Il sera lancé quand les six sections et le quiz existeront. En attendant, la
seule chose vérifiée automatiquement et en continu, ce sont les 9 contrôles de
`outils-test-navigateur.py`, qui sont au vert.
