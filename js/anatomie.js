/* ==========================================================================
   anatomie.js, section 1 : « Qui est-ce ? »
   --------------------------------------------------------------------------
   Le neurone se CONSTRUIT partie par partie. Deux principes s'y rejoignent :
   la consigne de départ (rien n'apparaît en même temps, les parties viennent
   dans une suite logique) et la grammaire de 3Blue1Brown (le trait se dessine,
   puis se nomme, puis on bâtit dessus).

   La caméra, c'est-à-dire le viewBox du SVG, se déplace vers la partie dont on
   parle. C'est aussi ce qui rend la chose lisible sur un petit écran : sans
   zoom, les dendrites feraient trois pixels de haut sur un téléphone.

   La surbrillance est MOMENTANÉE. On clique, la partie s'allume le temps qu'on
   la repère, puis le dessin revient à l'encre noire. Rien n'est atténué en
   permanence, pour que le schéma reste épuré.
   ========================================================================== */

import { mouvementReduit } from './a11y.js';

/* La lucarne prend la forme de ce qu'elle cadre, au lieu de forcer le dessin
   dans un cadre fixe. Sans ça, zoomer sur un détail large et court laisserait
   d'immenses bandes vides au-dessus et en dessous. Le cadre se déforme donc
   en même temps que la caméra se déplace, ce qui se voit et se comprend.

   Les quatre parties partagent le même rapport 4:5, donc la lucarne ne bouge
   que lorsqu'on passe à la vue d'ensemble, qui est haute et étroite. */
const VUE_ENSEMBLE = '0 0 400 1000';
const DUREE_SURBRILLANCE = 1800;   /* millisecondes */

const PARTIES = [
  {
    id: 'p-dendrites',
    vue: '50 8 300 375',
    titre: 'Les dendrites, le buisson qui écoute',
    texte: `C'est par là que les messages arrivent. Un seul neurone peut en
            recevoir <strong>des milliers en même temps</strong>, venus de
            milliers d'autres neurones. Toutes ces branches ne font qu'une
            chose : collecter.`
  },
  {
    id: 'p-soma',
    vue: '130 133 140 175',
    titre: 'Le corps cellulaire, le poste de commande',
    texte: `Tout ce que les dendrites ont récolté converge ici. Le corps
            cellulaire fait la somme, et il tranche : <strong>on transmet, ou
            on ne transmet pas</strong>. C'est la décision de tout le neurone,
            prise en un seul endroit.`
  },
  {
    id: 'p-axone',
    vue: '40 230 320 400',
    titre: "L'axone, le câble de sortie",
    texte: `Un neurone a des centaines de dendrites, mais <strong>un seul
            axone</strong>. Le message part par là, et seulement par là. Chez
            toi, certains axones descendent de la moelle épinière jusqu'au
            pied : presque <strong>un mètre de long</strong>, pour une seule
            cellule.`
  },
  {
    id: 'p-terminaisons',
    vue: '100 748 200 250',
    titre: 'Les terminaisons, la remise en mains propres',
    texte: `Au bout, l'axone se divise en petites branches, chacune finie par
            un renflement. C'est là que le message est <strong>remis au
            destinataire</strong> : un autre neurone, ou un muscle. Comme ton
            pouce, tout à l'heure.`
  }
];

export function initAnatomie() {
  const svg = document.querySelector('#anatomie .neurone');
  if (!svg) return;

  const groupes = PARTIES.map(p => svg.querySelector('#' + p.id));
  const boutons = [...document.querySelectorAll('.etapes button[data-etape]')];
  const elTitre = document.querySelector('.explication [data-titre]');
  const elTexte = document.querySelector('.explication [data-texte]');

  let courante = -1;
  let maxAtteinte = -1;
  let minuteur = null;

  /* Hauteur maximale de la lucarne : le dessin ET les boutons doivent tenir
     ensemble à l'écran, sinon on ne voit pas ce qu'on est en train de piloter. */
  const hauteurMax = () => Math.min(window.innerHeight * 0.46, 440);

  /** Dimensions que doit prendre la lucarne pour cadrer `vue` sans bande vide. */
  function dimensions(vue) {
    const [, , w, h] = vue.split(/\s+/).map(Number);
    const dispo = (svg.parentElement.clientWidth || 320) - 16;
    let L = dispo, H = L * h / w;
    const max = hauteurMax();
    if (H > max) { H = max; L = H * w / h; }
    return { L: Math.round(L), H: Math.round(H) };
  }

  let vueCourante = VUE_ENSEMBLE;

  function poser(vue) {
    const { L, H } = dimensions(vue);
    svg.setAttribute('viewBox', vue);
    svg.style.width = L + 'px';
    svg.style.height = H + 'px';
  }

  poser(VUE_ENSEMBLE);

  /* Si la fenêtre change de taille, la lucarne se recalcule. */
  window.addEventListener('resize', () => poser(vueCourante));

  /* ATTENTION, piège coûteux : `element.hidden = true` ne fonctionne PAS sur
     un élément SVG. La propriété `hidden` appartient à HTMLElement, pas à
     SVGElement, donc l'affectation crée une propriété JavaScript inerte et
     ne pose jamais l'attribut. On passe donc par une classe.

     aria-hidden en plus de la classe : un lecteur d'écran ne doit pas
     annoncer des parties du neurone qui n'existent pas encore. */
  function montrer(g, visible) {
    if (!g) return;
    g.classList.toggle('cachee', !visible);
    if (visible) g.removeAttribute('aria-hidden');
    else g.setAttribute('aria-hidden', 'true');
  }
  const estCache = g => g.classList.contains('cachee');

  groupes.forEach(g => montrer(g, false));

  const anime = () => typeof gsap !== 'undefined' && !mouvementReduit();

  function deplacerCamera(vue) {
    vueCourante = vue;
    if (!anime()) { poser(vue); return; }
    const { L, H } = dimensions(vue);
    /* Le cadre et le cadrage bougent ensemble : si l'un devançait l'autre,
       on verrait apparaître des bandes vides le temps de la transition. */
    gsap.to(svg, {
      attr: { viewBox: vue }, width: L, height: H,
      duration: 1.2, ease: 'power2.inOut'
    });
  }

  function dessiner(groupe) {
    if (!anime()) return;
    const traits = groupe.querySelectorAll('.t');
    const points = groupe.querySelectorAll('.b');
    if (traits.length) {
      gsap.fromTo(traits, { drawSVG: '0%' },
        { drawSVG: '100%', duration: 0.9, stagger: 0.05, ease: 'power1.out' });
    }
    if (points.length) {
      gsap.fromTo(points, { scale: 0, transformOrigin: 'center' },
        { scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(2)', delay: 0.5 });
    }
  }

  /** Allume la partie le temps qu'on la repère, puis rend la main. */
  function surbriller(groupe) {
    clearTimeout(minuteur);
    groupes.forEach(g => g && g.classList.remove('surbrillance'));
    if (!groupe) return;
    groupe.classList.add('surbrillance');
    minuteur = setTimeout(() => groupe.classList.remove('surbrillance'),
                          DUREE_SURBRILLANCE);
  }

  function allerA(i) {
    courante = i;
    maxAtteinte = Math.max(maxAtteinte, i);

    groupes.forEach((g, k) => {
      if (!g) return;
      const etaitCache = estCache(g);
      montrer(g, k <= maxAtteinte);
      if (k <= maxAtteinte && etaitCache) dessiner(g);
    });

    deplacerCamera(PARTIES[i].vue);
    surbriller(groupes[i]);

    elTitre.textContent = PARTIES[i].titre;
    elTexte.innerHTML = PARTIES[i].texte;

    boutons.forEach((b, k) => {
      b.setAttribute('aria-current', String(k === i));
      b.dataset.atteinte = k <= maxAtteinte ? 'oui' : 'non';
    });
  }

  function toutVoir() {
    maxAtteinte = PARTIES.length - 1;
    courante = -1;
    surbriller(null);
    groupes.forEach(g => {
      if (!g) return;
      const etaitCache = estCache(g);
      montrer(g, true);
      if (etaitCache) dessiner(g);
    });
    deplacerCamera(VUE_ENSEMBLE);
    elTitre.textContent = 'Le neurone en entier';
    elTexte.innerHTML = `Voilà la cellule complète. Le message entre par le
      haut, descend tout le long, et ressort en bas.
      <strong>Toujours dans ce sens.</strong>`;
    boutons.forEach(b => {
      b.setAttribute('aria-current', 'false');
      b.dataset.atteinte = 'oui';
    });
  }

  boutons.forEach(b => {
    b.addEventListener('click', () => allerA(Number(b.dataset.etape)));
  });

  /* Les flèches du clavier passent d'une étape à l'autre, comme dans une
     barre d'onglets. */
  document.querySelector('.etapes')?.addEventListener('keydown', (e) => {
    const pas = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const cible = Math.min(PARTIES.length - 1,
                           Math.max(0, (courante < 0 ? 0 : courante) + pas));
    boutons[cible].focus();
    allerA(cible);
  });

  document.querySelector('[data-tout-voir]')?.addEventListener('click', toutVoir);

  /* À l'arrivée dans la section, la construction démarre seule : un cadre
     vide n'inviterait personne à cliquer. */
  function demarrer() { if (maxAtteinte === -1) allerA(0); }

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '.explorateur', start: 'top 70%', once: true, onEnter: demarrer
    });
  } else {
    demarrer();
  }

  /* Si les animations sont coupées en cours de route, on montre l'état final
     complet plutôt que de laisser le neurone à moitié construit. */
  document.addEventListener('mouvement:change', (e) => {
    if (e.detail.reduire) toutVoir();
  });
}
