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

import { initA11y } from './a11y.js?v=0b36be13';
import { initRecit } from './recit.js?v=0b36be13';

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
