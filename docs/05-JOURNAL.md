# 05 — Journal de bord

> **Ce fichier est mis à jour en continu, pas en fin de session.**
> Si un agent est interrompu, la section « État actuel » ci-dessous doit suffire
> à reprendre sans rien perdre. La tenir à jour est une obligation, pas une courtoisie.

---

## État actuel

**Dernière mise à jour :** 11 septembre 2026.
**En ligne :** <https://gaspodt.github.io/neurone/>

### Ce qui est implémenté

| | |
|---|---|
| **Le bouton d'ouverture** | Plein écran, centré, fond opaque. Rien ne se débloque tant qu'il n'est pas cliqué, pas même le défilement. Il se replie au clic |
| **La silhouette** | Pictogramme au trait, tête détachée, de face et neutre. Produite par symétrie à partir d'une moitié décrite point par point |
| **Une seule mise en page** | Celle du téléphone, partout. La version deux colonnes des grands écrans est supprimée le 11 septembre 2026, sur décision de l'utilisateur, pour tenir le calendrier. Sur ordinateur, la même colonne de 34 rem, centrée |
| **Silhouette et neurone exclusifs** | Ils partagent une case de grille et ne sont jamais visibles ensemble |
| **L'acte 0 entier, conforme à `02-CONTENU`** | Pièce 1, 11 septembre 2026. Temps 2 la silhouette seule avec la phrase sur le cerveau, temps 3 le trajet qui se trace avec « Un message est parti de là-haut », temps 4 « deux centièmes de seconde » [S1] avec le temps inscrit à côté, temps 5 la question et le corps qui s'efface **sauf le trait**. Le neurone n'arrive qu'à la bascule, en fondu avec le trait qui part. Vérifié capture par capture à 390 × 844 |
| **La transition centrale** | Pièce 2, 11 septembre 2026. À la bascule, la caméra **plonge dans le trait** (cadrage de la silhouette asservi au défilement) jusqu'à ce qu'il soit une large bande. Bloc « chaîne » : trois capsules abstraites dans la bande. Bloc « en voici une » : la bande et les autres capsules s'effacent, la capsule élue reste, le neurone se dessine à sa place. Bloc « plan » : les boutons arrivent, et pas avant. Remonter défait tout. Vérifié par capture |

### Ce qui n'est PAS implémenté

- **Le texte de l'acte 1 est encore l'ancien.** Les deux affirmations FAUSSES
  ont disparu avec la réécriture de l'acte 0 (« moins d'un centième » et « une
  impulsion, et une seule »). Restent les deux IMPRÉCISES, dans le parcours :
  « des milliers de messages en même temps » et « des centaines de dendrites ».
- Les deux moments interactifs, le retour au corps et le quiz.

### Un écart à connaître entre le code et les documents

`css/tokens.css` contient **les deux palettes en même temps**. L'ancienne,
dérivée d'Okabe-Ito, est encore utilisée par le reste du site ; la nouvelle,
fluo, a été ajoutée parce que le CSS écrit depuis référençait `--signal` et
`--accent` qui n'existaient pas, et le trajet de la silhouette se retrouvait
sans couleur définie. **L'ancienne disparaîtra quand tout le contenu sera
passé à la nouvelle**, pas avant.

Cet écart vient d'un retour en arrière sur le code du site qui n'a pas touché
aux documents. C'est le genre de dérive à surveiller après tout `git checkout`
partiel.

### Comment vérifier

**Ne jamais se fier aux opacités ni aux positions.** La méthode qui tient est
décrite dans `04-ARCHITECTURE.md` : compter les pixels peints, détecter les
chevauchements, et regarder les images, à trois tailles de fenêtre.

```bash
python3 -m http.server 8000 --bind 127.0.0.1 &
python3 outils-test-navigateur.py
```

### Ce qui a été décidé depuis la dernière session

| | |
|---|---|
| **Narration** | Réécrite de A à Z. Ouverture en 5 temps démarrant par **un bouton à cliquer**, puis le neurone partie par partie, chacune portant sa notion. Les actes séparés sur le repos, le seuil, la vitesse et la synapse sont **repliés dans l'acte 1**, faute de temps pour 3 minutes |
| **Audit de séquence** | **8 incohérences trouvées et corrigées**, dont le fait que le site ne disait nulle part que le signal est électrique alors que tout le code couleur reposait dessus |
| **Palette** | Refaite en **fluo**. Le texte reste noir, la couleur passe **derrière**, en surligneur. Seul le bleu électrique tient en trait |
| **Titres** | Encre noire, sous-titre explicite. **Aucun ornement, aucun filet** : demande explicite de l'utilisateur |
| **Sources** | [`10-SOURCES.md`](10-SOURCES.md). **11 fiches, toutes les valeurs sourcées.** Le sourçage a évité trois erreurs invisibles à l'œil nu, et conduit à ne PAS afficher cinq des six dernières valeurs |
| **Erreurs scientifiques** | **4 trouvées dans le site en ligne**, dont deux fausses |
| **Interactions** | Deux moments seulement, à chaque nœud du récit : le **curseur du seuil**, et le **défi du chronomètre** sur la myéline |

### Les erreurs scientifiques du site en ligne

Les deux **fausses** ont disparu avec la pièce 1, l'acte 0 réécrit. Les deux
**imprécises** sont encore dans le texte de l'acte 1, qui n'est pas réécrit.

| Affirmation | Verdict | Source |
|---|---|---|
| « moins d'un centième de seconde » | **faux**, facteur 2. La vraie valeur est 21,4 ms | [S1] |
| « une impulsion électrique, et une seule » | **faux**. Un geste mobilise des centaines d'impulsions | [S4] |
| « des milliers de messages en même temps » | imprécis | [S2] |
| « des centaines de dendrites » | imprécis | [S2] |

### Feuille de route, par pièces

L'ordre suit `02-CONTENU.md`. Chaque pièce est vérifiée par capture à
390 × 844 et montrée avant la suivante.

| Pièce | État |
|---|---|
| 1. Acte 0 conforme : silhouette, trajet, temps inscrit, trait seul | **fait**, 11 septembre 2026 |
| 2. La transition centrale : plongeon dans le trait, chaîne de capsules, « En voici une » | **fait**, 11 septembre 2026 |
| 3. Acte 1 : textes de 1A à 1D qui s'accumulent, boutons au temps 3, courbe déplacée au corps cellulaire | à faire |
| 4. Le curseur du seuil, 1B temps 8 | à faire |
| 5. Le défi du chronomètre, 1C temps 16 | à faire |
| 6. Acte 2, le retour au corps | à faire |
| 7. Acte 3, le quiz | à faire |
| **Agent d'audit technique** | avant-dernier |
| **Agent d'audit scientifique** | **après l'audit technique** |
| Parcours de démonstration 3 minutes | en dernier |

**Mesures du moment** : 14 contrôles sur 14 dans `outils-test-navigateur.py`,
mouvement réduit et sans JavaScript vérifiés par capture.

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

**Pièce 3 : l'acte 1.** Les textes de 1A à 1D de `02-CONTENU.md`, qui
s'accumulent à l'intérieur de chaque partie au lieu de se remplacer, les
titres et sous-titres des grandes parties, la courbe du potentiel d'action
déplacée au corps cellulaire, et la disparition des deux formulations
imprécises encore en ligne. Sans les deux moments interactifs, qui sont les
pièces 4 et 5.

---

## Historique des sessions

### 11 septembre 2026, soir : une seule mise en page

**Ce qui a été décidé.** Plus de version grand écran. L'utilisateur a tranché
sur le calendrier : « if the problem is to have both the mobile version and the
computer version, we will have only the mobile version, i dont have the time ».
Enregistré dans `00-CONTEXTE.md` et détaillé dans `04-ARCHITECTURE.md`.

**Trois défauts trouvés et corrigés avant cette décision**, tous les trois
invisibles aux mesures qui tournaient jusque là :

1. **La bascule traversait son propre texte.** Effacement du texte et montée du
   dessin étaient pilotés par la même valeur, donc simultanés : à mi-course, le
   titre de l'ouverture se lisait par-dessus le neurone. Séparés en deux temps
   qui ne se recouvrent pas, la place est libre avant qu'on l'occupe.
2. **L'origine du déplacement était fausse.** `offsetTop` se compte depuis le
   parent positionné ; l'ajout du conteneur `.visuels` a changé cette origine
   sans produire la moindre erreur. Le dessin remontait sous la barre. Mesuré
   désormais par rapport à la scène.
3. **Les phrases de l'acte 1 se coupaient en plein mot** sur grand écran, en
   passant sous le dessin opaque. Ce défaut n'apparaissait dans **aucune**
   mesure, et a été trouvé en regardant une capture. La suppression du grand
   écran le fait disparaître par construction.

**Ce qu'on a appris sur l'outillage**, et qui est écrit dans
`04-ARCHITECTURE.md` : le détecteur de recouvrements a des angles morts dans
ses deux versions. Comparer les boîtes signale des défauts qui n'existent pas
et en rate de réels. Interroger le point est plus juste mais ignore ce qui
porte `pointer-events: none` : il a été **mis en échec sur le défaut n°3
réintroduit exprès pour le tester**. Regarder les captures reste obligatoire.



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

### 10 septembre 2026 — Session 2 (suite) : le début du site est refait

Trois demandes de l'utilisateur, après avoir regardé le site.

**1. Le texte de l'ouverture doit s'EMPILER.** Chaque temps occupait presque
tout l'écran : un seul était visible à la fois, et on lisait une suite de
cartons. L'ouverture devient une scène collée dans laquelle les temps
s'ajoutent les uns sous les autres et restent.

**2. La courbe doit se TRACER**, comme sur un électroencéphalogramme. Le tracé
est asservi au défilement, pas joué en un temps donné : c'est le doigt du
visiteur qui déroule la ligne, ce qui le rend réversible sans une ligne de
code de plus.

**3. Le neurone doit apparaître dès l'ouverture, et être LE MÊME que celui du
parcours, sans coupure.** C'est la demande la plus lourde, et elle a une
conséquence d'architecture : l'ouverture et le parcours ne peuvent plus être
deux sections. Deux sections auraient imposé deux dessins. Ils n'en font plus
qu'une, avec une seule scène collée, et `js/apparitions.js` et
`js/parcours.js` fusionnent en `js/recit.js`.

Le neurone arrive après la phrase sur le cerveau, se dessine trait par trait,
puis grandit et remonte pour devenir l'objet du parcours. Sa taille
d'introduction est **calculée** à partir de la place réellement libre entre
les deux blocs de texte, pas écrite en dur : elle doit tenir sur un téléphone
comme sur un écran large.

**Quatre défauts trouvés en construisant, tous documentés dans
[`04-ARCHITECTURE.md`](04-ARCHITECTURE.md) :**

1. `svg.offsetHeight` n'existe pas, comme `element.hidden` avant lui. Le
   neurone d'introduction faisait 110 px au lieu de 219, sans aucune erreur.
2. Le porte-neurone avait **deux propriétaires** pour sa position, l'apparition
   et la bascule, et l'apparition gagnait. Le défaut ne se voyait qu'en
   sautant directement à une position lointaine, c'est à dire exactement ce que
   fait un test automatisé.
3. Deux `ReferenceError` de zone morte temporelle, en mode mouvement réduit
   seulement : la caméra ne fonctionnait plus pour exactement les visiteurs
   qu'on cherche à ménager.
4. Les deux replis, sans JavaScript et en mouvement réduit, affichaient bien
   tout le contenu mais **tout se chevauchait** : la scène collée enfermait six
   temps et un dessin dans un seul écran. Elle redevient un bloc de page
   normal dans ces deux cas.

**Deux corrections d'accessibilité au passage.** La barre du haut devient fixe,
car elle sortait de l'écran dès le premier défilement alors que WCAG 2.2.2 et
le critère 3.2.6 exigent que ce réglage soit atteignable à tout moment. Et la
page ne peut plus rester blanche si le JavaScript **casse** : la protection ne
couvrait que le cas où il est désactivé.

**Résultat : 12 contrôles sur 12**, 99 Ko sur un budget de 150.
