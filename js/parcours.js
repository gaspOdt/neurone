/* ==========================================================================
   parcours.js : un seul neurone, visité partie par partie
   --------------------------------------------------------------------------
   Le dessin reste collé en haut de l'écran pendant que le texte défile
   dessous. La caméra, c'est-à-dire le viewBox du SVG, se déplace vers la
   partie dont parle le bloc de texte en cours.

   Le DÉFILEMENT est la source de vérité unique. Les boutons ne changent pas
   l'état directement : ils font défiler jusqu'au bon bloc, et c'est le
   défilement qui met à jour la caméra. L'état ne peut donc jamais se
   désynchroniser de ce que le visiteur a sous les yeux, et remonter rejoue
   naturellement le parcours à l'envers.

   Le neurone n'est plus construit morceau par morceau : c'est la caméra qui
   isole chaque partie en la cadrant. Les autres parties ne sont pas cachées,
   elles sont simplement hors champ, ce qui est à la fois plus simple et plus
   honnête vis-à-vis d'un lecteur d'écran.
   ========================================================================== */

import { mouvementReduit } from './a11y.js';

const DUREE_SURBRILLANCE = 1800;   /* millisecondes */

/* Tous les cadrages des parties ont le même rapport 4:5, donc la lucarne ne
   change de forme qu'en passant à la vue d'ensemble, haute et étroite. */
const VUES = {
  ensemble:     { vue: '0 0 400 1000',   partie: null,             titre: 'le neurone entier' },
  dendrites:    { vue: '50 8 300 375',   partie: 'p-dendrites',    titre: 'les dendrites' },
  soma:         { vue: '130 133 140 175', partie: 'p-soma',        titre: 'le corps cellulaire' },
  axone:        { vue: '40 230 320 400', partie: 'p-axone',        titre: "l'axone" },
  terminaisons: { vue: '100 748 200 250', partie: 'p-terminaisons', titre: 'les terminaisons' }
};

export function initParcours() {
  const svg = document.querySelector('#parcours .neurone');
  if (!svg) return;

  const blocs = [...document.querySelectorAll('.etape-texte')];
  const boutons = [...document.querySelectorAll('.etapes button[data-vers]')];
  const titre = document.querySelector('#figure-titre');
  const annonce = document.querySelector('[data-annonce]');

  let cle = 'ensemble';
  let minuteur = null;

  const anime = () => typeof gsap !== 'undefined' && !mouvementReduit();

  /* --- La lucarne prend la forme de ce qu'elle cadre --------------------
     Sans ça, zoomer sur un détail large et court laisserait d'immenses
     bandes vides au-dessus et en dessous du dessin. */

  const hauteurMax = () => Math.min(window.innerHeight * 0.38, 380);

  function dimensions(vue) {
    const [, , w, h] = vue.split(/\s+/).map(Number);
    const dispo = (svg.parentElement.clientWidth || 320);
    let L = dispo, H = L * h / w;
    const max = hauteurMax();
    if (H > max) { H = max; L = H * w / h; }
    return { L: Math.round(L), H: Math.round(H) };
  }

  function poser(vue) {
    const { L, H } = dimensions(vue);
    svg.setAttribute('viewBox', vue);
    svg.style.width = L + 'px';
    svg.style.height = H + 'px';
  }

  poser(VUES.ensemble.vue);
  window.addEventListener('resize', () => poser(VUES[cle].vue));

  /* --- Le trait se dessine, une seule fois ------------------------------
     À la première apparition du neurone. Ce n'est pas une apparition de
     texte : on ne la rembobine pas en remontant, l'objet d'étude reste là. */

  let dejaDessine = false;

  function dessiner() {
    if (dejaDessine) return;
    dejaDessine = true;
    if (!anime()) return;
    gsap.fromTo(svg.querySelectorAll('.t'), { drawSVG: '0%' },
      { drawSVG: '100%', duration: 1.1, stagger: 0.03, ease: 'power1.out' });
    gsap.fromTo(svg.querySelectorAll('.b'), { scale: 0, transformOrigin: 'center' },
      { scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(2)', delay: 0.9 });
  }

  /* --- Désigner une partie, momentanément -------------------------------- */

  function surbriller(idPartie) {
    clearTimeout(minuteur);
    svg.querySelectorAll('.partie').forEach(g => g.classList.remove('surbrillance'));
    if (!idPartie) return;
    const g = svg.querySelector('#' + idPartie);
    if (!g) return;
    g.classList.add('surbrillance');
    minuteur = setTimeout(() => g.classList.remove('surbrillance'), DUREE_SURBRILLANCE);
  }

  /* --- Aller à une vue ---------------------------------------------------- */

  function allerA(nouvelle) {
    if (nouvelle === cle || !VUES[nouvelle]) return;
    cle = nouvelle;
    const { vue, partie, titre: nom } = VUES[cle];

    if (!anime()) { poser(vue); }
    else {
      const { L, H } = dimensions(vue);
      /* Le cadre et le cadrage bougent ensemble : si l'un devançait l'autre,
         des bandes vides apparaîtraient pendant la transition. */
      gsap.to(svg, {
        attr: { viewBox: vue }, width: L, height: H,
        duration: 1.1, ease: 'power2.inOut', overwrite: 'auto'
      });
    }

    surbriller(partie);
    titre.textContent = nom.charAt(0).toUpperCase() + nom.slice(1);
    if (annonce) annonce.textContent = 'Vue sur ' + nom + '.';
    boutons.forEach(b => b.setAttribute('aria-current', String(b.dataset.vers === cle)));
  }

  /* --- Le défilement pilote tout ------------------------------------------
     La bande de déclenchement correspond à la zone de lecture, sous le dessin
     collé. Le bloc qui s'y trouve commande la caméra. En remontant, le bloc
     précédent y revient et la caméra revient avec lui. */

  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach(e => { if (e.isIntersecting) allerA(e.target.dataset.vue); });
  }, { rootMargin: '-48% 0px -22% 0px', threshold: 0 });

  blocs.forEach(b => observateur.observe(b));

  /* Même précaution que pour les apparitions : l'état de départ est calculé
     directement, sans dépendre d'un rappel asynchrone. Si le visiteur arrive
     au milieu du parcours, par un rechargement ou une ancre, la caméra est
     tout de suite au bon endroit. */
  (function etatInitial() {
    const h = window.innerHeight || 800;
    const dedans = blocs.find(b => {
      const r = b.getBoundingClientRect();
      return r.bottom > h * 0.48 && r.top < h * 0.78;
    });
    if (dedans) allerA(dedans.dataset.vue);
  })();

  /* Le dessin se trace quand la figure entre à l'écran. */
  const figure = document.querySelector('.parcours-figure');
  if (figure) {
    const visible = () => {
      const r = figure.getBoundingClientRect();
      return r.bottom > 0 && r.top < (window.innerHeight || 800);
    };
    if (visible()) dessiner();
    else {
      new IntersectionObserver((entrees, obs) => {
        entrees.forEach(e => { if (e.isIntersecting) { dessiner(); obs.disconnect(); } });
      }, { threshold: 0.1 }).observe(figure);
    }
  }

  /* --- Les boutons ne font que déplacer le défilement ---------------------
     Ils ne changent pas l'état eux-mêmes. C'est ce qui garantit que ce qu'on
     voit et ce que dit l'interface ne peuvent pas diverger. */

  boutons.forEach(b => {
    b.addEventListener('click', () => {
      const bloc = document.querySelector('#etape-' + b.dataset.vers);
      if (!bloc) return;
      bloc.scrollIntoView({
        behavior: mouvementReduit() ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  document.addEventListener('mouvement:change', (e) => {
    if (e.detail.reduire) { dejaDessine = true; poser(VUES[cle].vue); }
  });
}
