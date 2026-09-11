/* ==========================================================================
   quiz.js : l'acte 3, cinq questions qui s'empilent
   --------------------------------------------------------------------------
   Le contenu est dans docs/02-CONTENU.md, acte 3, et dans le générateur
   outils-dessin-neurone.py. Ici, seulement la mécanique, en trois règles :

     1. Les questions S'EMPILENT. Une seule est visible au départ ; répondre
        fait apparaître la suivante juste en dessous, et les précédentes
        restent lisibles avec leur explication. C'est la dynamique du reste
        du site, déclenchée par la réponse plutôt que par le défilement.
     2. Une explication après CHAQUE réponse, juste ou fausse. Le résultat
        est dit par un MOT, « Bonne réponse » ou « Pas tout à fait », doublé
        d'une icône de forme distincte : jamais par la seule couleur.
     3. Aucun score, aucune limite de temps, aucun verrouillage. On peut
        changer de réponse autant qu'on veut : le verdict suit, l'explication
        reste.

   Sans JavaScript, ce module ne tourne pas et rien n'est caché : les cinq
   questions et leurs réponses forment une liste de questions-réponses.
   C'est pour ça que c'est CE module qui cache, à l'initialisation, et non le
   HTML ni le CSS seuls.
   ========================================================================== */

import { mouvementReduit } from './a11y.js?v=c1a2e0d5';

/* Deux icônes de formes différentes, une coche et une croix, à l'encre.
   Un daltonien, une capture en noir et blanc ou un lecteur d'écran, qui lit
   le mot, ont chacun de quoi distinguer les deux résultats. */
const ICONE_JUSTE =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M4 12.5 9.5 18 20 7" fill="none" stroke="currentColor" ' +
  'stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICONE_PAS =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" ' +
  'stroke-width="3" stroke-linecap="round"/></svg>';

export function initQuiz() {
  const quiz = document.querySelector('#quiz');
  if (!quiz) return;

  const questions = [...quiz.querySelectorAll('.quiz-question')];
  const fin = quiz.querySelector('.quiz-fin');
  if (!questions.length) return;

  /* L'empilement : seule la première question est visible. Les autres, et
     la phrase de fin, attendent une réponse. Les verdicts et les
     explications attendent aussi, chacun la réponse à sa question. La
     région aria-live qui les contient, elle, reste en place dès le
     chargement : c'est la condition pour qu'un changement dedans soit
     annoncé. */
  questions.forEach((q, i) => {
    if (i > 0) q.classList.add('attente');
    q.querySelectorAll('.verdict, .explication').forEach(el => { el.hidden = true; });
  });
  if (fin) fin.classList.add('attente');

  questions.forEach((q, i) => {
    q.addEventListener('change', e => {
      const choix = e.target;
      if (choix && choix.matches('input[type="radio"]')) repondre(q, i, choix);
    });
  });

  function repondre(q, i, choix) {
    const juste = choix.value === q.dataset.bonne;

    /* Le choix retenu est marqué sur son étiquette entière, pas seulement
       sur le petit bouton rond : c'est elle que le doigt a touchée. */
    q.querySelectorAll('.choix-item').forEach(item => {
      item.classList.toggle('choisi', item.contains(choix));
    });

    /* Le verdict : un mot et une icône. Le mot « Bonne réponse » reçoit le
       magenta en fond, « regarde ici », et le texte reste noir. */
    const verdict = q.querySelector('.verdict');
    if (verdict) {
      verdict.innerHTML = juste
        ? ICONE_JUSTE + '<span class="mot">Bonne réponse</span>'
        : ICONE_PAS + '<span>Pas tout à fait</span>';
      verdict.hidden = false;
    }

    /* L'explication, la même dans les deux cas, une seule fois : changer
       de réponse met le verdict à jour, l'explication ne bouge pas. */
    const explication = q.querySelector('.explication');
    if (explication && explication.hidden) {
      explication.hidden = false;
      apparaitre(q.querySelector('.reponse'));
    }

    /* La suivante, ou la fin après la cinquième. Une seule fois aussi. */
    const suivante = questions[i + 1] || fin;
    if (suivante && suivante.classList.contains('attente')) {
      suivante.classList.remove('attente');
      apparaitre(suivante);
    }
  }

  /* La même arrivée que les temps du récit : de 16 pixels plus bas, en
     fondu. Rien de tout ça en mouvement réduit ou sans GSAP : l'élément
     est simplement là, ce qui est aussi son état d'arrivée. */
  function apparaitre(el) {
    if (!el || typeof gsap === 'undefined' || mouvementReduit()) return;
    gsap.fromTo(el, { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform' });
  }

  /* Pour la batterie de tests. */
  window.__quiz = {
    repondues: () => questions.filter(q => {
      const e = q.querySelector('.explication');
      return e && !e.hidden;
    }).length,
    visibles: () => questions.filter(q => !q.classList.contains('attente')).length
  };
}
