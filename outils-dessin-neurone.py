# -*- coding: utf-8 -*-
"""Régénère le contenu de index.html à partir des dessins canoniques.

UN SEUL neurone pour tout le site. Il apparaît en vue large, puis reste à
l'écran pendant que le texte défile, la caméra se déplaçant sur chaque partie.

Lancer :  python3 outils-dessin-neurone.py     (macOS, Linux)
          python outils-dessin-neurone.py      (Windows)
"""
import io, os, sys

# Windows : imposer l'UTF-8 sur la sortie.
#
# Dès que la sortie est redirigée vers un fichier, Python n'écrit plus dans la
# console mais dans la page de codes locale, cp1252 en France. Le message de
# fin partirait en cp1252 alors que tout le dépôt est en UTF-8, et un
# caractère absent de cp1252 lèverait UnicodeEncodeError au lieu de régénérer
# la page. Sans aucun effet sur macOS et Linux.
for _flux in (sys.stdout, sys.stderr):
    if hasattr(_flux, "reconfigure"):
        _flux.reconfigure(encoding="utf-8", errors="replace")

# Le dossier du dépôt, déduit de l'emplacement de CE fichier.
#
# Surtout pas un chemin absolu écrit en dur : le projet se développe à la fois
# sur macOS et sur Windows, et un chemin en dur ne survit pas au changement de
# machine. Déduit ainsi, l'outil fonctionne depuis n'importe quel dossier
# courant, sur n'importe quel système.
RACINE = os.path.dirname(os.path.abspath(__file__))


# ===========================================================================
# La silhouette de l'acte 0
# ===========================================================================
# -*- coding: utf-8 -*-
"""La silhouette de l'acte 0, en PICTOGRAMME.

Reference demandee par l'utilisateur : le personnage neutre des panneaux de
toilettes. C'est une forme PLEINE, pas un contour, ce qui regle d'un coup
trois choses : le trait parait epais parce qu'il n'y a plus de trait, la tete
ne peut plus chevaucher le buste puisqu'elle en est detachee, et la figure est
neutre par convention.

Le corps est rempli d'un gris pale et non de noir : le trajet bleu du signal
doit rester lisible par-dessus, et c'est lui le sujet. Le corps n'est que le
decor qui situe la scene.

La moitie droite est decrite point par point puis MIROITEE, donc la symetrie
est exacte par construction.
"""

L = 300.0

# Moitie DROITE du corps, du centre des epaules a l'entrejambe, sens horaire.
DEMI = [
    (150, 130),   # centre des epaules, sur l'axe
    (192, 138),   # epaule
    (208, 156),   # deltoide
    (214, 200),   # bras
    (218, 262),   # avant-bras
    (219, 322),   # bas de la main
    (201, 326),   # main, cote interieur
    (198, 262),
    (192, 202),
    (184, 168),   # aisselle
    (181, 240),   # taille
    (188, 322),   # hanche
    (192, 400),   # cuisse
    (186, 500),   # genou
    (181, 590),   # mollet
    (178, 640),   # cheville
    (181, 656),   # pied
    (157, 656),   # pied, cote interieur
    (156, 640),
    (156, 520),
    (153, 420),
    (150, 352),   # entrejambe, sur l'axe
]

TETE = (150, 72, 46)   # cx, cy, r. Detachee : son bas est a 118, les epaules a 130.


def catmull(points, ferme=False):
    """Relie des points par des courbes douces. Sortie : un `d` de SVG."""
    p = list(points)
    p = ([p[-1]] + p + [p[0], p[1]]) if ferme else ([p[0]] + p + [p[-1]])
    d = "M%.1f %.1f" % (p[1][0], p[1][1])
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6.0, p1[1] + (p2[1] - p0[1]) / 6.0)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6.0, p2[1] - (p3[1] - p1[1]) / 6.0)
        d += " C%.1f %.1f %.1f %.1f %.1f %.1f" % (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
    return d


def corps():
    """Contour ferme du corps : moitie droite, puis son miroir."""
    miroir = [(L - x, y) for (x, y) in reversed(DEMI[1:-1])]
    return catmull(DEMI + miroir, ferme=True) + " Z"


# Le trajet du signal. Il part de la tete, descend au centre du corps, bifurque
# vers le bras DROIT du dessin, et s'arrete au bout de la main, la ou le doigt
# a appuye. Trace par-dessus la forme pleine.
TRAJET = [
    (150, 86), (150, 130), (152, 166), (168, 190),
    (192, 226), (203, 266), (208, 300), (210, 318),
]


def trajet():
    return catmull(TRAJET)


# ---------------------------------------------------------------------------
# La courbe du potentiel d'action
# ---------------------------------------------------------------------------
# La vraie forme de l'impulsion électrique : ligne plate au repos, pointe
# brutale, retombée sous le niveau de départ, retour au calme. On la revoit
# en section 3, mais c'est alors le visiteur qui la déclenche.

COURBE = '''<svg class="courbe" viewBox="0 0 320 130"
             preserveAspectRatio="xMidYMid meet"
             role="img" aria-labelledby="c-titre c-desc">
          <title id="c-titre">La forme d'une impulsion nerveuse</title>
          <desc id="c-desc">Une ligne horizontale et calme, qui monte
            brutalement en une pointe étroite, redescend en dessous de son
            niveau de départ, puis revient tranquillement à l'horizontale.</desc>
          <!-- En bleu : c'est l'impulsion, le signal, vue autrement. Le bleu
               est la seule couleur autorisée en trait pur, 4,8:1. -->
          <g fill="none" stroke="var(--signal)" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round"
             vector-effect="non-scaling-stroke">
            <path class="t" d="M10 92 L104 92 C118 92 121 62 130 36
                               C134 24 138 20 143 20 C149 20 153 32 158 52
                               C164 76 169 96 177 103 C184 109 191 106 198 102
                               C212 94 218 92 232 92 L310 92"/>
          </g>
        </svg>'''


# ---------------------------------------------------------------------------
# Le neurone
# ---------------------------------------------------------------------------
# Dessiné à la verticale : le message entre par le haut et ressort en bas,
# donc le sens du défilement est le sens du signal. Les coordonnées sont
# écrites à l'horizontale puis basculées d'un quart de tour par le transform,
# ce qui évite de tout recalculer.

NEURONE = '''<svg class="neurone" viewBox="0 0 400 1000"
                 preserveAspectRatio="xMidYMid meet"
                 role="img" aria-labelledby="n-titre n-desc">
              <title id="n-titre">Un neurone, dessiné au trait</title>
              <desc id="n-desc">Dessin à l'encre noire sur fond blanc, orienté
                de haut en bas. En haut, quatre branches fines partent dans des
                directions différentes et se divisent chacune en deux : les
                dendrites. Elles convergent vers un rond : le corps cellulaire.
                De ce rond descend un fil unique et très long, qui traverse
                toute la hauteur de l'image : l'axone. Il se termine tout en
                bas par trois petites branches, chacune finie par un point
                plein.</desc>

              <g fill="none" stroke="var(--ink)" stroke-linecap="round"
                 stroke-linejoin="round" vector-effect="non-scaling-stroke"
                 transform="translate(400,0) rotate(90)">

                <g class="partie" id="p-dendrites" data-partie="dendrites">
                  <g stroke-width="2.4">
                    <path class="t" d="M203 183 Q178 158 152 132"/>
                    <path class="t" d="M194 200 Q161 199 128 199"/>
                    <path class="t" d="M203 217 Q178 243 152 268"/>
                    <path class="t" d="M237 183 Q253 161 268 140"/>
                  </g>
                  <g stroke-width="1.7">
                    <path class="t" d="M152 132 Q132 118 110 106"/>
                    <path class="t" d="M152 132 Q146 110 140 86"/>
                    <path class="t" d="M128 199 Q108 188 86 178"/>
                    <path class="t" d="M128 199 Q108 211 86 222"/>
                    <path class="t" d="M152 268 Q132 282 110 294"/>
                    <path class="t" d="M152 268 Q146 291 140 314"/>
                    <path class="t" d="M268 140 Q264 121 260 102"/>
                    <path class="t" d="M268 140 Q286 129 304 118"/>
                  </g>
                </g>

{afferents}
                <g class="partie" id="p-soma" data-partie="soma">
                  <!-- LE NIVEAU DANS LE CORPS, pour le curseur du seuil (1B).
                       Un disque bleu, découpé par un rectangle dont on fait
                       varier la largeur : dans ce repère tourné d'un quart
                       de tour, l'axe x local est la VERTICALE de l'écran,
                       donc « se remplir par le bas » revient à étendre le
                       rectangle depuis x = 246. Le seuil est une ligne
                       pointillée à trois quarts de la hauteur, sans aucun
                       chiffre : ce n'est pas une constante [S6]. -->
                  <clipPath id="soma-clip">
                    <rect class="soma-clip-rect" x="246" y="172" width="0" height="56"/>
                  </clipPath>
                  <circle class="soma-fill" cx="220" cy="200" r="24.6"
                          fill="var(--signal)" stroke="none"
                          clip-path="url(#soma-clip)"/>
                  <path class="soma-seuil" d="M207 178 L207 222"
                        stroke-width="1.4" stroke-dasharray="3 3" opacity="0"/>
                  <circle class="t" cx="220" cy="200" r="26" stroke-width="2.4"/>
                </g>

                <g class="partie" id="p-axone" data-partie="axone">
                  <path class="t" stroke-width="2.4"
                        d="M246 200 C380 193 460 207 580 200
                           C700 193 780 206 840 200"/>
                </g>

                <!-- LA GAINE DE MYÉLINE, pour le défi du chronomètre (1C).
                     Six segments, créés par js/myeline.js en copiant le
                     tracé de l'axone et en n'en dessinant qu'une portion :
                     une bande verte cernée d'un filet d'encre, jamais un
                     trait, comme l'exige la palette. Vides tant que le
                     visiteur n'a rien ajouté. -->
                <g class="gaines"></g>

                <g class="partie" id="p-terminaisons" data-partie="terminaisons">
                  <g stroke-width="1.7">
                    <path class="t" d="M840 200 Q868 182 896 166"/>
                    <path class="t" d="M840 200 Q872 200 904 200"/>
                    <path class="t" d="M840 200 Q868 218 896 234"/>
                  </g>
                  <g fill="var(--ink)" stroke="none">
                    <circle class="b" cx="899" cy="164" r="5.5"/>
                    <circle class="b" cx="907" cy="200" r="5.5"/>
                    <circle class="b" cx="899" cy="236" r="5.5"/>
                  </g>
                </g>

                <!-- LA SYNAPSE, 1D temps 20 à 22. En face du renflement du
                     milieu, le bord de la CELLULE SUIVANTE, à l'encre, avec
                     un vide visible entre les deux : le point est qu'il
                     existe, pas sa mesure [S9]. Les messagers, en orange
                     cerné d'encre, sont créés par js/synapse.js et
                     traversent le vide. Puis la cellule suivante s'illumine
                     en bleu : de l'autre côté, tout recommence. -->
                <g class="synapse">
                  <path class="suivante" d="M921 174 C932 176 940 187 940 200
                                            C940 213 932 224 921 226"
                        stroke-width="2.4"/>
                  <path class="suivante-bleue" d="M921 174 C932 176 940 187 940 200
                                                  C940 213 932 224 921 226"
                        stroke="var(--signal)" stroke-width="4" opacity="0"/>
                  <g class="messagers" fill="var(--messagers)" stroke="var(--ink)"
                     stroke-width="0.5"></g>
                </g>

                <!-- LES MESSAGES et L'IMPULSION, en bleu : le signal. Les
                     points sont créés par js/seuil.js et voyagent le long
                     des dendrites vers le corps ; l'impulsion descend le
                     long de l'axone. Dans ce groupe pour hériter du repère
                     tourné, donc des mêmes coordonnées que les tracés. -->
                <g class="messages" fill="var(--signal)" stroke="none"></g>
                <circle class="impulsion" r="5.5" cx="246" cy="200"
                        fill="var(--signal)" stroke="none" opacity="0"/>
                <!-- L'impulsion du défi du chronomètre, distincte de celle
                     du seuil : deux modules ne se partagent pas un élément. -->
                <circle class="impulsion-defi" r="5.5" cx="246" cy="200"
                        fill="var(--signal)" stroke="none" opacity="0"/>

              </g>
            </svg>'''


# LE SIGNAL AFFÉRENT, 1A temps 4. De petites flèches bleues, une par bout de
# dendrite, qui pointent vers l'intérieur : le message vient d'ailleurs, et
# il entre par là. Elles disent que le neurone REÇOIT, ce que les traits
# seuls ne disaient pas. Demande de l'utilisateur, 11 septembre 2026. Les
# points bleus du temps suivant, puis du curseur du seuil, en sont la
# modélisation.
#
# Calculées à partir des tracés eux-mêmes, et non écrites à la main : la
# tangente au bout de chaque dendrite secondaire donne la direction, la
# flèche se pose à quelques unités du bout. Un coup de crayon sur les
# dendrites les déplace avec elles.
#
# Le bleu du signal est la seule couleur autorisée en trait pur. Le groupe
# est invisible au départ : js/recit.js le montre tant que la caméra regarde
# les dendrites, et le repli sans script le laisse.

def fleches_afferentes(svg):
    import math, re
    zone = svg[svg.index('id="p-dendrites"'):svg.index('{afferents}')]
    secondaires = zone[zone.index('stroke-width="1.7"'):]
    ECART, TIGE, POINTE, ANGLE = 7.0, 20.0, 8.0, math.radians(28)
    def n(v):
        return ('%.1f' % v).rstrip('0').rstrip('.')
    fleches = []
    for m in re.finditer(r'd="M(-?[\d.]+) (-?[\d.]+) Q(-?[\d.]+) (-?[\d.]+) '
                         r'(-?[\d.]+) (-?[\d.]+)"', secondaires):
        x0, y0, cx, cy, x2, y2 = map(float, m.groups())
        # La tangente au bout d'une quadratique va du point de contrôle au
        # bout : c'est la direction vers l'extérieur.
        tx, ty = x2 - cx, y2 - cy
        norme = math.hypot(tx, ty)
        ux, uy = tx / norme, ty / norme
        hx, hy = x2 + ux * ECART, y2 + uy * ECART          # la pointe
        sx, sy = hx + ux * TIGE, hy + uy * TIGE            # le talon
        ailes = []
        for signe in (1, -1):                              # les deux ailes
            a = signe * ANGLE
            wx = ux * math.cos(a) - uy * math.sin(a)
            wy = ux * math.sin(a) + uy * math.cos(a)
            ailes.append((hx + wx * POINTE, hy + wy * POINTE))
        d = 'M%s %s L%s %s M%s %s L%s %s L%s %s' % (
            n(sx), n(sy), n(hx), n(hy),
            n(ailes[0][0]), n(ailes[0][1]), n(hx), n(hy),
            n(ailes[1][0]), n(ailes[1][1]))
        # data-dx/dy : d'où la flèche glisse quand elle arrive, un peu plus
        # loin dans sa propre direction, vers l'intérieur.
        fleches.append('                  <path d="%s" data-dx="%s" data-dy="%s"/>'
                       % (d, n(ux * 12), n(uy * 12)))
    assert len(fleches) == 8, "%d flèches, huit bouts attendus" % len(fleches)
    return ('''                <!-- LE SIGNAL AFFÉRENT, 1A temps 4 : une flèche bleue par
                     bout de dendrite, vers l'intérieur. Le neurone reçoit.
                     Calculées par fleches_afferentes(), montrées par
                     js/recit.js tant que la caméra est sur les dendrites. -->
                <g class="afferents" stroke="var(--signal)" stroke-width="2.4"
                   opacity="0">
%s
                </g>''' % '\n'.join(fleches))


NEURONE = NEURONE.replace('{afferents}', fleches_afferentes(NEURONE))


# ---------------------------------------------------------------------------
# Le récit : l'ouverture et le parcours ne font plus qu'UNE SEULE section
# ---------------------------------------------------------------------------
# DEUX CHANGEMENTS DE PRINCIPE, demandés par l'utilisateur.
#
# 1. LE TEXTE S'EMPILE. Avant, chaque temps occupait presque tout l'écran :
#    un seul était visible à la fois et les précédents étaient sortis par le
#    haut. On lisait une suite de cartons, pas un texte. Maintenant les temps
#    s'ajoutent les uns sous les autres et RESTENT : le défilement ne déplace
#    plus le texte, il en fait arriver un morceau de plus.
#
# 2. IL N'Y A QU'UN NEURONE, ET IL N'EST JAMAIS COUPÉ. Il apparaît au milieu
#    de l'ouverture, juste après la phrase sur le cerveau, puis il ne quitte
#    plus l'écran : c'est LUI qui grandit et remonte pour devenir l'objet du
#    parcours. C'est la raison pour laquelle l'ouverture et le parcours sont
#    désormais une seule section avec une seule scène collée. Deux sections
#    séparées auraient imposé deux dessins, donc une coupure.
#
# Ce que ça ne change pas, et qui reste la règle du projet :
#   le défilement est le SEUL déclencheur, rien n'arrive après un délai ;
#   remonter rejoue tout à l'envers ;
#   sans JavaScript ou en mouvement réduit, tout est là d'emblée.
#
# La section est haute de plusieurs écrans, mais ce n'est QUE de la distance
# de défilement : rien n'y est affiché. Tout ce qui se voit est dans la scène
# collée, qui ne bouge pas.

SILHOUETTE = '''<svg class="silhouette" viewBox="0 0 300 700"
                 preserveAspectRatio="xMidYMid meet"
                 role="img" aria-labelledby="sil-titre sil-desc">
              <title id="sil-titre">Une silhouette humaine, et le trajet du message</title>
              <desc id="sil-desc">Pictogramme d'une personne vue de face, comme
                sur un panneau, dessine au trait epais : une tete ronde detachee
                au-dessus d'un corps aux bras le long du corps. Un trait bleu part de la
                tete, descend au centre du corps, bifurque vers le bras droit et
                s'arrete au bout de la main.</desc>

              <!-- La forme du pictogramme, mais en CONTOUR : tete detachee au
                   dessus des epaules, comme sur un panneau, et trait epais.
                   Non rempli, pour que le trajet bleu reste lisible a
                   l'interieur du corps plutot que pose par-dessus un aplat. -->
              <g fill="none" stroke="var(--ink)" stroke-width="3.5"
                 stroke-linejoin="round">
                <circle class="s" cx="150" cy="72" r="46"/>
                <path class="s" d="{corps}"/>
              </g>

              <!-- Le trajet du signal, par-dessus.

                   Son epaisseur est en unites du DESSIN, sans
                   vector-effect="non-scaling-stroke" : c'est ce qui permet a
                   la camera de plonger dedans. Avec une epaisseur fixe a
                   l'ecran, aucun zoom ne l'aurait jamais elargi. 12 unites
                   font environ 5 pixels a la taille d'introduction, et une
                   large bande une fois le cadrage resserre. -->
              <g fill="none" stroke="var(--signal)" stroke-width="12"
                 stroke-linecap="round">
                <path class="trajet" d="{trajet}"/>
              </g>

              <!-- LE FAISCEAU, acte 2 temps 25 : le trait unique se
                   demultiplie. Des copies du trajet, decalees, qui
                   apparaissent ensemble. « Pour un seul geste, ton corps en
                   a mobilise des centaines » [S4] : c'est la reparation de
                   la simplification « un neurone, une impulsion ». -->
              <g class="faisceau" fill="none" stroke="var(--signal)"
                 stroke-width="6" stroke-linecap="round" opacity="0">
                <path d="{trajet}" transform="translate(-16,0)"/>
                <path d="{trajet}" transform="translate(-8,0)"/>
                <path d="{trajet}" transform="translate(8,0)"/>
                <path d="{trajet}" transform="translate(16,0)"/>
              </g>

              <!-- LA CHAINE DE CELLULES, acte 1 temps 1. Invisible tant que la
                   camera n'est pas au fond du trait. Trois neurones REDUITS A
                   L'ESSENTIEL, un cercle et un trait pour l'axone, bout a
                   bout sur le segment vertical du trajet, sous la tete :
                   c'est ce segment que le cadrage resserre. Chaque axone
                   s'arrete juste au-dessus du cercle suivant. Celui du milieu
                   est « elu » : c'est lui qui deviendra le neurone au temps 2.
                   Decision de l'utilisateur, revenant sur les gelules : la
                   forme annonce deja le dessin qu'on va trouver.
                   Poses a partir de y = 84 : le trait commence a 86 et son
                   bout arrondi remonte a 80. Le dernier deborde du cadrage
                   par le bas, et c'est voulu : la chaine continue hors champ. -->
              <g class="chaine" fill="var(--paper)" stroke="var(--ink)"
                 stroke-width="0.9" stroke-linecap="round" opacity="0">
                <g>
                  <circle cx="150" cy="84" r="3.6"/>
                  <path d="M150 87.6 L150 98"/>
                </g>
                <g class="elue">
                  <circle cx="150" cy="102" r="3.6"/>
                  <path d="M150 105.6 L150 116"/>
                </g>
                <g>
                  <circle cx="150" cy="120" r="3.6"/>
                  <path d="M150 123.6 L150 134"/>
                </g>
              </g>
            </svg>'''.replace("{corps}", corps()).replace("{trajet}", trajet())


RECIT_DEBUT = '''  <!-- ==================================================================
       L'ouverture. Le texte s'EMPILE dans une scène collée : chaque temps
       s'ajoute aux précédents, qui restent visibles. Le site s'ouvre sur un
       CONSTAT, pas sur un titre : le geste que le visiteur vient
       littéralement de faire. Aucun vocabulaire scientifique avant la
       question finale.

       La hauteur de la section ne sert QU'À donner de la distance de
       défilement. Rien n'y est affiché hors de la scène collée.
       =================================================================== -->
  <section class="section recit" id="recit" aria-labelledby="recit-titre">

    <h2 id="recit-titre" class="sr-only">Le neurone, et par où passe le message</h2>

    <div class="recit-scene">

      <div class="wrap pile pile-haut">

        <!-- LE BOUTON D'OUVERTURE.
             Rien ne se débloque tant qu'il n'est pas cliqué, pas même le
             défilement. C'est la seule exception à la règle « le défilement
             est le seul déclencheur », et elle est nécessaire : sans le clic,
             la phrase suivante affirmerait un geste qui n'a pas eu lieu. -->
        <div class="temps porte-entree" data-temps="1">
          <!-- LE TITRE DU SITE, en gros, au-dessus du tout premier bouton.
               Demande de l'utilisateur. Il disparaît avec le bouton, au clic.
               Le nom du site n'est PAS encore choisi (README) : ce titre est
               PROVISOIRE, repris de la balise title. -->
          <h1 class="titre-site">Comment un neurone transmet l'information</h1>
          <p class="lead">Clique sur ce bouton.</p>
          <button type="button" class="bouton-entree" data-entree>Clique</button>
        </div>

        <!-- Temps 2 de la narration. La silhouette apparaît EN MÊME TEMPS que
             cette phrase, mais sans le trajet : on montre d'abord le corps
             dont on parle. Le trajet n'arrive qu'avec la phrase qui le
             nomme, au temps suivant (02-CONTENU, incohérence n°1).
             Ce n'est plus le h1 : le h1 est le titre du site. -->
        <p class="temps lead t-corps" data-temps="2">
          Ton cerveau vient de commander le mouvement de ton doigt.
        </p>

      </div>

      <!-- LE NEURONE, et il n'y en a qu'un dans tout le site.
           Il apparaît ici, au milieu de l'ouverture, puis il ne quitte plus
           l'écran : c'est LUI qui grandit et remonte pour devenir l'objet du
           parcours. Le visiteur ne voit jamais deux neurones, et il n'y a
           jamais de coupure entre les deux moments.

           Ce bloc est hors du .wrap, en pleine largeur, pour que son fond
           papier couvre tout l'écran quand le texte du parcours défile
           dessous. -->
      <!-- LES DEUX VISUELS PARTAGENT UNE SEULE CASE.
           Ils ne sont jamais montres ensemble : la silhouette est le plan
           large, le neurone est ce qu'on trouve au bout du zoom. Les empiler
           n'est donc pas une astuce de mise en page, c'est le recit. Et c'est
           ce qui garantit que la scene ne deborde jamais : un seul visuel
           occupe de la place a la fois, quelle que soit la fenetre. -->
      <div class="visuels">

        <!-- Ni la silhouette ni le neurone ne sont des « temps » : leur
             apparition ne suit pas la règle générale, monotone, des
             paragraphes. La silhouette arrive avec la phrase sur le cerveau,
             s'efface au moment de la question en laissant son trait, puis
             cède la place au neurone. C'est js/recit.js qui tient ces deux
             fenêtres, à partir de la position des phrases qui les gouvernent. -->
        <div class="porte-silhouette">
          <div class="scene">
{silhouette}
          </div>
          <!-- Temps 4 : « le temps s'inscrit à côté ». La valeur vient de
               [S1], 21,4 ms, arrondie du bon côté. C'est ce même chiffre que
               le défi du chronomètre reprendra comme cible, en 1C. -->
          <p class="chrono caption" data-chrono aria-hidden="true">0,02 s</p>
        </div>

        <div class="porte-neurone">
        <p class="figure-titre" id="figure-titre">Le messager</p>
        <div class="scene">
{neurone}
        </div>
        <nav class="etapes wrap" aria-label="Aller à une partie du neurone">
{boutons}
        </nav>
        <p class="sr-only" aria-live="polite" data-annonce></p>
      </div>

      </div>

      <!-- Les temps 3 à 5 de l'acte 0, sous le dessin. Textes de 02-CONTENU,
           mot pour mot. « deux centièmes » est sourcé [S1] : la valeur
           « moins d'un centième » qui figurait ici était fausse d'un facteur
           deux. La courbe et « une impulsion, et une seule » sont retirées :
           la courbe revient au corps cellulaire, où le visiteur la
           déclenchera lui-même, et l'affirmation était fausse [S4]. -->
      <div class="wrap pile pile-bas">

        <p class="temps lead t-trajet" data-temps="3">
          Un message est parti de là-haut, et il est descendu jusqu'à lui.
        </p>

        <p class="temps lead t-duree" data-temps="4">
          Ça a pris deux centièmes de seconde.
        </p>

        <p class="temps question t-question" data-temps="5">Sais-tu comment&nbsp;?</p>

      </div>

      <p class="defiler caption" aria-hidden="true">Continue à défiler</p>

    </div>

    <!-- Les rails. Ils n'affichent RIEN : leur seule fonction est de donner
         au défilement la distance nécessaire pour faire arriver un temps
         après l'autre, puis pour la bascule vers le parcours. -->
    <div class="rails" aria-hidden="true"></div>
'''


# ---------------------------------------------------------------------------
# Le parcours : un seul neurone, qui reste à l'écran
# ---------------------------------------------------------------------------

# L'acte 1, textes de 02-CONTENU mot pour mot, un temps par paragraphe.
#
# À L'INTÉRIEUR D'UNE PARTIE, LES TEMPS S'EMPILENT : chacun arrive sous les
# précédents, qui restent. C'est la règle 1 de 02-CONTENU, valable pour tout
# le site. Une partie est un bloc, et le bloc suivant repart d'un écran net.
#
# Le mot-clé de chaque partie est marqué `mot` : du magenta DERRIÈRE, le
# texte reste noir. C'est la règle de la palette.
#
# Les phrases des deux moments interactifs (1B temps 8, 1C temps 16 et 17)
# n'y sont pas encore : elles arrivent avec leur interaction, pièces 4 et 5.
# Chaque entrée : clé, titre, sous-titre, paragraphes.

ETAPES = [
    ('chaine', None, None, [
        '''<p class="lead">Ce chemin n'est pas un fil. C'est une chaîne de
           cellules, mises bout à bout.</p>''']),

    ('cellule', None, None, [
        '''<p class="lead">En voici une. On l'appelle un
           <strong class="mot">neurone</strong>.</p>''']),

    ('plan', 'Le neurone', 'La cellule qui fait voyager le message', [
        '''<p>Il est très fort pour une chose : faire passer un message d'un
           bout à l'autre. Suivons ce message, dans l'ordre.</p>''']),

    ('dendrites', 'Les dendrites', 'Là où les messages arrivent', [
        '''<p>Le message arrive par le haut, dans ces branches fines. On les
           appelle les <strong class="mot">dendrites</strong>.</p>''',
        # [S2]. Surtout pas « des milliers de messages en même temps », qui
        # confondrait le nombre de connexions et le nombre de messages.
        '''<p>Elles collectent, et elles collectent beaucoup. Ce n'est pas une
           simple chaîne : <strong>des milliers d'autres neurones</strong>
           parlent à celui-ci.</p>''']),

    ('soma', 'Le corps cellulaire', 'Là où le neurone décide de transmettre', [
        '''<p>Tout ce que les dendrites ont récolté converge ici, dans le
           <strong class="mot">corps cellulaire</strong>.</p>''',
        # Quand cette phrase apparaît, trois messages arrivent l'un après
        # l'autre : le corps monte un peu à chacun, puis se vide. C'est la
        # sommation, et le retour au repos évite de faire croire à une
        # accumulation permanente. Joué par js/seuil.js.
        '''<p data-demo="messages">Chaque message qui arrive le fait monter
           un peu. Un seul ne suffit jamais.</p>''',
        # LE PREMIER MOMENT INTERACTIF, 1B temps 8. Un curseur natif, donc
        # pilotable aux flèches du clavier, PLUS deux boutons : aucune
        # dépendance au glissement (WCAG 2.5.7). Valeur annoncée en aria-live.
        # Aucune limite de temps, aucun état d'échec.
        '''<div class="interaction" data-interaction="seuil">
          <p>Essaie. Fais monter le nombre de messages qui arrivent.</p>
          <div class="curseur">
            <button type="button" class="curseur-bouton" data-moins
                    aria-label="Moins de messages">Moins</button>
            <input type="range" id="curseur-seuil" min="0" max="10" step="1"
                   value="0" aria-label="Nombre de messages qui arrivent"
                   aria-valuetext="aucun message">
            <button type="button" class="curseur-bouton" data-plus
                    aria-label="Plus de messages">Plus</button>
          </div>
          <p class="sr-only" aria-live="polite" data-annonce-seuil></p>
        </div>''',
        # La courbe du potentiel d'action, déplacée ici depuis l'ouverture.
        # Elle se trace quand l'impulsion part : c'est le même objet vu de
        # deux façons. Elle reste affichée ensuite (temps 9).
        '''<figure class="figure-courbe">
          {courbe}
          <figcaption class="caption">La même impulsion, vue comme une
            courbe.</figcaption>
        </figure>''',
        # Le seuil et l'impulsion sont nommés ICI, chacun avec sa définition
        # dans la phrase, et nulle part avant. « Vers le bas », jamais « le
        # long de l'axone » : l'axone n'est nommé qu'en 1C. Aucune valeur de
        # seuil affichée, [S6] : ce n'est pas une constante.
        '''<p class="t-seuil">Il y a un niveau à atteindre. On l'appelle le
           <strong class="mot">seuil</strong>. En dessous, il ne se passe
           rien. Au-dessus, quelque chose part vers le bas : une
           <strong class="mot">impulsion</strong>. Et elle part
           <strong>toujours pareil</strong>, pas plus fort si tu pousses
           plus.</p>''',
        '''<p>Comme un interrupteur : tu peux appuyer doucement autant que tu
           veux, la lumière reste éteinte. Passé le déclic, elle s'allume. Et
           toujours à la même intensité.</p>''',
        '''<p>Sauf que le neurone, lui, se rallume aussitôt. Prêt pour le
           message suivant.</p>''']),

    ('axone', "L'axone", "Le long câble qui emporte l'impulsion", [
        # « Un seul axone » : vérifié. Surtout pas « des centaines de
        # dendrites », qui compte mal l'objet [S2].
        '''<p>Une fois partie, l'impulsion descend le long de
           l'<strong class="mot">axone</strong>. Un neurone a des milliers
           d'entrées, mais <strong>un seul axone</strong>.</p>''',
        # Seul endroit du site où le signal est dit électrique. Affirmer
        # d'abord, corriger ensuite : nier une idée que le visiteur n'a pas
        # encore reviendrait à la lui souffler.
        '''<p>Cette impulsion est bien un signal
           <strong class="mot">électrique</strong>. Mais pas comme dans un
           câble : c'est un basculement qui se propage, de proche en
           proche.</p>''',
        # [S3], 0,5 à 3 m/s sans myéline. Quand la phrase apparaît, une
        # impulsion descend l'axone nu, lentement : js/myeline.js.
        '''<p data-demo="lent">Sur un axone nu, c'est lent. Beaucoup trop lent
           pour tes deux centièmes de seconde.</p>''',
        # Premier endroit du site où le mot apparaît.
        '''<p>D'où ceci : une gaine, posée par morceaux le long de l'axone. On
           l'appelle la <strong class="mot">myéline</strong>.</p>''',
        # LE SECOND MOMENT INTERACTIF, 1C temps 16. Six segments à ajouter un
        # par un ; à chaque ajout l'impulsion repart du haut et le chronomètre
        # affiche le temps du modèle. La cible est le chiffre du premier
        # écran. Modèle, validation et réserves dans 02-CONTENU : les temps
        # affichés sont des sorties de modèle, sauf le dernier qui coïncide
        # avec la mesure [S1]. Aucune limite de temps, aucun état d'échec.
        '''<div class="interaction" data-interaction="myeline">
          <p>À toi. Ajoute de la myéline jusqu'à ce que le message arrive à
             temps.</p>
          <p class="chrono-defi">
            <span class="chrono-valeur" data-chrono-valeur>0,51 s</span>
            <span class="chrono-cible caption">Objectif : <strong>0,02 s</strong>,
              le chiffre du premier écran.
              <span data-chrono-etat></span></span>
          </p>
          <div class="curseur">
            <button type="button" class="curseur-bouton" data-retirer
                    aria-label="Retirer un segment de gaine">Retirer</button>
            <input type="range" id="curseur-myeline" min="0" max="6" step="1"
                   value="0" aria-label="Segments de gaine posés, sur six"
                   aria-valuetext="aucun segment sur six">
            <button type="button" class="curseur-bouton" data-ajouter
                    aria-label="Ajouter un segment de gaine">Ajouter</button>
          </div>
          <p class="sr-only" aria-live="polite" data-annonce-myeline></p>
        </div>''',
        # Temps 17 : la leçon que le visiteur vient de découvrir en
        # manipulant, énoncée après et non avant. [S3] pour le rapport de 50.
        '''<p>Tu as vu ? Tant qu'il reste un bout à découvert, le message y
           perd tout son temps. Il faut la gaine <strong>partout</strong>.
           Alors le signal saute d'un morceau au suivant au lieu de ramper :
           jusqu'à <strong>cinquante fois plus vite</strong>.</p>''',
        '''<p>Voilà pourquoi ça va si vite.</p>''']),

    ('terminaisons', 'Les terminaisons', 'Là où le message passe à la cellule suivante', [
        '''<p>Tout en bas, l'axone se divise en petites branches, chacune finie
           par un renflement.</p>''',
        # [S9]. Aucune largeur affichée : le point est qu'il EXISTE un vide.
        # La caméra plonge sur un renflement quand cette phrase apparaît.
        '''<p data-cadrage="synapse">Et là, surprise : la cellule suivante
           n'est pas collée. Il reste un vide.</p>''',
        # Les messagers orange traversent le vide : js/synapse.js.
        '''<p data-synapse="messagers">Alors le message change de forme : il
           devient chimique. Le renflement libère des
           <strong class="mot">messagers</strong> qui traversent le vide et
           vont toucher la cellule d'en face.</p>''',
        # La cellule suivante s'illumine en bleu, et le regard s'élargit.
        '''<p data-synapse="suivante" data-cadrage="terminaisons">Et de
           l'autre côté, tout recommence.</p>''']),

    # ACTE 2, le retour au corps. Referme la boucle, et répare la
    # simplification « un neurone, une impulsion » avant qu'elle ne reste.
    ('muscle', None, None, [
        '''<p class="lead">Le dernier maillon de la chaîne ne parle pas à un
           neurone. Il parle à un muscle.</p>''']),

    ('doigt', 'Ton doigt', 'Là où le message arrive, et où tout a commencé', [
        '''<p>Le muscle se contracte. Ton doigt appuie.</p>''']),

    # [S4] : un mouvement volontaire recrute de nombreuses unités motrices.
    ('faisceau', None, None, [
        '''<p>Une dernière chose. On a suivi <strong>un</strong> neurone. Mais
           pour un seul geste, ton corps en a mobilisé
           <strong>des centaines</strong>, qui ont envoyé des centaines
           d'impulsions, ensemble.</p>''']),

    # Chute : retour au bouton du tout premier écran. Le cliquer rejoue
    # l'impulsion le long de la silhouette.
    ('clic', None, None, [
        '''<p class="lead">Tout ça, pour un clic. Pas mal, non ?</p>''',
        '''<div class="fin">
          <button type="button" class="bouton-entree" data-rejouer>Clique</button>
        </div>''']),
]

BOUTONS = '\n'.join(
    '          <button type="button" data-vers="{}" aria-current="false">{}</button>'
    .format(cle, nom) for cle, nom in [
        ('plan', 'Vue entière'), ('dendrites', '1. Dendrites'),
        ('soma', '2. Corps'), ('axone', '3. Axone'),
        ('terminaisons', '4. Terminaisons')])

def bloc(cle, titre, sous_titre, paragraphes):
    """Un bloc du parcours. Le titre est un temps comme les autres : il arrive
    en premier, puis chaque paragraphe s'ajoute dessous."""
    morceaux = []
    if titre:
        # Titre en encre noire, gros et gras ; sous-titre en encre douce.
        # Aucun ornement, aucun filet : demande explicite de l'utilisateur.
        morceaux.append('          <h3 class="temps-parcours partie-titre">%s'
                        '<span class="sous-titre">%s</span></h3>' % (titre, sous_titre))
    for p in paragraphes:
        # Le `temps-parcours` se pose sur la balise de PREMIER niveau du
        # paragraphe, p ou figure : ajouté à sa classe si elle en a une,
        # créé sinon. On ne touche qu'à la première balise.
        p = p.strip()
        fin_balise = p.index('>')
        balise = p[:fin_balise]
        if 'class="' in balise:
            balise = balise.replace('class="', 'class="temps-parcours ', 1)
        else:
            nom = balise.split(' ', 1)[0]            # « <p » ou « <figure »
            balise = nom + ' class="temps-parcours"' + balise[len(nom):]
        p = balise + p[fin_balise:]
        morceaux.append('          ' + p.replace('{courbe}', COURBE))
    return '''      <div class="etape-texte" id="etape-{cle}" data-vue="{cle}">
        <div class="etape-contenu">
{contenu}
        </div>
      </div>
'''.format(cle=cle, contenu='\n'.join(morceaux))

BLOCS = '\n'.join(bloc(*e) for e in ETAPES)

RECIT_FIN = '''
    <!-- ==================================================================
         Le parcours. Le neurone est DÉJÀ à l'écran, arrivé pendant
         l'ouverture : ces blocs de texte défilent sous lui et commandent la
         caméra, qui se déplace vers la partie dont on parle.

         Le défilement est la source de vérité : les boutons ne font que
         faire défiler jusqu'au bon bloc, donc l'état ne peut jamais se
         désynchroniser de ce que le visiteur a sous les yeux.
         =============================================================== -->
    <div class="wrap parcours-textes">
{blocs}
    </div>

    <div class="wrap">
      <details class="alt-text">
        <summary>Lire la description complète en texte</summary>
        <ol>
          <li><strong>Les dendrites.</strong> Les branches fines, en haut, qui
            partent dans toutes les directions. C'est par là que le message
            arrive. Des milliers d'autres neurones parlent à celui-ci.</li>
          <li><strong>Le corps cellulaire.</strong> Le rond où convergent les
            branches. Chaque message qui arrive le fait monter un peu. Passé
            un niveau, le seuil, une impulsion part vers le bas, toujours
            pareille. En dessous, rien ne part.</li>
          <li><strong>L'axone.</strong> Le fil unique qui descend du corps
            cellulaire. L'impulsion y descend : c'est un signal électrique,
            mais pas comme dans un câble. Sur un axone nu c'est lent ; une
            gaine posée par morceaux, la myéline, le rend rapide.</li>
          <li><strong>Les terminaisons.</strong> Tout en bas, l'axone se divise
            en petites branches finies par un renflement. La cellule suivante
            n'est pas collée : des messagers chimiques traversent le vide, et
            de l'autre côté tout recommence.</li>
        </ol>
      </details>
    </div>

  </section>
'''.replace('{blocs}', BLOCS)


# Le récit complet. L'assemblage se fait ICI, et pas plus haut, parce que
# l'ouverture a maintenant besoin du neurone ET des boutons du parcours :
# ils vivent dans la même scène collée.
RECIT = (RECIT_DEBUT
         .replace('{courbe}', COURBE)
         .replace('{silhouette}', SILHOUETTE)
         .replace('{neurone}', NEURONE)
         .replace('{boutons}', BOUTONS)
         + RECIT_FIN)


# ---------------------------------------------------------------------------
# ACTE 3, le quiz. Cinq questions, pas une de plus, celles de
# docs/02-CONTENU.md. Chaque mauvaise réponse est une vraie idée fausse de
# collégien, et l'explication, affichée dans tous les cas, la répare. Aucun
# score, aucune limite de temps : la mécanique est dans js/quiz.js.
#
# Chaque entrée : clé, question, les trois choix, l'indice du bon, et
# l'explication. L'explication commence par la bonne réponse en gras : sans
# JavaScript, rien n'est caché, et les questions suivies de leurs réponses
# forment une liste lisible telle quelle.
#
# Le « cinquante fois » de la myéline est sourcé en [S3], les « centaines »
# de neurones en [S4].

QUESTIONS = [
    ('sens', "Dans un neurone, le message circule dans quel sens ?",
     ["Des dendrites vers l'axone",
      "De l'axone vers les dendrites",
      "Dans les deux sens, ça dépend"], 0,
     '''<strong>Des dendrites vers l'axone.</strong> Toujours dans ce sens,
        jamais l'inverse. C'est pour ça que le neurone est dessiné à la
        verticale sur ce site : il descend, comme le message.'''),

    ('seuil', "Deux neurones dépassent leur seuil. Le premier le dépasse tout "
              "juste, le second le dépasse très largement. Que se passe-t-il ?",
     ["Le second envoie une impulsion plus forte",
      "Les deux envoient exactement la même impulsion",
      "Le second envoie une impulsion plus longue"], 1,
     '''<strong>Les deux envoient exactement la même impulsion.</strong>
        C'est la loi du tout ou rien. Comme un interrupteur : appuyer plus
        fort n'allume pas la lumière plus fort. Ce qu'un neurone fait
        varier, ce n'est pas la force de son impulsion, c'est le
        <strong>nombre</strong> d'impulsions qu'il envoie.'''),

    ('myeline', "À quoi sert la myéline ?",
     ["À faire voyager le message beaucoup plus vite",
      "À protéger l'axone des chocs",
      "À fabriquer l'impulsion"], 0,
     '''<strong>À faire voyager le message beaucoup plus vite.</strong> Avec
        elle, le signal saute d'un morceau au suivant au lieu de ramper.
        Jusqu'à cinquante fois plus vite. Et il en faut sur
        <strong>tout</strong> le trajet : s'il reste un bout à découvert, le
        message y perd presque tout son temps.'''),

    ('synapse', "Entre deux neurones, qu'est-ce qui franchit le vide qui les "
                "sépare ?",
     ["Une étincelle électrique",
      "Des messagers chimiques",
      "Rien, les deux neurones se touchent"], 1,
     '''<strong>Des messagers chimiques.</strong> Le message change de forme
        en route. Électrique à l'intérieur du neurone, chimique pour passer
        d'un neurone au suivant.'''),

    ('centaines', "Pour que ton doigt appuie sur l'écran, combien de neurones "
                  "ont travaillé ?",
     ["Un seul, celui qu'on a suivi",
      "Deux, un pour partir et un pour arriver",
      "Des centaines"], 2,
     '''<strong>Des centaines.</strong> On en a suivi <strong>un</strong>
        pour comprendre comment ça marche. Mais ton corps en a mobilisé des
        centaines, en même temps, chacun envoyant sa propre série
        d'impulsions.'''),
]


def question(numero, cle, enonce, choix, bon, explication):
    # Une question : un fieldset, sa légende, trois boutons radio natifs,
    # (classe quiz-question : « question » tout court est déjà la question
    # de l'ouverture, en gros et en gras, et le fieldset en héritait)
    # puis la région annoncée où arrivent le verdict et l'explication.
    #
    # Les radios natifs se pilotent aux flèches du clavier sans script. Le
    # verdict est vide et caché tant qu'on n'a pas répondu : c'est js/quiz.js
    # qui l'écrit. L'explication est visible dans le HTML, et c'est le script
    # qui la cache jusqu'à la réponse : sans lui, elle reste, précédée du mot
    # « Réponse » que le script, lui, retire.
    lettres = 'abc'
    items = '\n'.join('''            <label class="choix-item">
              <input type="radio" name="q-{cle}" value="{valeur}">
              <span>{texte}</span>
            </label>'''.format(cle=cle, valeur=lettres[i], texte=t)
                      for i, t in enumerate(choix))
    return '''        <fieldset class="quiz-question" id="question-{cle}" data-bonne="{bonne}">
          <legend><span class="numero">{numero}.</span> {enonce}</legend>
          <div class="choix">
{items}
          </div>
          <div class="reponse" aria-live="polite">
            <p class="verdict" hidden></p>
            <p class="explication"><span class="sans-js">Réponse. </span>{explication}</p>
          </div>
        </fieldset>
'''.format(cle=cle, bonne=lettres[bon], numero=numero, enonce=enonce,
           items=items, explication=' '.join(explication.split()))


QUIZ = '''  <!-- ==================================================================
       ACTE 3, le quiz. Cinq questions qui s'empilent : répondre à l'une
       fait apparaître la suivante, et les précédentes restent avec leur
       explication. Aucun score, aucune limite de temps, aucun verrou.
       Sans JavaScript : une liste de questions-réponses, lisible.
       =============================================================== -->
  <section id="quiz" class="quiz section" aria-labelledby="quiz-titre">
    <div class="wrap">
      <h2 id="quiz-titre">Cinq questions</h2>
      <p class="quiz-intro">Pas de note, pas de chrono. Tu peux te tromper
        autant que tu veux : à chaque réponse, une explication.</p>

{questions}
      <!-- Après la cinquième question : la phrase de fin, et le bouton du
           tout premier écran. Le cliquer ramène à la silhouette, et
           l'impulsion repart de la tête au doigt, une dernière fois. -->
      <div class="quiz-fin">
        <p class="lead">Voilà. Tu sais maintenant ce qui s'est passé entre ta
          tête et ton doigt quand tu as cliqué sur ce bouton, tout au
          début.</p>
        <div class="fin">
          <button type="button" class="bouton-entree" data-rejouer
                  data-retour="etape-clic">Clique</button>
        </div>
      </div>
    </div>
  </section>
'''.replace('{questions}', '\n'.join(
    question(i + 1, *q) for i, q in enumerate(QUESTIONS)))



# ---------------------------------------------------------------------------

def regenerer():
    chemin = os.path.join(RACINE, "index.html")
    with io.open(chemin, encoding="utf-8") as f:
        s = f.read()

    debut = s.index('<main id="contenu">') + len('<main id="contenu">')
    fin = s.index('</main>')
    s = s[:debut] + "\n\n" + RECIT + "\n" + QUIZ + "\n" + s[fin:]

    # newline="\n" est OBLIGATOIRE, ce n'est pas un détail de style.
    # Sans lui, Python traduit chaque saut de ligne en CRLF sur Windows. Le
    # fichier serait alors réécrit en entier, et le moindre passage de l'outil
    # produirait un diff de plusieurs centaines de lignes, illisible, sur une
    # machine et pas sur l'autre. Le dépôt reste en LF partout.
    #
    # `with`, et pas io.open(...).write(...) : sans lui, la fermeture est
    # laissée au ramasse-miettes. Sur Windows le descripteur reste ouvert le
    # temps qu'il passe, et rien ne garantit que l'écriture soit vidée sur le
    # disque si le processus s'arrête entre temps. index.html est LE fichier
    # du site : il ne doit jamais pouvoir rester à moitié écrit.
    with io.open(chemin, "w", encoding="utf-8", newline="\n") as f:
        f.write(s)

    print("index.html régénéré :", len(s.splitlines()), "lignes")


# Un garde-fou, pour que le simple fait d'IMPORTER ce module ne réécrive pas
# index.html. Sans lui, tout le travail se faisait à l'import : un outil
# d'analyse, un test, ou n'importe quel `import` de ce fichier réécrivait la
# page du site sans que personne ne l'ait demandé.
if __name__ == "__main__":
    regenerer()
