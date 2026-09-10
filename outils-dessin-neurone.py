# -*- coding: utf-8 -*-
"""Régénère le contenu de index.html à partir des dessins canoniques.

UN SEUL neurone pour tout le site. Il apparaît en vue large, puis reste à
l'écran pendant que le texte défile, la caméra se déplaçant sur chaque partie.

Lancer :  python3 outils-dessin-neurone.py
"""
import io

RACINE = "/Users/gaspard/Desktop/Work/BDS/Projet site"


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
# L'ouverture, en quatre temps
# ---------------------------------------------------------------------------

OUVERTURE = '''  <!-- ==================================================================
       L'ouverture, en quatre temps.
       Un seul temps apparaît par mouvement de défilement. Le site s'ouvre sur
       un CONSTAT, pas sur un titre : le geste que le visiteur vient
       littéralement de faire. Aucun vocabulaire scientifique avant la
       question finale.
       =================================================================== -->
  <section class="section ouverture" id="ouverture">
    <div class="wrap">

      <h1 class="temps reveal">Tu viens d'appuyer sur cette page.</h1>

      <p class="temps lead reveal">
        Ton cerveau a commandé le mouvement de ton doigt.
      </p>

      <figure class="temps figure-courbe reveal">
        {courbe}
        <figcaption class="caption">
          Voilà à quoi ressemble l'ordre qu'il a envoyé.
          Une impulsion électrique, et une seule.
        </figcaption>
      </figure>

      <p class="temps lead reveal">
        Ça a pris moins d'un centième de seconde.
      </p>

      <p class="temps question reveal">Sais-tu comment&nbsp;?</p>

      <p class="defiler caption reveal" aria-hidden="true">Continue à défiler</p>

    </div>
  </section>
'''.replace('{courbe}', COURBE)


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

PARCOURS = '''  <!-- ==================================================================
       Le parcours. UN SEUL neurone pour tout le site.
       Il reste à l'écran pendant que le texte défile, et la caméra se déplace
       vers la partie dont on parle. Le défilement est la source de vérité :
       les boutons ne font que faire défiler jusqu'au bon bloc, donc l'état ne
       peut jamais se désynchroniser.
       =================================================================== -->
  <section class="section parcours" id="parcours" aria-labelledby="parcours-titre">

    <h2 id="parcours-titre" class="sr-only">Les parties d'un neurone</h2>

    <div class="parcours-figure">
      <div class="wrap">
        <p class="figure-titre" id="figure-titre">Le messager</p>
        <div class="scene">
{neurone}
        </div>
        <nav class="etapes" aria-label="Aller à une partie du neurone">
{boutons}
        </nav>
        <p class="sr-only" aria-live="polite" data-annonce></p>
      </div>
    </div>

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
'''.replace('{neurone}', NEURONE).replace('{boutons}', BOUTONS).replace('{blocs}', BLOCS)


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

chemin = RACINE + "/index.html"
s = io.open(chemin, encoding="utf-8").read()

debut = s.index('<main id="contenu">') + len('<main id="contenu">')
fin = s.index('</main>')
s = s[:debut] + "\n\n" + OUVERTURE + "\n" + PARCOURS + "\n" + RESTE + "\n" + s[fin:]

io.open(chemin, "w", encoding="utf-8").write(s)
print("index.html régénéré :", len(s.splitlines()), "lignes")
