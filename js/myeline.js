/* ==========================================================================
   myeline.js : le défi du chronomètre, second moment interactif (1C, t16)
   --------------------------------------------------------------------------
   Ce que le visiteur fait : il pose des segments de gaine sur l'axone, un par
   un, six au maximum. À chaque changement, l'impulsion repart du haut et le
   chronomètre affiche le temps mis pour parcourir tout le trajet.

   Ce qu'il découvre, et ce n'est pas la proportionnalité attendue : à cinq
   segments sur six, le message est encore cinq fois trop lent. Le signal
   passe presque tout son temps dans les portions restées nues. Le temps 17
   énonce cette leçon APRÈS, jamais avant.

   LE MODÈLE, tel que 02-CONTENU le pose et le valide.
     temps = part fixe + longueur nue / vitesse nue + longueur gainée / vitesse gainée
     trajet 1 m, 2 m/s sans myéline, 100 m/s avec, part fixe 0,011 s [S3].
     À six segments sur six : 0,021 s. La mesure réelle est 0,0214 s [S1]. Le
     modèle retombe sur la mesure sans avoir été forcé : c'est ce qui autorise
     à afficher ces nombres. Les autres valeurs sont des sorties de modèle.

   CE QUE LE DESSIN NE DIT PAS. Un axone à moitié gainé est une situation de
   laboratoire ou de maladie, pas un état normal : le défi est un dispositif
   pédagogique, pas la description d'un axone en train de se construire. Et
   la démyélinisation réelle ne fait pas que ralentir, elle bloque aussi : le
   modèle ne représente que le ralentissement. Simplifications assumées.

   ACCESSIBILITÉ. Deux boutons, Ajouter et Retirer, plus un curseur natif de
   0 à 6 : aucune dépendance au glissement. Annonce en aria-live après chaque
   changement, avec la cible. Aucune limite de temps, aucun état d'échec : le
   temps 17 donne la réponse de toute façon. Le succès n'est pas signalé par
   la seule couleur : la cible affiche aussi le mot « atteint ».
   ========================================================================== */

import { mouvementReduit } from './a11y.js?v=c1a2e0d5';

const SEGMENTS = 6;
const LONGUEUR_M = 1;          /* non affichée au visiteur */
const V_NUE = 2, V_GAINEE = 100, PART_FIXE = 0.011;
const CIBLE_S = 0.0214;        /* [S1], affichée arrondie : 0,02 s */

/* Durées d'animation par segment, pour que l'œil voie la différence : le
   signal rampe sur un segment nu, il saute sur un segment gainé. Rapport de
   dix, lisible ; le vrai rapport est de cinquante, dit par le texte. */
const ANIM_NU = 0.42, ANIM_GAINE = 0.045;

const borne = (v, min, max) => Math.min(max, Math.max(min, v));

/** Le temps du modèle, en secondes, pour n segments gainés sur six. */
export function tempsModele(n) {
  const nue = LONGUEUR_M * (SEGMENTS - n) / SEGMENTS;
  const gainee = LONGUEUR_M * n / SEGMENTS;
  return PART_FIXE + nue / V_NUE + gainee / V_GAINEE;
}

/** « 0,51 s », en français, deux décimales. */
export function formater(s) {
  return s.toFixed(2).replace('.', ',') + ' s';
}

export function initMyeline() {
  const bloc = document.querySelector('[data-interaction="myeline"]');
  const svg  = document.querySelector('.neurone');
  if (!bloc || !svg) return;

  const curseur  = bloc.querySelector('input[type="range"]');
  const ajouter  = bloc.querySelector('[data-ajouter]');
  const retirer  = bloc.querySelector('[data-retirer]');
  const valeur   = bloc.querySelector('[data-chrono-valeur]');
  const etatCible = bloc.querySelector('[data-chrono-etat]');
  const annonce  = bloc.querySelector('[data-annonce-myeline]');
  const axone    = svg.querySelector('#p-axone path');
  const gaines   = svg.querySelector('.gaines');
  const impulsion = svg.querySelector('.impulsion-defi');
  if (!curseur || !axone || !gaines || !impulsion) return;

  const anime = () => typeof gsap !== 'undefined' && !mouvementReduit();
  const L = axone.getTotalLength();

  /* --- Les six segments de gaine ----------------------------------------
     Chacun est une copie du tracé de l'axone dont on ne dessine qu'une
     portion, par stroke-dasharray. Deux copies par segment : un filet
     d'encre dessous, un peu plus large, et la bande verte dessus. C'est le
     filet qui porte le contraste, pas la couleur. Un petit espace entre
     deux segments laisse voir l'axone nu, comme un nœud. */
  const bandes = [];
  const d = axone.getAttribute('d');
  const NS = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < SEGMENTS; i++) {
    const seg = L / SEGMENTS, marge = seg * 0.07;
    const debut = i * seg + marge, longueur = seg - 2 * marge;
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('opacity', '0');
    for (const [couleur, largeur] of [['var(--ink)', 11], ['var(--myeline)', 7.5]]) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', couleur);
      p.setAttribute('stroke-width', String(largeur));
      p.setAttribute('stroke-linecap', 'butt');
      p.setAttribute('stroke-dasharray', '0 ' + debut + ' ' + longueur + ' ' + (L * 2));
      g.appendChild(p);
    }
    gaines.appendChild(g);
    bandes.push(g);
  }

  /* --- L'état ------------------------------------------------------------- */

  let poses = 0;
  let course = null;          /* l'animation de l'impulsion en cours */
  const chrono = { t: 0 };

  function poserGaines(n, immediat) {
    bandes.forEach((g, i) => {
      const voulu = i < n ? 1 : 0;
      if (immediat || !anime()) g.setAttribute('opacity', String(voulu));
      else gsap.to(g, { attr: { opacity: voulu }, duration: 0.35, overwrite: 'auto' });
    });
  }

  function texteSegments(n) {
    if (n === 0) return 'aucun segment sur six';
    return (n === 1 ? 'un segment' : n + ' segments') + ' sur six';
  }

  function afficherTemps(s) {
    if (valeur) valeur.textContent = formater(s);
  }

  function poserEtat(n) {
    const atteint = n >= SEGMENTS;
    if (etatCible) etatCible.textContent = atteint ? 'Objectif atteint.' : '';
    bloc.classList.toggle('defi-atteint', atteint);
  }

  /** Repart du haut de l'axone et descend, lentement sur le nu, vite sur le
      gainé. Le chronomètre compte pendant la course et se pose sur le temps
      du modèle à l'arrivée, qui est ce que le visiteur retient. */
  function courir(n) {
    const total = tempsModele(n);
    if (course) course.kill();
    if (!anime()) {
      gsap.set && gsap.set(impulsion, { opacity: 0 });
      afficherTemps(total);
      return;
    }
    const tl = gsap.timeline({
      onComplete() { gsap.set(impulsion, { opacity: 0 }); afficherTemps(total); }
    });
    course = tl;
    const seg = L / SEGMENTS;
    const dureeTotale = Array.from({ length: SEGMENTS }, (_, i) => i < n ? ANIM_GAINE : ANIM_NU)
                             .reduce((a, b) => a + b, 0);
    /* Le chronomètre compte de 0 au temps du modèle, sur la durée de la
       course : il « tourne » pendant que le message avance. */
    chrono.t = 0;
    tl.set(impulsion, { opacity: 1 }, 0);
    tl.to(chrono, { t: total, duration: dureeTotale, ease: 'none',
                    onUpdate() { afficherTemps(chrono.t); } }, 0);
    const p = { d: 0 };
    let t0 = 0;
    for (let i = 0; i < SEGMENTS; i++) {
      const duree = i < n ? ANIM_GAINE : ANIM_NU;
      tl.to(p, { d: (i + 1) * seg, duration: duree, ease: 'none',
                 onUpdate() {
                   const pt = axone.getPointAtLength(p.d);
                   impulsion.setAttribute('cx', pt.x); impulsion.setAttribute('cy', pt.y);
                 } }, t0);
      t0 += duree;
    }
  }

  function appliquer(n, immediat) {
    n = borne(Math.round(n), 0, SEGMENTS);
    poses = n;
    curseur.value = String(n);
    curseur.setAttribute('aria-valuetext', texteSegments(n));
    poserGaines(n, immediat);
    poserEtat(n);
    courir(n);
    if (annonce) {
      const t = tempsModele(n);
      annonce.textContent = texteSegments(n).charAt(0).toUpperCase() + texteSegments(n).slice(1)
        + '. Le message met ' + formater(t).replace(' s', ' seconde')
        + '. Objectif : 0,02 seconde' + (n >= SEGMENTS ? ', atteint.' : '.');
    }
  }

  curseur.addEventListener('input', () => appliquer(Number(curseur.value)));
  if (ajouter) ajouter.addEventListener('click', () => appliquer(poses + 1));
  if (retirer) retirer.addEventListener('click', () => appliquer(poses - 1));

  /* --- La démonstration du temps 14 --------------------------------------
     « Sur un axone nu, c'est lent » : quand la phrase apparaît, une
     impulsion descend l'axone nu, une fois, lentement. Déclenchée par le
     défilement, jamais par un délai. */
  document.addEventListener('temps:parcours', (e) => {
    const { el, visible } = e.detail;
    if (!el || el.dataset.demo !== 'lent') return;
    if (visible && poses === 0) courir(0);
    else if (!visible && course) { course.kill(); gsap.set(impulsion, { opacity: 0 }); }
  });

  afficherTemps(tempsModele(0));
  poserGaines(0, true);
  poserEtat(0);

  window.__myeline = { appliquer, poses: () => poses, temps: tempsModele };
}
