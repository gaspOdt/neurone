/* ==========================================================================
   main.js, point d'entrée
   --------------------------------------------------------------------------
   Deux règles qui gouvernent tout le site :

     1. Le DÉFILEMENT est le seul déclencheur d'apparition. Rien n'arrive tout
        seul après un délai. Si le visiteur ne fait rien, rien ne bouge.
     2. Toute animation a un état d'arrivée STATIQUE qui dit la même chose.
        Mouvement coupé, appareil lent ou JavaScript en échec : le contenu
        reste entier et lisible.
   ========================================================================== */

import { initA11y } from './a11y.js?v=c1a2e0d5';
import { initRecit } from './recit.js?v=c1a2e0d5';
import { initSeuil } from './seuil.js?v=c1a2e0d5';
import { initMyeline } from './myeline.js?v=c1a2e0d5';
import { initSynapse } from './synapse.js?v=c1a2e0d5';

initA11y();

/* GSAP est chargé par des balises <script> classiques, donc disponible en
   variable globale. S'il manquait, rien ne casse : le site reste lisible,
   simplement sans animation.

   Les DEUX noms sont vérifiés, et ce n'est pas de la prudence gratuite : si
   gsap se chargeait mais pas son greffon, DrawSVGPlugin serait un identifiant
   inconnu, cette ligne lèverait une ReferenceError, et le module s'arrêterait
   là. Ni les apparitions ni le parcours ne seraient initialisés, alors que la
   classe js est déjà posée : la page resterait vide. */
if (typeof gsap !== 'undefined' && typeof DrawSVGPlugin !== 'undefined') {
  gsap.registerPlugin(DrawSVGPlugin);
}

/* Un seul récit, une seule scène collée, un seul neurone : l'ouverture et le
   parcours ne peuvent pas être initialisés séparément sans risquer de se
   contredire sur la taille et la position du dessin. */
initRecit();

/* Le premier moment interactif, le curseur du seuil. Il ne touche qu'à ses
   propres éléments dans le dessin : le niveau du corps, les messages et
   l'impulsion. Le cadrage et les tracés restent à recit.js. */
initSeuil();

/* Le second moment interactif, le défi du chronomètre. Même règle : il ne
   touche qu'à ses propres éléments, la gaine et sa propre impulsion. */
initMyeline();

/* La synapse : les messagers qui traversent le vide, la cellule d'en face
   qui s'illumine. Même règle, ses propres éléments seulement. */
initSynapse();
