# 08 — Audit technique : protocole et rapport

> **État : l'audit a été mené les 11 et 12 septembre 2026.**
> Il a été conduit par des **agents indépendants, un par chantier**, chacun
> suivi d'un **contre-vérificateur** qui a refait les gestes avant qu'un
> constat soit retenu. Tout a été mesuré dans **Chrome headless**, à
> **390 × 844** comme référence, puis à quatre autres tailles : 390 × 660,
> 390 × 930, 844 × 390 en paysage, et 195 × 422 pour le zoom à 200 %. Le
> protocole ci dessous n'a pas bougé ; les constats sont dans la section
> « Résultats », à la fin.
> **Ce qui n'est pas mesurable depuis une machine de développement reste à
> faire par l'utilisateur, sur un vrai poste** : le doigt sur un vrai
> téléphone, VoiceOver sur iPhone ou Mac, NVDA sous Windows, le rendu couleur
> d'un écran réel et des simulations de daltonisme, le réglage « Réduire les
> animations » d'un vrai iPhone ou d'un vrai Android, et le zoom de page de
> Chrome, ici seulement émulé par une fenêtre plus petite. La liste complète
> est en fin de rapport. **Ne jamais y écrire un résultat qui n'a pas été
> constaté.**

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
**37 contrôles** en quinze groupes. L'auditeur les relance, constate qu'ils
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
13. Entrer dans le site, au geste, dans les deux modes
14. Ce qui est invisible ne se laisse pas tabuler
15. Aucune erreur de console

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

Audit mené les 11 et 12 septembre 2026, en deux vagues : un agent par chantier,
puis un contre-vérificateur par chantier, qui a refait les gestes avant qu'un
constat soit retenu. Les chantiers sont A1 à A5 (la synchronisation du dessin et
du texte, découpée par portées du récit), B le socle, C sans JavaScript, D le
clavier, E la couleur, F le mouvement, G les lecteurs d'écran, H la motricité et
le tactile.

### Le résumé

Tout a été mesuré dans Chrome headless, à 390 × 844, et aux quatre autres
tailles pour le chantier A5. Sur les 148 lignes de protocole réparties entre les
douze portées, **86 sont cochées, 51 ne le sont pas, 11 ne sont pas mesurables
depuis cette machine**. La contre-vérification retient **73 constats : 5
bloquants, 38 gênants, 30 cosmétiques** ; **13 constats de la première vague
n'ont pas été reproduits**. Sur le chantier A, la priorité de l'utilisateur : la
synchronisation tient à l'acte 0, à la bascule et à l'acte 2, où l'événement
graphique arrive avec sa phrase, à un cran près, jamais avant. Elle ne tient pas
dans l'acte 1, où **six temps n'ont aucun événement graphique**, un septième en
a un qui contredit sa phrase, et l'annotation arrive 70 px après son mot magenta.

### Trois corrections apportées pendant l'audit

Trois défauts trouvés par la campagne ont été corrigés le **12 septembre
2026**, avant la clôture du rapport. Ils sont signalés ici parce que les
constats correspondants ne valent plus.

1. **En mouvement réduit, le bouton d'ouverture n'était branché par personne.**
   Le verrou de défilement ne se levait donc jamais et tout le site, du récit au
   quiz, était fermé à ces visiteurs. Corrigé. Un contrôle qui n'emploie que des
   gestes réels a été ajouté à la batterie, **le contrôle 13**, « entrer dans le
   site, au geste, dans les deux modes » ; la batterie compte depuis 33
   contrôles. Ce défaut n'apparaît dans aucun constat ci dessous : le chantier B
   a travaillé sur `f88005f4`, le chantier D sur `3601190`, et les chantiers F
   et H mesurent un mouvement réduit où le clic d'entrée pose bien la classe
   `entre`, donc après la correction.
2. **`etatParcours` était déclaré après le retour anticipé du mouvement
   réduit**, et `majCamera()` le lit : `Uncaught ReferenceError: Cannot access
   etatParcours before initialization` sur le seul bloc qui porte un
   `data-cadrage`, celui des terminaisons, quatre fois par descente. Corrigé.
   Le constat du chantier A3 qui décrit la caméra morte sur tout 1D en mouvement
   réduit est donc **corrigé le 12 septembre** ; la moitié de ce constat qui
   porte sur les messagers jamais créés et la cellule d'en face jamais illuminée
   **reste ouverte**, et le chantier F la documente séparément.

3. **Un piège au clavier fermait le site à qui n'a pas de souris**, commit
   1e5f111. C'est le constat bloquant n° 3 ci dessous, reproduit à l'identique
   avant correction : quatre tabulations depuis la page neuve tombaient sur un
   bouton du parcours invisible, et Entrée envoyait le défilement à 7586 px
   sans lever le verrou. Corrigé. Retirer les seuls boutons du parcours ne
   suffisait pas : le piège se déplaçait sur le bouton de la fin du récit, qui
   envoyait à 14312 px, puis sur le quiz ; c'est tout ce que couvre le cache
   d'ouverture qui passe désormais en `visibility: hidden` tant que le verrou
   est posé. Deux constats gênants de la même famille partent avec : le bouton
   d'ouverture atteignable et annoncé après le clic (chantiers D et G), et la
   barre des parties tabulable derrière le cache en mouvement réduit
   (chantier D). Le **contrôle 14** a été ajouté, « ce qui est invisible ne se
   laisse pas tabuler » ; la batterie compte depuis **37 contrôles**.

Tout le reste des constats du chantier F reste ouvert.

### Les constats bloquants

#### 1. Au zoom 200 %, aucune phrase des actes 1 et 2 n'est lisible

| Champ | Contenu |
|---|---|
| **Gravité** | bloquant |
| **Où** | Tout le parcours, du bloc plan (`index.html` l.385) au bloc clic (l.541). Mécanique en cause : `css/base.css` l.363, `.porte-neurone .etapes` en `position: absolute; top: 100%`, dont la hauteur n'est pas réservée dans la scène collée de 100 svh |
| **Comment le reproduire** | Ouvrir `http://127.0.0.1:8000` dans une fenêtre de 195 × 422, équivalent CSS du zoom 200 % sur 390 × 844. Cliquer le bouton d'entrée, attendre 1,3 s, puis descendre à la molette par crans de 300 px jusqu'au bout du récit |
| **Constaté sur** | Chrome headless, émulation mobile DPR 2, fenêtre 195 × 422 (viewport 198 × 429), mode normal, `documentElement.className` valant `js entre` |
| **Ce que ça casse** | Aucune phrase des actes 1 et 2 n'est jamais lisible. Le visiteur voit un dessin qui change tout seul et ne lit aucun des vingt-six temps du récit. Les deux moments interactifs, le curseur du seuil et le défi du chronomètre, sont eux aussi entièrement cachés alors qu'ils restent dans l'ordre de tabulation |

**Note du contre-vérificateur.** Reproduit à l'identique. Sur les 23 crans où le
bloc de boutons est peint, son bas est à y=496 pour une fenêtre de 429 px : il
déborde de 67 px sous l'écran, valeur constante aux 23 crans sur 23. Hauteur de
texte du parcours non recouverte : 0 px aux 23 crans sur 23, contre 250 px en
médiane à 390 × 844 dans le même script. Le curseur du seuil est visible sur 0
de ses 223 px et le défi du chronomètre sur 0 de ses 360 px, au meilleur cran de
toute la descente. Captures regardées : l'écran ne contient que le bouton
flottant, le titre du schéma, le dessin et quatre boutons dont le quatrième est
coupé par le bord. Gravité maintenue à bloquant : le protocole exige
explicitement la vérification au zoom 200 %, la norme visée est WCAG 2.2 AA, et
pour ce visiteur la lecture des vingt-six temps échoue entièrement.

#### 2. Au zoom 200 %, le bouton « 4. Terminaisons » est hors d'atteinte

| Champ | Contenu |
|---|---|
| **Gravité** | bloquant |
| **Où** | Bouton `[data-vers=terminaisons]`, `index.html` l.325, cinquième bouton du parcours |
| **Comment le reproduire** | Même reproduction que ci dessus. Chercher le bouton « 4. Terminaisons » à n'importe quel moment du parcours, et essayer de défiler pour l'atteindre |
| **Constaté sur** | Chrome headless, 195 × 422 (viewport 198 × 429), mode normal |
| **Ce que ça casse** | Les cinq boutons s'empilent sur cinq rangs et le cinquième passe sous le bas de l'écran. La scène étant collée, il n'y remonte jamais : le visiteur ne peut pas sauter aux terminaisons, et quand la caméra y est, aucun bouton ne paraît sélectionné puisque le seul marqué `aria-current` est hors champ |

**Note du contre-vérificateur.** Reproduit à l'identique. Tops mesurés 228, 280,
332, 384 et 436 pour une fenêtre de 429 px ; le bouton des terminaisons est à
top=436 et bottom=480, entièrement sous le bord bas, aux 23 crans sur 23 où le
bloc est peint. La scène étant collée, sa position à l'écran ne change pas d'un
cran à l'autre. Le relevé d'accessibilité confirme la seconde moitié du constat :
aux crans 30 et 33 la vue est « terminaisons » et `aria-current=true` est bien
posé sur ce bouton, mais il est hors champ, donc aucun des quatre boutons
visibles n'apparaît sélectionné. Constat distinct du premier, et il subsisterait
même si le premier était corrigé.

#### 3. Un piège au clavier avant même d'être entré dans le site

| Champ | Contenu |
|---|---|
| **Gravité** | bloquant |
| **Où** | Le tout premier écran, avant le clic d'ouverture. `index.html` l.321 à 325, les cinq boutons de `nav.etapes`, toujours dans le DOM et toujours focusables ; `js/recit.js` l.808 à 811, la barre passe à opacité 0 et `pointer-events: none`, jamais hors de la tabulation ; `css/base.css` l.828, `html.js:not(.entre) { overflow: hidden }` |
| **Comment le reproduire** | Charger `http://127.0.0.1:8000` à 390 × 844. Sans souris : Tab (lien d'évitement), Tab (Réduire les animations), Tab (bouton Clique), Tab une quatrième fois, puis Entrée |
| **Constaté sur** | Chrome headless, 390 × 844, DPR 2, mode normal (`html = 'js'`), dépôt au commit 3601190 |
| **Ce que ça casse** | Le site se fige. Le défilement saute à 7586 px, la vue caméra passe à « plan », et le visiteur se retrouve devant le neurone entier alors qu'il n'a jamais cliqué sur le bouton d'ouverture. Le verrou de défilement est toujours actif : deux crans de molette et deux flèches bas ne bougent plus rien. Le récit entier devient inatteignable. Un utilisateur de souris ne peut pas tomber dedans, les boutons étant à `pointer-events: none` : c'est un défaut réservé au visiteur au clavier |

> **Corrigé le 12 septembre 2026, commit 1e5f111.** Voir la section des
> corrections ci dessus.

**Note du contre-vérificateur.** Confirmé sur le fond, avec trois corrections de
fait. Reproduit par quatre Tab réels puis Entrée : scrollY 0 vers 7586, vue
« plan », `html` reste `js` et n'atteint jamais `entre`, `overflow` mesuré à
`hidden`. Verrou vérifié par des gestes : deux crans de molette, deux flèches
bas et deux crans vers le haut laissent scrollY à 7586. Correction 1 : le bouton
Clique n'est pas sorti de l'écran, il est à top=520 bottom=586, donc en plein
dans l'écran, mais à opacité effective 0. L'effet pour le visiteur est le même,
la cause décrite est fausse. Correction 2 : la récupération demande un seul
Shift+Tab, pas un long retour, et un simple rechargement remet tout à zéro.
Correction 3 : l'écran d'arrivée n'est pas vide et l'anneau de focus y est bien
visible. Gravité maintenue à bloquant : la ligne « Aucun piège au clavier » du
chantier D est en échec, la lecture s'arrête là, et rien à l'écran n'indique la
sortie.

#### 4. En mouvement réduit, le dessin n'est jamais à l'écran pendant qu'on lit

| Champ | Contenu |
|---|---|
| **Gravité** | bloquant |
| **Où** | `css/base.css` l.428 à 431, `html.reduce-motion .recit-scene { position: static }`, effet sur les onze blocs du parcours, de l'acte 1 temps 1 à l'acte 2 temps 26 |
| **Comment le reproduire** | Ouvrir `http://127.0.0.1:8000` à 390 × 844 avec le mouvement réduit, par `prefers-reduced-motion: reduce` ou par un clic sur « Réduire les animations ». Cliquer le bouton d'entrée. Descendre à la molette jusqu'à ce que le bloc « Les dendrites » soit dans la zone de lecture. Regarder l'écran : le dessin n'y est pas. Recommencer aux dix autres blocs |
| **Constaté sur** | Chrome headless, 390 × 844, DPR 2, mode réduit par le stockage et par le réglage système, les deux |
| **Ce que ça casse** | Le visiteur qui a demandé moins de mouvement lit les onze blocs du parcours sans jamais voir le dessin dont ils parlent. Il pose les six segments de myéline du défi sans en voir un seul apparaître. Pour voir le schéma il doit remonter de deux mille à huit mille pixels. La promesse du site, le dessin et la phrase au même instant, ne tient pas pour lui |

**Note du contre-vérificateur.** Reproduit deux fois, par le stockage et par le
réglage système. Aux onze blocs, le SVG `.neurone` est entièrement au dessus de
la fenêtre : hauteur visible 0 px, bord supérieur de -377 px au bloc chaîne à
-8100 px au bloc clic, `.recit-scene` en `position: static`, hauteur du document
10465 px. Témoin en mode normal, même relevé : 228 px visibles aux onze blocs,
scène collée, document de 16079 px. Deux précisions qui ne changent pas le
verdict : le défi de la myéline n'est pas entièrement muet en mode réduit, le
chronomètre passe de 0,51 s à 0,02 s et affiche « Objectif atteint », 10,2 % des
pixels de l'écran changent, seules les six bandes vertes se posent hors champ ;
le curseur du seuil, lui, est bien muet, sept clics ne changent que 1,15 % des
pixels. Gravité maintenue à bloquant pour une raison de plus, mesurée : basculer
en mouvement réduit en cours de parcours, ce que fait aussi la dégradation
automatique sur appareil lent (`js/a11y.js`, `surveillerFluidite`), fait passer
le dessin de 228 px visibles à 0 px et saute de y=8677 à y=3063.

#### 5. Revenir au mouvement complet en cours de visite rend la page illisible

| Champ | Contenu |
|---|---|
| **Gravité** | bloquant |
| **Où** | Le bouton `[data-bascule-mouvement]`, `index.html` l.28, quand on revient au mouvement complet en cours de visite |
| **Comment le reproduire** | Ouvrir la page en mode réduit, par le stockage ou par le réglage système. Cliquer le bouton d'entrée. Descendre jusqu'au bloc des dendrites, du corps cellulaire ou des terminaisons. Cliquer le bouton « Animations réduites » pour revenir au mouvement complet. Regarder l'écran |
| **Constaté sur** | Chrome headless, 390 × 844, DPR 2, mode réduit au départ (stockage), trois positions différentes, trois fois le même résultat |
| **Ce que ça casse** | La page devient illisible : les cinq textes de l'ouverture s'empilent les uns sur les autres dans la scène redevenue collée, par dessus les boutons du parcours et par dessus le texte en cours de lecture. Le visiteur qui essaie le réglage puis change d'avis ne peut plus lire, et rien ne lui dit qu'il faut recharger la page |

**Note du contre-vérificateur.** Reproduit quatre fois : mode réduit par le
stockage aux blocs dendrites, soma et terminaisons, et par le réglage système au
bloc soma, avec des clics réels. Après le clic, `.recit-scene` repasse de
`static` à `sticky`, la hauteur du document passe de 10465 à 16079 px, les cinq
temps de l'ouverture restent à opacité effective 1, et le détecteur de
recouvrements passe de 0 à 1 aux dendrites, de 0 à 2 au soma, de 1 à 3 aux
terminaisons, par exemple « DIV.etape-contenu coupé par P.temps lead t-corps,
42 points sur 45 ». Capture regardée : quatre phrases de l'acte 0 sont écrites
par dessus les cinq boutons du parcours et par dessus la courbe, et le désordre
persiste quand on continue à défiler. Aucune erreur de console. Un ajout au
constat d'origine : il existe une sortie de secours, recliquer le même bouton
rend la page propre, mais elle ramène le visiteur au mouvement réduit qu'il
venait de refuser, et rien à l'écran ne l'indique.

### Les constats gênants

Trente-huit constats, groupés par thème. Tous ont été reproduits par le
contre-vérificateur de leur chantier.

**Le décalage entre la phrase et la caméra**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Acte 1 temps 4 et temps 6 ; `js/recit.js` l.661, `SEUIL_LECTURE = 0.93`, contre l.102, `HAUT = 0.62` et `BAS = 0.70` | À un cran de molette ordinaire, le visiteur lit la phrase entière, mot en magenta compris, pendant que le dessin montre encore la partie précédente : pas de zoom, pas de surbrillance, pas de flèches, et le titre du schéma annonce encore l'autre partie | 390 × 844, entrer, aller à scrollY 7900, molette par crans de 200 px avec 0,4 s de pause, et regarder la capture du cran qui fait apparaître la phrase |
| 1D temps 19, bloc `#etape-terminaisons` ; `index.html` l.507, `data-cadrage="synapse"` posé sur le temps 20 | Le visiteur lit « Tout en bas, l'axone se divise en petites branches » devant un dessin toujours titré « L'axone », où les terminaisons ne sont qu'un gribouillis de dix pixels au ras du cadre, sans surbrillance, avec « 3. Axone » encore marqué courant. La partie que la phrase nomme n'est jamais montrée avant le temps 22 | Entrer, descendre jusqu'à scrollY 9850, puis molette par crans de 150 à 250 px, et lire à chaque cran `window.__parcours.vueActuelle()` et le viewBox de `.neurone` |

**Deux temps dans un même cran**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Acte 1 partie 1A et 1B ; `index.html` l.393 à 458 et `css/base.css` l.542 | La règle « un mouvement de défilement fait arriver un nouvel élément de texte » ne tient pas : le raisonnement se construit deux marches à la fois, et le visiteur reçoit en une fois la définition des dendrites et l'idée des milliers de neurones | Entrer, aller à scrollY 7900, descendre par crans de 150 px : le cran qui arrive à 8200 révèle d'un coup les temps 4 et 5. Recommencer par crans de 250 px : celui qui arrive à 8900 révèle les temps 6 et 7 |
| Blocs `#etape-axone` et `#etape-terminaisons` ; `css/base.css` l.542 et `js/recit.js` l.661 | Deux temps apparaissent dans le même geste : le lecteur en reçoit deux d'un coup et ne sait plus lequel commande le dessin | Descendre au pas minimal du protocole, 150 px, pause 0,4 s, depuis scrollY 9850, et noter à chaque cran les `.temps-parcours` dont l'opacité effective dépasse 0,5 |

**Les temps dont l'événement graphique n'existe pas, ou contredit la phrase**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Acte 1 partie 1A, temps 5 ; `index.html` l.398, le seul auditeur de `temps:parcours` est `js/seuil.js` l.264, qui ne répond qu'à `data-demo='messages'` | Le visiteur lit « Elles collectent, et elles collectent beaucoup » devant un dessin où il n'arrive rien. Les points bleus qui doivent arriver aux extrémités des dendrites n'existent pas à ce moment du récit | Entrer, aller à scrollY 8100, descendre par crans de 200 px jusqu'à 8760, et relever le nombre d'enfants de `.neurone .messages` à chaque cran |
| 1C temps 15 ; `index.html` l.472, `js/myeline.js` l.87 à 104 et l.204 | La phrase qui introduit la myéline, mot en magenta compris, n'est accompagnée d'aucun vert : le premier vert du site n'apparaît que si le visiteur touche de lui même les boutons du temps suivant | Descendre jusqu'à scrollY 10520, attendre 2,5 s, lire l'opacité effective des six groupes `.gaines > g` |
| 1C temps 17 et temps 18 ; `index.html` l.494 et 498 | Deux temps sur onze n'ont aucun événement graphique. Le temps 17 promet une comparaison côte à côte : il n'existe aucun second tracé d'axone dans le document. Le temps 18 promet un chronomètre qui retombe en bleu : il ne bouge pas, et s'il affiche 0,02 s c'est sur fond vert, parce que le visiteur l'y a mis | S'arrêter à scrollY 10910 puis 11140, attendre 2,5 s à chaque fois, relever le viewBox, les opacités et `[data-chrono-valeur]` |
| 1C temps 12 et temps 13 ; `index.html` l.463 et 466 | « L'impulsion descend le long de l'axone » et « un basculement qui se propage » sont dits devant un axone où rien ne descend et rien ne se propage. La première impulsion de 1C est celle du temps 14, deux temps plus loin | S'arrêter à scrollY 10045 puis 10215, attendre 0,35 s, lire l'opacité effective et le `cx` de `.impulsion` et `.impulsion-defi` |
| 1D temps 21 ; `js/synapse.js` l.27 et 28, et `index.html` l.294 | Les quatre messagers s'arrêtent dans le blanc, à un quart du chemin, alors que la phrase dit qu'ils traversent le vide et vont toucher la cellule d'en face. Le dessin contredit la phrase au moment même où elle se lit | Descendre jusqu'à scrollY 11590, attendre 2,5 s, relever `cx` et `cy` des quatre cercles de `.synapse .messagers` |
| 1C temps 14 rejoué après le temps 16 ; `js/myeline.js` l.199, les gaines posées ne sont jamais retirées par le défilement | « Sur un axone nu, c'est lent » se lit sous un axone entièrement couvert de six bandes vertes, et aucune impulsion ne repart. Le visiteur qui remonte pour relire tombe sur un dessin qui dit le contraire de la phrase | Descendre à scrollY 10700, cliquer six fois « Ajouter », attendre 3 s, remonter de quatre crans de 250 px, puis redescendre jusqu'à scrollY 10450 |

**Ce qui se joue hors de la vue du lecteur, et ce qui se recouvre**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| 1B temps 8, la courbe du potentiel d'action ; `index.html` l.424 à 445, `js/seuil.js` l.140 à 143 | Le visiteur qui fait ce que la phrase demande, au moment où elle le demande, ne voit pas la moitié de ce que le temps 8 promet : la courbe se trace entièrement hors de sa vue, puis la figure réapparaît vide et se retrace toute seule, et le lien avec son geste est perdu | Entrer, aller à scrollY 9000, attendre 3,5 s, poser la valeur 8 sur `#curseur-seuil` ou cliquer huit fois sur Plus, et relever l'opacité effective de `.figure-courbe` et son `strokeDasharray` pendant trois secondes |
| Acte 2, entrée et sortie du temps 23, y de 12100 à 12300 en descendant ; `js/recit.js`, `appliquerScene()`, fondus de 0,9 s | Pendant environ une seconde l'écran devient illisible : les deux fonds de dessin sont translucides en même temps, les quatre paragraphes de l'acte 1 réapparaissent au travers, et en remontant le titre du schéma et les cinq boutons se superposent à la phrase. C'est le passage le plus important du récit, le retour au corps | Entrer, aller à y=12100, attendre 2 s, donner un cran de molette de 200 px et capturer 0,15 s plus tard. En remontant : y=12235, un cran de -200 px, capturer 0,15 s plus tard |

**Le haut de la page, après l'entrée**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Haut de la page, y de 0 à environ 1000 ; `css/base.css` l.740, `html.entre .porte-entree { max-height: 0 }` | Le visiteur qui remonte en haut trouve un écran vide, 0,54 % de pixels peints : le temps 1, titre du site, phrase et bouton magenta, n'est jamais remis, et la silhouette n'est pas encore là. Environ une hauteur et demie d'écran de page blanche avant le retour du temps 2, à y=1100 | Entrer, descendre jusqu'au quiz, remonter à la molette jusqu'à y=0, capturer et compter les pixels peints |
| Même bloc `.porte-entree`, `index.html` l.58, constaté aux cinq tailles | De y=0 à environ y=800 l'écran est vide, à l'exception du bouton flottant. Le visiteur qui remonte pour relire le début peut croire le site cassé, et le titre du schéma reste figé sur « Une chaîne de cellules » | Entrer, puis aller directement à y=600 après le clic, à n'importe laquelle des cinq tailles |

**Le dessin qui bouge sans qu'on défile**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Vue dendrites ; `js/recit.js` l.706 à 716, un `setTimeout` de 1800 ms retire la classe `surbrillance` | Le dessin change tout seul alors que le visiteur ne touche rien : la surbrillance magenta de la partie regardée s'efface d'elle même pendant que le mot reste en magenta dans le texte. Passé 1,8 s, le dessin ne désigne plus la partie que la phrase nomme. Le contre-vérificateur écarte la moitié « corps cellulaire » du constat, où les deux éléments qui disparaissent sont deux cercles anonymes | Entrer, atteindre le parcours, cliquer « 1. Dendrites », attendre 2,5 s, capturer et relever le DOM, ne plus rien toucher, attendre 10 s, recommencer |

**Les boutons du parcours**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Bouton « 4. Terminaisons » ; `css/base.css` l.522, `scroll-margin-top: 52svh` ; `js/recit.js` l.793 | Le bouton nommé « 4. Terminaisons » dépose le visiteur sur le gros plan de la synapse, titré « La synapse », et plus aucun bouton n'est marqué comme courant : le visiteur ne sait plus où il est, ni au regard ni au lecteur d'écran | Se placer à scrollY 8800, cliquer « 4. Terminaisons », attendre 3,5 s, lire `vueActuelle()`, le texte de `#figure-titre` et les `aria-current` des cinq boutons |
| Le même bouton, `index.html` l.325, constaté à 390 × 844 et à 390 × 930 | Le dessin montre le gros plan de la synapse alors que le bouton promettait les terminaisons, et aucun des cinq boutons n'est marqué courant | Entrer, descendre jusqu'à voir les boutons, cliquer « 4. Terminaisons », attendre 1,6 s, relever la vue, le titre du schéma et les `aria-current` |

**Les autres tailles d'écran**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Paysage 844 × 390, zone de lecture sous les boutons, tout l'acte 1 et tout l'acte 2 | Il reste 62 px sous les boutons, une ligne et demie. Chaque phrase arrive avec sa première ligne déjà effacée par le fondu du dessin, et à deux crans sur onze rien n'est lisible. Le défi du chronomètre n'est visible que sur 21 de ses 241 px | Fenêtre 844 × 390, entrer, attendre 1,3 s, descendre par crans de 200 px avec 0,4 s de pause, et lire ce qui est sous les boutons à chaque cran |
| 390 × 930, acte 1D, temps 19 puis 20 ; bloc `etape-terminaisons`, `index.html` l.502 à 507 | La phrase qui nomme les terminaisons arrive alors que le dessin montre encore l'axone, puis le dessin saute directement au gros plan de la synapse : le plan intermédiaire du récit manque | Fenêtre 390 × 930, entrer, descendre par crans de 200 px, pause 0,4 s, et relever `vueActuelle()` entre y=11028 et y=12828 |
| Acte 2 temps 24, titre `h3` « Ton doigt », `index.html` l.527, en paysage 844 × 390 et au zoom 200 % | Le titre disparaît derrière le fond du dessin alors que son sous-titre reste affiché juste en dessous : le lecteur voit un sous-titre orphelin. Le détecteur de chevauchements compte 3 points de ligne couverts sur 9 | Ouvrir à 844 × 390, entrer, aller au haut du bloc `etape-doigt` moins 35 % de la hauteur d'écran, capturer |

**Le mouvement réduit**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Mouvement réduit, toute la portée 1C et 1D ; `js/recit.js`. **La caméra morte sur tout 1D est corrigée le 12 septembre, commit 3601190** | Ce qui reste ouvert : les quatre messagers ne sont jamais créés et la cellule d'en face ne s'illumine jamais, donc toute la colonne Graphique de 1D manque à ce visiteur. Le contre-vérificateur réfute deux affirmations du constat d'origine : la caméra fonctionne bien en mouvement réduit sur 1C, et il y avait des erreurs de console, quatre par descente | Lancer le navigateur avec `prefers-reduced-motion: reduce`, entrer, puis relever le titre du schéma, le viewBox, le nombre de messagers, l'opacité de `.suivante-bleue` et celle des six gaines |
| Acte 1D temps 20 à 22, bloc `etape-terminaisons`, en mode réduit | Trois événements graphiques manquent : le gros plan sur le vide, les quatre messagers oranges, seul orange du site, et la cellule d'en face qui s'illumine. Le passage de l'électrique au chimique, point de bascule du récit, n'a plus d'image. L'alternative textuelle de la fin du récit décrit encore les messagers en toutes lettres, pour qui l'ouvre | Ouvrir en mode réduit, entrer, descendre jusqu'au bloc des terminaisons, parcourir par pas de 120 px, et relever le nombre d'enfants de `.synapse .messagers`, l'opacité de `.suivante-bleue` et le viewBox |
| Le curseur du seuil, acte 1B temps 8 ; `js/seuil.js` l.163 à 172 et 244 à 251, en mode réduit | Le curseur affiche 8 messages, bien au dessus du seuil, et la seule phrase que reçoit le visiteur dit le contraire : « Pas assez pour partir. » En mouvement réduit cette annonce est le seul retour disponible. C'est l'inverse de la leçon du temps 9. 450 ms entre deux clics suffisent déjà, ce qui est une cadence ordinaire | Ouvrir en mode réduit, entrer, aller au bloc du corps cellulaire, remettre le curseur à 0, cliquer huit fois de suite sur Plus sans attendre, et lire `[data-annonce-seuil]` |

**Le clavier**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| Le corps cellulaire et l'axone, chaque fois que le navigateur doit défiler pour montrer le focus ; `css/base.css` l.363 à 369 contre l.522 | Le visiteur au clavier ne voit plus rien : ni l'anneau de focus, ni la commande qui le porte. Il continue à taper des flèches sur un curseur invisible. C'est le cas que WCAG 2.4.11 interdit | Entrer, défiler jusqu'à voir les commandes de la myéline vers le milieu de l'écran, scrollY environ 11077, poser le focus sur le curseur de la myéline puis appuyer deux fois sur Shift+Tab |
| `index.html` l.321 à 325 et `js/recit.js` l.808 à 811 : la barre des boutons change d'opacité sans jamais quitter la tabulation | Cinq coups de Tab dans le vide, au début du site et de nouveau à la fin. Le visiteur au clavier perd son repérage et croit la tabulation cassée | Charger la page, sans toucher la souris appuyer quatre fois sur Tab puis continuer : cinq arrêts d'affilée sans aucun anneau visible |
| `css/base.css` l.740 à 744 : le bouton d'ouverture reste focusable après avoir disparu | Un arrêt de tabulation fantôme, au début du récit comme à la fin. Entrée dessus ne fait rien : le visiteur tape sur un bouton mort sans savoir lequel | Entrer, défiler jusqu'au corps cellulaire, revenir au début de la tabulation puis appuyer deux fois sur Tab : le focus est sur le bouton d'ouverture, invisible, à top 152 |
| Le bloc de la myéline, `#etape-axone .interaction` ; `css/base.css` l.622, `html.js .interaction { visibility: hidden }` | Le visiteur qui navigue à la touche Tab passe par dessus une activité entière, le défi du chronomètre, sans savoir qu'elle existe | Entrer, descendre jusqu'au corps cellulaire seulement, scrollY environ 9300, revenir au début de la tabulation et appuyer sur Tab jusqu'au bouton Plus du seuil : le onzième Tab saute à scrollY 14312 |
| Le premier écran en mouvement réduit ; `css/base.css` l.724 à 738, le cache papier plein écran | Le focus se pose sur des boutons à opacité 1 mais derrière le cache plein écran : rien n'apparaît. Tous les temps étant déjà déployés, la série d'arrêts perdus est longue, neuf au moins, et elle arrive avant même que le visiteur soit entré | Lancer Chrome avec `prefers-reduced-motion: reduce` à 390 × 844, et sans cliquer appuyer quatre fois sur Tab |

**Les lecteurs d'écran**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| `index.html` l.320 à 326 et `js/recit.js` l.793 ; vue « synapse » de `js/recit.js` l.70 | Le visiteur appuie sur « 4. Terminaisons » et l'interface lui répond que rien n'est en cours : aucun bouton ne s'allume, et la seule phrase annoncée nomme une vue, « la synapse », qui ne correspond à aucun bouton de la barre | Entrer, attendre 1,6 s, revenir en haut, cliquer `[data-vers=terminaisons]`, attendre 2 s, lire `vueActuelle()` et les `aria-current` des cinq boutons |
| `index.html` l.58 à 66 et `css/base.css` l.740 à 744 | Une fois cliqué, le bouton d'ouverture a visuellement disparu mais reste lu et atteignable : la troisième tabulation s'arrête sur un bouton invisible de 148 × 44 px, et le lecteur d'écran annonce la consigne périmée « Clique sur ce bouton. » | Entrer, attendre 1,6 s, revenir en haut, enchaîner huit tabulations et relever `document.activeElement` ; interroger en parallèle l'arbre d'accessibilité sous `.porte-entree` |
| `js/seuil.js` l.234 à 251 ; acte 1B temps 8, le curseur du seuil | Le visiteur entend deux nombres qui se contredisent à une demi-seconde d'intervalle, et le verdict qui accompagne est celui d'un réglage précédent. L'annonce se remet d'aplomb une seconde après le dernier geste, mais tout ce qui est entendu pendant la manipulation est faux, au moment même où le site enseigne le tout ou rien | Entrer, défiler jusqu'à ce que `[data-interaction=seuil]` soit à 0,6 hauteur d'écran, mettre le focus sur `#curseur-seuil`, envoyer cinq flèches droite espacées de 0,45 s, et lire après chaque flèche la valeur, l'`aria-valuetext` et `[data-annonce-seuil]` |

**La couleur**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| `css/tokens.css` l.57 et `css/base.css` l.498 ; tout temps où une partie est désignée | La partie que le site est en train de montrer devient la moins visible de l'écran : au temps des terminaisons, les branches et les renflements désignés sont plus pâles que la cellule d'en face, qui n'est pas le sujet. Le lecteur qui cherche où regarder est attiré par le mauvais élément | Entrer, cliquer « 1. Dendrites », puis figer l'état avec `document.getElementById('p-dendrites').classList.add('surbrillance')` et mesurer |
| `css/tokens.css` l.91 et l.95, partout où la surbrillance et le signal sont à l'écran ensemble, le temps 1A étant le plus net | Un protanope, un deutéranope voit les branches désignées, les flèches du signal et le bloc derrière le mot-clé du même bleu. Pour ces visiteurs, les dendrites ont l'air de se déplacer, et le magenta, qui ne devait rien signifier, se met à signifier signal | Entrer, cliquer « 1. Dendrites », figer l'état, puis appliquer `Emulation.setEmulatedVisionDeficiency` en `protanopia` puis en `deuteranopia` et capturer |

**Sans JavaScript**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| `index.html` l.474 à 493, le défi du chronomètre, valeur initiale l.478 | Le visiteur lit « Ajoute de la myéline jusqu'à ce que le message arrive à temps », voit le curseur se déplacer réellement, et le chronomètre reste bloqué sur 0,51 s en face d'un objectif affiché à 0,02 s. Deux paragraphes plus bas il lit « Voilà pourquoi ça va si vite » alors que le seul chiffre à l'écran dit le contraire | 390 × 844, scripts désactivés, aller à y=6792, cliquer six fois sur « Ajouter », puis pousser le curseur à fond aux flèches, et relire le texte du bloc |
| `index.html`, les 13 commandes de la page, dont `[data-entree]`, les cinq `[data-vers]`, les quatre boutons des curseurs, les deux `input[type=range]`, les deux `[data-rejouer]` et `[data-bascule-mouvement]` | Toutes les commandes restent à l'écran et paraissent actives, et aucune ne fait quoi que ce soit. Pire pour les deux curseurs : le pouce natif se déplace vraiment, ce qui promet une réaction qui ne vient jamais. Le bouton « Réduire les animations », posé là pour WCAG 2.2.2, ne réduit rien | 390 × 844, scripts désactivés : cliquer le bouton magenta en haut de page, puis « 1. Dendrites » à y=1065, puis cinq fois « Plus » à y=4899, puis « Réduire les animations » |
| `css/base.css` l.516, 517 et 540, `min-height: 74svh` et `padding-top: 12svh` non limités à `html.js` | Onze blocs gardent une hauteur minimale destinée à la révélation au défilement, qui n'a plus lieu : 3985 px de vide forcé, près de cinq écrans de téléphone, et huit bandes de 283 à 569 px sans une ligne de texte ni un trait de dessin | 390 × 844, scripts désactivés, défiler de y=2000 à y=4800 puis de y=8100 à y=10500 ; ou relever pour chaque `.etape-texte` la hauteur du bloc et celle de son `.etape-contenu` |
| `css/base.css` l.203 à 226, `.barre` en `position: fixed` avec son bouton opaque | Le bouton fixe occupe la bande de 8 à 52 px sous le haut de l'écran sur 193 px de large, la moitié de la largeur. Tout texte qui passe dessous devient illisible le temps qu'on défile | 390 × 844, scripts désactivés : à y=398 la phrase « Ton cerveau vient de commander le mouvement de ton doigt. » a sa fin cachée ; à y=1345 le chronomètre « 0,02 s » n'a plus que son premier caractère visible |

**Le tactile**

| Où | Ce que ça casse | Comment le reproduire |
|---|---|---|
| `index.html` l.65, le bouton d'ouverture. Empilement en cause : `css/base.css` l.724 enfermé dans l.347, et `.pile-bas`, de même `z-index` mais plus loin dans le document, passe devant | Le premier geste du site, et le seul qui déverrouille le défilement, échoue sans aucun retour quand le doigt se pose sur le tiers bas du bouton. Le bouton est peint sur 66,5 px de haut, il n'en répond que 41, et rien ne bouge, pas même l'enfoncement de `:active`. Cible effective 147,8 × 41 px. Ne se produit pas en mouvement réduit | 390 × 844, page fraîche : taper au milieu horizontal du bouton magenta à 6 px de son bord bas, coordonnées (195, 580) : rien. Taper ensuite au milieu, (195, 553) : la classe passe à `js entre` et la page défile jusqu'à 1477 |

### Les constats cosmétiques

| Chantier | Où | Ce que ça casse |
|---|---|---|
| A1 | Acte 0 temps 5 et la bascule, y de 4000 à 6000 | La plongée se joue une fois la phrase effacée, et 800 px défilent sans rien à lire : le visiteur peut croire la page finie |
| A1 | `#figure-titre`, enfant de la porte du neurone ; `index.html` l.186, `js/recit.js` l.791 | Aucun titre au dessus du dessin pendant tout l'acte 0, la bascule et l'acte 1 temps 1 ; au chargement, un lecteur d'écran lit « Le messager », qui ne désigne aucun dessin du site |
| A1 | `index.html` l.120, le cercle de la tête | La tête est un contour vide là où `02-CONTENU` demande une tache : le point de départ du trajet est moins immédiatement désigné |
| A2 | La surbrillance magenta des temps 4 et 6 ; `js/recit.js` l.714, `setTimeout` de 1800 ms | Elle s'efface seule avant que le visiteur ait fini de lire la phrase qu'elle accompagne, et l'état d'arrivée du temps est un dessin entièrement à l'encre |
| A2 | 1B, entre le temps 8 et le temps 9 ; `index.html` l.424 | Pendant 160 px de défilement, le cadre de la courbe et sa légende « La même impulsion, vue comme une courbe » sont affichés sans aucune courbe tracée |
| A2 | 1B temps 7, cadrage `130 133 140 175` | Le niveau de bleu monte bien, mais les messages qui le font monter sont hors du cadre pendant presque tout leur trajet |
| A3 | 1C temps 14 ; le seul chronomètre du bloc est masqué jusqu'au temps 16 | La lenteur de l'axone nu n'est jamais chiffrée, et la question à laquelle la myéline répond n'est pas posée |
| A3 | 1D temps 21 ; la phrase fait 163 px pour une fenêtre de 844 | Le mot « messagers » en magenta est sous le bord bas de l'écran au moment où les quatre messagers traversent |
| A3 | 1D ; `index.html` l.294, le tracé de la cellule d'en face n'a aucun contrôle d'opacité | L'arc et le vide sont déjà dessinés un temps avant la phrase qui annonce la surprise |
| A3 | 1C temps 16, le bloc du défi, 216 px de haut | La consigne apparaît mais le chronomètre, le curseur et les deux boutons sont sous le bord bas : il faut un cran de plus pour jouer |
| A4 | Acte 2, bas de `#recit`, y de 14602 à 15235 | Le dessin reste dans un état qui n'appartient à aucun temps : un rectangle bleu et une barre noire, non identifiables, et un cran de molette ne répare rien |
| A4 | Acte 2 entier ; `#figure-titre`, `js/recit.js` l.791 et l.342 | Le titre du schéma est mis à jour à chaque bloc mais reste invisible ; le seul moment où il se voit est le fondu d'entrée, où il s'imprime sur une phrase de l'acte 1 |
| A4 | Acte 2 temps 23, vue `muscle` ; `js/recit.js` l.75 | L'état décrit pour le temps 23, la silhouette entière à l'encre sans trajet allumé, n'existe à aucun moment : seule la chaîne revient |
| A5 | Zoom 200 %, `.figure-titre` et `.neurone` ; vues soma, terminaisons, clic | Le titre passe sur deux lignes et le dessin est tracé par dessus : les dendrites barrent le mot CELLULAIRE, l'axone barre le mot TERMINAISONS |
| A5 | Paysage 844 × 390 ; `.rails`, `css/base.css` l.290 | Le récit passe en 43 crans contre 70 : un cran avance d'un demi temps, et à quatre blocs sur onze la caméra est déjà sur la partie suivante au cran où la phrase apparaît |
| B | `index.html`, `<head>` l.3 à 21 : aucune balise `<link rel="icon">` | L'onglet n'a pas d'icône, et qui ouvre la console au premier chargement d'une origine voit une erreur rouge sur un site qui n'en produit aucune |
| B | `sections/01-anatomie.html`, 159 lignes, 8 267 octets | Fichier jamais servi ni lu : une correction faite là n'aurait aucun effet sur le site, et la duplication de contenu peut faire diverger la source de vérité |
| C | `css/base.css` l.800, `.silhouette` sans repli de hauteur pour `html.no-js` | Sans script, la silhouette, premier dessin du site, ne tient jamais entière sur l'écran : il faut défiler à l'intérieur du dessin |
| C | `css/base.css` l.150 à 155, le `summary` de l'alternative textuelle | La seule alternative textuelle ne ressemble pas à une commande : ni triangle, ni contraste, exactement l'apparence d'une légende |
| D | `index.html` l.25 et l.33, `<main id="contenu">` sans `tabindex="-1"` | Le lien d'évitement remplit son office, mais le focus lui même n'a pas bougé : un lecteur d'écran qui suit le focus reste au début de la page |
| E | `css/base.css` l.499, les trois renflements en surbrillance | Désigner un renflement revient à l'effacer : aplat noir franc vers rose pâle de même taille, presque invisible en noir et blanc, alors que c'est d'eux que parle la phrase |
| E | `css/base.css` l.590, `accent-color` des deux curseurs | L'outil qui pose la gaine verte est peint dans le bleu réservé au signal, et c'est l'objet le plus saturé de l'écran à ce moment là |
| F | `js/recit.js` l.970, `window.__parcours` déclaré après le retour anticipé du mouvement réduit | Rien pour le visiteur. Mais le crochet de mesure annoncé par le protocole n'existe pas dans le mode où l'on en a le plus besoin : un contrôle qui s'y fie lira `undefined` au lieu d'échouer franchement |
| G | `index.html` l.108 à 112, le `<desc>` de la silhouette | Au temps 2, la description parle déjà du trait bleu du temps 3 : la réponse avant la question. Elle ne dit jamais rien de la chaîne ni du faisceau, que le même SVG affiche ensuite |
| G | La même description, `index.html` l.108 à 112 | Elle est écrite sans accents, sur la seule phrase qui dit à un visiteur aveugle ce qu'il y a à l'écran. Les deux autres descriptions sont correctement accentuées |
| G | `index.html` l.47 et l.63, un `h2` en `sr-only` avant le `h1` | Le parcours par les titres commence par un titre que personne d'autre ne voit, puis le niveau passe de 1 à 3 sans `h2` intermédiaire : les six parties du neurone sont rattachées à rien |
| G | `css/base.css` l.622 ; `index.html` l.422 et 492 | Les deux régions d'annonce des moments interactifs n'existent pas dans l'arbre d'accessibilité au chargement ; elles y entrent au défilement, avant que le visiteur puisse agir. À confirmer au lecteur d'écran réel |
| G | `index.html` l.65, 545 et 707, les trois boutons `.bouton-entree` | Trois boutons différents portent exactement le même nom, « Clique » : rien ne les distingue dans la liste des boutons d'un lecteur d'écran |
| G | `index.html` l.106, 190 et 427, les trois `aria-labelledby` | Le nom accessible de l'image devient le titre suivi de toute la description, qui reste par ailleurs la description : selon la verbosité, soixante mots lus deux fois de suite pour le neurone |
| H | `css/base.css` l.203 à 226, la boîte du `<header class="barre">`, 225,5 × 60 px pour un bouton de 193,5 × 44 | Une bande transparente de 16 px à gauche du bouton de réglage, et deux bandes de 8 px, avalent le doigt : le visiteur vise un texte lisible, appuie, et rien ne se passe. Le coût est un appui à refaire |

### Les constats non reproduits

Treize constats de la première vague n'ont pas été retenus.

| Chantier | Le constat | La raison du contre-vérificateur |
|---|---|---|
| A1 | Acte 1 temps 2 : le neurone se trace sans sa phrase, au dessus d'un écran vide | Réfuté. La phrase est lisible dès y=6750 et la vue ne bascule qu'à y=6900 : l'événement arrive 150 px après sa phrase, et celle ci ne passe sous le fond du dessin qu'à y=7171. Le phénomène ne tient qu'à la cadence choisie, 500 px/s, à laquelle aucun texte du site ne se lit |
| A1 | Acte 1 temps 1, à 390 × 660 : la phrase disparaît au moment où la chaîne finit de se former | Réfuté. La phrase devient lisible à y=4800, la chaîne atteint 1 dès y=4900, et la phrase ne passe sous le fond qu'à y=5100 : elle disparaît 200 px après, pas au même moment |
| A2 | 1B temps 9 : la ligne du seuil n'est pas dessinée si l'on ne touche pas au curseur | Réfuté comme défaut, la mesure étant exacte. `02-CONTENU` ne demande aucune ligne de seuil dans le dessin à ce temps : sa colonne Graphique demande que la courbe reste affichée et qu'une poussée redéclenche une impulsion identique |
| A4 | À y=9500, le dessin continue de bouger tout seul pendant dix secondes | Réfuté. La mesure se reproduit mais l'interprétation est fausse : le dessin termine une animation déclenchée par le défilement, puis zéro pixel change entre 13,2 s et 23,8 s, et entre 23,8 s et 34,3 s. Atteint après un passage par y=8900, il est immobile dès la première paire |
| B | Les deux greffons `<script src="assets/vendor/...">` sans paramètre `?v=` | Fait exact, effet annoncé réfuté par la mesure. Le constat oublie la police, non versionnée elle aussi, et donne 11 modules JS là où le dépôt en contient 7 |
| B | `ScrollTrigger.min.js` et `MorphSVGPlugin.min.js` sont orphelins | Faits exacts, qualification d'orphelin réfutée. La ligne B4 définit l'orphelin comme « référencé nulle part » ; ces deux fichiers sont nommés et leur présence expressément justifiée, trois fois, dans les documents du dépôt |
| D | L'anneau de focus est coupé quand l'élément touche un bord de la fenêtre | Réfuté comme défaut, la mesure géométrique étant confirmée. Dans la reproduction directe l'anneau n'est coupé d'aucun côté ; le cas ne survient qu'au bord bas, l'anneau reste lisible et l'élément repéré |
| E | Le magenta devient la marque du « juste » et le vert celle du « réussi » | Réfuté. Les relevés sont exacts, mais aucun des deux jetons ne sort de sa définition : le magenta est déclaré « regarde ici » et ne désigne aucune notion scientifique |
| E | Deux bleus différents cohabitent, indiscernables en noir et blanc | Réfuté. Les mesures sont justes, la conclusion ne suit pas : l'anneau de focus lu dans la capture donne `#6D6D6D` en achromatopsie contre `#727272` pour le signal, et les deux formes ne se confondent pas |
| E | Huit jetons de couleur restent déclarés et commentés comme actifs | Réfuté en tant que défaut du site. Le comptage est exact, aucun des huit n'est employé, et l'auditeur écrit lui même « rien pour le visiteur aujourd'hui », ce que le champ « ce que ça casse » exige de remplir |
| E | Trois valeurs de couleur écrites en dur hors de `tokens.css` | Réfuté, et la conséquence annoncée est fausse, mesurée : un changement de `--paper` ne fait pas fondre les deux dégradés vers un blanc étranger |
| E | Le seul orange du site tient sur quatre ronds de 3,5 px, illisible comme couleur | Réfuté : la mesure a été prise pendant que la caméra zoomait encore. À l'état d'arrivée, la fenêtre du SVG passe de 119 à 228 px de large et les cercles changent de taille |
| G | Le `<desc>` du neurone ne suit pas le dessin et ne décrit ni la myéline ni les messagers | Réfuté. Ce que le constat déclare décrit nulle part l'est à trois endroits, dont le `<details class="alt-text">` de `index.html` l.553 à 573, exposé dans l'arbre d'accessibilité, qui nomme la gaine de myéline, les messagers chimiques et le seuil |

### Chantier A, temps par temps

Les tableaux des portées A1 à A5 fusionnés dans l'ordre du récit. Relevés à
390 × 844 sauf mention de taille, portée par portée : A1 l'acte 0, la bascule et
l'acte 1 temps 1 à 3 ; A2 les parties 1A et 1B ; A3 les parties 1C et 1D ; A4
l'acte 2 et le retour du quiz ; A5 les cinq tailles. Une ligne par temps, même
quand l'écart est vide.

| Temps | Phrase | Attendu | Constaté | Écart |
|---|---|---|---|---|
| Acte 0, t1 | « Clique sur ce bouton. » | Un bouton magenta seul au milieu d'un écran vide, rien d'autre, aucun texte ne suit avant le clic | Bouton magenta #FF6EF5 centré, phrase au dessus, aucun autre texte ni dessin. Deux crans de molette avant le clic laissent y=0 et toutes les opacités inchangées | |
| Acte 0, t2 | « Ton cerveau vient de commander le mouvement de ton doigt. » | Silhouette de face, unisexe, au trait, une tache pour la tête, pas encore de trajet | Apparaît au cran 05 en même temps que sa phrase, silhouette au contour sans visage ni marque de genre, tracé à 0. Immobile à 10 s, encre identique | La tête est un cercle au trait, non rempli, là où `02-CONTENU` demande une tache. En paysage, la silhouette ne fait plus que 210 px de haut sur un écran de 844 de large |
| Acte 0, t3 | « Un message est parti de là-haut, et il est descendu jusqu'à lui. » | Le trajet apparaît ici : un trait bleu se dessine de la tête vers le doigt | Phrase au cran 10, le tracé démarre au même cran à 0,03 et atteint 1,00 au cran 15, exactement sur la fenêtre de sa phrase, sens tête vers main | À 390 × 660 le trait est encore à 2 % au cran de sa phrase, contre 11 % à 844. En paysage et au zoom 200 %, plus d'un tiers est déjà dessiné quand la phrase arrive |
| Acte 0, t4 | « Ça a pris deux centièmes de seconde. » | Le même trait, le temps s'inscrit à côté, aucun élément nouveau | Phrase au cran 15, la légende « 0,02 s » passe de 0,00 à 0,97 au même cran puis à 1,00 et reste. Le trait est complet et ne bouge plus | La légende est posée sous le dessin et non à côté, contrainte de la colonne unique du téléphone, sans conséquence. En paysage, deux crans seulement séparent t3 de t4, contre cinq à 390 × 844 |
| Acte 0, t5 | « Sais-tu comment ? » | La silhouette s'efface sauf le trait, la caméra plonge dans le trait jusqu'à ce qu'il remplisse l'écran | Le corps passe de 1,00 à 0,09 au cran de la phrase puis à 0,00 : le trait bleu reste seul, conforme. Mais le cadrage reste `0 0 300 700` jusqu'au cran 26 et n'atteint `138 72 24 56` qu'au cran 30 | La plongée, seconde moitié de la colonne Graphique, se joue sept crans (1400 px) après la phrase et s'achève alors qu'aucun texte n'est à l'écran. En paysage elle tient en trois crans |
| La bascule | (sans texte) | La caméra plonge dans le trait, sans écran blanc ni recouvrement de l'ancien texte par le nouveau | Les cinq temps de l'acte 0 s'effacent ensemble des crans 25 à 27 ; le cadrage passe de `0 0 300 700` à `138 72 24 56` sur les crans 27 à 30 et le trait grossit en bande. Jamais d'écran blanc, encre de 0,0076 à 0,0336. Aucun recouvrement texte contre texte, dans les deux sens. Le neurone ne s'affiche à aucun moment | Quatre crans consécutifs, 800 px à 390 × 844 et 1000 px à 390 × 930, sans aucun texte à l'écran. En paysage, la bande ne remplit jamais la colonne, le dessin étant plafonné à 105 px de haut |
| Acte 1, t1 | « Ce chemin n'est pas un fil. C'est une chaîne de cellules, mises bout à bout. » | Le trait devenu large se révèle composé de plusieurs formes alignées | Phrase au cran 31, la chaîne monte au même cran de 0,00 à 1,00 : trois cellules, cercle et trait, alignées dans la bande bleue. Immobile à 10 s | Aucun titre de schéma n'accompagne ce temps. Au zoom 200 %, la dernière ligne de la phrase est hors champ |
| Acte 1, t2 | « En voici une. On l'appelle un neurone. » | Une cellule s'isole et le neurone se dessine à sa place ; le mot « neurone » en magenta au même instant | Phrase et mot magenta au cran 34, ensemble. L'isolement se joue au cran 35, phrase encore lisible. Le tracé du neurone ne commence qu'au cran 36 et s'achève au cran 37, quand la phrase est sous le fond du dessin. Le neurone obtenu est complet et conforme | En défilement continu lent, la seconde moitié de l'événement se joue après que la phrase est passée sous le dessin. Si le visiteur s'arrête, le tracé s'achève en 1,2 s avec la phrase encore lisible. En paysage, la caméra est déjà passée au plan d'ensemble un cran plus tard |
| Acte 1, t3 | « Il est très fort pour une chose... Suivons ce message, dans l'ordre. » | Les boutons du parcours apparaissent ici, et pas avant | Titre de partie au cran 37, paragraphe et cinq boutons ensemble au cran 38, phrase lisible. Avant ce cran, vérifié à quatre positions : `nav` à opacité 0 et `pointer-events: none`, et un clic à l'emplacement d'un bouton ne l'atteint pas. Arrivée par le bouton « Vue entière » : état identique champ pour champ | Au zoom 200 %, bloquant : plus aucun texte du récit n'est lisible et un bouton du parcours est inatteignable. En paysage, il ne reste que 62 px de zone de lecture contre 393 à 390 × 844 |
| 1A, titre | « Les dendrites / Là où les messages arrivent » | Titre en encre noire, sous-titre en encre douce ; le titre du schéma nomme la partie regardée | Titre et sous-titre conformes. Le titre de partie se révèle à 7990, le titre du schéma ne passe à « Les dendrites » qu'à 8130 | 140 px de défilement entre les deux : pendant un cran de molette, les deux titres se contredisent |
| 1A, t4 | « Le message arrive par le haut, dans ces branches fines. On les appelle les dendrites. » | Caméra sur les dendrites, surbrillance magenta, mot en magenta au même instant, huit flèches bleues vers l'intérieur | Caméra `50 8 300 375` et surbrillance à 8130, huit flèches à l'opacité 1, présentes de 8130 à 8790 et nulles sur les autres vues. Mot magenta posé dès 8060 avec la phrase | Annotation 70 px après le mot magenta, 40 px à 660 et 90 px à 930. Surbrillance retirée seule au bout de 1,8 s, donc absente de l'état d'arrivée. En paysage, deux temps de deux blocs arrivent dans le même cran ; au zoom 200 %, l'annotation arrive sans sa phrase |
| 1A, t5 | « Elles collectent, et elles collectent beaucoup... des milliers d'autres neurones parlent à celui-ci. » | Des points bleus arrivent aux extrémités des dendrites, sporadiquement, et convergent vers le corps | Rien. Phrase révélée à 8200, `messages.children.length = 0` de 8200 à 8760, et toujours 0 après dix secondes d'immobilité | Événement graphique entièrement absent : aucun point bleu n'arrive jamais à ce temps |
| 1B, titre | « Le corps cellulaire / Là où le neurone décide de transmettre » | Titre en encre noire et sous-titre en encre douce ; le titre du schéma nomme la partie | Conforme. Titre de partie révélé à 8610, titre du schéma à 8760 | 150 px entre les deux, soit un cran de molette |
| 1B, t6 | « Tout ce que les dendrites ont récolté converge ici, dans le corps cellulaire. » | Caméra sur le corps cellulaire, surbrillance magenta, mot-clé en magenta dans le texte | Caméra `130 133 140 175` centrée sur le disque, surbrillance à 8760, mot magenta posé à 8690 avec la phrase | Annotation 70 px après le mot magenta ; surbrillance retirée à 1,8 s, donc absente de l'état d'arrivée |
| 1B, t7 | « Chaque message qui arrive le fait monter un peu. Un seul ne suffit jamais. » | Les points bleus arrivent, et à chaque arrivée le corps se remplit un peu de bleu par le bas, puis se vide | Déclenché au pixel près avec la phrase, à 8820. Trois messages, remplissage par le bas jusqu'à 0,55 du corps, puis vidage complet ; le dessin se fige 3,62 s après le cran et ne bouge plus des dix secondes suivantes | Les points sont hors du cadrage du corps pendant presque tout leur trajet : deux en vol et aucun visible à la capture |
| 1B, t8 | « Essaie. Fais monter le nombre de messages qui arrivent. » | Un curseur ; en montant, les messages arrivent et le niveau de bleu monte ; au passage du seuil, quelque chose part vers le bas en bleu et une courbe se trace à côté | Le bloc est masqué et injoignable à 8700 et 8900, visible et cliquable à 9000, sa phrase se révélant à 8960. Premier changement du dessin 9 ms après un clic réel. À la valeur 8 : huit points partent, chaque arrivée monte le niveau de 8,67 sur 52, le seuil est atteint au sixième, l'impulsion part vers le bas, la ligne du seuil apparaît, la courbe se trace sur 409 px, le corps revient à zéro | La courbe se trace pendant que sa figure est à une opacité effective de 0 : le visiteur qui agit au moment de sa phrase ne la voit jamais se tracer. En paysage, le curseur et son effet sur le dessin ne peuvent pas être vus ensemble ; au zoom 200 %, le curseur est dans l'ordre de tabulation sans être visible et le titre du schéma est barré par le dessin |
| 1B, t9 | « Il y a un niveau à atteindre. On l'appelle le seuil... elle part toujours pareil. » | La courbe reste affichée ; le curseur poussé plus haut redéclenche une impulsion identique | La courbe se trace au pixel près avec la phrase, à 9290, et reste tracée jusqu'à la fin du bloc. Poussé de 8 à 10 : seconde impulsion, même chemin, même durée, même annonce ; compteur d'impulsions 1 puis 2 | La ligne du seuil, que la phrase nomme, n'est dessinée que si l'on a touché au curseur ; et la figure de la courbe est restée affichée vide pendant les 160 px précédents |
| 1B, t10 | « Comme un interrupteur : tu peux appuyer doucement autant que tu veux... » | Aucun nouvel élément ; le texte s'ajoute sous les précédents | Phrase révélée à 9557, aucun changement du dessin : vue soma, viewBox inchangé, surbrillance vide, remplissage 0, courbe à 409, ligne du seuil inchangée entre 9700 et 9900 | |
| 1B, t11 | « Sauf que le neurone, lui, se rallume aussitôt. Prêt pour le message suivant. » | Le corps cellulaire revient à son état de repos | Phrase révélée à 9760. Le corps est déjà au repos depuis le temps 7 ou depuis le dernier geste sur le curseur ; rien ne se produit à l'arrivée de la phrase | Aucun événement à ce temps : l'état décrit est déjà celui du dessin, le retour au repos s'est joué plusieurs temps plus tôt |
| 1C, t12 | « Une fois partie, l'impulsion descend le long de l'axone... un seul axone. » | Caméra sur l'axone, surbrillance magenta, mot « axone » en magenta, l'impulsion descend en bleu | Phrase révélée à 10040. La caméra passe sur l'axone (`40 236 320 616`), le titre devient « L'axone », le bouton « 3. Axone » prend `aria-current` et la surbrillance s'allume à 10110, soit 70 px plus loin, le même cran. Aucune impulsion : `.impulsion` et `.impulsion-defi` restent à 0 et ne quittent pas `cx 246`. Le cadrage ne coupe pas l'axone | L'impulsion bleue du temps 12 n'existe pas. Le titre de partie apparaît 80 px avant la phrase, donc parfois dans le même cran qu'elle |
| 1C, t13 | « Cette impulsion est bien un signal électrique... un basculement qui se propage. » | L'impulsion avance par étapes visibles plutôt qu'en glissant | Phrase révélée à 10210, mot « électrique » sur fond magenta. Le dessin ne change pas : viewBox identique, aucune surbrillance, les deux impulsions à 0 et à leur position de départ, rien de créé | Aucun événement graphique. Rien n'avance, ni par étapes ni autrement |
| 1C, t14 | « Sur un axone nu, c'est lent. Beaucoup trop lent pour tes deux centièmes de seconde. » | L'impulsion descend lentement un axone à l'encre ; le chronomètre de l'acte 0 réapparaît et dépasse largement les deux centièmes | Phrase révélée à 10380 ; au même instant `.impulsion-defi` passe à 1 et descend de `cx 246` à `cx 840` en 2,52 s, puis disparaît. Immobilité vérifiée à 10 s. Le chronomètre de l'acte 0 reste à l'opacité 0 à tous les crans ; celui du défi compte bien de 0,00 à 0,51 s mais reste masqué jusqu'à 10650 | Aucun chronomètre visible : la lenteur n'est jamais chiffrée. Et si le visiteur a joué le défi puis remonte, la phrase se lit sous un axone couvert de six bandes vertes, sans impulsion |
| 1C, t15 | « D'où ceci : une gaine, posée par morceaux le long de l'axone. On l'appelle la myéline. » | La gaine se pose sur l'axone, en vert, par segments espacés, premier vert du site ; le mot « myéline » en magenta | Phrase révélée à 10520, mot sur fond magenta. Les six groupes `.gaines > g` restent à l'opacité effective 0, à ce cran et à tous les suivants. Le dessin montre un axone à l'encre nue | La gaine ne se pose pas. Le premier vert du site n'apparaît que si le visiteur actionne le défi, un temps plus loin |
| 1C, t16 | « À toi. Ajoute de la myéline jusqu'à ce que le message arrive à temps. » | Six segments, un chronomètre, une cible 0,02 s affichée en permanence, deux boutons et un curseur ; sept valeurs de 0,51 à 0,02 s | Le bloc devient visible exactement à son seuil, 10650, et redevient masqué en remontant. Les sept valeurs sont exactes, aux boutons comme au curseur poussé d'un coup. À six segments, le chronomètre passe sur fond vert et le mot est écrit, « Objectif atteint. », avec l'annonce en `aria-live`. Réaction mesurée 60 ms après le clic. Les segments sont bien des bandes vertes cernées d'encre, profil 0,6 / 2,75 / 0,6 px. Immobilité à 10 s vérifiée | Au seuil du temps, 82 px sur 216 seulement sont à l'écran : il faut un cran de plus pour jouer. Le nombre met jusqu'à 2,5 s à se stabiliser après un clic. En paysage le bloc est caché à 91 %, au zoom 200 % il est entièrement invisible |
| 1C, t17 | « Tu as vu ? Tant qu'il reste un bout à découvert... jusqu'à cinquante fois plus vite. » | Comparaison côte à côte : l'axone nu en fantôme et celui que le visiteur vient d'équiper, départ simultané | Phrase révélée à 10910. Rien ne change : viewBox inchangé, aucune surbrillance, aucun élément créé, aucune impulsion. Il n'existe dans le document qu'un seul tracé d'axone, et aucun élément fantôme | La comparaison côte à côte n'existe pas |
| 1C, t18 | « Voilà pourquoi ça va si vite. » | Le chronomètre retombe sur deux centièmes de seconde, en bleu | Phrase révélée à 11140. Le chronomètre ne bouge pas : 0,51 s si le visiteur n'a pas joué le défi, sinon la valeur qu'il y a laissée. Quand il affiche 0,02 s, c'est sur fond vert myéline, posé au temps 16, jamais en bleu | Le chronomètre ne retombe pas, et il n'est pas bleu |
| 1D, t19 | « Tout en bas, l'axone se divise en petites branches, chacune finie par un renflement. » | Caméra sur les terminaisons, surbrillance magenta | Phrase révélée à 11350. La caméra ne vise les terminaisons qu'entre 11420 et 11490, soit 70 px, après quoi le temps 20 impose le cadrage synapse. Sur vingt descentes, la vue « terminaisons » n'est atteinte avant la synapse que dix fois, et le cadrage n'a jamais le temps d'arriver. La surbrillance ne se voit qu'au temps 22. Pendant la phrase, le titre dit « L'axone » | Le cadrage et la surbrillance du temps 19 ne se jouent pas, et quand ils se jouent, la cellule d'en face est déjà dans le cadre, ce qui dévoile la surprise du temps 20. À 390 × 930 la vue est sautée, à 390 × 660 le titre et le temps 19 arrivent dans le même cran, au zoom 200 % le titre du schéma est barré par le dessin |
| 1D, t20 | « Et là, surprise : la cellule suivante n'est pas collée. Il reste un vide. » | Zoom sur un renflement, l'espace avec la cellule suivante devient visible, à l'encre | Phrase révélée à 11490 et cadrage synapse (`168 884 64 64`) imposé au même pas de mesure de 10 px : simultané. Titre « La synapse ». L'état d'arrivée montre le renflement, l'espace et l'arc de la cellule d'en face, tout à l'encre, sans aucun chiffre. La phrase est entière à l'écran pendant la transition. Immobilité à 10 s vérifiée | Sur cette vue, plus aucun bouton du parcours n'est marqué courant, et l'arc de la cellule d'en face était déjà visible au cadrage précédent |
| 1D, t21 | « Alors le message change de forme : il devient chimique... toucher la cellule d'en face. » | Les messagers, en orange fluo, traversent et atteignent la cellule suivante ; le mot « messagers » en magenta | Phrase révélée à 11590 ; les quatre cercles orange cernés d'encre sont créés au même instant et partent du renflement, en éventail, sur 0,9 s. Ils s'arrêtent à 919,4 alors que le bord de la cellule d'en face est à 940 : 6,9 unités parcourues sur 27,5. En remontant, les quatre messagers sont effacés. Immobilité à 10 s vérifiée | Les messagers n'atteignent pas la cellule d'en face : ils s'arrêtent dans le blanc, plus près du renflement que de la membrane. Le mot en magenta est sous le bord bas de l'écran au moment de la traversée |
| 1D, t22 | « Et de l'autre côté, tout recommence. » | La cellule suivante s'illumine en bleu à son tour, et le regard s'élargit sur la chaîne | Phrase révélée à 11800 ; au même pas de 10 px, `.suivante-bleue` passe de 0 à 1 et la caméra revient au cadrage des terminaisons, titre « Les terminaisons », avec la surbrillance magenta. La phrase est entière à l'écran pendant l'illumination. En remontant, la lueur retombe à 0 | Le regard s'élargit sur les terminaisons, pas sur la chaîne de cellules. Et la surbrillance magenta des terminaisons, due au temps 19, se joue ici, trois temps plus tard |
| Acte 2, t23 | « Le dernier maillon de la chaîne ne parle pas à un neurone. Il parle à un muscle. » | La caméra recule, la chaîne réapparaît, puis la silhouette de l'acte 0, à l'encre | Phrase révélée au cran y=12100. Au cran suivant la vue passe à `muscle`, la chaîne revient et le trait bleu redevient visible, phrase toujours lisible en clair. La caméra ne recule pas : viewBox figé à `138 72 24 56`, corps de la silhouette à 0. Pendant le fondu d'entrée, les deux dessins sont superposés et le texte de l'acte 1 se lit au travers | Le recul de caméra et la silhouette à l'encre n'arrivent qu'au temps 24 : l'état décrit n'existe jamais. Superposition des deux dessins et des deux textes pendant environ une seconde. En paysage, le temps du muscle ne dure qu'un cran |
| Acte 2, t24 | « Le muscle se contracte. Ton doigt appuie. » | La silhouette entière, le trajet allumé en bleu de la tête au doigt, exactement comme à l'acte 0 | Phrase et titre « Ton doigt » révélés au cran y=12700. Au cran suivant la caméra recule (`0 0 300 700`), le corps de la silhouette apparaît, la chaîne s'efface, le trajet bleu est entier de la tête à la main. Phrase entièrement lisible pendant le mouvement | En paysage et au zoom 200 %, le titre « Ton doigt » passe derrière le fond du dessin alors que son sous-titre reste affiché juste en dessous |
| Acte 2, t25 | « Une dernière chose... ton corps en a mobilisé des centaines, ensemble. » | Le trait bleu unique se démultiplie en faisceau | Phrase révélée au cran y=13300. Au cran suivant la vue passe à `faisceau` et `.faisceau` monte de 0 à 1 : plusieurs copies décalées du trajet apparaissent autour du trait. Phrase entièrement lisible pendant | En paysage, le faisceau n'est à l'écran que deux crans |
| Acte 2, t26 | « Tout ça, pour un clic. Pas mal, non ? » | Retour au bouton magenta du tout premier écran | Phrase et bouton magenta révélés au même cran, y=13900 ; la vue passe à `clic` au cran suivant, le dessin reste la silhouette avec son faisceau. Bouton bien magenta, texte noir, lisible. Le cliquer retrace le trajet de 0 à 100 % en 1,1 s | |
| Acte 3, le quiz | « Voilà. Tu sais maintenant ce qui s'est passé entre ta tête et ton doigt... » | Le bouton magenta réapparaît, cliquable ; le cliquer ramène au dernier bloc de l'acte 2 puis relance l'impulsion bleue | La phrase et le bouton ne sortent de l'attente qu'après la cinquième réponse. Le clic fait défiler de y=17620 à y=14170 en 0,8 s, puis le trajet se retrace de 0 à 100 % entre 1,0 s et 2,2 s. État d'arrivée identique à celui obtenu en défilant : vue `clic`, silhouette entière, faisceau visible | Au zoom 200 %, le quiz est la seule partie du site qui tienne |

**Les cinq tailles.** Le chantier A5 a refait le récit entier à 390 × 844
(70 crans), 390 × 660 (60 crans), 390 × 930 (75 crans), 844 × 390 en paysage
(43 crans) et 195 × 422 pour le zoom 200 %. Sur 85 relevés de bloc, 59 donnent
la même lecture qu'à 390 × 844 ; les 26 autres portent un écart propre à la
taille, repris ci dessus dans la colonne Écart du temps concerné. Aucun
défilement horizontal à aucune taille (`scrollWidth` égale `innerWidth` à chaque
cran) et aucune erreur de console à aucune taille.

### Les lignes du protocole, chantier par chantier

148 lignes au total, réparties entre les douze portées : **86 cochées, 51 non,
11 non mesurables**. Chaque portée a repris les lignes du protocole qui la
concernent et les a reformulées pour son périmètre.

**A1, l'acte 0, la bascule et l'acte 1 temps 1 à 3** (11 cochées, 4 non, 3 non mesurables)

| État | Ligne | Preuve |
|---|---|---|
| non | L'événement graphique commence quand sa phrase entre dans la zone de lecture, à un cran près, jamais avant | Conforme au cran près à l'acte 0 t2, t3 et t4. En défaut au t5, où la plongée arrive sept crans après la phrase, et à l'acte 1 t2, où le tracé du neurone s'achève après elle |
| non | La phrase est lisible pendant que son événement graphique se joue | Acte 1 t2 : au cran 37 le neurone est tracé à 100 % et la phrase est à top=102, sous le fond papier opaque qui descend jusqu'à y=355 |
| coché | L'annotation du dessin et le mot en magenta arrivent au même instant | Un seul mot magenta dans la portée, « neurone » au cran 34, fond `rgb(255,110,245)`, exactement au cran d'arrivée de sa phrase ; aucun magenta aux crans 00 à 33 |
| non | Le titre du schéma nomme la partie regardée et change en même temps que la caméra | Aux crans 31 à 34, `#figure-titre` porte bien « Une chaîne de cellules » mais son opacité effective vaut 0,00, étant enfant de `.porte-neurone` |
| coché | Jamais deux temps n'apparaissent ensemble | Suite des opacités des cinq temps de l'acte 0 au fil des crans : un seul passe de 0 à 1 par cran. Côté parcours, quatre crans distincts |
| coché | Remonter défait chaque événement dans l'ordre inverse, redescendre le refait | Encre identique aux cinq décimales entre descente et remontée, de y=200 à y=5800 |
| coché | Arriver par un bouton du parcours produit le même état qu'en défilant | Bouton « Vue entière » depuis y=9000 : y=7586, vue plan, neurone tracé à 100 %, encre identique à celle obtenue en défilant |
| coché | Sans défilement, rien ne bouge pendant au moins dix secondes | Quatre temps éprouvés, deux captures et deux relevés DOM à 10,2 s d'intervalle : encre identique au chiffre près |
| coché | Chaque animation a un état d'arrivée statique, conforme à la colonne Graphique | Vérifié par les quatre épreuves d'immobilité et par cinq captures de l'état d'arrivée |
| coché | La caméra vise la bonne partie et le cadrage ne coupe rien | Les vues chaîne, cellule et plan partagent `0 0 400 1000`, rien de coupé ; en fin de plongée, les trois cellules de la chaîne sont complètes |
| non | La bascule se joue sans écran blanc et sans recouvrement des textes | Pas d'écran blanc au sens strict, le trait bleu est peint sans interruption, et aucun recouvrement texte contre texte dans les deux sens. Mais quatre crans consécutifs sans aucun texte à l'écran |
| coché | Après le clic sur le bouton d'ouverture, quelque chose apparaît sans défiler | y=0 avant le clic, y=1477 six dixièmes de seconde après, sans aucun geste ; silhouette et phrase du temps 2 à l'opacité 1 |
| coché | Les boutons du parcours n'existent pas à l'écran avant l'acte 1 temps 3 | Relevé à quatre positions : opacité 0 et `pointer-events: none` calculés, et `elementFromPoint` au centre d'un bouton rend le texte situé dessous |
| coché | Le tout vérifié à 390 × 844, 390 × 660 et 390 × 930 | Les trois hauteurs passées à la molette sur toute la portée ; rails de 5908, 4620 et 6510 px, ordre des temps et seuils conformes |
| coché | Aucune erreur de console sur toute la portée | `window.__erreurs` vide aux 46 crans de la descente, aux 42 de la remontée et aux 43 de chaque hauteur ; collecteur éprouvé par un `console.error` volontaire |
| non mesurable | Vérifié à un zoom de 200 % | Le zoom navigateur ne se pilote pas depuis les commandes CDP mises à disposition |
| non mesurable | Vérifié en paysage | Hors portée A1, fixée à la mise en page téléphone de 390 de large |
| non mesurable | Les moments interactifs, les flèches afférentes, la synapse, l'acte 2, le bouton de fin du quiz | Hors portée A1, confié aux autres portées du chantier A. Aucune mesure faite, donc aucune conclusion |

**A2, les parties 1A et 1B** (8 cochées, 4 non)

| État | Ligne | Preuve |
|---|---|---|
| non | L'événement graphique commence avec sa phrase, à un cran près, jamais avant | Mesure au pas de 10 px. Là où l'événement existe, il arrive toujours après sa phrase et de moins d'un cran, 70 px à 390 × 844, 40 px à 660, 90 px à 930. Mais au temps 5, il n'arrive jamais |
| coché | La phrase est lisible pendant que son événement graphique se joue | La scène collée occupe y 0 à 440 sur 844 ; au déclenchement de la caméra dendrites la phrase est à y=710, au déclenchement soma à y=705 |
| non | L'annotation du dessin et le mot en magenta arrivent au même instant | Le mot magenta est posé par le CSS, donc il arrive avec sa phrase ; l'annotation arrive 70 px de défilement plus tard |
| coché | Le titre du schéma nomme la partie et change avec la caméra | `#figure-titre` passe à « Les dendrites » au même scrollY que le changement de vue, 8130, et à « Le corps cellulaire » à 8760, écrit dans le même appel |
| non | Jamais deux temps n'apparaissent ensemble | À 150 px par cran, celui qui arrive à 8200 révèle les temps 4 et 5 ensemble ; à 250 px, celui de 8900 révèle les temps 6 et 7 ; à 200 px, trois crans sur huit révèlent deux éléments |
| coché | Remonter défait dans l'ordre inverse, redescendre refait à l'identique | Descente 7800 à 9400, remontée, seconde descente : à scrollY égal, vue, titre, viewBox, flèches, ligne du seuil et temps révélés sont identiques |
| coché | Arriver par un bouton du parcours produit le même état qu'en défilant | « 1. Dendrites » dépose à 8211, vue dendrites, huit flèches à 1 ; un défilement jusqu'à 8211 donne exactement le même relevé. Idem pour « 2. Corps » |
| coché | Sans défilement, rien ne bouge pendant dix secondes | Le dessin se fige 1,21 s après le dernier cran au temps 5, 3,62 s au temps 7, 0,80 s au temps 9 ; dix secondes plus tard, relevé DOM identique au caractère près |
| non | Chaque état d'arrivée est celui décrit par la colonne Graphique | Les états sont bien statiques, mais trois ne sont pas ceux de `02-CONTENU` : au temps 5 rien n'est jamais arrivé, et aux temps 4 et 6 la surbrillance a disparu au bout de 1,8 s |
| coché | La caméra vise la bonne partie et le cadrage ne coupe rien | Dendrites `50 8 300 375`, les huit bouts et leurs flèches sont dans le cadre ; corps `130 133 140 175`, le disque est centré et entier |
| coché | Le moment interactif du seuil n'apparaît qu'avec sa phrase, et répond sans délai | Masqué et injoignable à 8700 et 8900, visible et cliquable à 9000, sa phrase se révélant à 8960 ; cible 201 × 44 px, premier changement du dessin 9 ms après un clic réel |
| coché | Les flèches du signal afférent sont là sur les dendrites et parties ailleurs | Opacité effective de `.afferents` à 1 de 8130 à 8760, retombée à 0 à 8790 quand la caméra passe au corps, 0 sur les vues plan, soma et axone ; huit chemins orientés vers l'intérieur |

**A3, les parties 1C et 1D** (10 cochées, 5 non, 3 non mesurables)

| État | Ligne | Preuve |
|---|---|---|
| non | L'événement graphique commence avec sa phrase, à un cran près, jamais avant | t12 conforme, 70 px. Mais t13, t15, t17 et t18 n'ont aucun événement graphique, et le cadrage du t19 est sauté, sa plage ne faisant que 70 px |
| coché | La phrase est lisible pendant que son événement graphique se joue | À l'instant du déclenchement, chaque phrase a son haut entre 755 et 763 px sur 844, donc au bas de l'écran et non sous le dessin, dont la zone opaque s'arrête à 451 px |
| non | L'annotation du dessin et le mot en magenta arrivent au même instant | t12 conforme, même cran. t13 « électrique » et t15 « myéline » : le mot arrive, aucune annotation n'arrive jamais |
| coché | Le titre du schéma nomme la partie et change avec la caméra | Sur 24 relevés de molette et 11 états d'arrivée, `figure-titre` correspond toujours à `vueActuelle()`, et change dans le même appel que le cadrage |
| non | Jamais deux temps n'apparaissent ensemble | Seuils mesurés au pas de 10 px : sept écarts sur douze sont inférieurs au cran minimal du protocole, 150 px (80, 140, 130, 140, 70, 140 et 100 px) |
| coché | Remonter défait dans l'ordre inverse, redescendre refait à l'identique | À la molette de -150 px, les temps partent dans l'ordre exactement inverse ; lueur bleue 1 vers 0, messagers 4 vers 0 ; état final de la redescente identique |
| coché | Arriver par un bouton du parcours produit le même état qu'en défilant | « 3. Axone » mène à y=10187, vue axone ; la même position atteinte à la molette donne un état identique. « 4. Terminaisons » mène à la vue synapse, et la molette au même endroit aussi |
| coché | Sans défilement, rien ne bouge pendant dix secondes | Trois temps éprouvés : relevé DOM identique à 10 s d'écart, aucune clé différente, et encre de capture identique au sixième chiffre |
| non | Chaque état d'arrivée est celui décrit par la colonne Graphique | Statiques, oui. Conformes, non : t15, t17 et t18 n'ont aucun état d'arrivée, et celui du t21 laisse les quatre messagers à 25 % du vide |
| non | La caméra vise la bonne partie et le cadrage ne coupe rien | Le cadrage lui même ne coupe rien, l'axone entier et les trois terminaisons tiennent dans leur vue. Mais la vue des terminaisons n'est atteinte qu'une descente sur deux |
| coché | Les deux moments interactifs n'apparaissent qu'avec leur phrase et répondent sans délai | Pour le défi du chronomètre, seul de la portée : visible exactement au seuil de son temps, y=10650, masqué de nouveau à la remontée, réaction mesurée 60 ms après le clic |
| coché | Les messagers ne traversent qu'avec leur phrase, la cellule d'en face ne s'illumine qu'avec la sienne | Messagers à 0 jusqu'au seuil du t21, 4 dès ce seuil, 0 en remontant ; `.suivante-bleue` à 0 jusqu'au seuil du t22, 1 ensuite, retombée en remontant |
| coché | Vérifié à 390 × 844, 390 × 660 et 390 × 930 | Balayage du cadrage au pas de 10 px aux trois hauteurs : les écarts sont les mêmes, et la plage où la caméra vise les terminaisons vaut 100 px à 660, 70 px à 844, 50 px à 930 |
| coché | Vérifié à un zoom de 200 % | À `innerHeight` 864, les mêmes plages existent mais la fenêtre du cadrage terminaisons passe à 790 px, donc le temps 19 n'est plus sauté. Aucune erreur de console |
| coché | Vérifié en paysage | À 844 × 390, le récit se déroule, les cadrages s'enchaînent, encre 0,0326, aucune erreur de console. La fenêtre du cadrage terminaisons y vaut 130 px, toujours sous le cran minimal |
| non mesurable | La bascule se joue sans écran blanc et sans recouvrement | Hors portée A3, qui couvre 1C l'axone et 1D les terminaisons. Non testé |
| non mesurable | À l'acte 2, la silhouette revient entière, le trajet allumé, puis le faisceau | Hors portée A3 |
| non mesurable | Le bouton de la fin du quiz ramène à la silhouette et rejoue l'impulsion | Hors portée A3 |

**A4, l'acte 2 et le retour du quiz** (11 cochées, 6 non, 2 non mesurables)

| État | Ligne | Preuve |
|---|---|---|
| coché | L'événement graphique commence avec sa phrase, à un cran près, jamais avant | Phrase t23 révélée à y=12100, chaîne revenue à 12250 ; t24 révélée à 12700, caméra et corps de la silhouette au cran suivant ; idem t25 et t26 |
| coché | La phrase est lisible pendant que son événement graphique se joue | Quatre captures regardées, une par temps : phrase entière en clair, hors du fond du dessin |
| non | Le titre du schéma nomme la partie et change avec la caméra | Le texte de `#figure-titre` change bien à chaque bloc, mais son opacité effective vaut 0 à tous les crans de l'acte 2 |
| non | Jamais deux temps n'apparaissent ensemble | Révélation conforme, un temps par cran de 150 px. Rendu non : à 0,15 s du cran d'entrée dans l'acte 2, les deux dessins et les deux textes se superposent |
| non | Remonter défait dans l'ordre inverse, redescendre refait à l'identique | L'acte 2 est conforme, le faisceau se défait, la caméra replonge, le corps s'efface. Mais la remontée par la frontière du temps 23 fait se recouvrir les textes et les dessins |
| coché | À l'acte 2, la silhouette revient entière, le trajet allumé, puis le faisceau, chacun avec sa phrase | Silhouette entière et trajet allumé au temps 24, faisceau au temps 25, captures à l'appui |
| coché | Le bouton de la fin du quiz ramène à la silhouette et rejoue l'impulsion | Le clic fait passer de y=17620 à y=14170 en 0,8 s, puis le trajet se retrace de 0 à 100 % entre 1,0 s et 2,2 s |
| coché | Le bouton de l'étape clic rejoue l'impulsion | Après le clic, le trajet se retrace de 0 à 100 % en 1,1 s, sans déplacer le défilement et sans erreur de console |
| coché | Quiz : une seule question au départ, empilement à chaque réponse | Au départ 1 visible, 0 répondue, puis 2, 3, 4, 5 après chaque réponse, et la phrase de fin sort de l'attente après la cinquième |
| coché | Quiz : verdict par un mot et une icône, explication dans tous les cas, changement de réponse possible, aucun score | Réponse fausse : « Pas tout à fait » avec une croix, explication affichée quand même. Changement pour la bonne réponse : « Bonne réponse », explication toujours là |
| non | Chaque état d'arrivée est celui décrit par la colonne Graphique | État statique oui, captures identiques au bit près après dix secondes. Conformité non au temps 23, où l'état décrit n'existe jamais |
| non | La caméra vise la bonne partie et le cadrage ne coupe rien | Conforme en défilant. Mais au delà de y=14601, le dessin reste au cadrage de plongée avec le corps à 1, un état qui n'appartient à aucun temps |
| non | Sans défilement, rien ne bouge pendant dix secondes | Conforme à quatre positions sur cinq, PNG strictement identiques. Non conforme à y=9500, hors portée, relevé au titre du contrôle des cinq positions |
| coché | Vérifié à 390 × 844, 390 × 660 et 390 × 930 | Même ordre, mêmes états de scène et mêmes cadrages aux trois hauteurs pour les temps 23 à 26 |
| coché | Vérifié à un zoom de 200 % | À 195 × 422 CSS : mêmes scènes, mêmes cadrages, même ordre, et chaque phrase des temps 23 à 26 est entièrement lisible au cran où son événement se joue |
| coché | Vérifié en paysage | À 844 × 390, les quatre blocs donnent les mêmes vues et les mêmes états de scène qu'à 390 × 844. Réserve cosmétique sur le titre « Ton doigt » |
| coché | Aucune erreur de console sur toute la portée | `window.__erreurs` relevé à chaque cran de tous les passages : toujours vide |
| non mesurable | L'annotation et le mot en magenta arrivent au même instant | Aucun mot en magenta dans la portée : les quatre blocs de l'acte 2 n'en contiennent aucun, et `02-CONTENU` n'en demande pas |
| non mesurable | Arriver par un bouton du parcours produit le même état qu'en défilant | Aucun bouton `[data-vers]` ne mène à la portée : les cinq visent plan, dendrites, soma, axone et terminaisons |

**A5, les cinq tailles** (8 cochées, 11 non, 1 non mesurable)

| État | Ligne | Preuve |
|---|---|---|
| non | Le tout vérifié à 390 × 844, puis à 390 × 660 et 390 × 930 | Les trois parcours complets sont faits, 70, 60 et 75 crans. 660 se comporte comme 844 ; 930 non, la vue des terminaisons y est sautée |
| non | Vérifié à un zoom de 200 % | À 195 × 422 : le bas des boutons tombe 67 px sous la fenêtre, hauteur de texte lisible 0 px aux 23 crans sur 23, bouton « 4. Terminaisons » hors écran |
| non | Vérifié en paysage | À 844 × 390, 43 crans : zone de lecture réduite à 62 px, hauteur lisible médiane 52 px et nulle à 2 crans sur 11 ; le défi de la myéline n'est lisible que sur 21 px |
| non | L'événement graphique commence avec sa phrase, à un cran près, jamais avant | Tenu à 390 × 844, 660, 930 et au zoom 200 %. Pas tenu en paysage, où un cran de 200 px vaut la moitié d'un temps |
| non | La phrase est lisible pendant que son événement graphique se joue | Hauteur de texte non recouverte : médiane 242 px à 844, 190 à 660, 285 à 930 ; en paysage, médiane 52 px, minimum 0 |
| coché | L'annotation et le mot en magenta arrivent au même instant | Constaté aux cinq tailles sur les captures de réveil : surbrillance de la partie et mot magenta présents sur la même capture |
| coché | Le titre du schéma nomme la partie et change avec la caméra | `vueActuelle()` et le texte de `.figure-titre` concordent à chaque cran des cinq journaux |
| non | Jamais deux temps n'apparaissent ensemble | Crans où plus d'une phrase passe d'invisible à visible : 8 à 390 × 844, 6 à 660, 8 à 930, 2 au zoom 200 %, 10 en paysage |
| coché | Remonter défait chaque événement dans l'ordre inverse | Aux cinq tailles, exactement onze étapes de disparition dans l'ordre inverse exact, sans aucun retour en arrière |
| non | Remonter ramène l'état exactement au départ | Aux cinq tailles, la remontée jusqu'à y=0 laisse un écran quasi vide, encre de 0,00541 à 0,00742 ; le bouton d'entrée n'est plus peint |
| non | Arriver par un bouton du parcours produit le même état qu'en défilant | « 4. Terminaisons » mène à la vue synapse et aucun bouton ne porte `aria-current`, à 390 × 844 et à 390 × 930 |
| non | Sans défilement, rien ne bouge pendant dix secondes | Trois temps mesurés : sur les dendrites, la classe `surbrillance` disparaît seule ; sur le corps cellulaire, la mesure est écartée par le contre-vérificateur |
| coché | La bascule se joue sans écran blanc et sans recouvrement | L'encre ne descend jamais à zéro, minimum 0,00673 à 930, 0,00712 en paysage, 0,00739 à 844 |
| non | La caméra vise la bonne partie et le cadrage ne coupe rien | Correct à 390 × 844, 660, 930 et en paysage. Au zoom 200 %, le titre passe sur deux lignes et le dessin est tracé par dessus |
| non | Les deux moments interactifs n'apparaissent qu'avec leur phrase et restent manipulables | Le défi de la myéline est lisible sur 216 px de ses 216 à 390 × 844, sur 21 de ses 241 en paysage, sur 0 de ses 360 au zoom 200 % |
| coché | Le bouton de la fin du quiz ramène à la silhouette et rejoue l'impulsion | Ramène le défilement de 15235 à 14170 à 390 × 844 et de 12538 à 11912 au zoom 200 %, vue `clic` dans les deux cas |
| coché | Le quiz se comporte pareil à toutes les tailles | Une question visible à l'arrivée, répondre en fait apparaître une deuxième, aucun chevauchement, aucune erreur de console |
| coché | Pas de défilement horizontal | À chaque cran des cinq parcours : 390/390, 390/390, 390/390, 844/844, 198/198 |
| coché | Aucune erreur de console à aucune taille | Collecteur posé avant le premier script de la page, vide en fin de parcours aux cinq tailles et après les cinq réponses du quiz |
| non mesurable | Comportement au doigt sur un vrai téléphone, en paysage et au zoom système | Demande un appareil réel. Le zoom 200 % est ici émulé par une fenêtre de 195 × 422, qui reproduit la surface CSS mais pas le zoom de page de Chrome |

**B, le socle** (3 cochées, 3 non)

| État | Ligne | Preuve |
|---|---|---|
| non | Le site se charge sans erreur de console, en local et sur l'URL en ligne | Zéro erreur JavaScript en local et en ligne, `window.__erreurs` vide au chargement puis à trois positions, collecteur éprouvé par test négatif, batterie passée 31 sur 31 au moment du relevé. Mais le journal du navigateur contient une entrée de niveau `error` à chaque chargement : 404 sur `/favicon.ico` |
| coché | Aucune requête ne part vers un domaine tiers, tout est local | 13 ressources en local, toutes sur `127.0.0.1:8000` ; 13 en ligne, toutes sur `gaspodt.github.io`. Aucun CDN, aucune police distante, aucun traceur |
| non | Chaque fichier CSS et JS porte son paramètre `?v=`, et le même partout | La valeur est unique et identique partout où elle existe, `c1a2e0d5`. Mais les deux greffons et la police n'en portent pas |
| non | Aucun fichier du dépôt n'est orphelin | Boucle sur `git ls-files`, 32 fichiers : trois ressortent à zéro référence, `sections/01-anatomie.html`, `MorphSVGPlugin.min.js` et `ScrollTrigger.min.js`. Le contre-vérificateur n'en retient qu'un, les deux greffons étant nommés et justifiés dans les documents. `README.md` et `.gitignore` ressortent aussi à zéro sur le nom exact mais sont bien cités |
| coché | Le HTML est bien formé : balises fermées, `id` uniques, `aria-labelledby` résolus | Vérificateur écrit pour l'audit : 342 balises ouvrantes, pile vide en fin de fichier, 35 `id` tous uniques, toutes les références résolues |
| coché | `index.html` est bien le produit de `outils-dessin-neurone.py` | Arbre propre avant l'essai, md5 relevé, générateur relancé, md5 identique après |

**C, sans JavaScript** (7 cochées, 1 non)

| État | Ligne | Preuve |
|---|---|---|
| coché | La classe de `<html>` est bien `no-js` et aucun script ne s'exécute | `Emulation.setScriptExecutionDisabled` posé avant `Page.navigate` ; le test est falsifiable, `index.html` l.19 contient un script en ligne qui poserait `js` |
| coché | JavaScript désactivé, aucune page blanche | Document de 14263 px, 21 captures de y=0 à y=13419 : pixels non blancs entre 0,01883 et 0,11559, jamais 0 |
| coché | Tout le texte de tous les actes et du quiz est lisible, dans l'ordre | 94 lignes non vides sans script contre 101 avec script tout déroulé ; l'alignement des deux suites ne montre aucune inversion |
| coché | Tous les schémas SVG sont visibles, en entier | Trois SVG, tous peints, aucun coupé : découpe exacte de chaque boîte puis mesure d'encre |
| non | Aucune information n'a disparu par rapport à la version avec JavaScript | Le texte est complet, les cinq explications du quiz comprises. Mais les six temps du défi du chronomètre, que `02-CONTENU.md` liste comme contenu à voir, ne sont jamais affichés : le texte du bloc reste mot pour mot identique après six clics et après le curseur poussé à fond, chronomètre toujours à « 0,51 s » |
| coché | Les alternatives textuelles s'ouvrent, `details` étant du HTML natif | Un seul `<details>`, à y=10515, ouvert par un vrai clic souris au centre du `summary` : `open` passe de `false` à `true` |
| coché | Le quiz est une liste de questions-réponses lisible | Cinq `fieldset`, légendes numérotées 1 à 5, trois choix chacun, et pour chacun une explication visible, préfixée de « Réponse. » |
| coché | Rien ne se recouvre, rectangles mesurés sans script | 85 blocs textuels feuilles, rectangles comparés deux à deux : aucune intersection de plus de 2 px dans les deux axes |

**D, le clavier** (4 cochées, 3 non)

| État | Ligne | Preuve |
|---|---|---|
| non | Tout le contenu est atteignable à la touche Tab seule | Page arrêtée au corps cellulaire, tabulation reprise depuis le début : le dixième Tab est sur le bouton Plus du seuil, le onzième saute à scrollY 14312, par dessus le défi du chronomètre |
| coché | L'ordre de tabulation suit l'ordre visuel | Balayage complet page révélée : bascule, bouton d'ouverture, les cinq boutons du parcours, les commandes du seuil, le bouton de fin de récit, le `summary`, puis les cinq radios du quiz dans l'ordre |
| non | Le focus est toujours visible, contour de 3 px | Le contour est bien déclaré et calculé partout. Mais sur les 18 arrêts du balayage complet, 6 ne peignent rien, à opacité effective 0 |
| non | Le focus n'est jamais recouvert par le dessin collé en haut | Au bloc de la myéline, deux Shift+Tab posent le focus sur le bouton Plus du seuil, que le navigateur amène à top 400 à 444 pendant que la barre des boutons occupe cette bande |
| coché | Aucun piège au clavier, on peut toujours ressortir d'un composant | Huit Shift+Tab consécutifs depuis le curseur du seuil remontent sans blocage ; après la dernière radio disponible, Tab passe au `body` puis repart |
| coché | Le lien d'évitement fonctionne et amène bien au contenu | Premier Tab sur page neuve : le focus est sur `a.skip-link`, descendu à l'écran ; Entrée change bien `location` |
| coché | Toute interaction pilotable à la souris l'est aussi au clavier | Ouverture, bascule du mouvement, boutons du parcours, deux curseurs et leurs boutons, radios du quiz aux flèches, deux boutons de la fin : tous éprouvés à la touche |

**E, couleur et daltonisme** (3 cochées, 5 non)

| État | Ligne | Preuve |
|---|---|---|
| non | Capture d'écran en noir et blanc : tout reste compréhensible | Le texte (17,40:1), les boutons, l'axone à l'encre, la gaine cernée, le trait du signal et les deux verdicts du quiz tiennent. La surbrillance ne tient pas : les branches et les renflements désignés sont rendus #A8A8A8, 2,38:1, pendant que la cellule d'en face, non désignée, reste noire. Le noir et blanc inverse le sens de la surbrillance |
| non | Simulation deutéranopie, protanopie, tritanopie : rien ne se confond | Cinq rendus du même instant, couleurs relevées en moyennant les pixels de chaque jeton. Protanopie : magenta rendu #659BF9, signal rendu #007DFE, rapport 1,42:1. Deutéranopie : 2,23:1. Le vert, l'orange et le bleu ne se confondent dans aucune des trois simulations |
| non | Contrastes mesurés : 4,5:1 pour le texte, 3:1 pour les traits | Tout le texte est conforme, de 6,90:1 à 17,40:1 ; le trait du signal est à 4,83:1 ; l'orange et le vert sont sous le seuil sur blanc mais cernés d'encre, et le filet porte le contraste. Un échec : `--accent` en trait de surbrillance, 2,39:1 sur blanc, et sous 3:1 dans les quatre simulations |
| coché | Le texte est noir partout, aucune couleur fluo n'est posée sur du texte | Relevé de toutes les déclarations `color:` du CSS : seulement `--ink`, `--ink-soft`, `--paper`, `--c-impulse-text`. Aucune écriture de `style.color` dans le JS |
| non | Seul le bleu du signal est employé en trait pur, le vert est une bande cernée, l'orange un aplat cerné, le magenta un fond | Vert conforme, un filet d'encre de 11 sous une bande de 7,5. Orange conforme, le cerne existe à la taille réelle. Magenta non conforme : `css/base.css` l.498 le pose en `stroke` pur sur les traits du dessin et l.499 en `fill` sans aucun cerne sur les renflements |
| coché | Chaque concept est identifié par couleur, forme et étiquette ensemble | Signal : trait, flèches ou points, plus le titre et le texte. Myéline : bande segmentée cernée, plus le mot surligné et le libellé du curseur. Messagers : quatre ronds cernés qui traversent |
| non | Aucune couleur n'est réutilisée pour un second concept | Relevé exhaustif, CSS, JS et générateur. `--signal` est cohérent sur le dessin mais sert aussi d'`accent-color` aux deux curseurs, dont celui qui pose la gaine verte ; `--accent` sert aussi au verdict « Bonne réponse » ; `--myeline` sert aussi au fond d'« objectif atteint » ; et `--c-impulse` est un second bleu, pour l'anneau de focus |
| coché | Le verdict du quiz et l'objectif du chronomètre sont dits par un mot, jamais par la couleur seule | Relevé DOM après réponse : « Bonne réponse » avec une coche, « Pas tout à fait » avec une croix, les deux icônes en `currentColor`, donc à l'encre |

**F, le mouvement** (9 cochées, 2 non)

| État | Ligne | Preuve |
|---|---|---|
| coché | Le bouton fonctionne dans les deux sens : classe, `aria-pressed`, libellé | Chargement : `js`, `false`, « Réduire les animations ». Clic 1 : `js reduce-motion`, `true`, « Animations réduites ». Clic 2 : retour. Les trois canaux changent ensemble à chaque clic |
| coché | Le choix est mémorisé d'une visite à l'autre | Le clic pose `localStorage neurone:mouvement='reduit'`, et après rechargement la classe, l'`aria-pressed` et le libellé sont ceux du mode réduit. Sens inverse vérifié aussi |
| coché | Le réglage système `prefers-reduced-motion` est respecté, classe posée sans clic | Instance lancée avec `reduire_mouvement=True`, stockage vide, aucun clic : classe posée. Le parcours entier dans ce mode donne exactement le même état que par le stockage |
| coché | Le choix explicite du visiteur prime sur le réglage système, et tient après rechargement | Système à `reduce`, un clic : classe retirée, stockage à `complet` ; après rechargement la classe reste absente. Le système ne reprend pas la main |
| non | En mode réduit, aucune information n'a disparu par rapport au mode normal, à l'état d'arrivée | Le texte est entier, les 33 temps des onze blocs sont à l'opacité 1 dès le chargement. Mais le dessin est hors champ aux onze blocs, et les messagers comme l'illumination de la cellule d'en face n'existent jamais |
| coché | En mode réduit, `window.__erreurs` reste vide à chaque bloc | Relevé aux 26 positions du parcours en mode réduit par le stockage et aux 26 par le réglage système : 0 partout. Le chantier A3 avait relevé quatre `ReferenceError` par descente sur le bloc des terminaisons, corrigées le 12 septembre ; les gestes décrits par le chantier F supposent tous cette correction |
| non | En mode réduit, le curseur du seuil fonctionne | Il répond à la souris, aux boutons et aux flèches, et la région `aria-live` suit. Mais l'annonce ment quand les clics s'enchaînent : à 8 messages elle dit encore « Pas assez pour partir » |
| coché | En mode réduit, le défi du chronomètre fonctionne | Six clics sur Ajouter portent les poses de 0 à 6, les six segments passent à l'opacité 1 et le chronomètre descend à 0,02 s avec « Objectif atteint » |
| coché | En mode réduit, le quiz fonctionne, et le bouton de la fin ramène à la silhouette | Chaque réponse fait apparaître la suivante et pose son explication, le verdict est un mot, et le bouton de la fin ramène bien à la silhouette |
| coché | Aucun clignotement au delà de 3 par seconde | Douze captures en 1,12 s au moment le plus chargé du site : en mode réduit l'encre vaut 0,14869 aux douze captures, sans la moindre variation |
| coché | Aucune durée écrite en dur dans une transition CSS | Les trois seules déclarations `transition` de tout le CSS passent par les jetons ; aucune propriété `animation`, aucun `@keyframes`, aucune durée en dur |

**G, les lecteurs d'écran** (3 cochées, 6 non, 1 non mesurable)

| État | Ligne | Preuve |
|---|---|---|
| coché | Chaque SVG informatif porte `role="img"`, un `<title>` et un `<desc>` liés par `aria-labelledby` | Trois SVG informatifs, tous conformes ; les six `id` existent et sont cités |
| non | Chaque `<desc>` décrit ce qu'on voit et ne répète pas la légende | Aucune ne recopie son titre ni sa légende. Mais celle de la silhouette décrit le trait bleu un temps trop tôt, ne dit rien de la chaîne ni du faisceau, et est écrite sans accents |
| non | Chaque animation ou activité a son alternative textuelle dépliable | Un seul `<details class="alt-text">` dans toute la page, à y=15140 d'un document de 16079 px, c'est à dire tout à la fin du récit |
| non | Les résultats des interactions et du quiz sont annoncés en `aria-live="polite"`, et la région existe avant que son contenu change | Huit régions, toutes présentes dans le DOM au chargement. Mais les deux régions des moments interactifs sont dans un sous-arbre masqué et n'entrent dans l'arbre d'accessibilité qu'au défilement |
| non | La structure de titres est continue, sans saut de niveau | Ordre réel : un `h2` en `sr-only`, puis le `h1`, puis six `h3`, puis un `h2`. Le niveau passe de 1 à 3 sans intermédiaire |
| non | Que reste-t-il comme titre principal après le clic d'ouverture | Le `h1` ne disparaît pas : sa boîte mesure encore 284 × 154 px et il reste non ignoré dans l'arbre, avec la consigne « Clique sur ce bouton. » |
| non | Les boutons du parcours portent `aria-current`, et la vue est annoncée | En défilant, les onze vues sont correctes et l'annonce suit. Par les boutons, quatre sur cinq seulement : « 4. Terminaisons » mène à une vue qui n'a pas de bouton |
| coché | Chaque contrôle a un libellé | Les 34 contrôles de la page ont un nom accessible non vide ; les quinze radios sont dans un `label` parent qui porte leur énoncé |
| coché | Tous les `aria-labelledby` pointent vers des `id` existants | Huit références, toutes résolues ; aucun `aria-describedby`, aucun `aria-controls` |
| non mesurable | À faire par l'utilisateur : VoiceOver et NVDA | Aucun lecteur d'écran n'est pilotable depuis cette machine. Tout ce qui précède est mesuré dans l'arbre d'accessibilité que Chrome expose, pas dans la restitution |

**H, motricité et tactile** (9 cochées, 1 non, 1 non mesurable)

| État | Ligne | Preuve |
|---|---|---|
| coché | Aucune interaction n'exige un glisser déposer | Recherche sans résultat de `pointerdown`, `touchstart`, `mousedown`, `dragstart`, `draggable` et `touch-action` dans le JS, le CSS et le HTML |
| coché | Chaque curseur a des boutons équivalents qui couvrent toute la plage | Clics réels au centre de chaque bouton : 10 clics de min à max et 10 de max à min pour le seuil, et la plage entière pour la myéline |
| coché | Toutes les cibles font au moins 44 × 44 px, mesurées | `getBoundingClientRect` de chaque cible au moment où elle est visible : lien d'évitement 193,6 × 48,5, bouton de réglage 193,5 × 44, et ainsi de suite |
| non | Toutes les cibles font au moins 44 × 44 px réellement atteignables | Grille de 7 × 7 points par cible : 49 sur 49 partout, sauf le bouton d'ouverture, peint sur 66,5 px de haut et ne répondant que sur 41 |
| coché | Les quinze radios du quiz : cible mesurée | Le bouton rond ne fait que 20 × 20 px, mais son `label` l'enveloppe sur 358 × 44 au moins et répond sur 49 points sur 49, preuve par un clic réel à 12 px du bord |
| coché | Aucune limite de temps : aucun minuteur qui retire un contenu ou ferme une possibilité | Trois minuteurs seulement dans le JS, dont celui de 1800 ms qui retire la surbrillance ; aucun ne ferme une possibilité |
| coché | La période réfractaire de 900 ms n'est pas un délai imposé au visiteur | Elle ne s'applique qu'au compteur interne : dix clics réels espacés de 120 ms font tous avancer la valeur, sans qu'aucun soit perdu |
| coché | Aucune limite de temps dans le quiz | Aucun attribut `disabled`, `readonly` ou `aria-disabled` dans `index.html`, aucun minuteur dans `js/quiz.js` ; après 25 secondes d'attente, rien n'est désactivé |
| coché | Aucune limite de temps sur les deux moments interactifs | Curseur laissé à 4 messages pendant 20 secondes : même valeur, même visibilité, même position, et le clic suivant donne 5 |
| coché | Les cibles gardent leur taille à 390 × 660, à 390 × 930 et en mouvement réduit | Mêmes dimensions, 44 px de haut, et 49 points sur 49 atteignables quand le bloc est entièrement dans l'écran |
| non mesurable | À faire par l'utilisateur : au doigt sur un vrai téléphone | Chrome headless émule la taille de la fenêtre et le rapport de pixels, pas le doigt |

### Reste à faire par l'utilisateur

Onze lignes de protocole sont marquées non mesurables : sept sortent de la
portée de l'agent qui les a lues, ou n'ont pas d'objet dans cette portée, et sont
couvertes ailleurs ; quatre demandent un appareil ou un logiciel absent de cette
machine. Ce qui suit rassemble ces quatre là et les réserves posées dans les
notes des auditeurs. Rien de tout cela n'est coché ni décoché : rien n'est
mesuré.

**Sur un vrai téléphone, au doigt.** La surface réelle de contact et l'écart
entre le point visé et le point touché ; le délai de 300 ms que certains
navigateurs mobiles ajoutent encore ; la barre d'adresse qui se rétracte,
change `innerHeight` en cours de route et déplace donc tous les seuils mesurés
ici ; la main ou le pouce qui masquent une partie de l'écran ; le glissement
accidentel qui transforme un appui en défilement ; un geste de balayage rapide
qui parcourt plusieurs centaines de pixels d'un coup ; et le comportement sur
iOS, aucun Safari n'étant disponible ici.

**Aux lecteurs d'écran, VoiceOver et NVDA.** Tout le chantier G est mesuré dans
l'arbre d'accessibilité que Chrome expose, c'est à dire la matière que ces
logiciels lisent, jamais leur restitution. Restent à entendre : l'ordre de
lecture réel ; la double lecture du nom et de la description des trois SVG ; la
prononciation de la description non accentuée de la silhouette ; le
comportement des deux régions `aria-live` qui n'entrent dans l'arbre qu'au
défilement ; et si le curseur et sa région se contredisent aussi nettement à
l'oreille qu'à la mesure.

**Sur un vrai écran, pour la couleur.** Le rendu couleur d'un écran de
téléphone, sa calibration, sa luminosité, son mode sombre ; et le rendu des
simulations de daltonisme chez de vraies personnes daltoniennes, les filtres
CDP n'étant qu'un modèle.

**Le zoom et le paysage sur un appareil réel.** Le zoom 200 % est ici émulé par
une fenêtre de 195 × 422, ce qui reproduit la surface CSS disponible mais ni le
zoom de page de Chrome, ni le rendu des polices à ce facteur.

**Le mouvement réduit d'un vrai appareil.** Le réglage « Réduire les
animations » d'un iPhone ou d'un Android n'a pas été essayé ; seule l'émulation
de `prefers-reduced-motion` par Chrome l'a été. La dégradation automatique sur
appareil lent (`js/a11y.js`, 45 images au delà de 34 ms en huit secondes) n'a
pas pu être déclenchée : le protocole exclut le test sur matériel ancien ou
bridé, et rien ne permet de forcer ce compteur sans toucher au dépôt.

**Les autres navigateurs.** Firefox et Safari ne sont pilotables ni par
`outils-test-navigateur.py` ni depuis cette machine. Le comportement du cache
réel d'un visiteur revenant après une mise à jour des fichiers `vendor` ne se
simule pas ici non plus. Sans script, le rendu dans un navigateur où
l'utilisateur a coupé JavaScript lui même, plutôt que par
`Emulation.setScriptExecutionDisabled`, n'a pas été vu ; ni le second filet de
sécurité, l'attribut `onerror` de `index.html` l.731, qui n'a pas été déclenché.

### Ce que l'audit ne dit pas

**Il ne dit pas si le site dit vrai.** Aucune ligne de ce rapport ne porte sur
l'exactitude scientifique du contenu. C'est un contrôle entièrement différent,
qui fait l'objet de `09-AUDIT-SCIENTIFIQUE.md`. Un site peut fonctionner
parfaitement et raconter des bêtises.

**Un piège trouvé par le chantier B, à signaler au projet.**
`window.__erreurs` ne voit **pas** les échecs de chargement de ressource. Le
collecteur de `outils-test-navigateur.py` l.316 à 331 écoute `error` sans
capture, or ces événements ne bouillonnent pas jusqu'à `window`. Constaté
exprès : en ajoutant une `<img src='/inexistant-abc.png'>` à la page, le journal
du navigateur signale bien un 404 tandis que `window.__erreurs` reste vide.
Autrement dit, **si demain `css/base.css` ou `js/recit.js` cessait d'être servi,
le contrôle « aucune erreur de console » resterait vert.** Le collecteur voit en
revanche bien les erreurs JavaScript, les promesses rejetées et `console.error`,
vérifié par test négatif. Toutes les lignes « aucune erreur de console » de ce
rapport sont donc à lire avec cette réserve.

**Les limites de méthode signalées par les auditeurs.**

- Le clignotement a été mesuré par la proportion de pixels non blancs d'une
  capture, pas par une photométrie : un clignotement de faible surface mais de
  forte luminance échapperait à cette mesure, même si l'absence de
  `@keyframes`, de `setInterval` et de boucle GSAP le rend très improbable.
- Le retard entre la phrase et son annotation a été mesuré à trois hauteurs,
  660, 844 et 930, et il varie avec elles, 40, 70 et 90 px : il dépend donc du
  téléphone réel.
- Les portées du chantier A se sont réparti le récit, et chacune a laissé hors
  de sa mesure ce qui appartenait aux autres. Les lignes marquées non mesurables
  pour cause de portée ne sont pas des lacunes de l'audit : elles sont couvertes
  ailleurs, sauf le zoom 200 % et le paysage pour A1, repris par A3, A4 et A5.
- Le chantier E n'a pas mesuré l'effet des couleurs sur de vraies personnes, et
  le chantier G n'a pas écouté un seul lecteur d'écran.
- La latence des gestes sur les deux moments interactifs n'a pas été
  chronométrée par le chantier A5 : seule leur visibilité a été mesurée.
- Le chantier B a travaillé sur `f88005f4` et le chantier D sur `3601190` : les
  deux corrections du 12 septembre séparent la campagne en deux, et les relevés
  de console du chantier F sont postérieurs à la correction de la
  `ReferenceError` trouvée par le chantier A3.
- Le poids transféré et le fonctionnement hors connexion n'ont pas été
  vérifiés : l'utilisateur les a retirés du protocole le 11 septembre 2026.
