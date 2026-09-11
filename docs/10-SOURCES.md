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

## Valeurs encore à sourcer

À remplir **avant** d'écrire les passages concernés, jamais après.

| Valeur | Où elle servira | État |
|---|---|---|
| Seuil de déclenchement, et sa **plage réelle** | corps cellulaire | **à sourcer** |
| Durée d'un potentiel d'action, 1 à 2 ms | corps cellulaire | **à sourcer** |
| Longueur d'un axone moteur lombaire → pied, environ 1 m | axone | **à sourcer** |
| Largeur de la fente synaptique, environ 20 nm | terminaisons | **à sourcer** |
| Délai synaptique, environ 0,5 ms | terminaisons | **à sourcer** |
| Nombre de neurones du cerveau humain, environ 86 milliards | retour au corps | **à sourcer**, Azevedo et al. 2009 à vérifier |

**Attention particulière au seuil.** Comme le potentiel de repos, la valeur de
−55 mV est parmi les plus recopiées de toute la vulgarisation en
neurosciences, et presque toujours donnée comme universelle. Même traitement
que pour [S5] : chercher une mesure sur **motoneurone**, et se replier sur une
formulation sans chiffre si aucune source solide ne se dégage. Une interaction
peut parfaitement fonctionner sans afficher de nombre.
