# -*- coding: utf-8 -*-
"""Régénère les sections 0 et 1 de index.html à partir d'un dessin canonique.

Un seul dessin de neurone pour tout le site : les deux sections sont produites
ici, donc elles ne peuvent pas diverger. Style épuré, peu de branches.
"""
import io, re, sys

RACINE = "/Users/gaspard/Desktop/Work/BDS/Projet site"


def neurone(p, interactif):
    """p = préfixe d'identifiant unique. interactif = groupes ciblables."""
    attr = 'id="{}-{}"'.format(p, '{}') if interactif else 'class="partie"'

    def grp(nom):
        if interactif:
            return '<g class="partie" id="p-{}" data-partie="{}">'.format(nom, nom)
        return '<g class="partie" data-partie="{}">'.format(nom)

    return '''<svg class="neurone" viewBox="0 0 400 1000"
               preserveAspectRatio="xMidYMid meet"
               role="img" aria-labelledby="{p}-titre {p}-desc">
            <title id="{p}-titre">Un neurone, dessiné au trait</title>
            <desc id="{p}-desc">Dessin à l'encre noire sur fond blanc, orienté de haut
              en bas. En haut, quatre branches fines partent dans des directions
              différentes et se divisent chacune en deux : les dendrites. Elles
              convergent vers un rond : le corps cellulaire. De ce rond descend
              un fil unique et très long, qui traverse toute la hauteur de
              l'image : l'axone. Il se termine tout en bas par trois petites
              branches, chacune finie par un point plein.</desc>

            <g fill="none" stroke="var(--ink)" stroke-linecap="round"
               stroke-linejoin="round" vector-effect="non-scaling-stroke"
               transform="translate(400,0) rotate(90)">

              {g_dendrites}
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

              {g_soma}
                <circle class="t" cx="220" cy="200" r="26" stroke-width="2.4"/>
              </g>

              {g_axone}
                <path class="t" stroke-width="2.4"
                      d="M246 200 C380 193 460 207 580 200 C700 193 780 206 840 200"/>
              </g>

              {g_terminaisons}
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
          </svg>'''.format(
        p=p,
        g_dendrites=grp('dendrites'), g_soma=grp('soma'),
        g_axone=grp('axone'), g_terminaisons=grp('terminaisons'))


# ---------------------------------------------------------------- section 0

SECTION_0 = '''  <!-- ==================================================================
       Section 0, l'ouverture.
       La toute première chose affichée est une QUESTION, pas un titre. Elle
       porte sur le geste que le visiteur vient littéralement de faire, ce qui
       installe le sujet en une seconde et sans vocabulaire scientifique.

       Le dessin du neurone est le MÊME que celui de la section 1. Les deux
       sont produits par outils-dessin-neurone.py à partir d'une source unique :
       ne jamais en modifier un seul à la main.
       =================================================================== -->
  <section class="section ouverture" id="ouverture">
    <div class="wrap">

      <h1 class="reveal">
        Tu sais comment ton cerveau vient d'ordonner à ton pouce
        d'appuyer sur cette page&nbsp;?
      </h1>

      <p class="lead reveal">
        Ça a pris moins d'un dixième de seconde. Voici comment.
      </p>

      <figure class="figure reveal">
        <h2 class="figure-titre">Le messager</h2>
        <div class="scene">
          {svg}
        </div>
        <figcaption class="caption">
          Voici celui qui a fait passer l'ordre. Le message entre par le haut,
          descend tout le long du fil, et ressort en bas.
        </figcaption>
      </figure>

      <p class="defiler caption reveal" aria-hidden="true">Fais défiler</p>

    </div>
  </section>
'''.replace('{svg}', neurone('n0', False))


# ---------------------------------------------------------------- section 1

SECTION_1 = '''  <!-- ==================================================================
       Section 1, « Qui est-ce ? »
       Le neurone se CONSTRUIT partie par partie, jamais d'un seul coup.
       L'ordre suit le trajet du signal. La myéline n'est PAS mentionnée
       ici : elle est réservée à la section 4.

       Le rythme est volontairement lent : un seul bloc de texte apparaît
       par mouvement de défilement, jamais plusieurs à la fois.
       =================================================================== -->
  <section class="section anatomie" id="anatomie">
    <div class="wrap">

      <h2 class="beat reveal">D'abord, qui est-ce&nbsp;?</h2>

      <p class="lead beat reveal">Ce fil, c'est une cellule. Une seule.</p>

      <p class="lead beat reveal">On l'appelle un <strong>neurone</strong>.</p>

      <p class="lead beat reveal">
        Il est bâti pour une seule chose&nbsp;: faire passer un message
        d'un bout à l'autre.
      </p>

      <p class="beat reveal">
        Construisons-le morceau par morceau, dans l'ordre où le message
        les traverse.
      </p>

      <div class="explorateur reveal">

        <h3 class="figure-titre">Les quatre parties d'un neurone</h3>

        <div class="scene">
          {svg}
        </div>

        <nav class="etapes" aria-label="Les parties du neurone">
          <button type="button" data-etape="0" aria-current="false">1. Les dendrites</button>
          <button type="button" data-etape="1" aria-current="false">2. Le corps</button>
          <button type="button" data-etape="2" aria-current="false">3. L'axone</button>
          <button type="button" data-etape="3" aria-current="false">4. Les terminaisons</button>
          <button type="button" data-tout-voir>Tout voir</button>
        </nav>

        <div class="explication" aria-live="polite">
          <h4 data-titre>Le buisson d'antennes</h4>
          <p data-texte>Clique sur une partie ci-dessus, ou commence par la première.</p>
        </div>

      </div>

      <details class="alt-text">
        <summary>Lire la description complète en texte</summary>
        <ol>
          <li><strong>Les dendrites.</strong> Les branches fines qui partent
            dans toutes les directions autour du corps de la cellule. C'est par
            là que les messages arrivent, et il y en a beaucoup : un neurone
            peut en recevoir des milliers en même temps.</li>
          <li><strong>Le corps cellulaire.</strong> Le rond au centre. C'est le
            poste de commande : il additionne tout ce qui arrive et décide s'il
            faut transmettre, ou non.</li>
          <li><strong>L'axone.</strong> Le fil unique qui part du corps
            cellulaire et file très loin. Il n'y en a qu'un seul par neurone.
            Chez toi, certains axones mesurent presque un mètre.</li>
          <li><strong>Les terminaisons.</strong> Tout au bout, l'axone se divise
            en petites branches finies par un renflement. C'est là que le
            message est remis au suivant.</li>
        </ol>
      </details>

    </div>
  </section>
'''.replace('{svg}', neurone('n1', True))


# ---------------------------------------------------------------- écriture

def remplacer(source, debut_marqueur, fin_marqueur, nouveau):
    i = source.index(debut_marqueur)
    j = source.index(fin_marqueur, i)
    return source[:i] + nouveau + source[j:]


chemin = RACINE + "/index.html"
s = io.open(chemin, encoding="utf-8").read()

s = remplacer(s, "  <!-- ==================================================================\n       Section 0", "  <!-- ==================================================================\n       Section 1", SECTION_0 + "\n")
s = remplacer(s, "  <!-- ==================================================================\n       Section 1", "  <!-- Sections restantes", SECTION_1 + "\n")

io.open(chemin, "w", encoding="utf-8").write(s)
print("index.html régénéré :", len(s.splitlines()), "lignes")
