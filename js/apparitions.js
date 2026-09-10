/* ==========================================================================
   apparitions.js : le défilement, et rien d'autre, fait apparaître les choses
   --------------------------------------------------------------------------
   Deux règles posées par l'utilisateur :

     1. Le défilement est le SEUL déclencheur. Aucune apparition ne se produit
        toute seule après un délai. Si le visiteur ne fait rien, rien ne bouge.
     2. En remontant, le mouvement se joue à l'envers.

   On utilise IntersectionObserver plutôt que ScrollTrigger, pour une raison
   précise : ScrollTrigger ne déclenche `onEnter` qu'au moment où l'on FRANCHIT
   le seuil. Si un élément est déjà visible au chargement, par exemple après un
   rechargement au milieu de la page ou en arrivant par une ancre, rien ne se
   déclenche et l'élément reste invisible. IntersectionObserver, lui, notifie
   aussi ce qui est déjà à l'écran.
   ========================================================================== */

import { mouvementReduit } from './a11y.js';

/* Bande de déclenchement : on rogne le haut et le bas du champ, pour qu'un
   élément n'apparaisse pas alors qu'il est encore à moitié hors de l'écran. */
const BANDE = { rootMargin: '-8% 0px -14% 0px', threshold: 0 };

export function initApparitions() {
  const cibles = [...document.querySelectorAll('.reveal')];
  if (!cibles.length) return;

  /* Mouvement réduit, ou GSAP absent : tout est visible, tout le temps.
     On ne fait jamais disparaître un contenu à quelqu'un qui a demandé
     moins d'animation, ni à quelqu'un dont le JavaScript a échoué. */
  if (typeof gsap === 'undefined' || mouvementReduit()) {
    cibles.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  gsap.set(cibles, { opacity: 0, y: 20 });

  /* --- État de départ, calculé tout de suite et sans attendre personne ----
     On ne fait PAS dépendre le premier affichage du rappel de l'observateur.
     Un rappel est asynchrone : s'il tarde, ou s'il ne vient jamais parce que
     la page n'est pas encore peinte, le visiteur voit une page blanche. Ce
     qui est déjà dans la bande au chargement est donc affiché immédiatement,
     par un calcul direct. L'observateur ne gère que la suite. */

  function dansLaBande(el) {
    const r = el.getBoundingClientRect();
    const h = window.innerHeight || 800;
    return r.bottom > h * 0.08 && r.top < h * 0.86;
  }

  cibles.forEach(el => { if (dansLaBande(el)) gsap.set(el, { opacity: 1, y: 0 }); });

  const montrer = (el) => gsap.to(el, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto'
  });

  /* En remontant, on rejoue le mouvement à l'envers plutôt que de couper
     brutalement : c'est ce que l'utilisateur a demandé, et c'est aussi plus
     doux pour les personnes sensibles au mouvement. */
  const cacher = (el) => gsap.to(el, {
    opacity: 0, y: 20, duration: 0.45, ease: 'power2.in', overwrite: 'auto'
  });

  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach(e => {
      if (e.isIntersecting) { montrer(e.target); return; }
      /* L'élément a quitté la bande. S'il est passé SOUS le champ, c'est
         qu'on est remonté : on rembobine. S'il est passé au-dessus, on l'a
         simplement dépassé en descendant, et il doit rester visible. */
      if (e.boundingClientRect.top > 0) cacher(e.target);
    });
  }, BANDE);

  cibles.forEach(el => observateur.observe(el));

  /* Si le visiteur coupe les animations en cours de route, on arrête de
     masquer quoi que ce soit et on montre tout. */
  document.addEventListener('mouvement:change', (e) => {
    if (!e.detail.reduire) return;
    observateur.disconnect();
    gsap.killTweensOf(cibles);
    gsap.set(cibles, { opacity: 1, y: 0 });
  });
}
