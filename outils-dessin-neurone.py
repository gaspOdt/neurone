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
"""Fabrique la silhouette de l'acte 0 : de face, unisexe, neutre.

La moitie droite est decrite point par point, puis MIROITEE. La symetrie est
donc exacte par construction, ce qu'un trace a la main n'obtiendrait jamais.
Les points sont relies par des courbes de Catmull-Rom converties en Bezier,
ce qui donne un contour organique sans avoir a calculer des tangentes.
"""

L = 300.0   # largeur du viewBox

# Moitie DROITE seulement, du cou jusqu'a l'entrejambe, dans le sens horaire.
DEMI = [
    (166, 100),   # cou
    (196, 132),   # epaule
    (212, 158),   # deltoide
    (220, 215),   # bras, dehors
    (224, 272),   # coude, dehors
    (226, 330),   # avant-bras, dehors
    (224, 362),   # poignet, dehors
    (222, 392),   # LE DOIGT, ou le trajet s'arrete
    (206, 388),   # main, dedans
    (204, 360),   # poignet, dedans
    (202, 328),   # avant-bras, dedans
    (200, 272),   # coude, dedans
    (192, 196),   # aisselle
    (180, 252),   # taille
    (192, 316),   # hanche
    (196, 390),   # cuisse, dehors
    (190, 470),   # genou, dehors
    (185, 550),   # mollet, dehors
    (180, 628),   # cheville, dehors
    (194, 648),   # pied, dehors
    (166, 648),   # pied, dedans
    (164, 628),   # cheville, dedans
    (163, 470),   # genou, dedans
    (160, 390),   # cuisse, dedans
    (150, 348),   # entrejambe, sur l'axe de symetrie
]


def catmull(points, ferme=False):
    """Relie des points par des courbes douces. Sortie : un `d` de SVG."""
    p = list(points)
    if ferme:
        p = [p[-1]] + p + [p[0], p[1]]
    else:
        p = [p[0]] + p + [p[-1]]
    d = "M%.1f %.1f" % (p[1][0], p[1][1])
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6.0, p1[1] + (p2[1] - p0[1]) / 6.0)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6.0, p2[1] - (p3[1] - p1[1]) / 6.0)
        d += " C%.1f %.1f %.1f %.1f %.1f %.1f" % (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1])
    return d


def corps():
    """Contour complet : moitie droite, puis son miroir."""
    miroir = [(L - x, y) for (x, y) in reversed(DEMI[:-1])]
    return catmull(DEMI + miroir, ferme=True) + " Z"


# Le trajet du signal : de la tete, le long de la moelle, puis du bras,
# jusqu'au bout du doigt. Il s'arrete exactement sur le point « LE DOIGT ».
TRAJET = [
    (150, 96), (152, 140), (155, 174), (172, 198),
    (198, 240), (210, 286), (215, 336), (218, 366), (221, 390),
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
          <g fill="none" stroke="var(--ink)" stroke-width="2"
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

                <g class="partie" id="p-soma" data-partie="soma">
                  <circle class="t" cx="220" cy="200" r="26" stroke-width="2.4"/>
                </g>

                <g class="partie" id="p-axone" data-partie="axone">
                  <path class="t" stroke-width="2.4"
                        d="M246 200 C380 193 460 207 580 200
                           C700 193 780 206 840 200"/>
                </g>

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

              </g>
            </svg>'''


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
              <desc id="sil-desc">Contour d'une personne vue de face, dessine au
                trait, sans visage ni vetement. Un trait part du haut de la tete,
                descend au centre du corps, bifurque vers le bras droit et
                s'arrete au bout du doigt.</desc>
              <g fill="none" stroke="var(--ink)" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round"
                 vector-effect="non-scaling-stroke">
                <circle class="s" cx="150" cy="62" r="38"/>
                <path class="s" d="{corps}"/>
              </g>
              <g fill="none" stroke="var(--signal)" stroke-width="3.5"
                 stroke-linecap="round" vector-effect="non-scaling-stroke">
                <path class="trajet" d="{trajet}"/>
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
          <p class="lead">Clique sur ce bouton.</p>
          <button type="button" class="bouton-entree" data-entree>Clique</button>
        </div>

        <h1 class="temps" data-temps="2">
          Ton cerveau vient de commander le mouvement de ton doigt.
        </h1>

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

        <div class="porte-silhouette temps" data-temps="3">
          <div class="scene">
{silhouette}
          </div>
        </div>

        <div class="porte-neurone temps" data-temps="4">
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

      <div class="wrap pile pile-bas">

        <figure class="temps figure-courbe" data-temps="5">
          {courbe}
          <figcaption class="caption">
            Voilà à quoi ressemble l'ordre qu'il a envoyé.
            Une impulsion électrique, et une seule.
          </figcaption>
        </figure>

        <p class="temps lead" data-temps="6">
          Ça a pris moins d'un centième de seconde.
        </p>

        <p class="temps question" data-temps="7">Sais-tu comment&nbsp;?</p>

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

ETAPES = [
    ('ensemble', 'Le messager', '''
        <p class="lead">Ce fil, c'est une cellule. Une seule.</p>
        <p class="lead">On l'appelle un <strong>neurone</strong>.</p>
        <p>Il est bâti pour une seule chose : faire passer un message
           d'un bout à l'autre. Regardons-le de plus près, morceau par
           morceau, dans l'ordre où le message les traverse.</p>'''),

    ('dendrites', 'Les dendrites, le buisson qui écoute', '''
        <p>C'est par le haut que les messages arrivent, dans ces branches
           fines.</p>
        <p>Un seul neurone peut en recevoir <strong>des milliers en même
           temps</strong>, venus de milliers d'autres neurones. Toutes ces
           branches ne font qu'une chose : collecter.</p>'''),

    ('soma', 'Le corps cellulaire, le poste de commande', '''
        <p>Tout ce que les dendrites ont récolté converge ici.</p>
        <p>Le corps cellulaire fait la somme, et il tranche :
           <strong>on transmet, ou on ne transmet pas</strong>. C'est la
           décision de tout le neurone, prise en un seul endroit.</p>'''),

    ('axone', "L'axone, le câble de sortie", '''
        <p>Un neurone a des centaines de dendrites, mais <strong>un seul
           axone</strong>. Le message part par là, et seulement par là.</p>
        <p>Chez toi, certains axones descendent de la moelle épinière jusqu'au
           pied : presque <strong>un mètre de long</strong>, pour une seule
           cellule.</p>'''),

    ('terminaisons', 'Les terminaisons, la remise en mains propres', '''
        <p>Tout en bas, l'axone se divise en petites branches, chacune finie
           par un renflement.</p>
        <p>C'est là que le message est <strong>remis au destinataire</strong> :
           un autre neurone, ou un muscle. Comme celui de ton doigt, tout à
           l'heure.</p>'''),
]

BOUTONS = '\n'.join(
    '          <button type="button" data-vers="{}" aria-current="false">{}</button>'
    .format(cle, nom) for cle, nom in [
        ('ensemble', 'Vue entière'), ('dendrites', '1. Dendrites'),
        ('soma', '2. Corps'), ('axone', '3. Axone'),
        ('terminaisons', '4. Terminaisons')])

BLOCS = '\n'.join('''      <div class="etape-texte" id="etape-{cle}" data-vue="{cle}">
        <div class="etape-contenu">
          <h3>{titre}</h3>{corps}
        </div>
      </div>
'''.format(cle=cle, titre=titre, corps=corps) for cle, titre, corps in ETAPES)

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
            partent dans toutes les directions. C'est par là que les messages
            arrivent, et il y en a beaucoup : un neurone peut en recevoir des
            milliers en même temps.</li>
          <li><strong>Le corps cellulaire.</strong> Le rond où convergent les
            branches. C'est le poste de commande : il additionne tout ce qui
            arrive et décide s'il faut transmettre, ou non.</li>
          <li><strong>L'axone.</strong> Le fil unique qui descend du corps
            cellulaire et file très loin. Il n'y en a qu'un seul par neurone.
            Chez l'être humain, certains axones mesurent presque un mètre.</li>
          <li><strong>Les terminaisons.</strong> Tout en bas, l'axone se divise
            en petites branches finies par un renflement. C'est là que le
            message est remis au suivant.</li>
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


RESTE = '''  <!-- Sections restantes, jours 3 à 5. Ordre imposé : rien n'apparaît
       avant son tour, et la myéline n'est mentionnée nulle part avant la
       section « Ça file ».
         Au repos       les charges de part et d'autre de la membrane
         Tout ou rien   le seuil, l'analogie de l'interrupteur
         Ça file        la propagation, PUIS la myéline
         Le saut        la synapse
         Quiz           quelques questions, à la fin seulement -->
'''


# ---------------------------------------------------------------------------

def regenerer():
    chemin = os.path.join(RACINE, "index.html")
    with io.open(chemin, encoding="utf-8") as f:
        s = f.read()

    debut = s.index('<main id="contenu">') + len('<main id="contenu">')
    fin = s.index('</main>')
    s = s[:debut] + "\n\n" + RECIT + "\n" + RESTE + "\n" + s[fin:]

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
