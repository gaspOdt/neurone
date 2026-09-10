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

## La palette sémantique

**Une couleur = un concept. Tenue du début à la fin. Jamais réattribuée.**

C'est l'idée de l'utilisateur, et elle est retenue parce que **trois exigences
du projet convergent dessus** :

- **La pédagogie** — le lecteur reconnaît un concept à sa couleur avant même
  d'en lire le nom.
- **La grammaire de 3Blue1Brown** — son quatrième principe est exactement celui-là.
- **L'accessibilité** — une palette Okabe-Ito, sûre pour toutes les formes de
  daltonisme.

Trois contraintes qui se renforcent au lieu de se gêner, c'est rare. On en profite.

### Les couleurs

| Concept | Graphique | Texte | Forme associée |
|---|---|---|---|
| **L'impulsion et Na⁺** — ce qui déclenche | `#0072B2` | `#0072B2` | disque **plein** |
| **K⁺** — le retour au repos | `#D55E00` | `#A34700` | anneau **creux** |
| **La myéline** — ce qui accélère | `#009E73` | `#007054` | gaine épaisse |
| **Les neurotransmetteurs** — ce qui franchit | `#A64D79` | `#A64D79` | petits triangles |

Le bleu couvre à la fois l'impulsion et le sodium parce que **l'entrée de Na⁺
*est* l'impulsion**. Une seule couleur pour une seule idée : ce n'est pas une
économie, c'est une justesse. Le vert pour la myéline vient directement de
l'utilisateur.

### Pourquoi deux valeurs par concept

Sur fond blanc, **trois des quatre couleurs Okabe-Ito n'atteignent pas le
rapport de 4,5:1 exigé pour du texte.** Ratios mesurés :

| Couleur | Sur blanc | Verdict |
|---|---|---|
| `#0072B2` bleu | 5,1:1 | bon partout |
| `#D55E00` vermillon | 3,9:1 | graphiques seulement |
| `#009E73` vert | 3,4:1 | graphiques seulement |
| `#CC79A7` violet Okabe-Ito | 3,0:1 | **trop juste même pour un trait** — remplacé par `#A64D79`, à 5,2:1 |

D'où la règle : `--c-X` pour les aplats et les traits, `--c-X-text` dès qu'un
mot doit être lu. **Ne jamais écrire du texte avec `--c-X`.**

### La règle qui ne se négocie pas

**Aucune information n'est jamais portée par la couleur seule.**

Chaque concept est identifié par **trois canaux simultanés** — couleur, forme
et étiquette. Na⁺ est un disque plein bleu marqué « Na⁺ ». K⁺ est un anneau
creux vermillon marqué « K⁺ ». Une capture d'écran en noir et blanc doit rester
entièrement compréhensible : c'est le test.

Le retour du quiz suit la même règle. « Vert = bon, rouge = faux » est
précisément le couple que ne distinguent pas les daltonismes rouge-vert, donc
le résultat est toujours doublé d'un mot et d'une icône.

---

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
