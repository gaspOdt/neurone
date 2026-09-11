/* ==========================================================================
   seuil.js : le curseur du seuil, premier moment interactif (1B, temps 8)
   --------------------------------------------------------------------------
   Ce que le visiteur fait : il monte le nombre de messages qui arrivent.
   Ce qu'il voit : des points bleus arrivent par les dendrites, le corps
   cellulaire se remplit de bleu par le bas à chaque arrivée, puis se vide.
   Au passage du seuil, quelque chose part vers le bas, en bleu, et la courbe
   se trace à côté : c'est le même objet vu de deux façons. Poussé plus haut,
   le curseur redéclenche une impulsion IDENTIQUE, ce qui rend le tout ou
   rien évident sans l'expliquer.

   CE QUE CE FICHIER NE DIT PAS. Aucune valeur chiffrée de seuil : ce n'est
   pas une constante, elle dépend de la cellule et de l'instant [S6]. Le texte
   parle d'« un niveau à atteindre », et le dessin montre une ligne, sans
   nombre. Et jamais « le long de l'axone » : l'axone n'est nommé qu'en 1C.

   ACCESSIBILITÉ. Un <input type="range"> natif, donc pilotable aux flèches,
   plus deux boutons Moins et Plus : aucune dépendance au glissement
   (WCAG 2.5.7). Chaque changement est annoncé en aria-live. Aucune limite de
   temps, aucun état d'échec : on peut rester à deux messages et continuer.

   MOUVEMENT RÉDUIT. Pas de points qui voyagent : le niveau se pose d'un coup,
   l'impulsion aussi, et l'annonce dit la même chose que l'animation.

   LA RÈGLE DU PROJET, « rien ne bouge si le visiteur ne fait rien », est
   respectée : tout part d'un geste sur le curseur, ou de l'arrivée d'un
   temps au défilement (la petite démonstration du temps 7), et tout
   s'arrête tout seul.
   ========================================================================== */

import { mouvementReduit } from './a11y.js?v=c1a2e0d5';

/* Combien de messages, arrivés assez vite, font atteindre le seuil. Choisi
   pour que le curseur laisse une vraie marge en dessous (on voit monter et
   redescendre) et une vraie marge au dessus (on voit que pousser plus ne
   change rien à l'impulsion). Ce n'est pas une donnée scientifique, c'est
   le réglage d'un jeu. */
const MESSAGES_POUR_SEUIL = 6;

/* Le rectangle qui découpe le disque bleu du corps, en coordonnées du
   dessin : l'axe x local est la verticale de l'écran, 246 est le bas du
   corps, 194 le haut. Voir outils-dessin-neurone.py. */
const BAS_CORPS = 246, HAUT_CORPS = 194;

const borne = (v, min, max) => Math.min(max, Math.max(min, v));

export function initSeuil() {
  const bloc     = document.querySelector('[data-interaction="seuil"]');
  const svg      = document.querySelector('.neurone');
  if (!bloc || !svg) return;

  const curseur  = bloc.querySelector('input[type="range"]');
  const moins    = bloc.querySelector('[data-moins]');
  const plus     = bloc.querySelector('[data-plus]');
  const annonce  = bloc.querySelector('[data-annonce-seuil]');
  const clipRect = svg.querySelector('.soma-clip-rect');
  const ligneSeuil = svg.querySelector('.soma-seuil');
  const messages = svg.querySelector('.messages');
  const impulsion = svg.querySelector('.impulsion');
  const axone    = svg.querySelector('#p-axone path');
  const traitsCourbe = [...document.querySelectorAll('.figure-courbe .t')];
  if (!curseur || !clipRect || !messages || !impulsion || !axone) return;

  const anime = () => typeof gsap !== 'undefined' && !mouvementReduit();

  /* --- Les chemins d'arrivée --------------------------------------------
     Chaque dendrite secondaire prolonge une dendrite primaire : un message
     part du bout de la secondaire, la remonte, puis remonte la primaire
     jusqu'au corps. On apparie les chemins par leurs extrémités, mesurées,
     plutôt que par une liste écrite à la main qui se périmerait au premier
     coup de crayon dans le générateur. */
  const primaires   = [...svg.querySelectorAll('#p-dendrites > g:first-child path')];
  const secondaires = [...svg.querySelectorAll('#p-dendrites > g:last-child path')];
  const chemins = secondaires.map(s => {
    const debut = s.getPointAtLength(0);
    const p = primaires.find(pp => {
      const fin = pp.getPointAtLength(pp.getTotalLength());
      return Math.hypot(fin.x - debut.x, fin.y - debut.y) < 2;
    });
    return p ? { secondaire: s, primaire: p } : null;
  }).filter(Boolean);

  /** Position d'un message le long de son chemin, t de 0 (bout) à 1 (corps). */
  function position(chemin, t) {
    const ls = chemin.secondaire.getTotalLength();
    const lp = chemin.primaire.getTotalLength();
    const total = ls + lp;
    const d = t * total;
    /* On parcourt la secondaire À L'ENVERS (du bout vers la jonction), puis
       la primaire à l'envers (de la jonction vers le corps). */
    if (d < ls) return chemin.secondaire.getPointAtLength(ls - d);
    return chemin.primaire.getPointAtLength(lp - (d - ls));
  }

  /* --- L'état ------------------------------------------------------------- */

  const etat = { niveau: 0 };      /* 0 = vide, 1 = seuil atteint */
  let vidage = null;               /* le tween de retour au repos */
  let compteur = 0;                /* pour varier les dendrites */
  let impulsions = 0;              /* exposé pour les tests */

  function poserNiveau() {
    const h = borne(etat.niveau, 0, 1) * (BAS_CORPS - HAUT_CORPS);
    clipRect.setAttribute('x', String(BAS_CORPS - h));
    clipRect.setAttribute('width', String(h));
  }

  function vider(duree) {
    if (vidage) vidage.kill();
    if (!anime()) { etat.niveau = 0; poserNiveau(); return; }
    vidage = gsap.to(etat, {
      niveau: 0, duration: duree, ease: 'power1.in', onUpdate: poserNiveau
    });
  }

  /** L'impulsion : un point part du corps et descend, la courbe se trace. */
  function declencher() {
    impulsions++;
    etat.niveau = 1; poserNiveau();
    if (!anime()) {
      impulsion.setAttribute('opacity', '0');
      if (typeof gsap !== 'undefined' && traitsCourbe.length) {
        gsap.set(traitsCourbe, { drawSVG: '0% 100%' });
      }
      vider(0);
      return;
    }
    const L = axone.getTotalLength();
    const p = { t: 0 };
    gsap.set(impulsion, { opacity: 1 });
    gsap.to(p, {
      t: 1, duration: 0.9, ease: 'power1.in',
      onUpdate() {
        const pt = axone.getPointAtLength(p.t * L);
        impulsion.setAttribute('cx', pt.x); impulsion.setAttribute('cy', pt.y);
      },
      onComplete() { gsap.set(impulsion, { opacity: 0 }); }
    });
    if (traitsCourbe.length) {
      gsap.fromTo(traitsCourbe, { drawSVG: '0% 0%' },
        { drawSVG: '0% 100%', duration: 0.9, ease: 'power1.inOut', overwrite: 'auto' });
    }
    /* Le corps se vide juste après le départ : il se rallume aussitôt,
       prêt pour le message suivant (temps 11). */
    vider(0.5);
  }

  /** Un message arrive : il monte le niveau d'un cran, jusqu'au plafond.
      Le plafond vaut 1 pour le curseur, et reste SOUS le seuil pour la
      démonstration du temps 7 : « un seul ne suffit jamais », et trois non
      plus. Sans plafond, deux démonstrations rejouées coup sur coup au
      défilement s'additionnaient et faisaient partir une impulsion sans
      aucun geste du visiteur, ce que la phrase dément. */
  function arriver(plafond) {
    if (vidage) vidage.kill();
    etat.niveau = borne(etat.niveau + 1 / MESSAGES_POUR_SEUIL, 0, plafond);
    poserNiveau();
    if (plafond >= 1 && etat.niveau >= 1 - 1e-6) declencher();
  }

  /** Envoie n messages, échelonnés, par des dendrites différentes. */
  function envoyer(n, ecart, alors, plafond) {
    if (plafond === undefined) plafond = 1;
    if (n <= 0) { if (alors) alors(); return; }
    if (!anime()) {
      for (let i = 0; i < n; i++) arriver(plafond);
      if (etat.niveau > 0 && etat.niveau < 1) vider(0);
      if (alors) alors();
      return;
    }
    let restants = n;
    for (let i = 0; i < n; i++) {
      const chemin = chemins[(compteur++) % chemins.length];
      const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      point.setAttribute('r', '4.5');
      messages.appendChild(point);
      const p = { t: 0 };
      const depart = position(chemin, 0);
      point.setAttribute('cx', depart.x); point.setAttribute('cy', depart.y);
      gsap.to(p, {
        t: 1, duration: 0.7, ease: 'power1.in', delay: i * ecart,
        onUpdate() {
          const pt = position(chemin, p.t);
          point.setAttribute('cx', pt.x); point.setAttribute('cy', pt.y);
        },
        onComplete() {
          point.remove();
          arriver(plafond);
          restants--;
          if (restants === 0) {
            /* Les messages ont cessé d'arriver : si le seuil n'est pas
               atteint, le corps se vide, lentement. Rien ne s'accumule
               pour toujours. */
            if (etat.niveau > 0 && etat.niveau < 1) vider(1.4);
            if (alors) alors();
          }
        }
      });
    }
  }

  /* --- Le curseur ------------------------------------------------------- */

  function texteValeur(v) {
    if (v === 0) return 'aucun message';
    return v === 1 ? 'un message' : v + ' messages';
  }

  function appliquer(v) {
    v = borne(Math.round(v), 0, 10);
    curseur.value = String(v);
    curseur.setAttribute('aria-valuetext', texteValeur(v));
    if (ligneSeuil) ligneSeuil.setAttribute('opacity', '1');
    if (v === 0) {
      vider(0.6);
      if (annonce) annonce.textContent = 'Aucun message. Le corps est au repos.';
      return;
    }
    const avant = impulsions;
    envoyer(v, 0.16, () => {
      if (!annonce) return;
      annonce.textContent = impulsions > avant
        ? texteValeur(v) + '. Le seuil est atteint : une impulsion part vers le bas, '
          + 'toujours la même.'
        : texteValeur(v) + '. Le niveau monte, puis redescend. Pas assez pour partir.';
    });
  }

  curseur.addEventListener('input', () => appliquer(Number(curseur.value)));
  if (moins) moins.addEventListener('click', () => appliquer(Number(curseur.value) - 1));
  if (plus)  plus.addEventListener('click',  () => appliquer(Number(curseur.value) + 1));

  /* --- La démonstration du temps 7 ---------------------------------------
     Quand la phrase « chaque message qui arrive le fait monter un peu »
     apparaît, trois messages arrivent l'un après l'autre : le corps monte
     un peu, puis se vide. Déclenché par l'arrivée du temps au défilement,
     jamais par un délai. Remonter au dessus de la phrase remet le corps au
     repos. */
  document.addEventListener('temps:parcours', (e) => {
    const { el, visible } = e.detail;
    if (!el || el.dataset.demo !== 'messages') return;
    if (visible) envoyer(3, 0.9, null, 0.55);
    else { if (vidage) vidage.kill(); etat.niveau = 0; poserNiveau(); }
  });

  poserNiveau();

  /* Exposé pour les tests. */
  window.__seuil = { appliquer, impulsionsDeclenchees: () => impulsions,
                     niveau: () => etat.niveau };
}
