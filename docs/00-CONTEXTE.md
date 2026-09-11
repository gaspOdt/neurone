# 00 — Contexte du projet

> **Ce fichier est le premier à lire pour toute personne ou tout agent qui reprend ce projet.**
> Il contient le brief initial mot pour mot, puis le journal complet des décisions et de leurs raisons.
> Ne jamais résumer ni réécrire la section 1 : c'est la parole de l'utilisateur, elle fait foi.

---

## 1. Le brief initial, mot pour mot

Message d'ouverture de Gaspard Oudinot, le 10 septembre 2026. Quatre images de référence
étaient jointes (deux photos de pages d'un livre sur l'art et les neurosciences, en double).

> * Site internet, consultable aussi sur mobile (potentiellement la version mobile doit être celle qui marche le mieux)
> * Thème : vulgarisation de contenu scientifique
>    * Neuroscience, sujet pas encore fixé, libre au brainstorming dans un premier temps
>    * Idées : raconter le fonctionnement d'un neurone
>    * raconter comment l'information circule dans le cerveau, expliquer ce qu'est un potentiel daction
>    * Faire le lien entre les réseaux neuronaux (machine learning) et le système nerveux = mon sujet de thèse car j'utilise l'IA, le machine learning tout le temps dans mon projet de thèse
>    * Vulgariser la maladie de Charcot
> * Interactif, itératif, cliquer t'amène dans plusieurs directions, présence de quizz, de facts, beaucoup d'animations, ces éléments sont très importants pour moi. Ca doit etre trps ludique et informatif comme outil.
> * Public cible : jeunes collégiens (avec un portable), associations de patients, donateurs pour l'institut Imagine. A voir si on précise pour les collégiens /lycéens par exemple, pour se simplifier la vie
> * Besoin d'une grosse phase initiale de réflexion, brainstorming sur le but précis du site avant de commencer la conception concrète du site.
> * Esthéthique épurée, avec des éléments artistiques (je vais donner des références). Il faut chercher des outils pour faire du graphisme poussé pour un site internet, élément important. Des éléments qui apparaissent quand on scroll sur la page,
> * J'ai deja un github perso. Créer un repo dans celui ci
> * Besoin d'une documentation très robuste au cours de la conception, à chaque étape car j'ai besoin que d'autres agents puissent avoir le contexte complet et reprendre en cours de route.
> * Besoin d'un hébergement de site gratuit (au moins un mois), je ne connais pas quells sont les options
> * Besoin d'un agent testeur en fin de production qui va aller tester que le site marche parfaitement, qu'il n'y ait aucun bug.
> * Il faut me poser beaucoup de questions tout au long de la conception, et particulièrement dans la phase initiale
> * Je n'ai pas de connaissances poussées en html, css..etc mais je sais bien coder en python

Et, dans le même message, sur les références visuelles :

> In the idea, I want to do that, in terms of visual, it is a lot of themes of neuroscience, images, iconography of neuroscience, for example, with the coloration of Ramon Icaral, with his staining, his images, pretty connues. I would like to be able to find the iconography of the neurons, machine learning, if we talk about machine learning, I would like to find out some elements, think about it. Among the elements that I have in mind, there is also the Human Brain Project, they have very beautiful visuals, and we could also talk about that as a subject of vulgarisation. So I will give you several works of art, several references, forms of photos, which are taken from a book that is a neuroscience and art. And I would like to inspire you to see what graphics can be used to the site to make it aesthetically pleasant. But, I don't forget the kind of instructive and ludic. Thank you.

**Note de transcription.** « Ramon Icaral » est une transcription phonétique de **Santiago Ramón y Cajal**,
le neuroanatomiste espagnol dont les dessins à l'encre fondent l'iconographie des neurosciences.

---

## 2. Le fait le plus important, arrivé après le brief

**Ce site est une pièce de candidature.**

Gaspard postule à une mission de vulgarisation au sein de son institut. Il disposera de
**3 minutes pour présenter le site**, en en faisant la **démonstration en direct**, avec
peut-être une ou deux diapositives projetées en appoint.

Ce fait n'était pas dans le brief initial et il change tout :

- Le site n'est pas une encyclopédie. C'est un objet qui doit être **compris et jugé en 3 minutes**,
  tout en tenant la route s'il est exploré plus longtemps.
- Le parcours de démonstration est un **livrable à part entière** (`06-DEMO-3MIN.md`), pas une improvisation.
- **Échéance : moins d'une semaine.** Mode sprint.
- Mais l'utilisateur a explicitement refusé de tout miser sur un moment fort unique :
  **le site doit être bon dans son ensemble.**

---

## 3. Journal des décisions

Toutes les décisions ci-dessous ont été prises en dialogue avec l'utilisateur le 10 septembre 2026.
Chaque ligne indique **ce qui a été décidé** et **pourquoi**, pour qu'un agent qui reprend
ne remette pas en cause un arbitrage déjà tranché.

### 3.1 Sujet et public

| Décision | Raison |
|---|---|
| **Sujet : le neurone et le potentiel d'action, biologie seule** | Quatre pistes étaient ouvertes dans le brief. La piste « voyage d'un signal » qui les reliait toutes a été jugée **trop complexe** par l'utilisateur. Le lien avec l'IA / les réseaux de neurones est **mis en réserve**, à rouvrir en fin de projet si le temps le permet |
| **Public : collégiens (11-15 ans) uniquement** | L'utilisateur a demandé de commencer par ce seul niveau. Un deuxième niveau de lecture « Aller plus loin » est **reporté, pas abandonné** |
| **Ton : beau d'abord, jeu en récompense** | Arbitrage d'une tension réelle : les références de l'utilisateur sont des livres d'art, mais il demandait « très ludique ». La page reste calme et typographiée ; le jeu surgit à des moments précis |
| **Quiz : à la fin uniquement** | Précision de l'utilisateur : « quelques petites questions, est-ce que tu as vraiment été attentif pendant [...] ou est-ce que tu as bien compris cette section ou cette activité ». Pas de gamification permanente, pas de score punitif |
| **Institut Imagine : projet personnel, non officiel** | Aucun logo, aucune charte institutionnelle, aucun appel au don réel |

### 3.2 Forme et direction artistique

| Décision | Raison |
|---|---|
| **Fond blanc pur, traits foncés** | Décision explicite de l'utilisateur, revenant sur la première piste « fond sombre lumineux » inspirée du Blue Brain Project |
| **Typographie : Inter, corps 21 px** | L'utilisateur a cité [infrastructures-terrestres.com](https://www.infrastructures-terrestres.com) **pour la police des corps de texte**. Inspection faite : ce site utilise **Univers** (Frutiger, 1957) à 21 px. Univers étant commerciale, elle est remplacée par **Inter**, la plus proche et la mieux rendue sur écran ancien. Archivo et Work Sans ont été écartées après comparaison visuelle |
| **Le fond jaune de cette référence n'est PAS repris** | L'utilisateur a cité la police, pas la couleur. Le jaune tire vers l'affiche là où le projet vise le livre |
| **Palette : une couleur par concept** | Idée de l'utilisateur (« une couleur par thème, e.g. la myéline en vert »). Retenue parce que **trois exigences convergent** dessus : la pédagogie, la grammaire 3Blue1Brown, et l'accessibilité daltonienne. Détail dans `01-DIRECTION-ARTISTIQUE.md` |
| **Grammaire d'animation : celle de 3Blue1Brown** | Référence citée par l'utilisateur. On garde **la grammaire du mouvement** (morphing continu, caméra qui recadre, construction progressive, couleur sémantique constante) mais **pas le fond sombre** |
| **Rien n'apparaît en même temps** | Principe directeur posé par l'utilisateur : « il faut que les differentes parties viennent dans une suite logique ». Une notion n'est jamais montrée avant le moment où elle est expliquée |
| **Le défilement est le SEUL déclencheur** | « je veux que le scroll soit l'unique declencheur d'apparitions ». Aucune apparition ne se produit après un simple délai. Chaque temps de l'ouverture occupe presque tout l'écran, sinon deux d'entre eux tiendraient ensemble et apparaîtraient ensemble quoi qu'on code |
| **Remonter rejoue le mouvement à l'envers** | « quand on scroll en arriere ca revient en arriere dans le mouvement » |
| **Un seul neurone pour tout le site** | « On peut fusionner le premier et le deuxieme neurone en un ». Vu en large d'abord, puis la caméra se déplace sur chaque partie. Le dessin est produit par `outils-dessin-neurone.py`, source unique |
| **Neurone à la verticale** | Idée de l'utilisateur. Le sens du défilement devient le sens du signal : le message entre par le haut, ressort en bas |
| **Aucun tiret cadratin** | Demande explicite, valable pour tout le site, code compris |
| **Norme visée : WCAG 2.2 niveau AA** | « suis a la lettre les recommendations pour les handicaps, cest tres important ». WCAG 2.2 AA satisfait aussi le RGAA et l'Acte européen. Le volet cognitif suit le document COGA du W3C. Détail dans `03-ACCESSIBILITE.md` |

### 3.3 Technique

| Décision | Raison |
|---|---|
| **Sans build : HTML / CSS / JS natifs + GSAP** | L'utilisateur a délégué ce choix (« je ne sais pas, on peut installer ce qui est nécessaire »). Retenu pour quatre raisons : vitesse en sprint, fonctionnement **hors connexion** le jour de la démo, reprise immédiate par d'autres agents sans installation, et contrôle fin de l'accessibilité |
| **GSAP copié dans le dépôt, pas en CDN** | Pour que le site fonctionne **sans internet** pendant la présentation. GSAP est gratuit depuis avril 2025, plugins compris |
| **Hébergement : GitHub Pages** | Gratuit sans limite de durée, et l'utilisateur a déjà un compte GitHub. Le besoin exprimé était « au moins un mois » |
| **Doit tourner sur un vieux smartphone** | Exigence explicite : « je ne veux pas que ca beug sur un vieux smartphone dun membre du jury pendant la demo ». Contrainte de **conception**, pas d'optimisation finale. Détail dans `04-ARCHITECTURE.md` |
| **Pas de WebGL / Three.js** | Trop risqué en sprint, et incompatible avec la contrainte « vieux téléphone » |
| **Une seule mise en page, celle du téléphone** | Décision de l'utilisateur le 11 septembre 2026, pour une raison de calendrier qu'il a posée lui-même : « if the problem is to have both the mobile version and the computer version, we will have only the mobile version, i dont have the time ». La mise en page à deux colonnes des grands écrans est **supprimée**. Sur ordinateur, le site affiche exactement la même colonne que sur téléphone, bornée à 34 rem et centrée. Ce n'est pas une dégradation : une colonne étroite d'encre sur du blanc, c'est la page d'un livre, donc la direction artistique du projet. Conséquence technique qui vaut d'être notée : le dessin et le texte sont désormais toujours l'un au-dessus de l'autre, jamais côte à côte, ce qui supprime **par construction** toute une famille de recouvrements qui avait coûté plusieurs heures |
| **La chaîne de cellules : des neurones réduits à l'essentiel, un cercle et un trait** | Décision de l'utilisateur le 11 septembre 2026, après avoir vu la version en capsules abstraites qu'il avait d'abord choisie entre trois options. Le trait bleu, devenu bande par la plongée de la caméra, se révèle fait de petits neurones mis bout à bout, chaque axone s'arrêtant au cercle suivant ; l'un s'isole, puis le neurone entier se dessine à sa place. La forme réduite annonce le dessin sans le nommer : le mot « neurone » n'arrive qu'au temps suivant |
| **Le titre du site, en gros, au dessus du premier bouton** | Demande de l'utilisateur le 11 septembre 2026. Il disparaît avec le bouton, au clic. **Le nom du site n'est toujours pas choisi** : le titre affiché est provisoire, repris de la balise `title` |
| **Les dessins du parcours plus petits que les boutons ne le laissaient** | Demande de l'utilisateur le 11 septembre 2026 : « le texte est un peu dissimulé et ne prend pas assez de place par rapport aux dessins et boutons, on n'arrive pas à lire ». Le dessin du parcours passe de 42 % à 31 % de la hauteur de l'écran, les boutons ne changent pas. Le texte a priorité sur le dessin dans le parcours. **Seconde demande, même jour** : « en général les dessins et schémas prennent trop de place par rapport au texte, donc quand le texte défile et disparaît on ne le voit pas assez ». Le parcours passe à 27 % (228 px), l'ouverture plafonne à 300 px au lieu de 340, la courbe à 15 rem au lieu de 18. Zone de lecture du parcours : 393 px sur 844, 47 % |
| **Le signal afférent : des flèches bleues aux bouts des dendrites** | Demande de l'utilisateur le 11 septembre 2026 : « rajouter une notion (élément graphique) de signal afférent quand on parle des dendrites pour montrer que le neurone reçoit de l'information, peut-être juste des petites flèches de couleur bleue, une par dendrite ». Et ensuite, « ces entrées d'information sont modélisées par les petites billes bleues, c'est très bien ». Une flèche par bout de dendrite, en bleu signal, vers l'intérieur, le temps que la caméra regarde les dendrites |
| **La chute de l'acte 2 : « Tout ça, pour un clic. Pas mal, non ? »** | Ajout de l'utilisateur le 11 septembre 2026, à la vue de la fin de l'acte 2. Il a écrit « Pas mal non ? » ; la virgule est un choix typographique de l'agent, à retirer s'il la refuse |
| **Manim écarté pour le site** | Envisagé parce que l'utilisateur code en Python. Il a précisé **ne pas avoir besoin de maintenir le code lui-même**, donc cet argument tombe. Reste un bon candidat pour les diapositives projetées |

### 3.4 Accessibilité

Demande de l'utilisateur, arrivée en cours de conception :

> « On doit avoir un version colorblind, pour les associations de patients avec des gens en situation de handicap. Maybe aussi audiodescription ? c'est tout un pôle a definir mais c'est important, il faut faire des recherches dessus »

Deux conclusions de la recherche menée, qui ont orienté le pôle :

1. **L'« audiodescription » n'existe pas vraiment sur le web hors vidéo.** L'équivalent réel, ce sont
   les alternatives textuelles et le support des lecteurs d'écran.
2. **Pour ce public, la motricité compte au moins autant que la couleur.** Aucune interaction du site
   ne doit reposer sur un glisser-déposer.

Détail complet dans `03-ACCESSIBILITE.md`.

---

## 4. Ce qui reste ouvert

- **Le nom du site.** L'utilisateur a dit deux fois « on verra plus tard ». Le dépôt s'appelle
  `neurone` en attendant, ça ne bloque rien.
- **La palette.** Les couleurs sont posées mais ne se jugent qu'à l'écran. À revoir dès que
  les premières sections existent.
- **Les diapositives** d'appoint pour la projection.
- **La séquence sombre unique** en respiration : la garder ou non.
- **Le deuxième niveau de lecture** « Aller plus loin ».
- **L'ouverture sur l'IA**, si le temps le permet.
- **La narration audio** par section.

---

## 5. Comment travailler avec l'utilisateur

Éléments observés pendant la phase de conception, utiles à qui reprend :

- Il demande explicitement **beaucoup de questions**, surtout en phase initiale. Ne pas
  supposer à sa place.
- Il code **bien en Python**, mais pas en HTML / CSS / JS. Les explications techniques
  gagnent à passer par des analogies, et il a dit ne pas avoir besoin de tout comprendre du code.
- Il réagit **très bien aux comparaisons visuelles** : lui montrer deux options vaut mieux
  que les décrire.
- **Il refuse le tiret cadratin.** Nulle part dans le site, code compris.
- **Il refuse tout filet ou trait décoratif** au-dessus ou à côté d'un titre :
  il considère que ce motif signe un travail de machine. La hiérarchie se fait
  par la taille, la graisse et le blanc, jamais par un ornement ajouté.
- **Il exige une vérification réelle avant qu'on lui montre quoi que ce soit.**
  Formulé après que des tests annonçant quatorze succès aient accompagné une
  page blanche. Voir la méthode dans `04-ARCHITECTURE.md`.
- **Il teste sur ordinateur autant que sur téléphone.** Tout vérifier en
  émulation mobile a laissé passer des défauts graves pendant des jours.
- **Navigateur de référence : Chrome.** Safari n'est pas testé, décision prise
  d'un commun accord pour ne pas disperser l'effort. L'extension Claude in
  Chrome est installée et fonctionne, ce qui permet d'aller voir le site
  déployé directement.
- **Il préfère une implémentation par petites pièces**, chacune vérifiée et
  montrée avant la suivante, plutôt qu'un gros lot livré d'un coup. Décidé
  après qu'une implémentation complète de l'acte 0 ait dû être annulée.
- **Le fil de conversation est le canal fiable.** Les commentaires annotés dans l'interface
  de relecture de plan sont arrivés avec un fort décalage, et une première série a été perdue.
