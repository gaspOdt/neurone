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

import { initA11y } from './a11y.js?v=1200e850';
import { initApparitions } from './apparitions.js?v=1200e850';
import { initParcours } from './parcours.js?v=1200e850';

initA11y();

/* GSAP est chargé par des balises <script> classiques, donc disponible en
   variable globale. S'il manquait, rien ne casse : le site reste lisible,
   simplement sans animation. */
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(DrawSVGPlugin);
}

initApparitions();
initParcours();
