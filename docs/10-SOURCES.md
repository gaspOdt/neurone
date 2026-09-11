# 10 — Sources

> **Référentiel unique des sources du projet.**
> Toute affirmation chiffrée du site doit renvoyer à une clé de ce document.
> [`02-CONTENU.md`](02-CONTENU.md) cite ces clés en face de chaque phrase.
>
> **Règle absolue : aucune valeur n'est écrite dans le site avant d'être
> entrée ici.** Une valeur citée de mémoire compte comme non vérifiée, même
> si elle se révèle juste par la suite.

---

## Ce qui est accepté comme source

Dans cet ordre de préférence :

1. **La littérature primaire**, avec son DOI ou son PMID
2. **Les manuels de référence** : Purves *Neuroscience*, Kandel *Principles of
   Neural Science*, Bear *Neuroscience: Exploring the Brain*
3. **Les ressources institutionnelles** dont la rigueur est établie

**Refusé** : les sites de vulgarisation. Ils se recopient entre eux, et une
valeur présente sur vingt pages peut n'avoir jamais été vérifiée qu'une fois,
et mal.

**Le piège principal, signalé par le protocole d'audit** : présenter une
valeur unique comme universelle. Les valeurs en neurosciences varient
énormément selon l'espèce, le type de neurone et les conditions de mesure.
Chaque fiche ci-dessous indique donc **la plage**, pas seulement le chiffre.

---

## [S1] Durée du trajet cortex moteur → muscle du pouce

**Rayegani SM, Hollisaz MT, Hafezi R, Nassirzadeh S (2008).** Application of
magnetic motor stimulation for measuring conduction time across the lower part
of the brachial plexus. *Journal of Brachial Plexus and Peripheral Nerve
Injury*, 3:7.
DOI [10.1186/1749-7221-3-7](https://doi.org/10.1186/1749-7221-3-7) — PMID 18321392

**Valeur retenue : 21,4 ms**, écart-type 1,7, mesuré sur **112 membres
supérieurs**. Latence entre stimulation magnétique du cortex moteur et réponse
du muscle thénar. Hommes 21,9 ms (SD 1,4), femmes 21,0 ms (SD 1,7).

**Ce que ça autorise à écrire** : « deux centièmes de seconde ». 21,4 ms vaut
2,14 centièmes, donc l'arrondi est honnête et du bon côté.

**Ce que ça n'autorise PAS** : « moins d'un centième de seconde », qui était
**faux d'un facteur deux** et figurait sur le site.

**Deux précisions qui comptent :**

- Le **muscle thénar est le muscle du pouce**. La mesure correspond donc
  exactement au geste dont parle le site, ce qui est une coïncidence heureuse
  et non un arrangement.
- Ne pas confondre avec le **temps de réaction** d'un mouvement volontaire,
  qui inclut la décision et vaut plutôt 150 à 250 ms. Le site parle du
  **trajet du signal**, pas de la réaction complète. La formulation doit rester
  sans ambiguïté sur ce point.

---

## [S2] Nombre de synapses reçues par un neurone

**Eyal G, Verhoog MB, Testa-Silva G, Deitcher Y, Benavides-Piccione R,
DeFelipe J, de Kock CPJ, Mansvelder HD, Segev I (2018).** Human Cortical
Pyramidal Neurons: From Spines to Spikes via Models. *Frontiers in Cellular
Neuroscience*, 12:181.
DOI [10.3389/fncel.2018.00181](https://doi.org/10.3389/fncel.2018.00181)

**Valeur retenue : 20 000 à 30 000 épines dendritiques** par neurone pyramidal
humain des couches 2 et 3. Arbres basaux seuls : 12 700 à 15 138 selon la
région corticale.

Ordre de grandeur plus général pour un neurone cortical : **1 000 à 10 000
synapses d'entrée**, la valeur humaine se situant dans le haut de la plage.

**Ce que ça autorise à écrire** : « des milliers d'autres neurones lui
parlent ».

**Ce que ça n'autorise PAS** : « il reçoit des milliers de messages **en même
temps** ». Le nombre de connexions n'est pas le nombre de messages simultanés.
La formulation initiale du site installait cette confusion.

---

## [S3] Vitesse de propagation, avec et sans myéline

**Purves D, Augustine GJ, Fitzpatrick D, et al. (2001).** *Neuroscience*,
2e édition, Sinauer Associates. Chapitre « Increased Conduction Velocity as a
Result of Myelination ».
[NCBI Bookshelf NBK10921](https://www.ncbi.nlm.nih.gov/books/NBK10921/)

**Valeurs retenues :**

| | Vitesse |
|---|---|
| Axone **sans** myéline | environ **0,5 à 3 m/s** |
| Axone **myélinisé** | jusqu'à **120 m/s** |

Soit un rapport d'environ **50 fois**. C'est ce contraste qui rend les deux
centièmes de seconde de l'ouverture compréhensibles.

**Mécanisme** : conduction saltatoire, le signal « saute » d'un nœud de
Ranvier au suivant.

---

## [S4] Décharge des unités motrices pendant un mouvement volontaire

**Purves D, Augustine GJ, Fitzpatrick D, et al. (2001).** *Neuroscience*,
2e édition, Sinauer Associates. Chapitre « The Regulation of Muscle Force ».
[NCBI Bookshelf NBK11021](https://www.ncbi.nlm.nih.gov/books/NBK11021/)

**Valeurs retenues :** fréquence de décharge minimale pendant un mouvement
volontaire de l'ordre de **8 par seconde**, montant jusqu'à **20 à 25 par
seconde** à mesure que la force augmente. Un mouvement mobilise de nombreuses
unités motrices, recrutées progressivement.

**Ce que ça établit** : un geste volontaire correspond à **des centaines de
potentiels d'action**, répartis sur de nombreux neurones, et non à une
impulsion unique. Un potentiel d'action isolé ne produit qu'une secousse
musculaire imperceptible.

**Ce que ça interdit d'écrire** : « une impulsion électrique, et une seule »,
qui figurait sur le site et qui est **faux**.

---

## [S5] Potentiel de membrane au repos d'un motoneurone

**Forsythe ID, Redman SJ (1988).** The dependence of motoneurone membrane
potential on extracellular ion concentrations studied in isolated rat spinal
cord. *The Journal of Physiology*, 404:83-99.
DOI [10.1113/jphysiol.1988.sp017280](https://doi.org/10.1113/jphysiol.1988.sp017280)
— PMID 2855355 — PMC1190816

**Valeur retenue : −71 mV**, erreur standard 0,5, mesurée par enregistrement
intracellulaire sur **99 motoneurones**, moelle épinière de rat isolée, milieu
physiologique normal.

**Pourquoi celle-là, et pas « −70 mV ».** La valeur de −70 mV circule partout
en vulgarisation, presque toujours présentée comme universelle alors que le
potentiel de repos varie fortement selon le type de neurone, l'espèce et les
conditions de mesure. Le site tranche donc autrement : il parle d'**un
motoneurone**, c'est-à-dire précisément le type de cellule qui commande un
muscle, donc celui du récit. La valeur est alors une mesure réelle sur une
population identifiée, pas une moyenne flottante.

**Ce que ça autorise à écrire** : une valeur de repos d'environ −70 mV **pour
un motoneurone**, en le disant.

**Ce que ça n'autorise PAS** : présenter −70 mV comme la valeur de « tous les
neurones ».

**Décision de récit** : cette valeur n'est de toute façon **pas affichée** au
visiteur. La narration passe l'étage ionique, faute de temps. La source est
conservée parce qu'elle fonde l'existence d'un seuil, et parce que l'audit
demandera sur quoi repose l'interaction du curseur.

---

## [S6] Seuil de déclenchement d'un motoneurone

**Carp JS, Tennissen AM, Wolpaw JR (2003).** Conduction velocity is inversely
related to action potential threshold in rat motoneuron axons. *Experimental
Brain Research*, 150:497-505.
DOI [10.1007/s00221-003-1475-8](https://doi.org/10.1007/s00221-003-1475-8)
— PMID 12715118

**Valeur retenue : une dépolarisation de 11,6 mV**, écart-type 4,5, depuis le
potentiel de repos, mesurée sur axones de motoneurones de rat.

**Ce que cette source a permis de découvrir, et c'est le plus important.**

Le seuil n'est pas une tension absolue mais **un écart par rapport au repos**.
En le combinant à [S5], qui donne un repos à −71 mV, on obtient un seuil autour
de **−59 mV**.

**Or la vulgarisation répète partout « −55 mV ».** Ce chiffre ne correspond donc
même pas aux données du type de cellule dont parle le site. Il circule comme
une constante universelle alors qu'il est au mieux une valeur moyenne, sur
d'autres neurones que les nôtres.

**Pire : le seuil n'est pas fixe.** Il se dépolarise d'environ 10 mV au cours
d'une bouffée de potentiels d'action, puis récupère entre les bouffées. Une
valeur unique est donc doublement trompeuse, par l'espèce et par l'instant.

**Décision de récit : aucune valeur chiffrée de seuil n'est affichée.**
L'interaction du curseur fonctionne parfaitement sans nombre, et le texte parle
d'« un niveau à atteindre ». C'est exact, compréhensible à 13 ans, et ça
n'installe pas une fausse constante. **Un chiffre aurait été plus précis en
apparence et plus faux en réalité.**

---

## [S7] Durée d'un potentiel d'action

**Byrne JH.** Resting Potentials and Action Potentials, chapitre 1 de
*Neuroscience Online*, University of Texas Medical School at Houston.
<https://nba.uth.tmc.edu/neuroscience/m/s1/chapter01.html>

**Valeur retenue : environ 1 ms** pour un potentiel d'action de fibre nerveuse.

**Plage réelle, et elle est large** : d'environ 0,1 ms dans les cellules
granulaires du cervelet à 2 ou 3 ms dans les neurones dopaminergiques de la
substance noire. **La durée dépend fortement du type de cellule.**

**Ce que ça autorise à écrire** : « environ un millième de seconde », en parlant
d'une fibre nerveuse.

**Ce que ça n'autorise PAS** : présenter une durée unique comme valable pour
tous les neurones.

**Décision de récit** : valeur non affichée. Le site montre la **forme** de
l'impulsion par la courbe, jamais sa durée chiffrée.

---

## [S8] Longueur du plus long axone humain

**Sonne J, Lopez-Ojeda W.** Histology, Axon. *StatPearls*, NCBI Bookshelf.
<https://www.ncbi.nlm.nih.gov/books/NBK554388/> — PMID 32119275

**Valeur retenue : plus d'un mètre.** Les plus longs axones du corps humain
sont ceux du nerf sciatique, qui vont de la région lombaire de la moelle
épinière jusqu'aux orteils.

**Ce que ça autorise à écrire** : « certains axones descendent de la moelle
épinière jusqu'au pied : presque un mètre, pour une seule cellule ».

**Précision à tenir** : c'est le cas **extrême**, pas l'axone moyen. La
formulation du site dit bien « certains axones », ce qui est exact. Ne jamais
glisser vers « les axones mesurent un mètre ».

---

## [S9] Largeur de la fente synaptique

Sources concordantes en microscopie électronique, reprises notamment par
*Neuroscience Online* et la littérature de microscopie de super-résolution.

| Type de synapse | Largeur |
|---|---|
| Entre neurones, système nerveux central | **20 à 30 nm** |
| **Jonction neuromusculaire** | **environ 50 nm** |

**Ce que le sourçage a permis d'éviter.** La valeur « 20 nm » figurait dans la
liste des valeurs à vérifier, et elle est **fausse pour la fin du récit**. Le
site se termine sur un message remis à un **muscle**, donc sur une jonction
neuromusculaire, où la fente est **plus de deux fois plus large**. La différence
vient de la lame basale, présente à la jonction neuromusculaire et absente
entre neurones.

**Décision de récit** : aucune valeur chiffrée affichée. Le site montre qu'il
**existe un vide**, ce qui est le point pédagogique, sans le mesurer. Si un
chiffre devait être ajouté un jour, il faudrait choisir celui qui correspond à
la synapse effectivement dessinée.

---

## [S10] Délai synaptique

**Katz B, Miledi R (1965).** The measurement of synaptic delay, and the time
course of acetylcholine release at the neuromuscular junction. *Proceedings of
the Royal Society B*, 161(985):483-495.
DOI [10.1098/rspb.1965.0016](https://doi.org/10.1098/rspb.1965.0016)
— PMID 14278409

**Valeur retenue : minimum de 0,4 à 0,5 ms**, valeur modale environ 0,7 ms,
mesurée à la jonction neuromusculaire, **à 20 °C**.

**Deux réserves qui comptent :**

- La mesure est faite **à 20 °C**, pas à température corporelle. Le délai
  synaptique diminue nettement quand la température monte, donc la valeur réelle
  chez l'humain à 37 °C est plus courte.
- L'essentiel de ce délai **ne vient pas de la traversée du vide** par les
  messagers, mais du temps que met le neurone à les libérer. C'est la conclusion
  même de l'article, et c'est contre-intuitif : on imagine spontanément que le
  retard vient du trajet.

**Décision de récit** : valeur non affichée. Mais **la seconde réserve mérite
peut-être une phrase** dans l'acte 1D : le vide n'est pas ce qui prend du temps.
À arbitrer avec l'utilisateur.

---

## [S11] Nombre de neurones du cerveau humain

**Azevedo FA, Carvalho LR, Grinberg LT, Farfel JM, Ferretti RE, Leite RE, Jacob
Filho W, Lent R (2009).** Equal numbers of neuronal and nonneuronal cells make
the human brain an isometrically scaled-up primate brain. *The Journal of
Comparative Neurology*, 513:532-541.
DOI [10.1002/cne.21974](https://doi.org/10.1002/cne.21974) — PMID 19226510

**Valeur retenue : 86,1 milliards de neurones**, écart-type 8,1, et 84,6
milliards de cellules non neuronales, écart-type 9,8. Mesuré par fractionnement
isotropique sur **quatre cerveaux** d'hommes adultes.

**Ce que cette source corrige.** Le chiffre de « 100 milliards » circule depuis
des décennies sans source identifiable. Et l'idée que les cellules gliales
seraient dix fois plus nombreuses que les neurones, présente dans de nombreux
manuels, est également démentie : elles sont à peu près aussi nombreuses.

**La réserve à garder en tête** : quatre cerveaux, tous masculins. C'est peu, et
l'article lui-même ne prétend pas à davantage.

**Ce que ça autorise à écrire** : « environ 86 milliards ».
**Ce que ça n'autorise PAS** : « 100 milliards ».

---

## Toutes les valeurs sont sourcées

**Il n'y a plus de valeur en attente.** Les onze fiches ci-dessus couvrent
l'intégralité des affirmations chiffrées prévues par
[`02-CONTENU.md`](02-CONTENU.md).

### Ce que l'exercice de sourçage a rapporté

Trois erreurs auraient été commises sans lui, et **aucune n'était visible à
l'œil nu** :

| | |
|---|---|
| **Le seuil** | « −55 mV » ne correspond pas aux données du motoneurone, qui donnent plutôt −59 mV, et le seuil n'est de toute façon pas une constante : il se déplace d'environ 10 mV pendant une bouffée |
| **La fente synaptique** | « 20 nm » est faux pour la fin du récit : à la jonction neuromusculaire, où le site se termine, elle fait environ 50 nm |
| **Le nombre de neurones** | « 100 milliards » est un chiffre sans source, démenti depuis 2009 |

### La décision qui en découle

**Cinq de ces six valeurs ne seront pas affichées au visiteur.** Non par
prudence excessive, mais parce que le sourçage a montré qu'aucune n'est une
constante : toutes dépendent du type de cellule, de l'espèce, de la température
ou de l'instant.

Les afficher aurait donné au site une **apparence de précision** au prix de son
exactitude. Le récit dit « un niveau à atteindre », « il reste un vide »,
« presque un mètre », et chacune de ces formulations est vraie sans être
trompeuse.

**C'est exactement la distinction que le protocole d'audit demande de tenir :
une simplification incomplète est légitime, une simplification fausse ne l'est
pas.** Un chiffre non sourcé aurait été plus précis en apparence, et plus faux
en réalité.
