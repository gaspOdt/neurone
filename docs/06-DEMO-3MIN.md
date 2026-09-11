# 06 — Le parcours de démonstration, en 3 minutes

> **État : provisoire, et c'est normal.**
> Deux sections sur six existent. Ce document pose la structure, le minutage et
> les règles qui ne changeront pas, et il se remplit à mesure que les sections
> arrivent. Il est relu une dernière fois **après** l'audit technique.

---

## Pourquoi ce document est un livrable, et pas une improvisation

Le site est une **pièce de candidature**. Gaspard dispose de **3 minutes pour
le présenter, en démonstration live**, devant un jury d'institut, avec
éventuellement une ou deux diapositives en appoint.

Trois minutes, c'est très court. Assez pour convaincre, largement assez pour
se perdre. Un parcours écrit à l'avance et répété est la différence entre une
démonstration qui tient et une démonstration qui déborde.

**Ce que ces 3 minutes doivent prouver, dans cet ordre :**

1. Que le site est **beau**, tout de suite, dès le premier écran.
2. Qu'il **enseigne vraiment**, et pas seulement qu'il bouge.
3. Qu'il a été pensé pour **tout le monde**, y compris le public des
   associations de patients.
4. Qu'il **n'existait pas** avant, en français.

**Ce que ces 3 minutes ne doivent surtout pas essayer de faire : tout montrer.**
Le jury n'a pas besoin de voir les six sections. Il a besoin de comprendre
l'intention, et de constater qu'elle est tenue.

---

## La contrainte que personne ne voit venir : on ne peut pas tout faire défiler

Le site se pilote au **défilement**, volontairement lent, chaque bloc occupant
presque un écran. C'est une qualité pour un visiteur, c'est un problème pour
une démonstration de 3 minutes : **faire défiler le site entier prendrait
plusieurs minutes à lui seul.**

Il faut donc pouvoir **sauter d'une section à l'autre sans casser le récit**.
Trois pistes, à trancher avant la répétition générale :

| Piste | Ce qu'elle vaut |
|---|---|
| Les boutons du parcours, qui existent déjà | Ils font défiler jusqu'au bon bloc, sans désynchroniser l'état. Fonctionne déjà, mais ne couvre que le parcours |
| Des ancres dans l'URL, une par section | Gratuit, robuste, et invisible pour le visiteur ordinaire |
| Deux onglets ouverts à l'avance, à deux endroits du site | Aucun code à écrire. Le plus sûr le jour J, le moins élégant |

**Décision : à prendre.** Elle conditionne le minutage ci-dessous.

---

## Le minutage

> Colonne « écran » : ce que le jury voit. Colonne « voix » : l'idée à faire
> passer, pas un texte à réciter mot pour mot.

| Temps | Écran | Voix |
|---|---|---|
| **0:00 à 0:25** | L'ouverture. Le constat, puis un défilement lent, un temps par écran, jusqu'à la courbe | Le site ne s'ouvre pas sur un titre, il s'ouvre sur **un geste que vous venez de faire**. Le sujet, c'est vous |
| **0:25 à 1:00** | Le parcours. Le neurone se dessine, la caméra visite les quatre parties | **Un seul neurone pour tout le site.** On ne change jamais de dessin, on s'en approche. Le lecteur ne perd jamais le fil |
| **1:00 à 1:50** | **Le moment fort.** Une interaction, manipulée en direct | C'est ici que le jury doit comprendre que le site **enseigne** et ne fait pas que bouger. La section reste à choisir |
| **1:50 à 2:20** | Le bouton « Réduire les animations », puis une alternative textuelle dépliée | Le public inclut des **associations de patients**. Rien n'est porté par la couleur seule, rien n'exige un glisser déposer, tout est atteignable au clavier |
| **2:20 à 2:45** | Retour en haut, vue d'ensemble | **Ce site n'existait pas en français.** Le contenu interactif sur le neurone est abondant, mais conçu comme un outil de classe, jamais comme une expérience. Voir `07-BENCHMARK.md` |
| **2:45 à 3:00** | Écran fixe | Ce qui reste à faire, et ce que ça deviendrait avec du temps |

**La minute 1:00 à 1:50 est le cœur.** Tout le reste est du cadrage. Le choix
de la section à manipuler se fera quand les quatre sections scientifiques
existeront, et il se fera **sur le critère du geste qui enseigne le mieux**,
pas du geste le plus spectaculaire.

**Si le quiz est montré**, question 2 comme le prévoit `02-CONTENU.md`,
répondre d'abord à la question 1 : les questions s'empilent, la deuxième
n'existe à l'écran qu'après la première. Deux secondes à prévoir.

---

## Les règles du jour J

**Le site fonctionne sans connexion.** C'est une décision de conception, pas
une précaution de dernière minute : la police et GSAP sont copiées dans le
dépôt, aucune requête ne part vers un tiers. Un mauvais wifi de salle de
réunion ne peut pas gâcher la démonstration.

**Sur quel appareil.** Le site est pensé mobile d'abord. Mais une démonstration
sur téléphone tenu à la main est illisible pour un jury à trois mètres.
**Décision à prendre : téléphone projeté, ou ordinateur en fenêtre étroite.**
Le second est plus sûr, le premier est plus honnête.

**À préparer avant d'entrer :**

- [ ] Le site ouvert, **déjà chargé**, en haut de page
- [ ] Le mode « mouvement réduit » **désactivé**, vérifié
- [ ] Le cache chaud, la police déjà téléchargée
- [ ] Le mode avion activé, pour prouver que ça marche hors connexion
- [ ] Un deuxième onglet ouvert au moment fort, en secours
- [ ] La luminosité au maximum

**À ne pas faire :**

- Ne pas commenter le code. Personne ne l'a demandé, et ça consomme la moitié
  du temps.
- Ne pas s'excuser de ce qui manque. Le dire une fois, à la fin, en une phrase.
- Ne pas faire défiler vite pour « montrer la suite ». Le rythme lent est un
  parti pris, le casser en démonstration le fait passer pour un défaut.

---

## Le plan de secours

| Ce qui rate | Quoi faire |
|---|---|
| Pas de connexion | Rien à faire, le site fonctionne hors ligne. **Le dire à voix haute** : c'est un argument |
| L'animation rame sur la machine du jury | Le site bascule seul en mode allégé. **Le dire aussi** : c'est le même mécanisme qui sert l'accessibilité |
| Une interaction ne répond pas | Passer à l'alternative textuelle dépliable, qui dit la même chose. C'est prévu pour ça |
| Le navigateur du jury est ancien | Cible tenue : Safari iOS 14 et Chrome Android 90 |
| Il reste 30 secondes de trop | Ouvrir une alternative textuelle et parler du pôle accessibilité |
| Il manque 30 secondes | Sauter le retour en vue d'ensemble, garder la conclusion |

---

## Les diapositives d'appoint

Le brief autorise « une ou deux diapositives ». Elles ne doivent **pas**
répéter le site.

Une seule diapositive utile, à la fin : **ce que le site deviendrait avec du
temps.** Le deuxième niveau de lecture « Aller plus loin », la narration audio,
et l'ouverture sur l'intelligence artificielle, qui est le sujet de thèse de
Gaspard et le lien qu'il avait proposé dès le brief initial.

`00-CONTEXTE.md` note que Manim reste un bon candidat pour produire ces
diapositives, puisqu'il a été écarté pour le site mais pas pour la projection.

---

## Reste à trancher

1. **Comment sauter d'une section à l'autre** sans casser le récit. Bloquant.
2. **Quelle section sert de moment fort.** À décider une fois les quatre
   sections scientifiques écrites.
3. **Téléphone projeté ou ordinateur en fenêtre étroite.**
4. **Répéter chronomètre en main, au moins trois fois.** Trois minutes tenues
   en répétition font quatre minutes le jour J.
