/* ==========================================================================
   synapse.js : le vide, les messagers, et la cellule d'en face (1D, t20 à t22)
   --------------------------------------------------------------------------
   Trois temps, chacun accroché à sa phrase, et rien avant :

     t20  « il reste un vide »        la caméra plonge sur un renflement et
                                      la cellule d'en face, à l'encre. Le
                                      vide se voit. Aucune mesure [S9].
     t21  « des messagers »           des points orange, cernés d'encre,
                                      partent du renflement et traversent le
                                      vide jusqu'à la cellule d'en face.
                                      Premier et seul orange du site.
     t22  « tout recommence »         la cellule d'en face s'illumine en
                                      bleu : le signal repart. Le regard
                                      s'élargit.

   Le cadrage est tenu par recit.js (data-cadrage sur la phrase). Ce module
   ne touche qu'aux messagers et à la lueur bleue de la cellule suivante.
   Mouvement réduit : les messagers se posent d'un coup de l'autre côté.
   Remonter les efface : rien ne reste d'un temps qu'on a quitté.
   ========================================================================== */

import { mouvementReduit } from './a11y.js?v=c1a2e0d5';

/* Le renflement du milieu et le bord de la cellule d'en face, en coordonnées
   du dessin. Voir outils-dessin-neurone.py. */
const DEPART = { x: 912.5, y: 200 };
const ARRIVEE_X = 921;

export function initSynapse() {
  const svg = document.querySelector('.neurone');
  if (!svg) return;
  const messagers = svg.querySelector('.synapse .messagers');
  const lueur     = svg.querySelector('.synapse .suivante-bleue');
  if (!messagers || !lueur) return;

  const anime = () => typeof gsap !== 'undefined' && !mouvementReduit();
  const NS = 'http://www.w3.org/2000/svg';
  let enVol = [];

  function effacer() {
    enVol.forEach(t => t.kill());
    enVol = [];
    [...messagers.children].forEach(el => el.remove());
  }

  /** Quatre messagers partent du renflement, en éventail, et se posent
      contre la cellule d'en face. */
  function traverser() {
    effacer();
    const cibles = [-7, -2.5, 2.5, 7];
    cibles.forEach((dy, i) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', '1.5');
      c.setAttribute('cx', DEPART.x); c.setAttribute('cy', DEPART.y);
      messagers.appendChild(c);
      const fin = { x: ARRIVEE_X - 1.6, y: DEPART.y + dy };
      if (!anime()) { c.setAttribute('cx', fin.x); c.setAttribute('cy', fin.y); return; }
      const p = { t: 0 };
      enVol.push(gsap.to(p, {
        t: 1, duration: 0.9, delay: i * 0.12, ease: 'power1.out',
        onUpdate() {
          /* Un léger arc : les messagers ne vont pas tout droit, ils
             diffusent. Rien d'exact là dedans, c'est un dessin. */
          const x = DEPART.x + (fin.x - DEPART.x) * p.t;
          const y = DEPART.y + (fin.y - DEPART.y) * Math.sin(p.t * Math.PI / 2);
          c.setAttribute('cx', x); c.setAttribute('cy', y);
        }
      }));
    });
  }

  function illuminer(oui) {
    if (typeof gsap === 'undefined') { lueur.setAttribute('opacity', oui ? '1' : '0'); return; }
    if (!anime()) gsap.set(lueur, { attr: { opacity: oui ? 1 : 0 } });
    else gsap.to(lueur, { attr: { opacity: oui ? 1 : 0 }, duration: 0.7, overwrite: 'auto' });
  }

  document.addEventListener('temps:parcours', (e) => {
    const { el, visible } = e.detail;
    if (!el || !el.dataset.synapse) return;
    if (el.dataset.synapse === 'messagers') {
      if (visible) traverser(); else effacer();
    } else if (el.dataset.synapse === 'suivante') {
      illuminer(visible);
    }
  });

  window.__synapse = { messagers: () => messagers.children.length };
}
