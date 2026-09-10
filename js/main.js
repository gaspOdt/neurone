/* ==========================================================================
   main.js, point d'entrée
   --------------------------------------------------------------------------
   Règle du projet : toute animation doit avoir un état d'arrivée STATIQUE qui
   dit la même chose. Si le mouvement est coupé, que ce soit par un appareil
   lent, par le réglage du visiteur ou par un JavaScript en échec, le contenu
   reste entier et lisible.
   ========================================================================== */

import { initA11y, mouvementReduit } from './a11y.js';
import { initAnatomie } from './anatomie.js';

initA11y();

/* GSAP est chargé depuis assets/vendor/ par des balises <script> classiques,
   donc disponible en variable globale. S'il manquait, rien ne casse : le site
   reste lisible, simplement sans animation. */
const gsapDispo = typeof gsap !== 'undefined';
if (gsapDispo) {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

/** Affiche tout d'un coup, sans mouvement. Le repli de toutes les animations. */
function toutAfficher() {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.t').forEach(el => {
    el.style.strokeDasharray = 'none';
    el.style.strokeDashoffset = '0';
  });
}

/* ------------------------------------------------------------------------
   Section 0, l'ouverture.

   Le neurone se dessine trait par trait, puis le texte suit. C'est la
   construction progressive de 3Blue1Brown : jamais tout d'un coup.
   ------------------------------------------------------------------------ */

function animerOuverture() {
  /* On remet .reveal à sa valeur finale AVANT de construire la timeline. Le
     CSS les met à opacity:0 pour éviter qu'ils clignotent avant que le
     JavaScript prenne la main ; sans cette ligne, GSAP lirait 0 comme état
     d'arrivée et animerait de 0 vers 0, donc rien. */
  gsap.set('#ouverture .reveal', { opacity: 1, clearProps: 'transform' });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl.fromTo('#ouverture h1',
      { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 })
    .fromTo('#ouverture .lead',
      { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, '+=0.35')
    .fromTo('#ouverture .figure-titre',
      { opacity: 0 }, { opacity: 1, duration: 0.5 }, '+=0.3')
    .fromTo('#ouverture .t',
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 1.2, stagger: 0.05 }, '-=0.1')
    .fromTo('#ouverture .b',
      { scale: 0, transformOrigin: 'center' },
      { scale: 1, duration: 0.4, stagger: 0.07, ease: 'back.out(2)' }, '-=0.4')
    .fromTo('#ouverture figcaption, #ouverture .defiler',
      { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.25 }, '-=0.2');
}

/* ------------------------------------------------------------------------
   Apparitions au défilement, pour tout le reste du site.

   Le rythme est volontairement lent : chaque bloc arrive SEUL dans le champ.
   Le déclenchement à 80 % de la hauteur, combiné à l'espacement .beat du CSS,
   fait qu'on ne voit jamais trois phrases surgir ensemble. Le lecteur a le
   temps de lire avant que la suivante n'arrive.

   `once: true` : un élément apparu ne redisparaît jamais quand on remonte.
   Ce serait désagréable, et ce serait une perte d'information.
   ------------------------------------------------------------------------ */

function animerApparitions() {
  document.querySelectorAll('.reveal:not(#ouverture .reveal)').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true }
      });
  });
}

/* ------------------------------------------------------------------------ */

function demarrer() {
  if (!gsapDispo || mouvementReduit()) { toutAfficher(); }
  else { animerOuverture(); animerApparitions(); }
  initAnatomie();
}

demarrer();

/* Si le visiteur coupe les animations en cours de route, ou si l'appareil est
   détecté comme lent, on arrête tout et on montre l'état final. */
document.addEventListener('mouvement:change', (e) => {
  if (e.detail.reduire) {
    if (gsapDispo) gsap.globalTimeline.progress(1).kill();
    toutAfficher();
  }
});
