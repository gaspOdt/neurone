# 01 — Direction artistique

> Les valeurs concrètes vivent dans [`css/tokens.css`](../css/tokens.css).
> Ce document explique **pourquoi** elles sont ce qu'elles sont.
> Modifier une couleur ici sans la modifier là-bas ne sert à rien, et inversement.

---

## Le principe en une phrase

**De l'encre sur du papier blanc, et une couleur par idée.**

Le site doit ressembler à une page de livre d'art qui se serait mise à bouger,
pas à un logiciel éducatif. Calme, typographié, dessiné au trait — et le jeu
surgit à des moments précis, en récompense.

---

## Le fond et le trait

| | |
|---|---|
| Fond | Blanc pur `#FFFFFF` |
| Encre | `#1A1A1A` — pas du noir absolu, un peu plus doux à l'écran |
| Trait par défaut | 1,5 px |

Le blanc pur est une décision explicite de l'utilisateur. La première piste
explorée était l'inverse — fond indigo profond et fibres lumineuses, inspiré de
l'image du Blue Brain Project qu'il avait fournie. Il l'a écartée.

Ce choix est cohérent avec les deux références qu'il a données : ce sont des
**photos de pages de livre**, donc du blanc. Et les dessins de Ramón y Cajal,
matrice de toute l'iconographie neuroscientifique, sont de l'encre sur papier.

> **Une seule séquence sombre reste envisagée**, comme respiration unique au
> milieu du flux clair — exactement ce que fait le livre dont viennent les
> photos. Décision non tranchée.

---

## La palette

**Référence : [infrastructures-terrestres.com](https://www.infrastructures-terrestres.com),
cité par l'utilisateur.** Ce site n'écrit jamais en couleur. Son texte reste
noir, et la couleur arrive comme **un bloc derrière**, à la manière d'un
surligneur. C'est ce principe qui est repris ici, et il n'est pas seulement
esthétique : il est ce qui permet d'utiliser des couleurs fluo sans rien
sacrifier de la lisibilité.

### La règle

**Le texte est noir, toujours. La couleur passe derrière.**
**Les traits du dessin sont à l'encre. La couleur s'emploie en aplats.**

Mesures qui la justifient :

| Couleur | En fond, sous du texte noir | En trait fin sur blanc |
|---|---|---|
| Magenta `#FF6EF5` | **7,3:1** | 2,4:1 illisible |
| Vert `#00F58A` | **12,0:1** | 1,5:1 illisible |
| Orange `#FF7A29` | **6,7:1** | 2,6:1 illisible |
| Bleu électrique `#0066FF` | 3,6:1 | **4,8:1** |

Une couleur fluo est lumineuse, donc elle contraste mal avec du blanc et très
bien avec du noir. En fond, c'est un atout. En trait, c'est inutilisable.

### Les cinq couleurs

| Couleur | Représente | Emploi |
|---|---|---|
| **Encre** `#1A1A1A` | le dessin et le texte | traits et lettres |
| **Bleu électrique** `#0066FF` | **le signal** | **seule couleur autorisée en trait pur** |
| **Magenta fluo** `#FF6EF5` | « regarde ici » | bloc derrière un mot, surbrillance, bouton |
| **Vert fluo** `#00F58A` | la myéline | **une bande cernée d'encre**, jamais un trait |
| **Orange fluo** `#FF7A29` | les messagers chimiques | aplats cernés d'encre |

**Le filet d'encre autour des aplats fluo porte le contraste** que la couleur
ne peut pas porter. Sans lui, une bande verte n'aurait pas de bord défini sur
fond blanc.

### Les titres

**Encre noire, gros, gras. Sous-titre en encre douce. Aucun ornement.**

Pas de filet, pas de barre, pas de séparateur décoratif, nulle part dans le
site. La hiérarchie se fait par la taille, la graisse et le blanc. C'est une
demande explicite de l'utilisateur.

**Le titre n'est jamais bleu**, bien que le bleu soit le fil du récit, et
précisément pour cette raison : le bleu désigne une chose qui **se déplace**.
Un titre bleu au-dessus d'une impulsion bleue rendrait la couleur ambiguë.

### Daltonisme

Simulation des trois dichromatismes, distances calculées deux à deux :

- **Les couleurs du dessin sont sûres** : bleu, vert, orange et encre restent
  distinguables dans les trois cas, écart minimal de 86 pour un seuil de
  confusion à 60.
- **Le magenta se confond avec le vert en deutéranopie et avec l'orange en
  tritanopie.** Aucune variante n'y échappe : il n'existe aucune palette de
  quatre couleurs fluo passant toutes les paires.

**Ce n'est pas un défaut, parce que le magenta ne porte aucune information
scientifique.** Il dit « regarde ici », message déjà porté par l'épaisseur du
trait, le cadrage de la caméra et la graisse du mot. Il n'est jamais le seul
canal.

### La règle qui rend tout cela tenable

**Aucune information n'est jamais portée par la couleur seule.** Chaque élément
est identifié par couleur **et** forme **et** étiquette. Le test : une capture
en noir et blanc doit rester entièrement compréhensible.

> **`css/tokens.css` contient encore l'ancienne palette**, plus sourde, dérivée
> d'Okabe-Ito. Elle sera remplacée par les valeurs ci-dessus au moment de la
> reprise du site.

## La typographie

| | |
|---|---|
| Police | **Inter**, copiée dans le dépôt |
| Corps de texte | **21 px** |
| Interlignage | 1,55 |
| Largeur de lecture | ~34 rem, soit environ 62 caractères |

L'utilisateur a cité [infrastructures-terrestres.com](https://www.infrastructures-terrestres.com)
**pour la police de ses corps de texte**. Inspection faite, ce site utilise
**Univers** (Adrian Frutiger, 1957) à 21 px sur fond jaune vif.

Deux conclusions :

1. **Univers est commerciale** (Linotype), donc inutilisable. Remplacée par
   **Inter**, la plus proche d'après les comparatifs typographiques, et surtout
   la mieux dessinée pour l'écran — ce qui compte directement pour la contrainte
   « vieux téléphone ». Archivo et Work Sans ont été comparées puis écartées.
2. **Le corps à 21 px est repris tel quel.** C'est nettement au-dessus de
   l'usage courant, c'est un vrai parti pris, et ça se lit beaucoup mieux sur
   un téléphone. **Le fond jaune, lui, n'est pas repris** : l'utilisateur a cité
   la police, pas la couleur, et le jaune tire vers l'affiche là où le projet
   vise le livre.

---

## La grammaire d'animation

Reprise de **3Blue1Brown**, cité par l'utilisateur. Ce qu'on lui prend n'est
pas son fond sombre — c'est sa manière de bouger :

1. **Les objets se transforment, ils ne se coupent jamais.** Un schéma devient
   un autre par déformation continue. Le spectateur ne perd jamais le fil.
2. **La caméra recadre** pour diriger le regard : on zoome sur le détail qui
   compte, on dézoome pour resituer. En pratique : animation du `viewBox` du SVG.
3. **Construction progressive.** Le trait se dessine, puis se nomme, puis on
   bâtit dessus. **Jamais tout d'un coup** — c'est aussi une consigne explicite
   de l'utilisateur, et elle vaut pour le site entier.
4. **La couleur est un code tenu de bout en bout.** Voir la palette ci-dessus.
5. **Les étiquettes voyagent avec les objets** qu'elles désignent.
6. **Le rythme est lent et assumé.** Les choses restent à l'écran le temps
   d'être comprises.

Outils correspondants, tous gratuits depuis avril 2025 : `MorphSVG` pour les
transformations continues, `DrawSVG` pour le trait qui se dessine,
`ScrollTrigger` pour les apparitions au défilement.

---

## Le trait des schémas

Les dessins de **Santiago Ramón y Cajal** (mort en 1934) sont dans le **domaine
public**. On peut les utiliser tels quels, mais on préfère **les redessiner en
SVG dans leur esprit** : ça les rend animables, ça évite toute ambiguïté de
droits, et ça garantit qu'ils s'accordent entre eux.

Ce qu'on lui emprunte : le trait fin et nerveux, l'asymétrie organique — un vrai
neurone n'est jamais symétrique —, les ramifications qui s'affinent vers leurs
extrémités, et beaucoup de blanc autour.

---

## Ce qui reste ouvert

- La palette ne se juge vraiment qu'à l'écran, sur plusieurs sections. À revoir.
- La séquence sombre unique en respiration.
- Le schéma du neurone de la section 0 est un provisoire de jour 1, à remplacer
  par un vrai dessin.
