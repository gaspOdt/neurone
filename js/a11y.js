/* ==========================================================================
   a11y.js : préférences de mouvement et survie sur appareil lent
   --------------------------------------------------------------------------
   Ce fichier gère une seule bascule, mais elle sert DEUX besoins à la fois :

     1. le confort des personnes sensibles au mouvement (troubles vestibulaires,
        migraines, épilepsie photosensible) ;
     2. la survie du site sur un vieux téléphone.

   Les deux se règlent de la même façon : couper le mouvement en gardant
   l'information. C'est pour ça qu'il n'y a qu'un seul mécanisme.
   ========================================================================== */

const CLE_STOCKAGE = 'neurone:mouvement';

/* Les trois états possibles du réglage.
   - 'auto'    : on suit le système d'exploitation du visiteur (par défaut)
   - 'reduit'  : le visiteur a explicitement demandé moins d'animation
   - 'complet' : le visiteur a explicitement demandé toutes les animations */
const AUTO = 'auto', REDUIT = 'reduit', COMPLET = 'complet';

const requeteSysteme = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Vrai si l'appareil a été jugé trop lent pendant la session. */
let appareilLent = false;

/* ------------------------------------------------------------------------ */

function lireChoix() {
  /* Le stockage local peut lever une exception (navigation privée, réglages
     bloquant les données de site). On ne veut pas casser la page pour ça. */
  try {
    const v = localStorage.getItem(CLE_STOCKAGE);
    return (v === REDUIT || v === COMPLET) ? v : AUTO;
  } catch { return AUTO; }
}

function ecrireChoix(valeur) {
  try { localStorage.setItem(CLE_STOCKAGE, valeur); } catch { /* tant pis */ }
}

/** Faut-il réduire le mouvement, tout compte fait ? */
export function mouvementReduit() {
  const choix = lireChoix();
  if (choix === REDUIT)  return true;
  if (choix === COMPLET) return false;
  return requeteSysteme.matches || appareilLent;   /* mode auto */
}

/** Applique la décision au document. Le CSS fait le reste. */
function appliquer() {
  const reduire = mouvementReduit();
  document.documentElement.classList.toggle('reduce-motion', reduire);

  const bouton = document.querySelector('[data-bascule-mouvement]');
  if (bouton) {
    bouton.setAttribute('aria-pressed', String(reduire));
    bouton.textContent = reduire ? 'Animations réduites' : 'Réduire les animations';
  }
  document.dispatchEvent(new CustomEvent('mouvement:change', { detail: { reduire } }));
}

/** Bascule déclenchée par le bouton visible dans l'en-tête. */
export function basculerMouvement() {
  ecrireChoix(mouvementReduit() ? COMPLET : REDUIT);
  appliquer();
}

/* ------------------------------------------------------------------------
   Détection d'appareil lent.

   On ne mesure pas la fluidité au chargement : au repos, requestAnimationFrame
   tourne au rythme de l'écran même sur une machine poussive, donc la mesure ne
   voudrait rien dire. On surveille plutôt les images RÉELLEMENT produites
   pendant les premières secondes d'usage, et on ne dégrade que si la lenteur
   est franche et répétée, pour ne pas punir un simple à-coup de chargement.
   ------------------------------------------------------------------------ */

const SEUIL_MS       = 34;   /* une image au-delà de ~34 ms = sous 30 im/s */
const IMAGES_LENTES  = 45;   /* nombre d'images lentes avant de dégrader   */
const DUREE_SURVEIL  = 8000; /* on ne surveille que les 8 premières secondes */

function surveillerFluidite() {
  if (lireChoix() !== AUTO) return;        /* choix explicite : on n'y touche pas */
  if (requeteSysteme.matches) return;      /* déjà réduit par le système          */

  let lentes = 0, precedent = performance.now();
  const debut = precedent;

  function image(maintenant) {
    const delta = maintenant - precedent;
    precedent = maintenant;

    /* Un delta énorme signifie presque toujours un onglet en arrière-plan,
       pas un appareil lent. On l'ignore. */
    if (delta > SEUIL_MS && delta < 500) lentes++;

    if (lentes >= IMAGES_LENTES) {
      appareilLent = true;
      appliquer();
      console.info('[a11y] Appareil jugé lent : animations réduites automatiquement.');
      return;                              /* on arrête de surveiller */
    }
    if (maintenant - debut < DUREE_SURVEIL) requestAnimationFrame(image);
  }
  requestAnimationFrame(image);
}

/* ------------------------------------------------------------------------ */

export function initA11y() {
  appliquer();

  /* Si le visiteur change son réglage système en cours de route, on suit,
     sauf s'il a fait un choix explicite sur le site. */
  const suivreSysteme = () => { if (lireChoix() === AUTO) appliquer(); };
  if (requeteSysteme.addEventListener) requeteSysteme.addEventListener('change', suivreSysteme);
  else if (requeteSysteme.addListener)  requeteSysteme.addListener(suivreSysteme);  /* Safari ancien */

  const bouton = document.querySelector('[data-bascule-mouvement]');
  if (bouton) bouton.addEventListener('click', basculerMouvement);

  surveillerFluidite();
}
