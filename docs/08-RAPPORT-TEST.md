# 08 — Audit technique : protocole et rapport

> **État : l'audit n'a pas encore eu lieu.**
> Ce document contient pour l'instant **le protocole**, c'est à dire ce que
> l'agent d'audit devra vérifier et comment. La section « Résultats » est vide
> et le restera jusqu'à ce que l'audit soit mené. **Ne jamais y écrire un
> résultat qui n'a pas été constaté.**

> **Corrections de l'utilisateur, 11 septembre 2026**, à la lecture du
> protocole : pas de limite de poids à 150 Ko, pas de test hors connexion,
> pas de test sur matériel ancien ou bridé. **Le plus important, et de loin :
> que les annotations du dessin défilent bien et restent synchronisées avec
> le texte.** C'est le chantier A ci-dessous, et il passe avant tous les
> autres.

---

## Quand, et par qui

L'audit technique est l'**avant-dernière** étape du projet, après la
narration entière et le quiz, et **avant l'audit scientifique**
(`09-AUDIT-SCIENTIFIQUE.md`). Cet ordre n'est pas arbitraire : il ne sert à
rien de vérifier l'exactitude d'un texte que le visiteur n'arrive pas à
atteindre.

Il est mené par un **agent dédié, qui n'a pas écrit le site**. C'est le point
important : quelqu'un qui a codé une chose la teste comme il l'a codée, pas
comme on s'en sert.

## Ce qu'il vérifie, et ce qu'il ne vérifie pas

**Il vérifie que le site FONCTIONNE.** La synchronisation du dessin et du
texte d'abord, puis les interactions, la console, l'absence de JavaScript, et
la liste d'accessibilité.

**Il ne vérifie pas que le site DIT VRAI.** C'est un contrôle entièrement
différent, qui demande un autre regard, et il fait l'objet de
`09-AUDIT-SCIENTIFIQUE.md`. **Un site peut fonctionner parfaitement et
raconter des bêtises.**

**Il ne corrige rien.** Il constate, documente, et les corrections sont
décidées ensuite. Un auditeur qui corrige perd son regard extérieur sur ce
qu'il vient de toucher.

---

## Ce que le site est, au moment de l'audit

Une seule page, une seule mise en page, celle du téléphone, **390 × 844 dans
Chrome** comme référence. Un récit en trois actes qui s'empile au défilement
dans une scène collée, puis un quiz dans une section à part :

- **Acte 0, l'ouverture** : un bouton, puis cinq temps, un par écran, la
  silhouette et son trajet bleu.
- **La bascule** : la caméra plonge dans le trait, une chaîne de cellules,
  l'une s'isole, le neurone se dessine à sa place, les boutons du parcours
  arrivent.
- **Acte 1, le neurone** : quatre parties, dendrites, corps cellulaire,
  axone, terminaisons, avec deux moments interactifs, le curseur du seuil et
  le défi du chronomètre, et la synapse.
- **Acte 2, le retour au corps** : la chaîne, la silhouette, le faisceau, le
  bouton.
- **Acte 3, le quiz** : cinq questions qui s'empilent.

**La source de vérité du contenu est `02-CONTENU.md`** : pour chaque temps,
une colonne « Texte » et une colonne « Graphique ». L'audit compare le site à
ces deux colonnes, temps par temps.

---

## Ce qui est déjà couvert automatiquement

`outils-test-navigateur.py` lance un vrai Chrome à 390 × 844 et passe
**31 contrôles** en treize groupes. L'auditeur les relance, constate qu'ils
sont verts, et **ne les refait pas à la main** :

```bash
python3 -m http.server 8000 --bind 127.0.0.1   # python sur Windows
python3 outils-test-navigateur.py              # python sur Windows
```

1. Au chargement, un seul temps est visible
2. Après 4 secondes sans rien toucher, rien n'a bougé
3. Le verrou d'entrée : défiler sans cliquer ne fait rien
4. Le clic sur le bouton d'ouverture
5. La molette fait apparaître les temps un par un, la descente ne fait qu'ajouter
6. La remontée ne fait que retirer, et l'état revient exactement au départ
7. La caméra visite les parties dans l'ordre
8. Un seul neurone du début à la fin, et les flèches du signal afférent
9. Le curseur du seuil
10. Le défi du chronomètre
11. La synapse et le retour au corps
12. Le quiz
13. Aucune erreur de console

**Deux avertissements à l'auditeur, payés par l'expérience du projet :**

- Chrome en mode headless annonce de lui même `prefers-reduced-motion: reduce`.
  L'outil impose désormais la valeur voulue, mais **tout contrôle manuel fait
  dans un navigateur headless doit vérifier dans quel mode il se trouve**,
  sans quoi il mesure autre chose que ce qu'il croit.
- Le contrôle « aucune erreur de console » a longtemps été vert **parce qu'il
  ne mesurait rien**. Devant un test qui passe, toujours se demander ce qui
  se passerait s'il devait échouer.

**Ce qui n'est pas mesurable depuis une machine de développement**, et reste
à faire par l'utilisateur, sur un vrai téléphone : le doigt sur l'écran, la
barre d'adresse qui se rétracte, VoiceOver sur iPhone ou Mac, NVDA sous
Windows. L'auditeur le note comme tel, il ne le coche pas.

---

## Le protocole, chantier par chantier

> Chaque ligne doit pouvoir être **cochée ou non**, sans jugement. Une ligne
> qui demande une appréciation est mal écrite.

### A. La synchronisation du dessin et du texte, l'essentiel

C'est **la** chose à vérifier. Le site repose entièrement sur une promesse :
ce qui se passe dans le dessin se passe **au moment** où la phrase qui en
parle apparaît, ni avant, ni après. Une annotation en avance dévoile ; une
annotation en retard laisse le lecteur devant une phrase qui parle d'une
chose qu'il ne voit pas.

**Méthode.** Prendre `02-CONTENU.md`, temps par temps, de l'acte 0 au quiz.
Pour chaque temps, faire apparaître la phrase de la colonne « Texte » par
un défilement lent, à la molette, et constater ce que fait le dessin. Puis
refaire le même temps **en remontant**, puis **en y arrivant par un bouton
du parcours** quand il en existe un. Remplir un tableau : temps, phrase,
graphique attendu, graphique constaté, écart.

- [ ] Pour **chaque** temps, l'événement graphique de la colonne
      « Graphique » commence quand sa phrase entre dans la zone de lecture,
      à un cran de molette près, jamais avant
- [ ] Pour chaque temps, la phrase est **lisible pendant** que son événement
      graphique se joue : elle n'est pas encore passée sous le dessin
- [ ] Pour chaque temps, l'annotation du dessin et le mot en magenta dans le
      texte arrivent **au même instant**, comme l'exige `02-CONTENU.md`
- [ ] Le titre du schéma, au dessus du dessin, nomme la partie regardée, et
      change en même temps que la caméra
- [ ] Jamais deux temps n'apparaissent ensemble, ni dans le texte, ni dans le
      dessin
- [ ] Remonter défait chaque événement dans l'ordre inverse, et redescendre le
      refait à l'identique
- [ ] Arriver par un bouton du parcours produit le même état qu'en défilant
- [ ] Sans défilement, **rien ne bouge** dans le dessin, pendant au moins
      dix secondes, à chaque temps
- [ ] Chaque animation a un état d'arrivée statique, et cet état est bien
      celui décrit par la colonne « Graphique »
- [ ] La caméra vise la bonne partie à chaque bloc, et **le cadrage ne coupe
      rien** de la partie nommée
- [ ] La bascule (plongée dans le trait, chaîne, cellule, neurone) se joue
      sans écran blanc et sans que l'ancien texte et le nouveau se
      recouvrent
- [ ] Les deux moments interactifs n'apparaissent qu'avec leur phrase, et
      chaque geste dessus agit sur le dessin **sans délai**
- [ ] Les flèches du signal afférent sont là sur les dendrites et parties
      ailleurs ; les messagers ne traversent qu'avec leur phrase ; la
      cellule d'en face ne s'illumine qu'avec la sienne
- [ ] À l'acte 2, la silhouette revient entière, le trajet allumé, puis le
      faisceau, chacun avec sa phrase
- [ ] Le bouton de la fin du quiz ramène à la silhouette et rejoue
      l'impulsion
- [ ] Le tout vérifié à **390 × 844**, puis à une hauteur d'écran plus courte
      (390 × 660) et plus longue (390 × 930), car les seuils dépendent de la
      hauteur
- [ ] Vérifié à un niveau de zoom de 200 %
- [ ] Vérifié en paysage, une fois, pour constater que rien ne casse

### B. Le socle

- [ ] Le site se charge sans erreur de console, en local et sur l'URL en ligne
- [ ] Aucune requête ne part vers un domaine tiers, tout est local
- [ ] Chaque fichier CSS et JS porte bien son paramètre `?v=` de version, et
      **le même** partout, `index.html` et imports des modules compris
- [ ] Aucun fichier du dépôt n'est orphelin, c'est à dire référencé nulle part
- [ ] Le HTML est bien formé : balises fermées, `id` uniques, attributs
      `aria-labelledby` qui pointent vers des `id` existants
- [ ] `index.html` est bien le produit de `outils-dessin-neurone.py` :
      relancer le générateur ne change rien

### C. Sans JavaScript

- [ ] JavaScript désactivé, **aucune page blanche**
- [ ] Tout le texte de tous les actes et du quiz est lisible, dans l'ordre
- [ ] Tous les schémas SVG sont visibles, en entier
- [ ] Aucune information n'a disparu par rapport à la version avec JavaScript
- [ ] Les alternatives textuelles s'ouvrent, `details` étant du HTML natif
- [ ] Le quiz est une liste de questions-réponses lisible

### D. Clavier

- [ ] Tout le contenu est atteignable à la touche Tab seule, sans souris
- [ ] L'ordre de tabulation suit l'ordre visuel
- [ ] Le focus est **toujours** visible, contour de 3 px
- [ ] Le focus n'est **jamais** recouvert par le dessin collé en haut (WCAG 2.4.11)
- [ ] Aucun piège au clavier, on peut toujours ressortir d'un composant
- [ ] Le lien d'évitement fonctionne et amène bien au contenu
- [ ] Toute interaction pilotable à la souris l'est aussi au clavier : le
      bouton d'ouverture, les boutons du parcours, les deux curseurs et leurs
      boutons, les radios du quiz aux flèches, les deux boutons de la fin

### E. Couleur et daltonisme

- [ ] Capture d'écran en **noir et blanc** : tout reste compréhensible
- [ ] Simulation **deutéranopie**, **protanopie**, **tritanopie** : rien ne se confond
- [ ] Contrastes mesurés : **4,5:1** pour le texte, **3:1** pour les traits
- [ ] Le texte est **noir partout** : aucune couleur de la palette fluo n'est
      posée sur du texte, elle passe toujours derrière
- [ ] Seul le bleu du signal est employé en trait pur ; le vert est une bande
      cernée, l'orange un aplat cerné, le magenta un fond
- [ ] Chaque concept est identifié par **couleur, forme et étiquette** ensemble
- [ ] Aucune couleur n'est réutilisée pour un second concept
- [ ] Le verdict du quiz et l'objectif du chronomètre sont dits par un mot,
      jamais par la couleur seule

### F. Mouvement

- [ ] Le bouton « Réduire les animations » fonctionne dans les deux sens
- [ ] Le réglage système `prefers-reduced-motion` est respecté
- [ ] Le choix explicite du visiteur **prime** sur le réglage système
- [ ] Le choix est mémorisé d'une visite à l'autre
- [ ] En mode réduit, **aucune information n'a disparu** : tout ce que le
      chantier A a constaté en mode normal existe en mode réduit, à l'état
      d'arrivée
- [ ] En mode réduit, aucune erreur de console à aucun temps (piège payé
      quatre fois : une déclaration après le retour anticipé)
- [ ] Aucun clignotement au delà de **3 par seconde**
- [ ] Aucune durée écrite en dur dans une transition CSS, tout passe par `--dur-*`

### G. Lecteurs d'écran, ce qui se vérifie dans le DOM

- [ ] Chaque SVG informatif porte `role="img"`, un `<title>` et un `<desc>`
      liés par `aria-labelledby`
- [ ] Chaque `<desc>` **décrit ce qu'on voit**, il ne répète pas la légende
- [ ] Chaque animation ou activité a son alternative textuelle dépliable
- [ ] Les résultats des interactions et du quiz sont annoncés en
      `aria-live="polite"`, et la région existe avant que son contenu change
- [ ] La structure de titres est continue, sans saut de niveau
- [ ] Les boutons du parcours portent `aria-current`, et la vue est annoncée
- [ ] À faire par l'utilisateur : VoiceOver et NVDA

### H. Motricité et tactile

- [ ] **Aucune** interaction n'exige un glisser déposer
- [ ] Toutes les cibles font au moins **44 × 44 px**, mesurées
- [ ] **Aucune limite de temps**, nulle part, quiz compris
- [ ] À faire par l'utilisateur : au doigt sur un vrai téléphone

---

## Le format du rapport

Pour chaque problème constaté :

| Champ | Contenu |
|---|---|
| **Gravité** | bloquant pour la démonstration, gênant, ou cosmétique |
| **Où** | fichier et ligne, ou temps du récit |
| **Comment le reproduire** | la suite de gestes exacte, refaisable par un autre |
| **Constaté sur** | navigateur, taille de fenêtre, mode (normal, réduit, sans script) |
| **Ce que ça casse** | l'effet réel pour un visiteur, pas la cause supposée |

Et pour le chantier A, **le tableau complet**, temps par temps, même quand
tout est conforme : c'est la preuve que chaque temps a été regardé.

**L'agent d'audit ne corrige rien lui même.**

---

## Résultats

**Vide. L'audit n'a pas encore été mené.**
