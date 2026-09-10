/* ==========================================================================
   anatomie.js — section 1, « Qui est-ce ? »
   --------------------------------------------------------------------------
   Le neurone se CONSTRUIT partie par partie. Deux principes s'y rejoignent :
   la consigne de l'utilisateur (« rien n'apparaît en même temps, les parties
   viennent dans une suite logique ») et la grammaire de 3Blue1Brown (le trait
   se dessine, puis se nomme, puis on bâtit dessus).

   La caméra — c'est-à-dire le viewBox du SVG — se déplace vers la partie dont
   on parle, puis recule. C'est le deuxième principe de 3Blue1Brown, et c'est
   aussi ce qui rend la chose lisible sur un petit écran : sans zoom, les
   dendrites seraient illisibles sur un téléphone.
   ========================================================================== */

import { mouvementReduit } from './a11y.js';

const VUE_ENSEMBLE = '0 0 1000 400';

const PARTIES = [
  {
    id: 'p-dendrites',
    vue: '20 10 340 380',
    titre: 'Les dendrites, le buisson qui écoute',
    texte: `C'est par là que les messages arrivent. Un seul neurone peut en
            recevoir <strong>des milliers en même temps</strong>, venus de
            milliers d'autres neurones. Toutes ces branches ne font qu'une
            chose : collecter.`
  },
  {
    id: 'p-soma',
    vue: '170 130 180 144',
    titre: 'Le corps cellulaire, le poste de commande',
    texte: `Tout ce que les dendrites ont récolté converge ici. Le corps
            cellulaire fait la somme, et tranche : <strong>on transmet, ou
            on ne transmet pas</strong>. C'est la décision de tout le neurone,
            prise en un seul endroit.`
  },
  {
    id: 'p-axone',
    vue: '250 120 600 160',
    titre: "L'axone, le câble de sortie",
    texte: `Un neurone a des milliers de dendrites, mais <strong>un seul
            axone</strong>. Le message part par là, et seulement par là. Chez
            toi, certains axones descendent de la moelle épinière jusqu'au
            pied : presque <strong>un mètre de long</strong>, pour une seule
            cellule.`
  },
  {
    id: 'p-terminaisons',
    vue: '790 90 220 220',
    titre: 'Les terminaisons, la remise en mains propres',
    texte: `Au bout, l'axone se divise en un bouquet de petites branches,
            chacune terminée par un renflement. C'est là que le message est
            <strong>remis au destinataire</strong> : un autre neurone, ou un
            muscle. Comme ton pouce, tout à l'heure.`
  }
];

export function initAnatomie() {
  const svg = document.querySelector('#neurone');
  if (!svg) return;

  const groupes = PARTIES.map(p => svg.querySelector('#' + p.id));
  const boutons = [...document.querySelectorAll('.etapes button[data-etape]')];
  const elTitre = document.querySelector('.explication [data-titre]');
  const elTexte = document.querySelector('.explication [data-texte]');

  let courante = -1;
  let maxAtteinte = -1;

  /* On cache tout au départ : le neurone n'existe pas encore, il va se
     construire. [hidden] plutôt qu'une opacité à zéro, pour qu'un lecteur
     d'écran n'annonce pas des parties qui ne sont pas là. */
  groupes.forEach(g => { if (g) g.hidden = true; });

  const anime = () => typeof gsap !== 'undefined' && !mouvementReduit();

  function deplacerCamera(vue) {
    if (!anime()) { svg.setAttribute('viewBox', vue); return; }
    gsap.to(svg, { attr: { viewBox: vue }, duration: 1.1, ease: 'power2.inOut' });
  }

  function dessiner(groupe) {
    if (!anime()) return;
    const traits = groupe.querySelectorAll('.t');
    const boutons = groupe.querySelectorAll('.b');
    if (traits.length) {
      gsap.fromTo(traits, { drawSVG: '0%' },
        { drawSVG: '100%', duration: 0.9, stagger: 0.035, ease: 'power1.out' });
    }
    if (boutons.length) {
      gsap.fromTo(boutons, { scale: 0, transformOrigin: 'center' },
        { scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(2)', delay: 0.5 });
    }
  }

  function allerA(i) {
    const nouvelle = i > maxAtteinte;
    courante = i;
    maxAtteinte = Math.max(maxAtteinte, i);

    groupes.forEach((g, k) => {
      if (!g) return;
      const etaitCache = g.hidden;
      g.hidden = k > maxAtteinte;
      g.classList.toggle('active', k === i);
      /* Tant qu'une seule partie existe, ne pas l'atténuer : il n'y a rien
         à côté d'elle dont il faudrait la distinguer. */
      g.classList.toggle('seule', maxAtteinte === 0);
      if (!g.hidden && etaitCache) dessiner(g);
    });

    deplacerCamera(PARTIES[i].vue);

    elTitre.textContent = PARTIES[i].titre;
    elTexte.innerHTML = PARTIES[i].texte;

    boutons.forEach((b, k) => {
      b.setAttribute('aria-current', String(k === i));
      b.dataset.atteinte = k <= maxAtteinte ? 'oui' : 'non';
    });
    void nouvelle;
  }

  function toutVoir() {
    maxAtteinte = PARTIES.length - 1;
    courante = -1;
    groupes.forEach(g => {
      if (!g) return;
      const etaitCache = g.hidden;
      g.hidden = false;
      g.classList.remove('active');
      g.classList.add('seule');
      if (etaitCache) dessiner(g);
    });
    deplacerCamera(VUE_ENSEMBLE);
    elTitre.textContent = 'Le neurone en entier';
    elTexte.innerHTML = `Voilà la cellule complète. Le message entre à gauche,
      traverse tout, et ressort à droite — <strong>toujours dans ce sens</strong>.`;
    boutons.forEach(b => { b.setAttribute('aria-current', 'false'); b.dataset.atteinte = 'oui'; });
  }

  boutons.forEach(b => {
    b.addEventListener('click', () => allerA(Number(b.dataset.etape)));
  });

  /* Les flèches du clavier déplacent d'une étape à l'autre, comme dans une
     vraie barre d'onglets. */
  document.querySelector('.etapes')?.addEventListener('keydown', (e) => {
    const pas = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    e.preventDefault();
    const suivant = Math.min(PARTIES.length - 1, Math.max(0, (courante < 0 ? 0 : courante) + pas));
    boutons[suivant].focus();
    allerA(suivant);
  });

  document.querySelector('[data-tout-voir]')?.addEventListener('click', toutVoir);

  /* À l'arrivée dans la section, on démarre la construction tout seul :
     une page vide n'inviterait personne à cliquer. */
  function demarrer() { if (courante === -1 && maxAtteinte === -1) allerA(0); }

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({ trigger: '#anatomie', start: 'top 65%', once: true, onEnter: demarrer });
  } else {
    demarrer();
  }

  /* Si les animations sont coupées en cours de route, on montre l'état final
     complet plutôt que de laisser le neurone à moitié construit. */
  document.addEventListener('mouvement:change', (e) => { if (e.detail.reduire) toutVoir(); });
}
