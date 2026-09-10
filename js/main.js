/* ==========================================================================
   main.js — point d'entrée
   --------------------------------------------------------------------------
   Règle du projet : toute animation doit avoir un état d'arrivée STATIQUE
   qui dit la même chose. Si le mouvement est coupé — appareil lent, réglage
   du visiteur, ou JavaScript en échec — le contenu reste entier et lisible.
   ========================================================================== */

import { initA11y, mouvementReduit } from './a11y.js';
import { initAnatomie } from './anatomie.js';

initA11y();

/* GSAP est chargé depuis assets/vendor/ par des balises <script> classiques,
   donc disponible en variable globale. S'il manquait, on ne casse rien :
   le site reste lisible, simplement sans animation. */
const gsapDispo = typeof gsap !== 'undefined';
if (gsapDispo) {
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

/** Affiche tout d'un coup, sans mouvement. Le repli de toutes les animations. */
function ttoutAfficher() {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.trace').forEach(el => {
    el.style.strokeDasharray = 'none';
    el.style.strokeDashoffset = '0';
  });
}

/* ------------------------------------------------------------------------
   Section 0 — l'ouverture.

   Le neurone se dessine trait par trait, puis le texte apparaît. C'est la
   « construction progressive » de 3Blue1Brown : jamais tout d'un coup.
   ------------------------------------------------------------------------ */

function animerOuverture() {
  /* IMPORTANT — on remet .reveal à sa valeur finale AVANT de construire la
     timeline. Le CSS les met à opacity:0 pour éviter qu'ils clignotent avant
     que le JavaScript prenne la main ; si on ne le faisait pas ici, GSAP
     lirait 0 comme état d'arrivée et animerait de 0 vers 0 — donc rien. */
  gsap.set('#ouverture .reveal', { opacity: 1, clearProps: 'transform' });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  /* fromTo plutôt que from : l'état de départ ET celui d'arrivée sont écrits
     noir sur blanc, donc l'animation ne dépend plus de ce que le CSS a fait. */
  tl.fromTo('#ouverture h1',
      { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 })
    .fromTo('#ouverture .lead',
      { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    .fromTo('#ouverture .trace',
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 1.1, stagger: 0.08 }, '-=0.2')
    .fromTo('#ouverture figcaption, #ouverture .defiler',
      { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.15 }, '-=0.3');
}


/* ------------------------------------------------------------------------
   Apparitions au défilement, pour tout le reste du site.

   Toute la page hors section 0 : chaque .reveal apparaît quand il entre dans
   le champ. `once: true` — l'élément ne redisparaît jamais en remontant, ce
   qui serait à la fois désagréable et une perte d'information.
   ------------------------------------------------------------------------ */

function animerApparitions() {
  const cibles = document.querySelectorAll('.reveal:not(#ouverture .reveal)');
  cibles.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 14 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
  });
}

/* ------------------------------------------------------------------------ */

function demarrer() {
  if (!gsapDispo || mouvementReduit()) { ttoutAfficher(); }
  else { animerOuverture(); animerApparitions(); }
  initAnatomie();
}

demarrer();

/* Si le visiteur coupe les animations en cours de route — ou si l'appareil
   est détecté comme lent — on arrête tout et on montre l'état final. */
document.addEventListener('mouvement:change', (e) => {
  if (e.detail.reduire) {
    if (gsapDispo) gsap.globalTimeline.progress(1).kill();
    ttoutAfficher();
  }
});
