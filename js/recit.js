/* ==========================================================================
   recit.js : l'ouverture et le parcours, un seul récit, un seul neurone
   --------------------------------------------------------------------------
   Ce fichier remplace apparitions.js et parcours.js, qui étaient séparés
   quand l'ouverture et le parcours étaient deux sections. Ils n'en font plus
   qu'une, pour une raison de fond : le neurone doit être LE MÊME du début à
   la fin, sans coupure. Deux sections auraient imposé deux dessins.

   LES TROIS RÈGLES, inchangées.

     1. Le défilement est le SEUL déclencheur. Rien n'arrive après un délai.
        Si le visiteur ne fait rien, rien ne bouge.
     2. Remonter rejoue tout à l'envers, y compris les tracés.
     3. Toute animation a un état d'arrivée STATIQUE. Mouvement coupé,
        appareil lent ou JavaScript en échec : le contenu reste entier.

   LE DÉROULÉ, en une phrase par temps.

     1  le titre
     2  la phrase sur le cerveau
     3  LE NEURONE arrive, et se dessine trait par trait
     4  la courbe du potentiel d'action, qui se trace comme sur un EEG
     5  la durée
     6  la question

     puis LA BASCULE : le texte de l'ouverture s'efface, le neurone grandit
     et remonte en haut de l'écran, son titre et ses boutons apparaissent.
     Le parcours commence, et le texte défile sous un neurone qui était déjà
     là. Rien n'a été coupé, rien n'a été remplacé.

   POURQUOI LES TEMPS INVISIBLES OCCUPENT DÉJÀ LEUR PLACE.
   Parce que sinon chaque arrivée pousserait les suivantes, et le texte déjà
   lu bougerait sous les yeux du lecteur. En réservant la place dès le départ,
   on n'anime plus que l'opacité et la position : rien ne se recalcule.

   POURQUOI PAS IntersectionObserver, ni requestAnimationFrame.
   Leurs rappels ne partent pas quand la page n'est pas peinte, ce qui rendait
   tout le comportement au défilement invérifiable depuis l'environnement de
   développement, et pouvait le figer. Ici tout se déduit de la position de la
   section, ce qui se mesure, se rejoue et se teste.
   ========================================================================== */

import { mouvementReduit } from './a11y.js?v=b2713de7';

/* Les cadrages de la caméra, une entrée par partie du neurone. */
const VUES = {
  ensemble:     { vue: '0 0 400 1000',    partie: null,             titre: 'le neurone entier' },
  dendrites:    { vue: '50 8 300 375',    partie: 'p-dendrites',    titre: 'les dendrites' },
  soma:         { vue: '130 133 140 175', partie: 'p-soma',         titre: 'le corps cellulaire' },
  axone:        { vue: '40 230 320 400',  partie: 'p-axone',        titre: "l'axone" },
  terminaisons: { vue: '100 748 200 250', partie: 'p-terminaisons', titre: 'les terminaisons' }
};

/* Distance entre le haut de la scène et le neurone une fois la bascule finie. */
const MARGE_HAUTE = 14;

/* La zone de lecture, sous le dessin collé : le bloc de texte qui s'y trouve
   commande la caméra. Elle est étroite pour la même raison que la bande des
   apparitions : deux blocs ne doivent jamais s'y trouver ensemble, sinon la
   caméra sauterait d'une partie à l'autre toute seule.

   Ces deux constantes sont ici, HORS de la fonction, et pas à l'endroit où
   elles servent. Déclarées à l'intérieur, elles se trouvaient après le retour
   anticipé du mode « mouvement réduit », qui branche pourtant la caméra :
   celle-ci les lisait avant leur initialisation et levait une ReferenceError.
   Le contenu restait entier, mais la caméra ne marchait plus pour exactement
   les visiteurs qu'on cherche à ménager. */
const HAUT = 0.62, BAS = 0.70;

const borne = (v, min, max) => Math.min(max, Math.max(min, v));

export function initRecit() {
  /* Vrai une fois le bouton d'ouverture cliqué. Voir le verrou dans majEtat. */
  let entre = false;
  const section = document.querySelector('#recit');
  if (!section) return;

  const scene    = section.querySelector('.recit-scene');
  const rails    = section.querySelector('.rails');
  const porte    = section.querySelector('.porte-neurone');
  const svg      = section.querySelector('.neurone');
  const sil      = section.querySelector('.silhouette');
  const porteSil = section.querySelector('.porte-silhouette');
  if (!scene || !rails || !porte || !svg) return;

  const piles    = [...section.querySelectorAll('.pile')];
  const temps    = [...section.querySelectorAll('.temps')];
  const defiler  = section.querySelector('.defiler');
  const titre    = section.querySelector('#figure-titre');
  const nav      = section.querySelector('.etapes');
  const annonce  = section.querySelector('[data-annonce]');
  const boutons  = [...section.querySelectorAll('.etapes button[data-vers]')];
  const blocs    = [...section.querySelectorAll('.etape-texte')];

  const traitsCourbe  = [...section.querySelectorAll('.figure-courbe .t')];
  const traitsNeurone = [...svg.querySelectorAll('.t')];
  const traitTrajet   = [...section.querySelectorAll('.silhouette .trajet')];
  const boutsNeurone  = [...svg.querySelectorAll('.b')];

  const iCourbe  = temps.indexOf(section.querySelector('.figure-courbe'));
  const iNeurone = temps.indexOf(porte);
  const iSil     = temps.indexOf(porteSil);

  /* Un temps de plus que de temps à montrer : l'avant-dernier écran laisse le
     paragraphe complet sous les yeux, le dernier sert à la bascule. */
  const N = temps.length;
  const PAS = 1 / (N + 1);

  /* --- Les tailles du neurone -------------------------------------------
     Deux tailles seulement, et la bascule interpole de l'une à l'autre.
     La taille d'introduction est CALCULÉE à partir de la place réellement
     libre entre les deux blocs de texte, et pas écrite en dur : elle doit
     tenir sur un téléphone comme sur un écran large. */

  /* TOUT l'état est déclaré ici, avant le premier retour anticipé.
     Le mode « mouvement réduit » sort de la fonction très tôt, mais il branche
     quand même la caméra et les boutons. Si ces variables étaient déclarées
     plus bas, comme c'était le cas au premier jet, ces branchements liraient
     un `let` pas encore évalué et lèveraient une ReferenceError, donc la page
     resterait vide pour EXACTEMENT les visiteurs qu'on cherche à ménager. */
  let hautPile = 0, basPile = 0, reserve = 0, padHaut = 0;
  let decalage = 0;
  let cameraActive = false;
  let cle = 'ensemble';
  let minuteur = null;
  let H0 = 200;
  let H1 = 320;

  function mesurer() {
    padHaut  = parseFloat(getComputedStyle(scene).paddingTop) || 0;
    hautPile = piles[0] ? piles[0].offsetHeight : 0;
    basPile  = piles[1] ? piles[1].offsetHeight : 0;
    /* Le titre et les boutons du parcours sont positionnés en absolu dans
       .porte-neurone : ils ne coûtent aucune hauteur, mais leurs marges
       intérieures sont réservées en permanence, pour que rien ne saute au
       moment où ils apparaissent.

       getBoundingClientRect, et surtout PAS svg.offsetHeight. C'est le même
       piège que element.hidden, déjà payé deux fois par ce projet et raconté
       dans 04-ARCHITECTURE : offsetHeight et offsetTop appartiennent à
       HTMLElement, pas à SVGElement. Sur un <svg>, la lecture rend undefined,
       le calcul retombait silencieusement sur sa valeur plancher, et le
       neurone d'introduction faisait 110 px au lieu de 219. Aucune erreur,
       aucun message : juste un dessin deux fois trop petit. */
    reserve = porte.offsetHeight - svg.getBoundingClientRect().height;
  }

  /* Au-delà de cette largeur, le texte et le dessin sont en DEUX COLONNES,
     donc le dessin ne partage plus sa hauteur avec le texte. Le calcul de sa
     taille en dépend entièrement : garder la formule empilée en deux colonnes
     donnait un neurone de trente pixels alors que la place ne manquait pas. */
  const deuxColonnes = window.matchMedia('(min-width: 60em)');

  /* LA MEME REGLE POUR LES DEUX DESSINS.

     Ils partagent la meme case, donc la place disponible est la meme : leur
     donner deux calculs differents produisait une silhouette correcte a cote
     d'un neurone de trente pixels, ce qui n'avait aucune raison d'etre.

     La borne haute est choisie pour rester SOUS la taille du parcours, afin
     que la bascule fasse grandir le dessin et jamais retrecir : le recit
     plonge vers le neurone, un retrecissement le contredirait. */
  function hauteurDessin() {
    const dispo = scene.clientHeight - padHaut - 32;
    if (deuxColonnes.matches) return borne(dispo, 260, 520);
    return borne(dispo - hautPile - basPile, 230, 340);
  }

  function hauteurIntro() { return hauteurDessin(); }
  function hauteurSilhouette() { return hauteurDessin(); }

  function hauteurParcours() {
    const h = window.innerHeight || 800;
    /* Toujours au-dessus de hauteurDessin, pour que la bascule agrandisse. */
    return deuxColonnes.matches ? Math.min(h * 0.78, 600) : Math.min(h * 0.45, 380);
  }

  /** Pose la taille de la silhouette. Sa largeur decoule du rapport 300/700
      de son cadrage, et se replie si la colonne est plus etroite. */
  function poserSilhouette() {
    if (!sil) return;
    let H = hauteurDessin(), L = H * 300 / 700;
    const dispo = porte.clientWidth || scene.clientWidth || 320;
    if (L > dispo) { L = dispo; H = L * 700 / 300; }
    sil.style.width  = Math.round(L) + 'px';
    sil.style.height = Math.round(H) + 'px';
  }

  /** Pose le cadrage ET la taille. La largeur découle du rapport du cadrage. */
  function poserVue(cle, hauteur) {
    const [, , w, h] = VUES[cle].vue.split(/\s+/).map(Number);
    let H = hauteur, L = H * w / h;
    /* La largeur disponible est celle de la COLONNE du dessin, pas celle de
       la scène entière : en deux colonnes, prendre la scène autoriserait un
       dessin deux fois trop large, qui déborderait sur le texte. */
    const dispo = porte.clientWidth || scene.clientWidth || 320;
    if (L > dispo) { L = dispo; H = L * h / w; }
    svg.setAttribute('viewBox', VUES[cle].vue);
    svg.style.width  = Math.round(L) + 'px';
    svg.style.height = Math.round(H) + 'px';
  }

  /** L'état d'arrivée statique : tout est là, tout est lisible, rien ne bouge. */
  function toutMontrer() {
    temps.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    piles.forEach(el => { el.style.opacity = '1'; });
    if (defiler) defiler.style.opacity = '0';
    if (titre) titre.style.opacity = '1';
    if (nav) nav.style.opacity = '1';
    porte.style.transform = 'none';
    mesurer();
    poserVue('ensemble', hauteurParcours());
    poserSilhouette();
    if (typeof gsap !== 'undefined') {
      gsap.set([...traitsCourbe, ...traitsNeurone], { drawSVG: '0% 100%' });
      gsap.set(boutsNeurone, { scale: 1, transformOrigin: 'center' });
    }
  }

  /* Mouvement réduit, ou GSAP absent : tout est visible, tout le temps. On ne
     retire jamais un contenu à quelqu'un qui a demandé moins d'animation, ni
     à quelqu'un dont le JavaScript a échoué. */
  if (typeof gsap === 'undefined' || mouvementReduit()) {
    H1 = hauteurParcours();
    toutMontrer();
    brancherBoutons();
    brancherCamera();
    return;
  }

  mesurer();
  H0 = hauteurIntro();
  H1 = hauteurParcours();

  /* --- L'apparition d'un temps ------------------------------------------- */

  const affiche = new WeakMap();

  function poser(el, visible, immediat) {
    if (!el || affiche.get(el) === visible) return;
    affiche.set(el, visible);

    /* Le porte-neurone est le seul élément à être DEUX choses à la fois : un
       temps qui apparaît, et l'objet que la bascule déplace vers le haut de
       l'écran. Les deux animaient sa position, et l'apparition gagnait :
       elle repartait vers y = 0 pendant les six dixièmes de seconde qui
       suivaient, en emportant le déplacement de la bascule avec elle.
       Le dessin se retrouvait alors cent pixels trop bas, et le texte du
       parcours défilait à découvert au dessus de lui.
       Ici, il n'apparaît qu'en opacité. Sa position appartient à basculer(),
       et à elle seule. */
    const seulementOpacite = (el === porte);

    if (immediat) {
      const etat = { opacity: visible ? 1 : 0 };
      if (!seulementOpacite) etat.y = visible ? 0 : 16;
      gsap.set(el, etat);
      return;
    }

    const arrivee = visible
      ? { opacity: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }
      : { opacity: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' };
    if (!seulementOpacite) arrivee.y = visible ? 0 : 16;
    gsap.to(el, arrivee);
  }

  /* --- Les tracés, asservis au défilement --------------------------------
     Ni la courbe ni le neurone ne sont joués en un temps donné : c'est le
     doigt du visiteur qui déroule le trait. C'est ce qui rend l'effet
     réversible sans une ligne de code de plus, et c'est ce qu'exige la règle
     du projet. */

  function tracer(traits, i, p) {
    if (!traits.length) return 0;
    const t = borne((p - i * PAS) / PAS, 0, 1);
    gsap.set(traits, { drawSVG: '0% ' + (t * 100) + '%' });
    return t;
  }

  /* --- La bascule vers le parcours ---------------------------------------
     Le texte de l'ouverture s'efface, le neurone grandit et remonte, son
     titre et ses boutons arrivent. Tout est piloté par une seule valeur,
     entre 0 et 1, elle même déduite du défilement. */

  function basculer(t) {
    piles.forEach(el => gsap.set(el, { opacity: 1 - t }));
    gsap.set([titre, nav], { opacity: t });
    /* Au delà de la moitié, les blocs de texte de l'ouverture ne doivent plus
       intercepter la souris : le texte du parcours défile à leur place. */
    scene.classList.toggle('bascule', t > 0.5);
    if (nav) nav.style.pointerEvents = t > 0.5 ? 'auto' : 'none';

    /* Tant que la bascule n'est pas finie, c'est elle qui tient la taille du
       dessin. Ensuite c'est la caméra, et il ne faut surtout pas lui reprendre
       la main : elle est en train d'animer le cadrage vers une partie. */
    if (t < 1 || !cameraActive) {
      poserVue(t < 1 ? 'ensemble' : cle, H0 + (H1 - H0) * t);
      /* La silhouette suit la même hauteur que le neurone d'introduction :
         elles partagent la case, donc toute différence se verrait comme un
         saut au moment de la bascule. */
      poserSilhouette();
    }
    /* offsetTop est une mesure de MISE EN PAGE : les transformations ne
       l'affectent pas, donc on peut la relire sans que notre propre
       déplacement ne se rajoute au précédent.

       padHaut est ajouté parce que offsetTop se compte depuis le bord de la
       scène, marge intérieure comprise. Sans lui, le dessin remontait jusque
       SOUS le bouton flottant, et son titre passait derrière. */
    decalage = t * (padHaut + MARGE_HAUTE - porte.offsetTop);
    gsap.set(porte, { y: decalage });
  }

  /* --- L'état, entièrement déduit du défilement --------------------------- */

  function progression() {
    const d = rails.offsetHeight;
    if (d <= 0) return 1;
    return borne(-section.getBoundingClientRect().top / d, 0, 1);
  }

  function majEtat(immediat) {
    const p = progression();

    /* LE VERROU D'ENTRÉE. Tant que le bouton n'est pas cliqué, rien
       n'apparaît au-delà du premier temps, même si le visiteur fait défiler.
       Posé par le JavaScript et jamais par le CSS : si le script échoue, tout
       le texte reste lisible plutôt que bloqué. */
    temps.forEach((el, i) => poser(el, (entre || i === 0) && p >= i * PAS, immediat));

    /* LA SILHOUETTE S'EFFACE QUAND LE NEURONE ARRIVE.
       Ils partagent la même case de grille, donc les laisser visibles
       ensemble les superpose : un neurone à moitié dessiné par-dessus un
       corps. C'est le seul temps du site qui n'est pas monotone, et il doit
       l'être : le récit plonge DANS le trajet pour y trouver le neurone, donc
       le plan large cède la place au gros plan.

       Fondu croisé : la silhouette part sur le temps qui précède le neurone,
       de sorte qu'à aucun instant les deux ne sont opaques ensemble. */
    if (porteSil) {
      const debut = iSil * PAS;
      const fin   = iNeurone * PAS;
      const dedans = entre && p >= debut && p < fin;
      poser(porteSil, dedans, immediat);
    }
    poser(defiler, p < 0.01, immediat);

    tracer(traitsCourbe, iCourbe, p);
    /* Le trajet dans la silhouette se dessine de la tête vers le doigt,
       dans le sens du voyage. */
    tracer(traitTrajet, iSil, p);
    const tn = tracer(traitsNeurone, iNeurone, p);
    /* Les renflements des terminaisons arrivent une fois le trait posé. */
    gsap.set(boutsNeurone, {
      scale: borne((tn - 0.82) / 0.18, 0, 1), transformOrigin: 'center'
    });

    /* La bascule est recalculée À CHAQUE passage, y compris une fois
       terminée. Le raccourci qui l'arrêtait à t = 1 laissait un déplacement
       périmé dès que la mise en page bougeait sous elle, par exemple au
       redimensionnement ou pendant un mouvement de caméra. Le calcul est de
       toute façon négligeable : une lecture de position et une écriture. */
    const t = borne((p - N * PAS) / PAS, 0, 1);
    basculer(t);
    cameraActive = t >= 1;
    if (cameraActive) majCamera();
  }

  /* --- La caméra, une fois la bascule terminée ---------------------------
     C'est le bloc de texte présent dans la zone de lecture qui commande le
     cadrage. En remontant, le bloc précédent y revient et la caméra revient
     avec lui : l'état ne peut pas se désynchroniser de ce qu'on voit. */

  function blocCourant() {
    const h = window.innerHeight || 800;
    return blocs.find(b => {
      const r = b.getBoundingClientRect();
      return r.bottom > h * HAUT && r.top < h * BAS;
    });
  }

  function surbriller(idPartie) {
    clearTimeout(minuteur);
    svg.querySelectorAll('.partie').forEach(g => g.classList.remove('surbrillance'));
    if (!idPartie) return;
    const g = svg.querySelector('#' + idPartie);
    if (!g) return;
    g.classList.add('surbrillance');
    minuteur = setTimeout(() => g.classList.remove('surbrillance'), 1800);
  }

  function allerA(nouvelle) {
    if (!VUES[nouvelle]) return;
    const memeVue = nouvelle === cle;
    cle = nouvelle;
    const { vue, partie, titre: nom } = VUES[cle];

    if (!memeVue) {
      if (typeof gsap === 'undefined' || mouvementReduit()) {
        poserVue(cle, H1);
      } else {
        const [, , w, h] = vue.split(/\s+/).map(Number);
        let H = H1, L = H * w / h;
        /* La largeur disponible est celle de la COLONNE du dessin, pas celle de
       la scène entière : en deux colonnes, prendre la scène autoriserait un
       dessin deux fois trop large, qui déborderait sur le texte. */
    const dispo = porte.clientWidth || scene.clientWidth || 320;
        if (L > dispo) { L = dispo; H = L * h / w; }
        /* Le cadre et le cadrage bougent ensemble : si l'un devançait
           l'autre, des bandes vides apparaîtraient pendant la transition. */
        gsap.to(svg, {
          attr: { viewBox: vue }, width: Math.round(L), height: Math.round(H),
          duration: 1.1, ease: 'power2.inOut', overwrite: 'auto'
        });
      }
      surbriller(partie);
    }

    /* L'état est écrit à CHAQUE passage, même si la vue n'a pas changé.
       Sinon le tout premier appel, qui trouve déjà la vue d'ensemble en
       place, ne posait aria-current sur aucun bouton et n'annonçait rien :
       le visiteur au clavier ou au lecteur d'écran ne savait pas où il en
       était. Rendre l'état visible est une exigence du volet cognitif. */
    if (titre) titre.textContent = nom.charAt(0).toUpperCase() + nom.slice(1);
    if (annonce && !memeVue) annonce.textContent = 'Vue sur ' + nom + '.';
    boutons.forEach(b => b.setAttribute('aria-current', String(b.dataset.vers === cle)));
  }

  function majCamera() {
    const b = blocCourant();
    if (b) allerA(b.dataset.vue);
  }

  function brancherCamera() {
    majCamera();
    window.addEventListener('scroll', majCamera, { passive: true });
  }

  /* --- Les boutons ne font que déplacer le défilement ---------------------
     Ils ne changent pas l'état eux mêmes. C'est ce qui garantit que ce qu'on
     voit et ce que dit l'interface ne peuvent pas diverger. */

  function brancherEntree() {
    const bouton = section.querySelector('[data-entree]');
    if (!bouton) { entre = true; return; }
    bouton.addEventListener('click', () => {
      if (entre) return;
      entre = true;
      document.documentElement.classList.add('entre');
      majEtat(false);
      /* On avance d'EXACTEMENT un temps, sinon le bouton a l'air de n'avoir
         rien fait.

         Surtout pas scrollIntoView sur le temps suivant : les temps vivent
         dans une scène COLLÉE, donc leur position à l'écran ne bouge pas et
         leur position dans le flux est ailleurs. L'appel envoyait la page
         dans le vide et l'écran devenait blanc.

         Ici on déplace le défilement de la distance qui sépare deux temps,
         c'est-à-dire une fraction des rails, ce qui est la seule grandeur
         qui gouverne réellement la progression. */
      const pas = rails.offsetHeight * PAS;
      window.scrollBy({ top: pas, behavior: mouvementReduit() ? 'auto' : 'smooth' });

      /* Le bloc du bouton se replie, donc la hauteur des piles change et
         les tailles des dessins avec elle. Il ne suffit PAS de remesurer :
         il faut recalculer H0 et H1, sinon les dessins gardent la taille
         plancher calculée quand le bouton occupait encore sa place. C'est ce
         qui laissait une silhouette de 47 pixels de large. */
      setTimeout(() => {
        mesurer();
        H0 = hauteurIntro();
        H1 = hauteurParcours();
        poserSilhouette();
        majEtat(true);
      }, 700);
    });
  }

  function brancherBoutons() {
    boutons.forEach(b => {
      b.addEventListener('click', () => {
        const bloc = document.querySelector('#etape-' + b.dataset.vers);
        if (!bloc) return;
        bloc.scrollIntoView({
          behavior: mouvementReduit() ? 'auto' : 'smooth', block: 'start'
        });
      });
    });
  }

  /* --- Démarrage ---------------------------------------------------------- */

  gsap.set(temps, { opacity: 0, y: 16 });
  gsap.set([titre, nav], { opacity: 0 });
  gsap.set([...traitsCourbe, ...traitsNeurone], { drawSVG: '0% 0%' });
  gsap.set(boutsNeurone, { scale: 0, transformOrigin: 'center' });
  poserVue('ensemble', H0);
  poserSilhouette();
  majEtat(true);

  brancherEntree();
  brancherBoutons();

  /* Mise à jour SYNCHRONE, volontairement : requestAnimationFrame ne part pas
     quand la page n'est pas peinte, ce qui rendrait le comportement
     invérifiable et pourrait le figer. Le navigateur limite déjà les
     événements de défilement à environ un par image. */
  function auDefilement() { majEtat(false); }

  function auRedimensionnement() {
    mesurer();
    H0 = hauteurIntro();
    H1 = hauteurParcours();
    majEtat(true);
  }

  window.addEventListener('scroll', auDefilement, { passive: true });
  window.addEventListener('resize', auRedimensionnement, { passive: true });

  /* Exposé pour les tests automatisés. */
  window.__apparitions = { majEtat, temps, progression, PAS };
  window.__parcours = {
    majParcours: majCamera, blocCourant, vueActuelle: () => cle,
    bascule: () => borne((progression() - N * PAS) / PAS, 0, 1)
  };

  document.addEventListener('mouvement:change', (e) => {
    if (!e.detail.reduire) return;
    window.removeEventListener('scroll', auDefilement);
    window.removeEventListener('resize', auRedimensionnement);
    gsap.killTweensOf([...temps, ...piles, svg, porte]);
    toutMontrer();
  });
}
