/* ==========================================================================
   apparitions.js : le texte de l'ouverture s'EMPILE au défilement
   --------------------------------------------------------------------------
   Trois règles posées par l'utilisateur :

     1. Le défilement est le SEUL déclencheur. Aucune apparition ne se produit
        toute seule après un délai. Si le visiteur ne fait rien, rien ne bouge.
     2. Les temps s'AJOUTENT les uns aux autres. Le titre reste à l'écran quand
        la phrase suivante arrive, et ainsi de suite : on voit un paragraphe se
        construire, pas une suite de cartons qui se remplacent.
     3. En remontant, le mouvement se joue à l'envers.

   COMMENT ÇA MARCHE, et pourquoi c'est gratuit sur un vieux téléphone.

   La section #ouverture est haute de plusieurs écrans, mais elle n'affiche
   rien : sa hauteur n'est QUE de la distance de défilement. Tout ce qui se
   voit est dans .ouverture-scene, qui est collée en haut et ne bouge jamais.

   Les temps encore invisibles OCCUPENT DÉJÀ LEUR PLACE dans la pile. Seule
   leur opacité change. Rien ne pousse rien, aucune ligne ne se recalcule, et
   le texte déjà lu ne bouge pas d'un pixel quand le suivant arrive. On
   n'anime donc que transform et opacity, comme l'exige la règle du projet.

   POURQUOI PAS IntersectionObserver.
   C'était le choix initial, abandonné pour une raison concrète : ses rappels
   ne se déclenchent pas quand la page n'est pas peinte, donc le comportement
   au défilement était impossible à éprouver depuis l'environnement de
   développement. Un mécanisme qu'on ne peut pas tester finit toujours par
   casser sans qu'on le sache. Ici l'état se déduit d'une seule mesure, la
   position de la section, ce qui se vérifie et se reproduit.
   ========================================================================== */

import { mouvementReduit } from './a11y.js?v=d7b3a0d6';

/* Un temps de plus que de temps à montrer : le dernier sixième du défilement
   laisse le paragraphe complet sous les yeux avant que la section ne parte.
   Sans ça, le dernier mot apparaîtrait au moment exact où il quitte l'écran. */
export function pasDeProgression(nombreDeTemps) {
  return 1 / (nombreDeTemps + 1);
}

/** Où en est le défilement DANS la section, entre 0 et 1. */
export function progressionDe(section) {
  const h = window.innerHeight || 800;
  const parcourable = section.offsetHeight - h;
  if (parcourable <= 0) return 1;
  const haut = section.getBoundingClientRect().top;
  return Math.min(1, Math.max(0, -haut / parcourable));
}

export function initApparitions() {
  const section = document.querySelector('#ouverture');
  if (!section) return;

  const temps = [...section.querySelectorAll('.temps')];
  if (!temps.length) return;

  const defiler = section.querySelector('.defiler');
  /* Les traits de la courbe du potentiel d'action, qui se tracent au
     défilement comme sur un électroencéphalogramme. */
  const traits = [...section.querySelectorAll('.figure-courbe .t')];
  const iCourbe = temps.findIndex(el => el.classList.contains('figure-courbe'));

  const PAS = pasDeProgression(temps.length);

  /** L'état d'arrivée statique : tout est là, tout est lisible. */
  function toutMontrer() {
    temps.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    if (defiler) defiler.style.opacity = '0';
    if (typeof gsap !== 'undefined' && traits.length) {
      gsap.set(traits, { drawSVG: '0% 100%' });
    }
  }

  /* Mouvement réduit, ou GSAP absent : tout est visible, tout le temps. On ne
     fait jamais disparaître un contenu à quelqu'un qui a demandé moins
     d'animation, ni à quelqu'un dont le JavaScript a échoué. */
  if (typeof gsap === 'undefined' || mouvementReduit()) {
    toutMontrer();
    return;
  }

  /* On retient l'état affiché de chaque élément, pour ne relancer une
     animation que lorsqu'il change vraiment. Sans ça, chaque image de
     défilement relancerait un tween sur tout le monde. */
  const affiche = new WeakMap();

  function poser(el, visible, immediat) {
    if (!el || affiche.get(el) === visible) return;
    affiche.set(el, visible);
    if (immediat) {
      gsap.set(el, { opacity: visible ? 1 : 0, y: visible ? 0 : 16 });
      return;
    }
    gsap.to(el, visible
      ? { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }
      /* En remontant, on rejoue le mouvement à l'envers plutôt que de couper
         net : c'est la demande de l'utilisateur, et c'est plus doux pour les
         personnes sensibles au mouvement. */
      : { opacity: 0, y: 16, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
  }

  /* --- La courbe se trace, comme sur un électroencéphalogramme -----------
     Le tracé est ASSERVI au défilement, il n'est pas joué en un temps donné.
     C'est le doigt du visiteur qui déroule la ligne, ce qui respecte la règle
     du projet et rend l'effet réversible sans code supplémentaire : remonter
     efface le tracé exactement comme on l'a écrit. */

  function majCourbe(p) {
    if (iCourbe < 0 || !traits.length) return;
    const t = Math.min(1, Math.max(0, (p - iCourbe * PAS) / PAS));
    gsap.set(traits, { drawSVG: '0% ' + (t * 100) + '%' });
  }

  /** Recalcule l'état de chacun à partir de la seule position de défilement. */
  function majEtat(immediat) {
    const p = progressionDe(section);
    temps.forEach((el, i) => poser(el, p >= i * PAS, immediat));
    majCourbe(p);
    /* L'invite à défiler a dit ce qu'elle avait à dire dès le premier geste. */
    poser(defiler, p < 0.01, immediat);
  }

  /* État de départ calculé tout de suite : rien n'est confié à un rappel
     asynchrone, donc la page ne peut pas s'ouvrir vide. */
  gsap.set(temps, { opacity: 0, y: 16 });
  if (traits.length) gsap.set(traits, { drawSVG: '0% 0%' });
  majEtat(true);

  /* Mise à jour SYNCHRONE, volontairement.

     La version précédente passait par requestAnimationFrame pour lisser la
     charge. Mauvaise idée : rAF ne se déclenche pas quand la page n'est pas
     peinte, exactement comme les rappels d'IntersectionObserver. Le
     comportement redevenait alors invérifiable, et surtout il pouvait se
     figer. Le navigateur limite déjà les événements de défilement à environ
     un par image, et on ne lit ici qu'un seul rectangle : le calcul direct
     est à la fois moins cher et testable. */
  function auDefilement() { majEtat(false); }

  window.addEventListener('scroll', auDefilement, { passive: true });
  window.addEventListener('resize', auDefilement, { passive: true });

  /* Exposé pour les tests automatisés : permet de vérifier l'invariant
     essentiel, à savoir que sans défilement rien ne change. */
  window.__apparitions = {
    majEtat, temps, progression: () => progressionDe(section), PAS,
    tracéCourbe: () => (traits[0] ? traits[0].style.strokeDasharray : null)
  };

  document.addEventListener('mouvement:change', (e) => {
    if (!e.detail.reduire) return;
    window.removeEventListener('scroll', auDefilement);
    window.removeEventListener('resize', auDefilement);
    gsap.killTweensOf(temps);
    toutMontrer();
  });
}
