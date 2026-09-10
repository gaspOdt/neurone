# 07 — Étude de l'existant

Ce document a deux fonctions : **nourrir la conception**, et **armer la
présentation de 3 minutes**. Savoir répondre à « pourquoi ce site plutôt qu'un
autre ? » avec des noms précis vaut beaucoup devant un jury d'institut.

---

## Le budget de poids, mesuré et non supposé

Le plan posait « moins de 1 Mo » au doigt mouillé. **Mesure faite sur les
références réelles, c'était dix fois trop généreux.**

Relevés dans un navigateur, viewport mobile, poids **transféré** (donc compressé,
tel que le visiteur le télécharge vraiment) :

| Site | Requêtes | Transféré | Décompressé |
|---|---|---|---|
| [ncase.me/polygons](https://ncase.me/polygons/) | 23 | **25 Ko** | 46 Ko |
| [ciechanow.ski/gears](https://ciechanow.ski/gears/) | 13 | **51 Ko** | 231 Ko |
| [playground.tensorflow.org](https://playground.tensorflow.org/) | 7 | **111 Ko** | 443 Ko |
| **Notre site (jour 1)** | 9 | **104 Ko** | 205 Ko |

**La leçon.** Ciechanowski, la référence esthétique du projet, tient en 51 Ko
pour une page bourrée de simulations. La raison : **tout est dessiné par le code,
rien n'est une image**. Aucun asset lourd, aucune vidéo, aucune bibliothèque
d'animation — il écrit son moteur à la main.

### Où part notre poids

| Poste | Gzip | Part |
|---|---|---|
| Police Inter | 47 Ko | 45 % |
| GSAP + ScrollTrigger + DrawSVG | 47 Ko | 45 % |
| **Notre propre code** | **7 Ko** | **7 %** |

**91 % de notre poids est du tiers.** C'est le vrai enseignement : notre code
n'est pas le problème, nos dépendances le sont.

### Budget retenu : 150 Ko transférés

Justification : sous TensorFlow Playground, au-dessus de Ciechanowski — assumé,
puisque nous chargeons une police et une bibliothèque d'animation qu'il n'a pas.
Il reste **~45 Ko pour tout le contenu des sept sections restantes**, ce qui est
large : les schémas sont des SVG en ligne, qui pèsent quelques centaines d'octets.

Deux leviers si on approche du plafond :

1. **Sous-ensembler la police en fin de projet.** Inter latin fait 47 Ko. Réduite
   aux seuls caractères réellement employés sur le site (`pyftsubset`), elle
   tomberait autour de 15-20 Ko. À faire une fois tous les textes figés.
2. **MorphSVG n'est pas chargé** pour l'instant : le fichier est dans le dépôt
   mais absent de `index.html`, donc les visiteurs ne le téléchargent pas. Ne
   l'ajouter que le jour où on s'en sert vraiment.

---

## Ce qui existe déjà sur le neurone — et pourquoi ça ne suffit pas

| Ressource | Ce qu'elle fait bien | Sa limite |
|---|---|---|
| [PhET « Neuron »](https://phet.colorado.edu/en/simulations/neuron) (Univ. Colorado) — [code ouvert](https://github.com/phetsims/neuron), CC-BY | La simulation ionique la plus rigoureuse du web. Pause, rembobinage, canaux de fuite et canaux vannés | Interface de laboratoire, sans récit ni direction artistique. On ne « tombe » pas dedans, on l'utilise en cours |
| [BrainFacts — Action Potential](https://www.brainfacts.org/for-educators/for-the-classroom/2025/action-potential-interactive-062325) (Society for Neuroscience) | Caution scientifique, pensé pour l'enseignement | Esthétique datée, aucune narration |
| [LabXchange](https://www.labxchange.org/library/items/lb:LabXchange:0185aa05:lx_simulation:1) (Harvard) | Contenu solide, modulaire | Générique, sans point de vue |
| [Neuroscience for Kids](https://faculty.washington.edu/chudler/ap.html) (Univ. Washington) | Référence historique, très complet | Page des années 2000, non responsive |
| [Neuronify](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5355897/) (Univ. Oslo) | On construit des circuits neuronaux à la main | Pour étudiants avancés, pas pour des collégiens |
| [Le cerveau à tous les niveaux](https://www.blog-lecerveau.org/) (McGill) | **La meilleure ressource en français**, trois niveaux de lecture | Austère, très textuel, aucune interaction |

**Le constat qui justifie le projet.** Le contenu neuroscientifique interactif
est abondant et scientifiquement solide, mais il est presque toujours **conçu
comme un outil de classe, pas comme une expérience**. Et en français, l'offre
interactive et belle est quasi inexistante. Personne n'a fait « Ciechanowski
appliqué au neurone, en français, pour des collégiens ».

**C'est la fenêtre de tir, et c'est l'argument à tenir en entretien.**

---

## Le niveau à viser

### La forme

**[ciechanow.ski](https://ciechanow.ski/) — la cible n°1.** Fond clair, schémas
au trait, un widget manipulable par concept, zéro bibliothèque. Voir
[Gears](https://ciechanow.ski/gears/) et
[Cameras and Lenses](https://ciechanow.ski/cameras-and-lenses/) pour la manière
d'alterner texte et manipulation. Sa légèreté (51 Ko) est une leçon en soi :
**dessiner par le code plutôt que charger des images**.

### La pédagogie

**[Parable of the Polygons](https://ncase.me/polygons/)** (Vi Hart & Nicky Case)
— **la cible n°1 côté méthode**. Le lecteur comprend en manipulant, pas en
lisant. Le texte construit couche par couche jusqu'à ce qu'il puisse jouer seul
avec le modèle. C'est exactement le rapport « beau d'abord, jeu en récompense »
qu'on cherche. Et 25 Ko.

### Les catalogues à dépouiller

- [explorabl.es](https://explorabl.es) — le catalogue historique du genre
- [awesome-explanations](https://github.com/BHSPitMonkey/awesome-explanations)
- [ncase.me/projects](https://ncase.me/projects/)
- [Information is Beautiful Awards](https://www.informationisbeautifulawards.com/)
- [Les visuels préférés de *Science* en 2025](https://www.science.org/content/article/science-s-favorite-news-visuals-2025)

### Le contre-exemple utile

[Nobel Prize Educational Games](https://educationalgames.nobelprize.org/) —
contenu prestigieux, forme vieillie. À citer pour montrer que le prestige
scientifique ne suffit pas à faire un bon objet pédagogique.

---

## Reste à faire

Cette étude est une première passe. À approfondir :

1. **Dépouiller intégralement** awesome-explanations et explorabl.es, en extraire
   ce qui touche au vivant.
2. **Tester chaque référence sur mobile** — beaucoup sont cassées sur téléphone,
   et c'est précisément notre terrain.
3. **Éplucher les palmarès** : Awwwards, les pages graphiques du *New York Times*,
   du *Guardian*, de *Reuters*, du *Pudding* sur le corps et le vivant.
4. **Chercher les musées** : Cité des Sciences, Exploratorium, Science Museum,
   Wellcome Collection.
5. **Chercher le français** : Inserm, CNRS, Universcience, Institut du Cerveau.
   Confirmer ou infirmer le trou dans l'offre francophone.
6. **Lire le code de PhET « Neuron »** pour la justesse de leur modèle ionique —
   s'en inspirer sans copier ni l'interface ni le code.

Grille commune à chaque fiche : *ce que ça fait bien / ce que ça rate / ce qu'on
lui prend / est-ce que ça marche sur mobile / combien ça pèse*.

---

## Le vrai juge reste le téléphone

Décision de l'utilisateur : **le budget de 150 Ko est un garde-fou, pas une loi.**
L'arbitre final est son propre téléphone. S'il teste et que c'est fluide, on ne
touche à rien même en dépassant ; si ça rame, on ajuste — et le premier levier
sera alors le sous-ensemblage de la police, puis GSAP.

À faire dès qu'une section est en ligne : **la tester sur son appareil réel**,
pas seulement dans un navigateur de bureau bridé.
