/* ==========================================================================
   apparitions.js : le défilement, et rien d'autre, fait apparaître les choses
   --------------------------------------------------------------------------
   Deux règles posées par l'utilisateur :

     1. Le défilement est le SEUL déclencheur. Aucune apparition ne se produit
        toute seule après un délai. Si le visiteur ne fait rien, rien ne bouge.
     2. En remontant, le mouvement se joue à l'envers.

   POURQUOI PAS IntersectionObserver.
   C'était le choix initial, abandonné pour une raison concrète : ses rappels
   ne se déclenchent pas quand la page n'est pas peinte, donc le comportement
   au défilement était impossible à éprouver depuis l'environnement de
   développement. Un mécanisme qu'on ne peut pas tester finit toujours par
   casser sans qu'on le sache. Ici l'état est recalculé à partir de
   getBoundingClientRect, au plus une fois par image, ce qui se vérifie et se
   reproduit. Le coût est négligeable : une douzaine d'éléments mesurés.
   ========================================================================== */

import { mouvementReduit } from './a11y.js?v=d7b3a0d6';

/* La bande de déclenchement est une MINCE LIGNE AU MILIEU de l'écran, et
   c'est délibéré.

   Une bande large laisserait entrer deux blocs à la fois, et le second
   apparaîtrait sans qu'on ait rien fait. Le risque est réel sur téléphone :
   la hauteur des blocs est exprimée en svh, mesurée barre d'adresse DÉPLOYÉE,
   alors que innerHeight grandit quand cette barre se rétracte. Les deux ne
   bougent pas ensemble, donc toute bande large calculée en pourcentage de
   innerHeight finit par déborder sur le bloc suivant.

   Avec une bande de 8 % au centre, un bloc doit franchir le milieu de l'écran
   pour apparaître. Comme chaque bloc fait presque une hauteur d'écran, un seul
   peut y être à la fois, quel que soit l'écart entre svh et innerHeight. */
export const HAUT_BANDE = 0.46;
export const BAS_BANDE = 0.54;

export function dansLaBande(el) {
  const r = el.getBoundingClientRect();
  const h = window.innerHeight || 800;
  return r.bottom > h * HAUT_BANDE && r.top < h * BAS_BANDE;
}

/** Vrai si l'élément est passé AU-DESSUS de la bande, donc déjà lu. */
function dejaDepasse(el) {
  const r = el.getBoundingClientRect();
  return r.bottom <= (window.innerHeight || 800) * HAUT_BANDE;
}

export function initApparitions() {
  const cibles = [...document.querySelectorAll('.reveal')];
  if (!cibles.length) return;

  /* Mouvement réduit, ou GSAP absent : tout est visible, tout le temps. On ne
     fait jamais disparaître un contenu à quelqu'un qui a demandé moins
     d'animation, ni à quelqu'un dont le JavaScript a échoué. */
  if (typeof gsap === 'undefined' || mouvementReduit()) {
    cibles.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  /* On retient l'état affiché de chaque élément, pour ne relancer une
     animation que lorsqu'il change vraiment. Sans ça, chaque image de
     défilement relancerait un tween sur tout le monde. */
  const affiche = new WeakMap();

  function appliquer(el, visible, immediat) {
    if (affiche.get(el) === visible) return;
    affiche.set(el, visible);
    if (immediat) {
      gsap.set(el, { opacity: visible ? 1 : 0, y: visible ? 0 : 20 });
      return;
    }
    gsap.to(el, visible
      ? { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto' }
      /* En remontant, on rejoue le mouvement à l'envers plutôt que de couper
         net : c'est la demande de l'utilisateur, et c'est plus doux pour les
         personnes sensibles au mouvement. */
      : { opacity: 0, y: 20, duration: 0.45, ease: 'power2.in', overwrite: 'auto' });
  }

  /** Recalcule l'état de chacun à partir de la seule position de défilement. */
  function majEtat(immediat) {
    cibles.forEach(el => {
      /* Visible s'il est dans la bande, ou s'il l'a déjà franchie en
         descendant. Sinon il est encore à venir, ou bien on est remonté
         au-dessus de lui et il se rembobine. */
      appliquer(el, dansLaBande(el) || dejaDepasse(el), immediat);
    });
  }

  /* État de départ calculé tout de suite : rien n'est confié à un rappel
     asynchrone, donc la page ne peut pas s'ouvrir vide. */
  gsap.set(cibles, { opacity: 0, y: 20 });
  majEtat(true);

  /* Mise à jour SYNCHRONE, volontairement.

     La version précédente passait par requestAnimationFrame pour lisser la
     charge. Mauvaise idée : rAF ne se déclenche pas quand la page n'est pas
     peinte, exactement comme les rappels d'IntersectionObserver. Le
     comportement redevenait alors invérifiable, et surtout il pouvait se
     figer. Le navigateur limite déjà les événements de défilement à environ
     un par image, et on ne lit ici qu'une douzaine de rectangles : le calcul
     direct est à la fois moins cher et testable. */
  function auDefilement() { majEtat(false); }

  window.addEventListener('scroll', auDefilement, { passive: true });
  window.addEventListener('resize', auDefilement, { passive: true });

  /* Exposé pour les tests automatisés : permet de vérifier l'invariant
     essentiel, à savoir que sans défilement rien ne change. */
  window.__apparitions = { majEtat, dansLaBande, cibles };

  document.addEventListener('mouvement:change', (e) => {
    if (!e.detail.reduire) return;
    window.removeEventListener('scroll', auDefilement);
    gsap.killTweensOf(cibles);
    gsap.set(cibles, { opacity: 1, y: 0 });
  });
}
