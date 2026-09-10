# 09 — Audit scientifique : protocole et rapport

> **État : l'audit n'a pas encore eu lieu.**
> Ce document contient pour l'instant **le protocole**. La section
> « Résultats » est vide et le restera jusqu'à ce que l'audit soit mené.
> **Ne jamais y écrire une conclusion qui n'a pas été établie.**

---

## Quand, et par qui

L'audit scientifique est la **dernière** étape de contrôle du projet, menée
**après** l'audit technique (`08-RAPPORT-TEST.md`), et par un **agent
distinct** de celui qui l'a mené.

L'ordre compte, et la séparation aussi. Vérifier l'exactitude d'un contenu que
le visiteur n'arrive pas à atteindre est du temps perdu, donc le technique
passe d'abord. Et surtout : **un site peut fonctionner parfaitement et
raconter des bêtises.** Ce sont deux contrôles différents, qui demandent deux
regards différents, et les confier au même agent revient à n'en faire qu'un.

## Pourquoi cet audit est indispensable ici

Le site s'adresse à des collégiens, mais il sera montré à des **chercheurs**,
dans le cadre d'une candidature à une mission de vulgarisation, au sein d'un
institut de recherche médicale.

Une approximation qui passe inaperçue auprès d'un enfant de 13 ans ne passera
pas auprès d'eux. Et c'est justement la compétence évaluée : **vulgariser,
c'est simplifier sans rendre faux.** Une erreur scientifique dans une pièce de
candidature à un poste de vulgarisation ne coûte pas un point, elle coûte le
poste.

---

## La distinction qui structure tout l'audit

C'est le cœur du travail, et la seule chose que l'auditeur doit avoir en tête
en permanence :

| | Statut | Exemple de raisonnement |
|---|---|---|
| **Simplification incomplète** | **Légitime.** Ne rien signaler | La phrase tait quelque chose, mais rien de ce qu'elle dit n'est faux, et le lecteur n'en conclura rien de faux |
| **Simplification fausse** | **À corriger** | La phrase installe une idée que le lecteur devra désapprendre plus tard |

**Le test à appliquer, phrase par phrase : « qu'est ce qu'un enfant de 13 ans
va CROIRE après avoir lu ça, et est ce que ce qu'il croit est vrai ? »**

Ce n'est pas la même question que « est ce que la phrase est exacte ». Une
phrase peut être littéralement exacte et faire croire une chose fausse, par
ce qu'elle laisse entendre ou par ce qu'elle passe sous silence.

---

## Ce qu'il faut contrôler

### 1. Chaque affirmation chiffrée, une par une, avec sa source

Sont concernées, entre autres, celles déjà présentes sur le site :
« moins d'un centième de seconde », « des milliers de messages en même temps »,
« des centaines de dendrites mais un seul axone », « presque un mètre ».

Pour chacune :

- Le chiffre est il juste, dans la bonne unité, du bon ordre de grandeur ?
- **Quelle est sa plage réelle ?** Les valeurs de neurosciences varient
  énormément selon l'espèce, le type de neurone et les conditions de mesure.
  **Une valeur unique présentée comme universelle est le piège le plus courant
  de la vulgarisation**, et il est presque toujours invisible.
- La source dit elle vraiment cela, ou est ce une citation de seconde main ?

### 2. Les simplifications pédagogiques

Passer chaque phrase au test du « qu'est ce qu'il va croire ». Signaler
uniquement ce qui rend faux.

### 3. Le vocabulaire

Chaque terme technique est il employé correctement ? Un terme employé de
travers est plus grave qu'un terme absent : il faudra le désapprendre.

Vérifier aussi l'**ordre d'introduction** : le site s'interdit de mentionner
une notion avant la section qui l'explique. La myéline ne doit apparaître
nulle part avant « Ça file », le seuil nulle part avant « Tout ou rien ».

### 4. Les schémas

**Un dessin affirme des choses, exactement comme une phrase.** Le dessin du
neurone est il anatomiquement défendable ? Le nombre et la ramification des
dendrites, la position du corps cellulaire, la longueur relative de l'axone,
le nombre de terminaisons, et la forme de la courbe du potentiel d'action.

Contrôler également les `<desc>` des SVG, qui décrivent ces dessins aux
lecteurs d'écran : ils affirment la même chose, en mots.

### 5. Ce qui est passé sous silence et qui peut induire en erreur

Le point le plus difficile, et le plus utile. Ce que le site laisse croire
**sans le dire**. Un silence peut être aussi trompeur qu'une erreur.

---

## La méthode

**Sources acceptables**, dans cet ordre :

1. Les manuels de référence : Kandel *Principles of Neural Science*, Purves
   *Neuroscience*, Bear *Neuroscience: Exploring the Brain*
2. La littérature primaire, avec son DOI
3. Les ressources institutionnelles, comme PhET Neuron, dont le modèle ionique
   est réputé rigoureux (voir `07-BENCHMARK.md`)

**Sources à ne pas utiliser** : les sites de vulgarisation, qui se recopient
entre eux. Une valeur qu'on retrouve sur vingt pages web peut n'avoir jamais
été vérifiée qu'une fois, et mal.

**Le réflexe à tenir : par défaut, réfuter.** Ne conclure qu'une affirmation
est juste qu'après l'avoir vérifiée soi même. Une valeur citée de mémoire
compte comme non vérifiée. Chercher activement une source qui contredit, et
pas seulement une source qui confirme.

**Deux angles distincts par affirmation**, parce qu'ils ne trouvent pas les
mêmes défauts :

- l'**exactitude** : le chiffre, l'unité, la plage, la source
- le **contresens** : ce que le lecteur va croire

---

## Le format du rapport

La sortie doit **séparer nettement** deux choses qui ne demandent pas la même
décision :

### A. Les erreurs à corriger

| Champ | Contenu |
|---|---|
| **Où** | la section, et la phrase exacte citée mot pour mot |
| **Ce qui est affirmé** | le contenu factuel, dégagé de la formulation |
| **Ce qui est vrai** | le fait exact, avec ses valeurs, ses unités et sa plage |
| **Source** | la référence précise, chapitre ou DOI |
| **Gravité** | fausse, ou imprécise au point de devoir changer |
| **Reformulation proposée** | la phrase corrigée, niveau collégien, dans le ton du site |

### B. Les choix de vulgarisation assumés

Les simplifications incomplètes mais légitimes, **listées quand même**. Pas
pour les corriger, mais pour que le choix soit tracé et défendable si un
membre du jury pose la question.

**L'agent d'audit ne corrige rien lui même.** Il signale, et les corrections
sont décidées ensuite. C'est la même règle que pour l'audit technique, pour la
même raison.

---

## Ce qui est déjà engagé

Une **première passe** a été lancée sur les affirmations déjà présentes dans
`index.html` : recensement exhaustif, sourçage, puis réfutation par deux
sceptiques indépendants, l'un sur l'exactitude, l'autre sur le contresens.

Ses résultats alimentent [`02-CONTENU.md`](02-CONTENU.md), qui rassemble le
texte de chaque section **avec ses sources**. L'objectif est que l'audit final
n'ait presque rien à trouver, parce que le travail aura été fait au fil de
l'eau plutôt qu'à la fin.

**Cette première passe ne remplace pas l'audit.** Elle est menée pendant
l'écriture, donc par quelqu'un qui n'a pas le regard extérieur exigé ici.

---

## Résultats

**Vide. L'audit n'a pas encore été mené.**

Il sera lancé quand les six sections et le quiz existeront, et **après**
l'audit technique.
