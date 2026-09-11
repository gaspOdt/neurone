# 02 — La narration de A à Z

> **Ce document est la source de vérité du contenu.**
> On l'écrit et on le peaufine AVANT de toucher au site. Les éléments
> graphiques se décident ici, **en face du texte auquel ils répondent**, jamais
> séparément : c'est leur écriture séparée qui a produit les incohérences du
> site actuel.
>
> Les sources sont dans [`10-SOURCES.md`](10-SOURCES.md) et citées par leur clé.
>
> **Statut : le site ne correspond PAS encore à ce document.**

---

## Comment lire ce document

Chaque temps du récit est décrit sur trois plans, qui doivent toujours
s'accorder :

| Plan | Question |
|---|---|
| **Texte** | ce que le visiteur lit, mot pour mot |
| **Graphique** | ce qu'il voit **au même instant** |
| **Science** | ce que la phrase affirme, et sur quelle source |

---

## Les deux règles qui gouvernent tout

### 1. Un temps par défilement, et les temps s'accumulent

C'est la dynamique retenue avec l'utilisateur, et elle vaut pour **tout** le
site, pas seulement l'ouverture.

Un mouvement de défilement fait arriver **un** nouvel élément de texte. Les
précédents **restent à l'écran** et le nouveau vient s'ajouter à eux. Ce n'est
pas un élément isolé qui apparaît puis disparaît : **les éléments se
rejoignent**, et le raisonnement se construit sous les yeux du lecteur.

Conséquence de mise en page : à l'intérieur d'un même acte, les temps
s'empilent jusqu'à former un bloc lisible d'un seul tenant, puis l'acte suivant
repart d'un écran net.

### 2. L'entonnoir : du corps à la molécule, du simple au compliqué

Le fil directeur est un **zoom continu**. Chaque étape est un cran de plus, et
chaque notion ne peut arriver qu'une fois que celle dont elle dépend est
acquise.

```
   LE CORPS              un ordre part de la tête et descend au doigt
       ↓                 (aucun mot savant)
   LA CHAÎNE             ce chemin est fait de cellules mises bout à bout
       ↓
   UNE CELLULE           en voici une : le neurone
       ↓
   SES QUATRE PARTIES    et chacune porte sa propre idée :
       ↓
         dendrites  ......  on reçoit. Beaucoup.
         corps      ......  on additionne, et on décide. Tout ou rien.
         axone      ......  ça part, et ça file. Pourquoi si vite.
         terminaisons ....  on passe le relais au suivant.
       ↓
   RETOUR AU CORPS       le doigt bouge. La boucle est fermée.
```

**Vérification de l'entonnoir, notion par notion.** Chaque ligne ne peut être
comprise que si la précédente l'est, et aucune ne suppose une notion à venir :

| Notion | Ce qu'elle suppose acquis | Vérifié |
|---|---|---|
| Un ordre descend de la tête au doigt | rien | oui |
| Le chemin est fait de cellules | qu'il y a un chemin | oui |
| Les messages arrivent par les dendrites | qu'il y a une cellule | oui |
| Il en faut assez pour déclencher | qu'il en arrive plusieurs | oui |
| Tout ou rien | qu'il existe un seuil | oui |
| Ça descend le long de l'axone | que quelque chose est parti | oui |
| La myéline accélère | qu'on a constaté la lenteur sans elle | oui |
| Le relais au neurone suivant | qu'il existe d'autres cellules | oui |
| Un geste, ce sont des centaines d'impulsions | qu'on sait ce qu'est une impulsion | oui |

---

## L'ordre d'introduction des mots

Audit fait temps par temps. **Chaque mot du site apparaît ici pour la première
fois, accompagné de sa définition.** Aucun n'est employé avant sa ligne.

| Mot | Introduit à | Comment |
|---|---|---|
| cerveau, doigt | 0, t2 | mots courants, aucune définition nécessaire |
| **message** | 0, t3 | « un message est parti de là-haut » |
| cellule | 1, t1 | au programme du collège |
| **neurone** | 1, t2 | après avoir vu la chose, jamais avant |
| **dendrites** | 1A, t4 | « ces branches fines » |
| **corps cellulaire** | 1B, t6 | « tout converge ici » |
| **seuil** | 1B, t9 | « un niveau à atteindre » |
| **impulsion** | 1B, t9 | « quelque chose part vers le bas » |
| **axone** | 1C, t12 | « l'impulsion descend le long de » |
| **électrique** | 1C, t13 | seul endroit où le signal est qualifié |
| **myéline** | 1C, t15 | « une gaine, posée par morceaux » |
| **terminaisons** | 1D, t19 | « de petites branches » |
| **messagers**, chimique | 1D, t21 | « il devient chimique » |
| muscle | 2, t23 | mot courant |

**Deux pièges désamorcés par cet ordre :**

- L'impulsion part en **1B**, mais l'axone n'est nommé qu'en **1C**. Le texte de
  1B dit donc « vers le bas », jamais « le long de l'axone ».
- Le signal est dit **électrique** en 1C temps 13, ce qui donne tout son relief
  au passage **au chimique** en 1D temps 21. Sans cette affirmation préalable,
  le changement de nature ne voudrait rien dire.

## Les huit incohérences corrigées lors de cet audit

| # | Problème trouvé | Correction |
|---|---|---|
| 1 | Le trajet était dessiné en 0 t2, alors que le texte n'en parlait qu'en t3 | En t2, la silhouette seule. Le trajet apparaît en t3, avec sa phrase |
| 2 | « l'ordre » puis « le message » désignaient la même chose | **message** partout, dès 0 t3 |
| 3 | 1A t5 annonçait des milliers de neurones juste après avoir installé l'image d'une **chaîne**, qui n'en suppose qu'un | La phrase corrige explicitement : « ce n'est pas une simple chaîne » |
| 4 | « chaque message pousse un peu » : rien ne montait à l'écran | Le corps **se remplit de bleu par le bas**. Le verbe a enfin un référent |
| 5 | « seuil » employé en 1B t9 sans jamais avoir été défini | Défini dans la phrase : « un niveau à atteindre » |
| 6 | L'impulsion partait « le long de l'axone » en 1B, alors que l'axone n'est nommé qu'en 1C | « vers le bas » en 1B |
| 7 | « l'impulsion » apparaissait en 1C t12 avec un article défini, sans avoir jamais été nommée | Nommée en 1B t9, au moment où elle part |
| 8 | « ce n'est pas de l'électricité » niait une idée que le visiteur n'avait jamais eue, et le site ne disait nulle part que le signal est électrique, alors que **tout le code couleur repose dessus** | Affirmation d'abord, correction ensuite : « c'est bien un signal électrique, mais pas comme dans un câble » |

Le huitième était le plus grave : la couleur bleue est définie comme celle de
« l'impulsion électrique » dans toute la palette, alors qu'aucune phrase du
site n'établissait que le signal était électrique.

---

## La palette

### La règle qui gouverne tout : la couleur ne se pose jamais sur le texte

**Le texte est noir. Toujours. La couleur passe DERRIÈRE, en surligneur.**

Cette règle vient du site cité en référence par l'utilisateur,
[infrastructures-terrestres.com](https://www.infrastructures-terrestres.com),
qui n'écrit jamais en couleur : il laisse son texte en noir et place un bloc
de couleur derrière. C'est exactement ce qui l'autorise à être aussi fluo.

Les mesures expliquent pourquoi, et elles sont sans appel.

| Couleur | En **fond**, sous du texte noir | En **trait fin** sur blanc |
|---|---|---|
| Magenta `#FF6EF5` | **7,3:1** excellent | 2,4:1 illisible |
| Vert `#00F58A` | **12,0:1** excellent | 1,5:1 illisible |
| Orange `#FF7A29` | **6,7:1** excellent | 2,6:1 illisible |
| Bleu électrique `#0066FF` | 3,6:1 | **4,8:1 le seul qui passe** |

Une couleur fluo est lumineuse par définition, donc elle contraste mal avec du
blanc et très bien avec du noir. **Utilisée en fond, elle devient un atout ;
utilisée en trait, elle est inutilisable.**

### Les couleurs

| Couleur | Ce qu'elle représente | Comment elle s'emploie |
|---|---|---|
| **Encre** `#1A1A1A` | tout le dessin, et tout le texte | traits et lettres |
| **Bleu électrique** `#0066FF` | **le signal** | **la seule couleur autorisée en trait pur**, parce que la seule qui passe le contraste |
| **Magenta fluo** `#FF6EF5` | **« regarde ici »** | bloc derrière le mot-clé, surbrillance de la partie regardée, bouton d'ouverture |
| **Vert fluo** `#00F58A` | **la myéline** | **une bande**, cernée d'un filet d'encre, jamais un trait |
| **Orange fluo** `#FF7A29` | **les messagers chimiques** | des aplats cernés d'encre, jamais un trait |

**Le filet d'encre autour des aplats fluo n'est pas décoratif** : c'est lui qui
porte le contraste que la couleur ne peut pas porter. Sans lui, une bande verte
sur fond blanc n'aurait pas de bord défini.

Le bleu est la couleur porteuse du site : **c'est le fil du récit**, celui que
le visiteur apprend à suivre des yeux, du trajet dans la silhouette jusqu'au
faisceau final.

### Les titres des grandes parties

**Titre en encre noire, gros et gras. Sous-titre en encre douce. Rien d'autre.**

Aucun ornement, aucun filet, aucune barre au-dessus ni à côté. La hiérarchie se
fait par la taille, la graisse et le blanc.

| Titre | Sous-titre |
|---|---|
| **Le neurone** | La cellule qui fait voyager le message |
| **Les dendrites** | Là où les messages arrivent |
| **Le corps cellulaire** | Là où le neurone décide de transmettre |
| **L'axone** | Le long câble qui emporte l'impulsion |
| **Les terminaisons** | Là où le message passe à la cellule suivante |
| **Ton doigt** | Là où le message arrive, et où tout a commencé |

Le titre nomme la partie, **le sous-titre dit ce qui s'y passe et pour qui**.
Un sous-titre ne doit jamais être un raccourci cryptique : « on reçoit » ne dit
pas qui reçoit, et a été rejeté pour cette raison. Lus à la suite, ces six
lignes racontent déjà le trajet du message, et peuvent servir de plan le jour
de la présentation.

**Pourquoi le titre n'est pas bleu**, alors que le bleu est le fil du récit :
c'est justement pour ça. Le bleu désigne **une chose qui se déplace**. Sur
l'écran de l'axone, un titre bleu et une impulsion bleue coexisteraient, et le
visiteur ne saurait plus laquelle des deux la couleur désigne.

### Deux règles qui évitent la bouillie

1. **La surbrillance n'écrase jamais une couleur sémantique.** Si l'objet
   regardé porte déjà du bleu, du vert ou de l'orange, il garde sa couleur et
   c'est **l'épaisseur du trait** qui signale qu'on le regarde. Sinon la
   myéline deviendrait magenta et le code s'effondrerait.
2. **Aucune information n'est jamais portée par la couleur seule.** Chaque
   élément est identifié par couleur **et** forme **et** étiquette. Une capture
   en noir et blanc doit rester compréhensible.

### Ce que la mesure du daltonisme a donné

Simulation des trois dichromatismes sur la palette, distances calculées deux à
deux :

- **Les couleurs du dessin sont sûres.** Bleu, vert, orange et encre restent
  distinguables dans les trois cas, avec un écart minimal de 86 sur une échelle
  où 60 marque le seuil de confusion.
- **Le magenta, lui, se confond avec le vert en deutéranopie et avec l'orange
  en tritanopie**, et aucune variante testée n'y échappe. Aucune combinaison de
  quatre couleurs fluo ne passe toutes les paires.

**Ce n'est pas un défaut, parce que le magenta ne porte aucune information
scientifique.** Il dit « regarde ici », et ce message est déjà porté par
l'épaisseur du trait, par le cadrage de la caméra et par le mot en gras. Il
n'est jamais le seul canal. La règle 2 ci-dessus est ce qui rend cette
tolérance légitime.

> **À l'implémentation.** `css/tokens.css` contient encore l'ancienne palette,
> plus sourde, héritée d'Okabe-Ito. Elle devra être remplacée par les valeurs
> ci-dessus **au moment où le site sera repris**, pas avant.

---

## Les trois incohérences réparées

Constatées sur le site en ligne, et à l'origine de cette réécriture.

**1. On parlait d'un cerveau qu'on ne montrait jamais.** Le texte disait « ton
cerveau a commandé le mouvement de ton doigt » et l'image affichée était un
neurone isolé. **Réparé** par la silhouette de l'acte 0 : le plan large arrive
avant le gros plan.

**2. L'impulsion électrique arrivait sans introduction.** La courbe du potentiel
d'action était montrée et nommée avant que le visiteur sache ce qu'est un
neurone. **Réparé** : la courbe est déplacée au corps cellulaire, où elle
montre ce que le visiteur vient de déclencher lui-même.

**3. Tout arrivait en même temps.** Le neurone et les boutons du parcours
étaient déjà à l'écran pendant qu'on posait encore la question. **Réparé** :
chaque chose apparaît à son tour.

---

# ACTE 0 — L'ouverture

**Rôle : faire naître une question, sans un seul mot de vocabulaire
scientifique.** C'est ce que le jury verra en premier, et ce qui décide si un
collégien reste.

### Temps 1 — le bouton

| | |
|---|---|
| **Texte** | Clique sur ce bouton. |
| **Graphique** | Un bouton **magenta**, seul au milieu d'un écran vide, avec la phrase à côté. Rien d'autre. **Aucun texte ne suit tant qu'il n'est pas cliqué.** |
| **Science** | Consigne, pas d'affirmation. |

> **Pourquoi c'est la meilleure idée du récit.** En faisant cliquer le visiteur
> ici et maintenant, la phrase suivante cesse d'être une supposition sur un
> geste passé : elle décrit un geste qu'il vient de faire, à la seconde, et
> qu'il a senti. Le site ne raconte plus la neuroscience, il la prend en
> flagrant délit.
>
> **Le défilement ne déclenche rien tant que le bouton n'est pas cliqué.**
> C'est la seule exception à la règle « un temps par défilement », et elle est
> justifiée : sans le clic, la phrase suivante serait fausse.

### Temps 2 — la commande

| | |
|---|---|
| **Texte** | Ton cerveau vient de commander le mouvement de ton doigt. |
| **Graphique** | **À créer.** Une silhouette humaine **de face, unisexe, neutre**, au trait, très simplifiée : contour du corps, sans visage, sans vêtement, sans marque de genre. Une tache marque la tête. **Rien d'autre : pas encore de trajet.** Aucun organe, aucun détail anatomique. |
| **Science** | **Simplification assumée.** Un mouvement volontaire est commandé par le cortex moteur, avec un relais dans la moelle épinière. Dire « ton cerveau » n'est pas faux et n'installe rien à désapprendre. |

### Temps 3 — le trajet

| | |
|---|---|
| **Texte** | Un message est parti de là-haut, et il est descendu jusqu'à lui. |
| **Graphique** | **C'est ici que le trajet apparaît**, et pas avant : un trait unique se dessine de la tête vers le doigt, en **bleu**, dans le sens du voyage. C'est le premier bleu du site, et il désignera le signal jusqu'à la fin. La silhouette et le texte du temps 2 restent à l'écran. |
| **Science** | **Vérifié.** Trajet cortex moteur → moelle → muscle de la main. |

### Temps 4 — la durée

| | |
|---|---|
| **Texte** | Ça a pris deux centièmes de seconde. |
| **Graphique** | Le même trait. Le temps s'inscrit à côté. Aucun élément nouveau. |
| **Science** | **Vérifié, [S1].** 21,4 ms mesurés (SD 1,7) sur 112 membres supérieurs, du cortex moteur au **muscle du pouce**. Le muscle mesuré est exactement celui du geste décrit. Ne pas confondre avec le temps de réaction complet, 150 à 250 ms : le site parle du **trajet du signal**. |

### Temps 5 — la question

| | |
|---|---|
| **Texte** | Sais-tu comment ? |
| **Graphique** | La silhouette s'efface, **sauf le trait**. La caméra plonge dans le trait jusqu'à ce qu'il remplisse l'écran. |
| **Science** | Question. |

> **Cette transition est le cœur du dispositif.** Le visiteur comprend
> physiquement qu'il entre *dans* le chemin. C'est ce qui rend le neurone
> compréhensible : il n'apparaît pas de nulle part, il est ce qu'on trouve au
> bout du zoom.

---

# ACTE 1 — Le neurone

**Rôle : présenter la cellule, et faire porter à chacune de ses parties la
notion qui lui correspond.**

> **Décision de structure.** Les notions qui devaient faire des actes séparés,
> le repos, le seuil, la vitesse, la synapse, sont **repliées ici**, chacune au
> moment où l'on regarde la partie concernée. Raison : la présentation dure
> **3 minutes**. Un visiteur qui découvre le corps cellulaire doit apprendre à
> ce moment-là ce que fait un corps cellulaire, pas trois écrans plus loin.

### Temps 1 — la chaîne

| | |
|---|---|
| **Texte** | Ce chemin n'est pas un fil. C'est une chaîne de cellules, mises bout à bout. |
| **Graphique** | Le trait, devenu large, se révèle composé de plusieurs formes alignées. |
| **Science** | **Vérifié.** Corrige d'avance l'erreur spontanée la plus fréquente chez les enfants : le câble continu. |

### Temps 2 — la cellule

| | |
|---|---|
| **Texte** | En voici une. On l'appelle un **neurone**. |
| **Graphique** | Une cellule s'isole et se dessine : le neurone vertical, dendrites en haut, axone descendant, terminaisons en bas. Dessin canonique de `outils-dessin-neurone.py`. |
| **Science** | **Vérifié.** Premier mot savant du site, et il arrive après qu'on a vu la chose. |

### Temps 3 — le plan

| | |
|---|---|
| **Texte** | Il est très fort pour une chose : faire passer un message d'un bout à l'autre. Suivons ce message, dans l'ordre. |
| **Graphique** | **Les boutons du parcours apparaissent ici, et pas avant.** |
| **Science** | **Simplification assumée.** Un neurone fait aussi autre chose. Rien à désapprendre. **Formulation surveillée** : on décrit une performance, jamais une intention. Écrire « il est bâti pour » sous-entendrait un concepteur, ce que le site ne dit nulle part. |

---

## 1A — Les dendrites : on reçoit

### Temps 4

| | |
|---|---|
| **Texte** | Le message arrive par le haut, dans ces branches fines. On les appelle les **dendrites**. |
| **Graphique** | Caméra sur les dendrites. Surbrillance **magenta** sur la partie, et le mot « dendrites » en magenta dans le texte, au même instant. |
| **Science** | **Vérifié.** |

### Temps 5

| | |
|---|---|
| **Texte** | Elles collectent, et elles collectent beaucoup. Ce n'est pas une simple chaîne : **des milliers d'autres neurones** parlent à celui-ci. |
| **Graphique** | Des points **bleus** arrivent aux extrémités des dendrites, sporadiquement, et convergent vers le corps. |
| **Science** | **Vérifié, [S2].** 20 000 à 30 000 épines dendritiques sur un neurone pyramidal humain. **Formulation surveillée** : « des milliers d'autres neurones lui parlent », et surtout **pas** « il reçoit des milliers de messages en même temps », qui confondrait le nombre de connexions avec le nombre de messages simultanés. **La phrase « ce n'est pas une simple chaîne » est indispensable** : l'acte 1 temps 1 vient d'installer l'image d'une file de cellules, et ce temps la corrige explicitement au lieu de la contredire en silence. |

---

## 1B — Le corps cellulaire : on additionne, et on décide

**C'est le moment fort du site.** Le seuil et le tout ou rien se jouent ici.

> **Décision** : le **segment initial de l'axone** est traité comme faisant
> partie du corps cellulaire. C'est là que la décision se prend réellement, et
> les distinguer coûterait une notion pour un gain nul au niveau collège.
> À signaler à l'audit comme simplification assumée.

### Temps 6

| | |
|---|---|
| **Texte** | Tout ce que les dendrites ont récolté converge ici, dans le **corps cellulaire**. |
| **Graphique** | Caméra sur le corps cellulaire. Surbrillance **magenta**, mot-clé en magenta dans le texte. |
| **Science** | **Vérifié.** |

### Temps 7

| | |
|---|---|
| **Texte** | Chaque message qui arrive le fait monter un peu. Un seul ne suffit jamais. |
| **Graphique** | Les points **bleus** arrivent, et à chaque arrivée **le corps se remplit un peu de bleu, par le bas, puis se vide**. Le remplissage rend visible ce qui « monte » : sans lui, le verbe n'aurait aucun référent à l'écran. |
| **Science** | **Vérifié.** Sommation. Le retour à l'état initial entre deux messages est important : il évite de faire croire à une accumulation permanente. |

### Temps 8 — l'interaction

| | |
|---|---|
| **Texte** | Essaie. Fais monter le nombre de messages qui arrivent. |
| **Graphique** | **À créer.** Un curseur. À zéro, aucun message n'arrive. En montant, les messages arrivent de plus en plus nombreux sur les dendrites et le niveau de bleu monte dans le corps. **Au passage du seuil, quelque chose part vers le bas**, en **bleu**, et une courbe se trace à côté, en **bleu** elle aussi : c'est le même objet vu de deux façons. **Ne pas écrire « le long de l'axone »** : l'axone n'est nommé qu'en 1C. |
| **Accessibilité** | `<input type="range">` natif, donc pilotable au clavier par les flèches. **Plus deux boutons moins et plus**, pour ne dépendre d'aucun glissement. Valeur annoncée en `aria-live`. |
| **Science** | **Sourcé, [S6]. Et le sourçage a tranché contre l'affichage d'un chiffre.** Le seuil n'est pas une tension absolue mais une dépolarisation d'environ 11,6 mV depuis le repos, et il **se déplace d'environ 10 mV au cours d'une bouffée**. Combiné à [S5], cela donne un seuil vers −59 mV, pas les −55 mV que répète la vulgarisation. **Aucune valeur n'est donc affichée** : le texte dit « un niveau à atteindre », ce qui est exact et ne fabrique pas une fausse constante. |

### Temps 9 — le tout ou rien

| | |
|---|---|
| **Texte** | Il y a un niveau à atteindre. On l'appelle le **seuil**. En dessous, il ne se passe rien. Au-dessus, quelque chose part vers le bas : une **impulsion**. Et elle part **toujours pareil**, pas plus fort si tu pousses plus. |
| **Graphique** | La courbe reste affichée. Le curseur poussé plus haut redéclenche une impulsion **identique**, ce qui rend l'idée évidente sans l'expliquer. |
| **Science** | **Vérifié.** Loi du tout ou rien. **Ce temps introduit deux mots**, « seuil » et « impulsion », chacun accompagné de sa définition dans la phrase même. Aucun des deux ne doit apparaître avant. |

### Temps 10 — l'analogie

| | |
|---|---|
| **Texte** | Comme un interrupteur : tu peux appuyer doucement autant que tu veux, la lumière reste éteinte. Passé le déclic, elle s'allume. Et toujours à la même intensité. |
| **Graphique** | Aucun nouvel élément. Le texte s'ajoute sous les précédents. |
| **Science** | Analogie, demandée par l'utilisateur. **Limite à surveiller** : un interrupteur reste allumé, pas le neurone. Le temps 11 la corrige. |

### Temps 11

| | |
|---|---|
| **Texte** | Sauf que le neurone, lui, se rallume aussitôt. Prêt pour le message suivant. |
| **Graphique** | Le corps cellulaire revient à son état de repos. |
| **Science** | **Simplification assumée.** Escamote la période réfractaire, mais ne fait rien croire de faux. |

---

## 1C — L'axone : ça part, et ça file

### Temps 12

| | |
|---|---|
| **Texte** | Une fois partie, l'impulsion descend le long de l'**axone**. Un neurone a des milliers d'entrées, mais **un seul axone**. |
| **Graphique** | Caméra sur l'axone. Surbrillance **magenta** sur la partie, et le mot « axone » en magenta dans le texte. L'impulsion descend en **bleu**. |
| **Science** | « Un seul axone » : **vérifié**. **Ne pas écrire** « des centaines de dendrites », qui compte mal l'objet : quelques dendrites primaires, très ramifiées. |

### Temps 13

| | |
|---|---|
| **Texte** | Cette impulsion est bien un signal **électrique**. Mais pas comme dans un câble : c'est un basculement qui se propage, de proche en proche. |
| **Graphique** | L'impulsion **bleue** avance par étapes visibles plutôt qu'en glissant. |
| **Science** | **Garde-fou indispensable**, et **seul endroit où le site dit que le signal est électrique**. La formulation affirme d'abord, puis corrige : nier une idée que le visiteur n'a jamais eue reviendrait à la lui souffler. Le site ne détaille pas les ions, faute de temps, et cette phrase suffit à empêcher l'idée fausse du courant dans un câble. Elle prépare aussi le passage au chimique en 1D temps 21, qui n'aurait aucun relief sans elle. |

### Temps 14 — la lenteur

| | |
|---|---|
| **Texte** | Sur un axone nu, c'est lent. Beaucoup trop lent pour tes deux centièmes de seconde. |
| **Graphique** | L'impulsion **bleue** descend lentement un axone à l'**encre**. Le chronomètre de l'acte 0 réapparaît et **dépasse largement** les deux centièmes. |
| **Science** | **Vérifié, [S3].** 0,5 à 3 m/s sans myéline. La lenteur crée la question à laquelle la myéline répond. |

### Temps 15 — la myéline

| | |
|---|---|
| **Texte** | D'où ceci : une gaine, posée par morceaux le long de l'axone. On l'appelle la **myéline**. |
| **Graphique** | La gaine se pose sur l'axone, en **vert**, par segments espacés. Premier vert du site. Le mot « myéline » en magenta dans le texte. |
| **Science** | **Vérifié.** **Premier endroit du site où le mot apparaît**, conformément à la règle : aucune notion avant la section qui l'explique. |

### Temps 16 — LE SECOND MOMENT INTERACTIF : le défi du chronomètre

| | |
|---|---|
| **Texte** | À toi. Ajoute de la myéline jusqu'à ce que le message arrive à temps. |
| **Science** | **Vérifié, [S1] et [S3].** Modèle et validation détaillés ci-dessous. |

#### Ce que le visiteur voit

Trois choses, et rien d'autre :

1. **L'axone**, à l'encre, divisé en **six segments** visibles. Au départ,
   aucun n'est couvert.
2. **Un chronomètre**, qui affiche le temps mis par le message pour parcourir
   tout le trajet.
3. **Une cible : `0,02 s`**, affichée en permanence à côté du chronomètre.
   Ce n'est pas un nombre inventé pour l'occasion : **c'est le chiffre annoncé
   au premier écran du site**, et il est marqué comme tel.

#### Ce qu'il fait

Il ajoute des segments de gaine, un par un. À chaque ajout, **l'impulsion
repart du haut** et le chronomètre affiche le nouveau temps. Six segments,
donc six gestes au maximum.

#### Ce qui s'affiche, segment par segment

| Segments couverts | Temps affiché | Ce que le visiteur constate |
|---|---|---|
| 0 sur 6 | **0,51 s** | une demi-seconde, c'est énorme |
| 1 sur 6 | 0,43 s | ça descend |
| 2 sur 6 | 0,35 s | ça descend encore |
| 3 sur 6 | 0,27 s | la moitié du chemin couverte, temps divisé par deux |
| 4 sur 6 | 0,18 s | |
| 5 sur 6 | **0,10 s** | **toujours cinq fois trop lent** |
| 6 sur 6 | **0,02 s** | **cible atteinte** |

#### La leçon, et elle n'est pas celle que j'avais prévue

Le calcul a révélé mieux que « plus il y a de myéline, plus c'est rapide ».

**À cinq segments sur six, le message est encore cinq fois trop lent.** Le
dernier segment, à lui seul, divise le temps par cinq.

La raison est simple et vraie : **le signal passe presque tout son temps dans
les portions restées nues.** Couvrir 83 % du trajet ne sert presque à rien
tant qu'il reste 17 % à ramper. Ce n'est pas une propriété du jeu, c'est de
l'arithmétique physique.

C'est un bien meilleur enseignement que la proportionnalité attendue, pour
trois raisons :

- **Il est contre-intuitif**, donc il se retient.
- **Il est vrai**, et il explique pourquoi une perte même partielle de myéline
  est dévastatrice, ce qui est la réalité des maladies démyélinisantes.
- **Il rend le dernier clic spectaculaire** au lieu d'être anecdotique.

Le texte du temps 17 doit donc dire cela, et pas « plus il y en a, mieux
c'est ».

#### Le modèle, et pourquoi il est honnête

Temps total = temps dans les portions nues + temps dans les portions
myélinisées + une part fixe.

| Paramètre | Valeur | Justification |
|---|---|---|
| Longueur du trajet | 1 m | ordre de grandeur cortex → main. **Non affichée au visiteur**, tant qu'elle n'est pas sourcée |
| Vitesse sans myéline | 2 m/s | dans la plage 0,5 à 3 m/s de [S3] |
| Vitesse avec myéline | 100 m/s | dans la plage, plafond 120 m/s de [S3] |
| Part fixe | 0,011 s | relais synaptiques et traitement central, cohérent avec un temps de conduction centrale de 9 à 10 ms |

**La validation qui compte** : à six segments sur six, le modèle donne
**0,021 s**. La mesure réelle de [S1] est de **0,0214 s**. Le modèle retombe
sur la valeur mesurée sans avoir été forcé : les vitesses choisies sont au
milieu de leurs plages publiées, pas ajustées pour arriver au bon résultat.

C'est ce qui autorise à afficher ces nombres au visiteur.

#### Les réserves scientifiques, à transmettre à l'audit

- **Un axone partiellement myélinisé est une situation de laboratoire ou de
  maladie**, pas un état normal de développement. Le défi est un dispositif
  pédagogique, pas la description d'un axone en train de se construire. Le
  texte ne doit jamais laisser croire que la myéline se pose morceau par
  morceau au fil de la vie.
- **La démyélinisation réelle ne fait pas que ralentir** : elle provoque aussi
  des blocages de conduction, où le signal ne passe plus du tout. Le modèle ne
  représente que le ralentissement. **Simplification assumée**, à ne pas
  contredire ailleurs.
- Les temps affichés sont des **sorties de modèle**, pas des mesures, sauf la
  valeur finale qui coïncide avec [S1].

#### Accessibilité

- Deux boutons, **« ajouter un segment »** et **« retirer un segment »**, plus
  un `<input type="range">` natif de 0 à 6 pour qui préfère. **Aucune
  dépendance au glissement**, conformément au critère WCAG 2.5.7.
- Après chaque changement, annonce en `aria-live` : « quatre segments sur six.
  Le message met 0,18 seconde. Objectif : 0,02 seconde. »
- **Aucune limite de temps, aucun état d'échec.** Le visiteur peut rester à
  deux segments et continuer sa lecture : le temps 17 donne la réponse de
  toute façon.
- Le succès n'est pas signalé par la seule couleur : la cible affiche aussi le
  mot « atteint ».

#### Pour la démonstration de 3 minutes

Six segments, donc **six clics**, ou un seul geste sur le curseur. Le moment
tient en **quinze secondes** : deux ou trois clics pour montrer que ça descend,
puis le dernier pour l'effet. C'est le second des deux seuls moments où le jury
verra quelqu'un manipuler quelque chose.

### Temps 17 — le constat

| | |
|---|---|
| **Texte** | Tu as vu ? Tant qu'il reste un bout à découvert, le message y perd tout son temps. Il faut la gaine **partout**. Alors le signal saute d'un morceau au suivant au lieu de ramper : jusqu'à **cinquante fois plus vite**. |
| **Graphique** | Comparaison côte à côte : l'axone nu du temps 14, en fantôme à l'**encre**, et celui que le visiteur vient d'équiper, en **vert**. Départ simultané. |
| **Science** | **Vérifié, [S3].** Conduction saltatoire. Le rapport de 50 est l'ordre de grandeur entre 120 m/s et 2 à 3 m/s, présenté comme un « jusqu'à ». **Ce temps énonce la leçon que le visiteur vient de découvrir en manipulant**, plutôt que de l'affirmer avant. |

### Temps 18

| | |
|---|---|
| **Texte** | Voilà pourquoi ça va si vite. |
| **Graphique** | Le chronomètre retombe sur deux centièmes de seconde, en **bleu**. |
| **Science** | **Vérifié, [S1] et [S3].** Charnière du récit : ce temps referme la question ouverte à l'acte 0, temps 4. |

---

## 1D — Les terminaisons : on passe le relais

### Temps 19

| | |
|---|---|
| **Texte** | Tout en bas, l'axone se divise en petites branches, chacune finie par un renflement. |
| **Graphique** | Caméra sur les terminaisons. Surbrillance **magenta**. |
| **Science** | **Vérifié.** |

### Temps 20

| | |
|---|---|
| **Texte** | Et là, surprise : la cellule suivante n'est pas collée. Il reste un vide. |
| **Graphique** | Zoom sur un renflement. L'espace avec la cellule suivante devient visible, à l'**encre**. |
| **Science** | **Sourcé, [S9], et le sourçage a évité une erreur.** La fente mesure 20 à 30 nm entre neurones, mais **environ 50 nm à la jonction neuromusculaire**, à cause de la lame basale. Le récit se terminant sur un muscle, la valeur de 20 nm aurait été fausse. **Aucun chiffre n'est affiché** : le point pédagogique est qu'il **existe** un vide, pas sa mesure. |

### Temps 21

| | |
|---|---|
| **Texte** | Alors le message change de forme : il devient chimique. Le renflement libère des **messagers** qui traversent le vide et vont toucher la cellule d'en face. |
| **Graphique** | Les messagers, en **orange fluo**, traversent et atteignent la cellule suivante. Premier et seul vermillon du site. Le mot « messagers » en magenta. |
| **Science** | **Vérifié** dans les grandes lignes. **Simplification assumée** : ni vésicules, ni récepteurs, ni calcium. Rien de faux. |

### Temps 22

| | |
|---|---|
| **Texte** | Et de l'autre côté, tout recommence. |
| **Graphique** | La cellule suivante s'illumine en **bleu** à son tour, et le regard s'élargit sur la chaîne. |
| **Science** | **Vérifié.** Reboucle sur le temps 1 de l'acte, la chaîne de cellules. |

---

# ACTE 2 — Retour au corps

**Rôle : refermer la boucle, et réparer une simplification avant qu'elle ne
devienne une idée fausse.**

### Temps 23

| | |
|---|---|
| **Texte** | Le dernier maillon de la chaîne ne parle pas à un neurone. Il parle à un muscle. |
| **Graphique** | La caméra recule, la chaîne réapparaît, puis la silhouette de l'acte 0, à l'**encre**. |
| **Science** | **Vérifié.** Jonction neuromusculaire. |

### Temps 24

| | |
|---|---|
| **Texte** | Le muscle se contracte. Ton doigt appuie. |
| **Graphique** | La silhouette entière, le trajet allumé en **bleu** de la tête au doigt, exactement comme à l'acte 0, mais **on sait maintenant ce qu'il contient**. |
| **Science** | **Vérifié.** |

### Temps 25 — la réparation

| | |
|---|---|
| **Texte** | Une dernière chose. On a suivi **un** neurone. Mais pour un seul geste, ton corps en a mobilisé **des centaines**, qui ont envoyé des centaines d'impulsions, ensemble. |
| **Graphique** | Le trait **bleu** unique se démultiplie en faisceau. |
| **Science** | **Vérifié, [S4].** Un mouvement volontaire recrute de nombreuses unités motrices déchargeant 8 à 25 fois par seconde. **Ce temps existe précisément pour réparer la simplification « un neurone, une impulsion »** avant qu'elle ne reste comme une idée fausse. Le site en ligne affirme « une impulsion électrique, et une seule », ce qui est **faux**. |

### Temps 26

| | |
|---|---|
| **Texte** | Tout ça, pour un clic. |
| **Graphique** | Retour au bouton **magenta** du tout premier écran. |
| **Science** | Chute. Referme le récit sur son point de départ. |

---

# ACTE 3 — Le quiz

**Rôle : vérifier qu'on a suivi, sans jamais punir.**

## Les principes

**Cinq questions, pas une de plus.** Le site s'adresse à des collégiens et la
présentation dure trois minutes.

| Principe | Pourquoi |
|---|---|
| **Aucun score affiché** | On ne dit jamais « 3 sur 5 ». Un score transforme une lecture en évaluation, et c'est exactement ce que le site n'est pas |
| **Une explication après CHAQUE réponse** | Juste ou fausse. La question n'est pas là pour trier, elle est là pour faire revenir une idée une dernière fois |
| **Les mauvaises réponses sont les vraies idées fausses** | Pas des pièges. Chaque mauvaise réponse est une erreur qu'un collégien commet réellement, et l'explication la répare |
| **On peut se tromper autant qu'on veut** | Aucune limite de temps, aucune tentative comptée, aucun verrouillage |
| **On interroge ce qui a été MANIPULÉ** | Trois questions sur cinq portent sur les deux moments interactifs. C'est là que la compréhension s'est jouée |

## Le déroulé

Les questions **s'empilent** : répondre à l'une fait apparaître la suivante
juste en dessous, et les précédentes restent lisibles avec leur explication.
C'est la même dynamique que le reste du site, mais déclenchée par la réponse
plutôt que par le défilement, comme le bouton de l'acte 0.

---

### Question 1 — le sens du trajet

> **Dans un neurone, le message circule dans quel sens ?**
>
> - Des dendrites vers l'axone
> - De l'axone vers les dendrites
> - Dans les deux sens, ça dépend

**Bonne réponse : des dendrites vers l'axone.**

**Explication, affichée dans tous les cas :** toujours dans ce sens, jamais
l'inverse. C'est pour ça que le neurone est dessiné à la verticale sur ce
site : il descend, comme le message.

*Renvoie à l'acte 1.*

> **Pourquoi « axone » et pas « terminaisons ».** La première version proposait
> « des dendrites vers les terminaisons », ce qui donnait la réponse : l'ordre
> des mots reproduisait l'ordre dans lequel le site a présenté les parties, et
> il suffisait de se souvenir de la liste. Avec « axone », il faut vraiment
> savoir dans quel sens ça circule.

---

### Question 2 — le tout ou rien

> **Deux neurones dépassent leur seuil. Le premier le dépasse tout juste, le
> second le dépasse très largement. Que se passe-t-il ?**
>
> - Le second envoie une impulsion plus forte
> - Les deux envoient exactement la même impulsion
> - Le second envoie une impulsion plus longue

**Bonne réponse : les deux envoient exactement la même impulsion.**

**Explication :** c'est la loi du tout ou rien. Comme un interrupteur : appuyer
plus fort n'allume pas la lumière plus fort. Ce qu'un neurone fait varier, ce
n'est pas la force de son impulsion, c'est le **nombre** d'impulsions qu'il
envoie.

*Renvoie au curseur du seuil, acte 1B. La dernière phrase prépare la question 5.*

> **Pourquoi cette formulation.** La première version disait « tu envoies au
> neurone beaucoup plus de messages », ce qui posait deux problèmes. Le visiteur
> n'envoie rien, il actionne un curseur. Et « beaucoup plus » n'avait aucun point
> de comparaison : plus que quoi ? En mettant **deux neurones côte à côte**, la
> comparaison est dans la question elle-même, et il n'y a plus rien à deviner.

---

### Question 3 — la myéline

> **À quoi sert la myéline ?**
>
> - À faire voyager le message beaucoup plus vite
> - À protéger l'axone des chocs
> - À fabriquer l'impulsion

**Bonne réponse : à faire voyager le message beaucoup plus vite.**

**Explication :** avec elle, le signal saute d'un morceau au suivant au lieu de
ramper. Jusqu'à cinquante fois plus vite. Et il en faut sur **tout** le trajet :
s'il reste un bout à découvert, le message y perd presque tout son temps.

*Renvoie au défi du chronomètre, acte 1C. Vérifiée en [S3].*

> **Pourquoi la question a été simplifiée.** La première version demandait si le
> message arrivait à temps avec « cinq segments d'axone sur six » recouverts.
> Trop dur, et surtout mal posé : rien dans l'énoncé ne disait ce qu'était un
> segment ni combien il en fallait, donc la question testait la mémoire d'un
> réglage plutôt que la compréhension.
>
> **L'idée contre-intuitive n'est pas perdue, elle est déplacée dans
> l'explication**, où elle arrive comme un supplément plutôt que comme un piège.
> C'est sa place naturelle : le visiteur l'a déjà découverte en manipulant, le
> quiz n'a pas à la lui faire redécouvrir sous la contrainte.

---

### Question 4 — la synapse

> **Entre deux neurones, qu'est-ce qui franchit le vide qui les sépare ?**
>
> - Une étincelle électrique
> - Des messagers chimiques
> - Rien, les deux neurones se touchent

**Bonne réponse : des messagers chimiques.**

**Explication :** le message change de forme en route. Électrique à l'intérieur
du neurone, chimique pour passer d'un neurone au suivant.

*Renvoie à l'acte 1D. Les deux mauvaises réponses sont les deux idées fausses
les plus répandues, et l'explication répare les deux d'un coup.*

---

### Question 5 — ce qu'on a simplifié

> **Pour que ton doigt appuie sur l'écran, combien de neurones ont travaillé ?**
>
> - Un seul, celui qu'on a suivi
> - Deux, un pour partir et un pour arriver
> - Des centaines

**Bonne réponse : des centaines.**

**Explication :** on en a suivi **un** pour comprendre comment ça marche. Mais
ton corps en a mobilisé des centaines, en même temps, chacun envoyant sa propre
série d'impulsions.

*Renvoie à l'acte 2 temps 25. **Cette question a une fonction particulière :
elle verrouille la réparation de la simplification centrale du site.** Un
visiteur qui répond « un seul » est précisément celui qui serait reparti avec
l'idée fausse, et il reçoit l'explication au dernier moment utile. Vérifiée
en [S4].*

---

## Après la cinquième question

> **Texte :** Voilà. Tu sais maintenant ce qui s'est passé entre ta tête et ton
> doigt quand tu as cliqué sur ce bouton, tout au début.

**Graphique :** le bouton magenta du tout premier écran réapparaît, cliquable.
Le cliquer relance l'impulsion bleue le long de la silhouette, une dernière
fois.

Aucun bilan, aucun score, aucune note. La seule chose affichée est cette
phrase.

> **« Entre ta tête et ton doigt », et surtout pas « dans ton bras ».** Le
> trajet part du cortex moteur, descend la moelle épinière, puis seulement
> gagne le bras. Dire « dans ton bras » amputerait le parcours de sa plus
> grande partie, et contredirait la silhouette de l'acte 0, où le trait part
> de la tête.

---

## Accessibilité

Le quiz est l'endroit du site où les exigences se concentrent, parce que c'est
là que le visiteur interagit le plus.

- **Groupes de boutons radio natifs**, un par question, donc pilotables aux
  flèches du clavier sans une ligne de JavaScript. Chaque groupe porte un
  `<fieldset>` et une `<legend>` qui reprend la question.
- **Le résultat n'est jamais signalé par la seule couleur.** Toujours un mot :
  « bonne réponse » ou « pas tout à fait », plus une icône de forme distincte.
  Une capture en noir et blanc reste compréhensible.
- **L'explication est annoncée en `aria-live="polite"`** dès qu'elle apparaît.
- **Aucune limite de temps, aucune tentative comptée**, conformément à WCAG
  2.2.1 et au document COGA.
- **Aucune interaction au glisser**, conformément à WCAG 2.5.7.
- Les cibles font au moins 44 × 44 px.
- Sans JavaScript, les questions et **leurs réponses** restent lisibles : le
  quiz devient une liste de questions-réponses, ce qui est dégradé mais pas
  cassé.

## Pour la démonstration de 3 minutes

**Le quiz ne sera pas montré en entier.** Une seule question suffit, et c'est
**la question 2**, celle des deux neurones : elle se comprend en trois secondes
sans contexte, elle porte sur une manipulation, et son explication contient la
phrase qui résume le mieux le site, à savoir qu'un neurone ne fait pas varier
la force de son message mais leur nombre.

---

# Les erreurs du site en ligne, récapitulées

| Affirmation actuelle | Verdict | Correction | Source |
|---|---|---|---|
| « moins d'un centième de seconde » | **Faux**, facteur 2 | « deux centièmes de seconde » | [S1] |
| « une impulsion électrique, et une seule » | **Faux** | supprimée ; traitée à l'acte 2 temps 24 | [S4] |
| « des milliers de messages en même temps » | **Imprécis** | « des milliers d'autres neurones lui parlent » | [S2] |
| « des centaines de dendrites » | **Imprécis** | « des milliers d'entrées, mais un seul axone » | [S2] |

---

# Les éléments graphiques

| Élément | Où | Couleur | État |
|---|---|---|---|
| Le bouton d'ouverture | 0, t1 | magenta | **existe** |
| La silhouette de face, unisexe | 0, t2 | encre | **existe**, pictogramme au trait |
| Le trajet qui s'allume | 0, t3 | **bleu** | **existe**, se trace au défilement avec sa phrase, pièce 1 |
| Le zoom du corps vers la cellule | 0 → 1 | **bleu** | **existe**, pièce 2 : la caméra plonge dans le trait, asservie au défilement, jusqu'à ce qu'il soit une large bande |
| La chaîne de cellules | 1, t1 | encre | **existe**, pièce 2 : **trois neurones réduits à un cercle et un trait**, bout à bout dans la bande, décision de l'utilisateur après avoir vu une version en capsules. Au temps 2, la bande et les deux autres s'effacent, celui du milieu reste seul, puis le neurone entier se dessine à sa place |
| Le neurone au trait | 1, t2 | encre | **existe** |
| Les boutons du parcours | 1, t3 | encre | **existe**, n'apparaissent qu'au temps 3, pièce 2 |
| Les messages qui convergent | 1A | **bleu** | **existe**, pièce 4 : les mêmes points que ceux du curseur |
| **Le curseur du seuil** | 1B, t8 | bleu + magenta | **existe**, pièce 4, `js/seuil.js` |
| La courbe du potentiel d'action | 1B, t8 | **bleu** | **existe**, se trace au passage du seuil, ou au plus tard avec la phrase qui nomme le seuil |
| L'impulsion qui descend l'axone | 1C, t12 | **bleu** | **existe**, pièce 5 : au temps 14, lente sur l'axone nu, puis à chaque geste du défi |
| La gaine de myéline | 1C, t15 | **vert** | **existe**, pièce 5 : six bandes cernées d'encre, posées par le visiteur |
| **Le défi du chronomètre** | 1C, t16 | vert + bleu | **existe**, pièce 5, `js/myeline.js`, temps du modèle affichés tels que calculés ci-dessus |
| La comparaison nu contre myélinisé | 1C, t17 | encre + vert | **à créer** |
| Le vide synaptique | 1D, t20 | encre | **existe**, pièce 6 : cadrage sur le renflement du milieu et le bord de la cellule d'en face |
| Les messagers chimiques | 1D, t21 | **orange fluo** | **existe**, pièce 6 : quatre points cernés d'encre qui traversent le vide, `js/synapse.js` |
| Le retour à la silhouette | 2, t24 | **bleu** | **existe**, pièce 6 : la caméra recule de la chaîne à la silhouette entière |
| Le faisceau de neurones | 2, t25 | **bleu** | **existe**, pièce 6 : quatre copies décalées du trajet |

**Les deux moments interactifs** sont les seuls endroits où le visiteur agit,
en dehors du bouton d'ouverture. Ils sont placés aux deux nœuds du récit : la
décision, et la vitesse. Et ils enseignent deux formes de causalité
différentes, en tout ou rien d'un côté, progressive de l'autre.

---

# Ce qui reste à faire sur ce document

1. ~~Sourcer les six valeurs en attente~~ **fait**. Les onze fiches de
   `10-SOURCES.md` couvrent toutes les affirmations chiffrées du récit, et
   le sourçage a évité trois erreurs
2. ~~Écrire l'acte 3, le quiz~~ **fait**
3. Faire relire l'ensemble par l'utilisateur
4. **Ne toucher au site qu'une fois ce document stabilisé**

## Si le temps le permet, et seulement dans ce cas

Ces éléments sont **hors du socle**. Ils ne seront abordés qu'une fois les
actes 0 à 3 en ligne et testés.

| Élément | Description |
|---|---|
| **Une section « Pour aller plus loin »** | Des ressources sur chacun des points abordés, pour le visiteur qui veut continuer. Demande de l'utilisateur. Elle a un intérêt particulier ici : elle permet de **rendre visibles les onze sources** de `10-SOURCES.md`, ce qui montre au jury que le site est sourcé sans alourdir le récit. À destiner à trois publics distincts : un collégien curieux, un enseignant, et un lecteur qui veut les articles d'origine |
| L'ouverture vers l'IA et les réseaux de neurones | L'angle de thèse de l'utilisateur, écarté du socle mais gardé en réserve |
| Un deuxième niveau de lecture | Un bouton « Aller plus loin » ouvrant partout un encart plus technique |
| La narration audio par section | Non promis : la qualité de la synthèse vocale française dépend de la machine du visiteur |
| La phrase de Katz et Miledi | Le délai synaptique ne vient pas de la traversée du vide mais du temps de libération des messagers. Contre-intuitif et joli, mais coûte un temps de défilement. Voir [S10] |
