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

import { mouvementReduit } from './a11y.js?v=c1a2e0d5';

/* Les cadrages de la caméra, une entrée par partie du neurone. */
const VUES = {
  /* Les trois premiers blocs de l'acte 1 commandent l'ÉTAT DE LA SCÈNE plus
     que le cadrage : quel dessin est là. `scene` le dit.
       chaine   la silhouette au fond du trait, les capsules visibles
       cellule  la capsule élue s'accentue, le neurone se dessine à sa place
       neurone  la silhouette est partie, seul le neurone reste
     Les boutons du parcours n'arrivent qu'au plan, et pas avant. */
  chaine:       { vue: '0 0 400 1000',    partie: null, scene: 'chaine',  boutons: false, titre: 'une chaîne de cellules' },
  cellule:      { vue: '0 0 400 1000',    partie: null, scene: 'cellule', boutons: false, titre: 'un neurone' },
  plan:         { vue: '0 0 400 1000',    partie: null, scene: 'neurone', boutons: true,  titre: 'le neurone entier' },
  ensemble:     { vue: '0 0 400 1000',    partie: null, scene: 'neurone', boutons: true,  titre: 'le neurone entier' },
  dendrites:    { vue: '50 8 300 375',    partie: 'p-dendrites',    scene: 'neurone', boutons: true, titre: 'les dendrites' },
  soma:         { vue: '130 133 140 175', partie: 'p-soma',         scene: 'neurone', boutons: true, titre: 'le corps cellulaire' },
  /* L'axone ENTIER, du corps aux terminaisons : le défi du chronomètre y
     pose six segments de gaine, et le visiteur doit les voir tous les six.
     Le cadrage précédent en coupait deux. */
  axone:        { vue: '40 236 320 616',  partie: 'p-axone',        scene: 'neurone', boutons: true, titre: "l'axone" },
  terminaisons: { vue: '100 748 200 250', partie: 'p-terminaisons', scene: 'neurone', boutons: true, titre: 'les terminaisons' },
  /* Un cadrage de TEMPS, et non de bloc : la phrase « il reste un vide »
     plonge sur un renflement et la cellule d'en face. Voir majCamera. */
  /* En coordonnées de la RACINE du SVG, comme tous les cadrages : le dessin
     est tourné d'un quart de tour, donc racine (x, y) = (400 - y local,
     x local). Le renflement du milieu, local (907, 200), est en (200, 907).
     Écrit dans les coordonnées locales, ce cadrage montrait du vide. */
  synapse:      { vue: '168 884 64 64',   partie: null,             scene: 'neurone', boutons: true, titre: 'la synapse' },

  /* L'acte 2, le retour au corps. La caméra recule : la chaîne, puis la
     silhouette entière avec son trajet, puis le faisceau. Plus de boutons :
     on ne visite plus le neurone, on referme la boucle. */
  muscle:       { vue: '0 0 400 1000',    partie: null, scene: 'chaine',     boutons: false, titre: 'la chaîne de cellules' },
  doigt:        { vue: '0 0 400 1000',    partie: null, scene: 'silhouette', boutons: false, titre: 'ton doigt' },
  faisceau:     { vue: '0 0 400 1000',    partie: null, scene: 'faisceau',   boutons: false, titre: 'des centaines de neurones' },
  clic:         { vue: '0 0 400 1000',    partie: null, scene: 'faisceau',   boutons: false, titre: 'tout ça, pour un clic' }
};

/* Le cadrage de la silhouette, entier puis au fond du trait. Le second garde
   le rapport 3 pour 7 du premier, sinon le dessin serait letterboxé. Il est
   centré sur le segment vertical du trajet, sous la tête, là où sont posées
   les capsules de la chaîne. */
const SIL_ENTIERE = [0, 0, 300, 700];
const SIL_PLONGEE = [138, 72, 24, 56];

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
  /* Les temps de l'acte 1, un par paragraphe, qui s'empilent dans leur bloc. */
  const tempsParcours = [...section.querySelectorAll('.temps-parcours')];
  const figureCourbe  = section.querySelector('.figure-courbe');
  /* La phrase qui nomme le seuil et l'impulsion (1B, temps 9). C'est elle,
     et non la figure, qui déclenche le tracé de la courbe si le visiteur n'a
     pas fait partir d'impulsion lui même : la courbe est ce qu'on vient de
     déclencher, elle ne doit pas être déjà là avant qu'on ait essayé. */
  const phraseSeuil   = section.querySelector('.t-seuil') || figureCourbe;

  const traitsCourbe  = [...section.querySelectorAll('.figure-courbe .t')];
  const traitsNeurone = [...svg.querySelectorAll('.t')];
  const traitTrajet   = [...section.querySelectorAll('.silhouette .trajet')];
  const corpsSil      = [...section.querySelectorAll('.silhouette .s')];
  const chaine        = section.querySelector('.silhouette .chaine');
  const elue          = section.querySelector('.silhouette .chaine .elue');
  const autresCellules = [...section.querySelectorAll('.silhouette .chaine > g:not(.elue)')];
  const faisceau      = section.querySelector('.silhouette .faisceau');
  const chrono        = section.querySelector('[data-chrono]');
  const visuels       = section.querySelector('.visuels');
  const boutsNeurone  = [...svg.querySelectorAll('.b')];
  /* Les flèches du signal afférent, aux bouts des dendrites. */
  const afferents     = svg.querySelector('.afferents');

  /* Les phrases qui GOUVERNENT les dessins. Chaque élément graphique de
     l'acte 0 est accroché à la phrase qui en parle, et à rien d'autre :
     c'est la règle de 02-CONTENU, le texte et l'image au même instant. */
  const iCourbe   = temps.indexOf(section.querySelector('.figure-courbe'));
  const iCorps    = temps.indexOf(section.querySelector('.t-corps'));
  const iTrajet   = temps.indexOf(section.querySelector('.t-trajet'));
  const iDuree    = temps.indexOf(section.querySelector('.t-duree'));
  const iQuestion = temps.indexOf(section.querySelector('.t-question'));

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
  let silVisible = null;
  let corpsSilVisible = null;
  let sceneActive = null;
  let minuteur = null;
  /* Les flèches du signal afférent sont-elles à l'écran ? Mémo de
     poserAfferents(), déclaré ici pour précéder tout retour anticipé. */
  let afferentsVisibles = false;
  /* Ici, et pas plus bas : toutMontrer() l'écrit, et toutMontrer() est
     appelée par le retour anticipé du mode « mouvement réduit ». Déclaré
     après ce retour, le mémo levait une ReferenceError et la page restait
     figée pour exactement les visiteurs qu'on cherche à ménager. */
  const affiche = new WeakMap();
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

  /* LA MEME REGLE POUR LES DEUX DESSINS.

     Ils partagent la meme case, donc la place disponible est la meme : leur
     donner deux calculs differents produisait une silhouette correcte a cote
     d'un neurone de trente pixels, ce qui n'avait aucune raison d'etre.

     La borne haute est choisie pour rester SOUS la taille du parcours, afin
     que la bascule fasse grandir le dessin et jamais retrecir : le recit
     plonge vers le neurone, un retrecissement le contredirait. */
  function hauteurDessin() {
    /* Une seule mise en page, donc une seule regle de taille : le dessin
       prend ce que les deux piles de texte lui laissent. */
    const dispo = scene.clientHeight - padHaut - 32;
    /* Plafond abaissé de 340 à 300 : le texte prend un peu plus de place,
       le dessin un peu moins, demande de l'utilisateur du 11 septembre 2026
       (« les dessins et schémas prennent trop de place par rapport au
       texte »). Le plancher suit, de 230 à 210. */
    return borne(dispo - hautPile - basPile, 210, 300);
  }

  function hauteurIntro() { return hauteurDessin(); }
  function hauteurSilhouette() { return hauteurDessin(); }

  function hauteurParcours() {
    const h = window.innerHeight || 800;
    /* Plus petit que le dessin de l'ouverture, et c'est voulu : demande de
       l'utilisateur, le texte du parcours était dissimulé et illisible sous
       un dessin et deux rangs de boutons qui prenaient les deux tiers de
       l'écran. Le dessin cède la place au texte ; les boutons ne changent
       pas. La bascule fait donc RÉTRÉCIR la case pendant la plongée, ce qui
       ne se voit pas : le cadrage y zoome dans le trait au même moment.
       Réduit une seconde fois, de 31 % à 27 % et de 262 à 228 px, même
       demande, même jour : « quand le texte défile et disparaît, on ne le
       voit pas assez ». Zone de lecture de 359 à 393 px sur 844. */
    return Math.min(h * 0.27, 228);
  }

  /** Pose la taille de la silhouette. Sa largeur decoule du rapport 300/700
      de son cadrage, et se replie si la colonne est plus etroite. */
  function poserSilhouette(hauteur) {
    if (!sil) return;
    let H = hauteur || hauteurDessin(), L = H * 300 / 700;
    const dispo = porte.clientWidth || scene.clientWidth || 320;
    if (L > dispo) { L = dispo; H = L * 700 / 300; }
    sil.style.width  = Math.round(L) + 'px';
    sil.style.height = Math.round(H) + 'px';
  }

  /** La plongée : le cadrage de la silhouette, de l'entier au fond du trait,
      asservi au défilement. À z = 0 on voit le corps, à z = 1 le trait est
      une large bande qui remplit la colonne. */
  function plonger(z) {
    if (!sil) return;
    const v = SIL_ENTIERE.map((a, i) => a + (SIL_PLONGEE[i] - a) * z);
    sil.setAttribute('viewBox', v.map(n => n.toFixed(2)).join(' '));
  }

  /* --- L'état de la scène, commandé par le bloc de texte en cours --------
     Trois états, et le passage de l'un à l'autre est un fondu : c'est le seul
     endroit du site où une chose en remplace une autre, et c'est le récit
     qui le veut, on plonge dans le chemin pour y trouver la cellule. */

  /* Quatre états :
       plongee  pendant la bascule : ni chaîne ni neurone, la silhouette est
                tenue par le mémo de majEtat, pas par ici
       chaine   au fond du trait, les capsules visibles
       cellule  la capsule élue s'accentue, le neurone se dessine à sa place
       neurone  la silhouette est partie, seul le neurone reste
     L'opacité de la silhouette n'a qu'UN propriétaire à la fois : le mémo de
     majEtat tant que la bascule n'est pas finie, la scène ensuite. Sans cette
     frontière, en remontant du parcours, l'un la cachait pendant que l'autre
     la montrait. */
  function appliquerScene(nom, immediat) {
    if (sceneActive === nom) return;
    sceneActive = nom;
    const sansGsap = typeof gsap === 'undefined';
    const doux = !immediat && !sansGsap && !mouvementReduit();
    const vers = (cible, props, duree) => {
      if (sansGsap) {
        /* Sans bibliothèque, seule l'opacité est appliquée, à la main. Les
           tracés et les cadrages sont déjà à leur état d'arrivée. */
        if (props.opacity === undefined) return;
        [].concat(cible).forEach(el => { if (el) el.style.opacity = props.opacity; });
        return;
      }
      if (doux) gsap.to(cible, Object.assign({ duration: duree, overwrite: 'auto' }, props));
      else { const p = Object.assign({}, props); delete p.delay; gsap.set(cible, p); }
    };

    const chaineVisible  = nom === 'chaine' || nom === 'cellule';
    const neuroneVisible = nom === 'cellule' || nom === 'neurone';
    /* Les deux états de l'acte 2 : la silhouette entière, avec son corps et
       son trajet, puis la même avec le faisceau. La caméra recule : le
       cadrage revient de la plongée à l'entier, en douceur. */
    const corpsEntier    = nom === 'silhouette' || nom === 'faisceau';
    if (nom !== 'plongee') {
      const z = corpsEntier ? 0 : 1;
      if (zoomTween) zoomTween.kill();
      if (doux) zoomTween = gsap.to(zoom, { z, duration: 1.2, ease: 'power2.inOut',
                                           onUpdate: () => plonger(zoom.z) });
      else { zoom.z = z; plonger(z); }
      vers(corpsSil, { opacity: corpsEntier ? 1 : 0 }, 0.9);
      corpsSilVisible = corpsEntier;
      if (faisceau) vers(faisceau, { opacity: nom === 'faisceau' ? 1 : 0 }, 0.9);
    }
    /* « Une cellule S'ISOLE et se dessine » : au bloc « En voici une », la
       bande bleue et les autres capsules s'en vont d'abord, la capsule élue
       reste seule, et le neurone ne commence à se dessiner qu'ensuite, à sa
       place. Sans cet ordre, il se dessinait par-dessus la bande entière et
       rien ne s'isolait. */
    const isoler = nom === 'cellule';
    const apres  = isoler ? 0.55 : 0;

    if (chaine) vers(chaine, { opacity: chaineVisible ? 1 : 0 }, 0.7);
    vers(autresCellules, { opacity: isoler ? 0 : 1 }, 0.5);
    vers(traitTrajet, { opacity: (nom === 'cellule' || nom === 'neurone') ? 0 : 1 }, 0.5);
    /* La bande bleue du fond du trait est la chaîne DE PRÈS ; à l'acte 2,
       en reculant, le trait redevient le trajet fin de l'acte 0. Même
       élément, même couleur : c'est le cadrage qui change, pas l'objet. */
    /* La capsule élue s'accentue : plus de trait, et c'est la SEULE marque,
       pour que ça reste lisible en noir et blanc. */
    if (elue) vers(elue, { attr: { 'stroke-width': isoler ? 2.2 : 0.9 } }, 0.5);
    vers(porte, { opacity: neuroneVisible ? 1 : 0, delay: apres }, 0.9);
    vers(traitsNeurone, { drawSVG: neuroneVisible ? '0% 100%' : '0% 0%', delay: apres }, 1.1);
    vers(boutsNeurone, { scale: neuroneVisible ? 1 : 0, transformOrigin: 'center', delay: apres + 0.6 }, 0.4);

    if (nom !== 'plongee' && porteSil) {
      const garder = nom !== 'neurone';
      vers(porteSil, { opacity: garder ? 1 : 0 }, 0.9);
      silVisible = garder;
    }
  }

  /* Le cadrage de la silhouette pendant le parcours, tenu par la scène. La
     bascule le pilote tant qu'elle dure ; ensuite c'est ici, en douceur. */
  const zoom = { z: 1 };
  let zoomTween = null;

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
    tempsParcours.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });

    /* SYNCHRONISER LE MÉMO, et ce n'est pas un détail.

       poser() garde en mémoire l'état affiché de chaque élément et ne fait
       rien quand il n'a pas changé. Forcer les opacités ici sans le prévenir
       le laisse croire que la silhouette est cachée alors qu'elle vient
       d'être rendue visible : l'appel suivant qui demande de la cacher ne
       fait donc rien, et elle reste à l'écran par-dessus le neurone.

       C'est une desynchronisation entre un etat interne et l'affichage, la
       meme famille d'erreur que les verifications qui relisent leur propre
       ecriture. */
    temps.forEach(el => affiche.set(el, true));
    piles.forEach(el => { el.style.opacity = '1'; });
    if (defiler) defiler.style.opacity = '0';
    if (titre) titre.style.opacity = '1';
    if (nav) nav.style.opacity = '1';
    if (chrono) chrono.style.opacity = '1';
    /* Les deux dessins entiers, l'un au-dessus de l'autre : le CSS des replis
       défait la case partagée pour qu'ils ne se superposent pas. La
       silhouette entière, pas plongée, et sans la chaîne : ce sont des états
       de transition, ils n'ont pas de sens à l'arrêt. */
    if (porteSil) porteSil.style.opacity = '1';
    corpsSil.forEach(el => { el.style.opacity = '1'; });
    if (chaine) chaine.style.opacity = '0';
    traitTrajet.forEach(el => { el.style.opacity = '1'; });
    plonger(0);
    porte.style.opacity = '1';
    porte.style.transform = 'none';
    if (visuels) visuels.style.transform = 'none';
    sceneActive = 'neurone';
    mesurer();
    poserVue('ensemble', hauteurParcours());
    poserSilhouette();
    if (typeof gsap !== 'undefined') {
      gsap.set([...traitsCourbe, ...traitsNeurone, ...traitTrajet], { drawSVG: '0% 100%' });
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
    /* DEUX TEMPS, ET NON UN SEUL.
       La bascule fait deux choses : effacer le texte de l'ouverture, et faire
       monter le dessin à sa place. Pilotées par la même valeur, elles se
       produisaient ENSEMBLE : à mi-course, le dessin était déjà remonté de
       moitié pendant que le texte, encore à moitié visible, occupait toujours
       le haut. Les deux se traversaient, et le titre de l'ouverture se lisait
       par-dessus le neurone.

       On garde une seule valeur de défilement, mais on en tire deux temps qui
       ne se recouvrent pas : le texte s'efface sur la première moitié, le
       dessin monte sur la seconde. La place est libre avant qu'on l'occupe. */
    const tTexte  = borne(t / 0.5, 0, 1);
    /* Le neurone commence AVANT que le trait ait fini de partir. Les deux
       temps se recouvrent d'un tiers : sans ce recouvrement, l'écran était
       vide à mi-bascule, mesuré à 0,4 % de pixels peints, le trait parti et
       le neurone pas encore là. Ils partagent la même case, donc ce
       recouvrement se lit comme un fondu de l'un vers l'autre. */
    const tDessin = borne((t - 0.35) / 0.65, 0, 1);

    piles.forEach(el => gsap.set(el, { opacity: 1 - tTexte }));
    gsap.set(titre, { opacity: tDessin });
    /* Une fois le texte parti, les blocs de l'ouverture ne doivent plus
       intercepter la souris : le texte du parcours défile à leur place. */
    scene.classList.toggle('bascule', tTexte >= 1);

    /* LA PLONGÉE. Le trait reste, et la caméra entre dedans : le cadrage de
       la silhouette se resserre sur le segment vertical du trajet jusqu'à ce
       que le trait soit une large bande. C'est le cœur du dispositif selon
       02-CONTENU : le visiteur comprend qu'il entre DANS le chemin, et le
       neurone n'apparaît pas de nulle part, il est ce qu'on trouve au bout du
       zoom. Le neurone lui même n'arrive qu'au bloc « En voici une ». */
    if (t < 1 || !cameraActive) { zoom.z = tDessin; plonger(tDessin); }

    /* Tant que la bascule n'est pas finie, c'est elle qui tient la taille des
       dessins. Ensuite c'est la caméra, et il ne faut surtout pas lui
       reprendre la main : elle est en train d'animer le cadrage. Les deux
       dessins partagent la case, donc la même hauteur, sinon la bascule
       ferait un saut. */
    if (tDessin < 1 || !cameraActive) {
      const H = H0 + (H1 - H0) * tDessin;
      poserVue(tDessin < 1 ? 'ensemble' : cle, H);
      poserSilhouette(H);
    }
    /* C'est la CASE PARTAGÉE qui monte, et non le seul neurone : la
       silhouette est encore à l'écran pendant la plongée, elle doit monter
       avec. La position est mesurée par rapport à la scène, et non par
       offsetTop, qui se compte depuis le parent positionné et avait changé
       d'origine sans erreur quand `.visuels` est apparu. On retranche le
       déplacement déjà appliqué pour retrouver la position non transformée. */
    const hautNu = visuels.getBoundingClientRect().top
                 - scene.getBoundingClientRect().top - decalage;
    /* Arrondi au pixel : un déplacement fractionnaire pose le bloc sur une
       demi-ligne, et ses bords s'anti-crénèlent en laissant passer ce qu'il
       y a dessous. */
    decalage = Math.round(tDessin * (padHaut + MARGE_HAUTE - hautNu));
    gsap.set(visuels, { y: decalage });
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

    /* LA SILHOUETTE, gouvernée par les phrases de l'acte 0.

         temps 2  elle apparaît AVEC la phrase sur le cerveau, sans trajet
         temps 3  le trajet se trace, de la tête vers le doigt, avec sa phrase
         temps 4  le temps du trajet s'inscrit à côté
         temps 5  le corps s'efface, SAUF le trait : on va plonger dedans
         bascule  ce qui reste part, et le neurone arrive à sa place

       Elle partage sa case avec le neurone, donc elle doit avoir fini de
       disparaître quand lui commence : sa fenêtre se ferme au début de la
       bascule, et le neurone n'arrive qu'à la seconde moitié de celle-ci. */
    /* Tant que la bascule n'est pas finie, la scène est en plongée : ni
       chaîne ni neurone. En remontant depuis le parcours, c'est ce qui les
       fait repartir, et la silhouette revenir. */
    if (p < 1) appliquerScene('plongee', immediat);

    if (porteSil && p < 1) {
      /* La silhouette reste pendant TOUTE la bascule : c'est dans son trait
         que la caméra plonge. Au delà, p = 1, c'est la scène commandée par
         le bloc de texte qui décide, et ce mémo se tait. */
      const doitVoir = entre && p >= iCorps * PAS;

      /* Son propre etat, et surtout pas le memo partage de poser().

         Ce memo est ecrit par plusieurs chemins, dont toutMontrer(), qui
         force les opacites sans le prevenir. Il se retrouvait alors a croire
         la silhouette cachee alors qu'elle etait a l'ecran, et l'ordre de la
         cacher ne faisait rien : elle restait par-dessus le neurone. Un etat
         interne desynchronise de l'affichage.

         Ici l'ecriture est inconditionnelle des que la decision change, sur
         un seul element : le cout est nul et le resultat ne peut pas
         diverger de ce qui est affiche. */
      if (silVisible !== doitVoir) {
        silVisible = doitVoir;
        if (immediat) gsap.set(porteSil, { opacity: doitVoir ? 1 : 0 });
        else gsap.to(porteSil, { opacity: doitVoir ? 1 : 0,
                                 duration: 0.35, overwrite: true });
      }

    }

    /* Temps 5 : le corps s'efface, le trait reste. C'est la phrase de la
       question qui commande, parce que c'est à cet instant que le récit
       cesse de regarder le corps pour regarder le chemin.

       Évalué à CHAQUE position, y compris au delà de la bascule. Enfermé
       dans la fenêtre de l'ouverture, ce calcul était sauté quand on
       arrivait au parcours d'un bond, par un bouton ou un rechargement : le
       corps n'avait jamais été effacé, et le contour de la tête traversait
       la bande bleue au milieu de la chaîne. L'état doit être une fonction
       de la position, jamais du chemin parcouru pour y arriver. */
    /* ... mais seulement TANT QUE LA BASCULE N'EST PAS FINIE. Au delà, le
       corps appartient à la scène commandée par le bloc de texte : l'acte 2
       le fait revenir, et ce mémo, s'il tournait encore, le ré-effaçait à
       la position suivante. Deux propriétaires, le piège documenté. */
    if (porteSil && p < 1) {
      const corpsVisible = p < iQuestion * PAS;
      if (corpsSilVisible !== corpsVisible) {
        corpsSilVisible = corpsVisible;
        if (immediat) gsap.set(corpsSil, { opacity: corpsVisible ? 1 : 0 });
        else gsap.to(corpsSil, { opacity: corpsVisible ? 1 : 0,
                                 duration: 0.6, overwrite: true });
      }
    }
    /* Le temps inscrit part avec le texte de l'acte 0, au début de la
       bascule : c'est une légende de la silhouette entière, pas de la
       plongée. */
    poser(chrono, entre && p >= iDuree * PAS && p < N * PAS, immediat);
    poser(defiler, p < 0.01, immediat);

    /* Le trajet dans la silhouette se dessine de la tête vers le doigt,
       dans le sens du voyage, sur la mesure de la phrase qui le nomme. */
    tracer(traitTrajet, iTrajet, p);

    /* La bascule est recalculée À CHAQUE passage, y compris une fois
       terminée. Le raccourci qui l'arrêtait à t = 1 laissait un déplacement
       périmé dès que la mise en page bougeait sous elle, par exemple au
       redimensionnement ou pendant un mouvement de caméra. Le calcul est de
       toute façon négligeable : une lecture de position et une écriture. */
    const t = borne((p - N * PAS) / PAS, 0, 1);
    basculer(t);
    cameraActive = t >= 1;
    /* Les temps AVANT la caméra : un temps peut imposer son cadrage, et la
       caméra doit le lire à jour. Dans l'autre ordre, elle appliquait le
       cadrage de la position précédente, un pas de retard visible en
       sautant d'un bond sur la synapse. */
    majTempsParcours(immediat);
    if (cameraActive) majCamera();
  }

  /* --- Les temps de l'acte 1 s'empilent dans leur partie ------------------
     Un temps apparaît quand il entre dans la zone de lecture, sous le dessin
     collé, et il y reste tant qu'on descend : c'est la règle 1 de 02-CONTENU,
     un temps par défilement, et les temps s'accumulent. Remonter le retire,
     dans l'ordre inverse. La courbe se trace quand son temps arrive. */

  let courbeTracee = null;

  /* Le seuil d'apparition est EN BAS de l'écran, et non dans la bande de la
     caméra. La zone de lecture, sous le dessin collé et ses boutons, ne fait
     qu'un quart de l'écran : un temps doit apparaître quand il y ENTRE, par
     le bas, puis y rester en montant, jusqu'à passer sous le dessin. Avec le
     seuil de la caméra, il n'apparaissait qu'au moment de disparaître sous
     le dessin, et la capture ne montrait qu'un fragment de phrase. */
  const SEUIL_LECTURE = 0.93;

  const etatParcours = new WeakMap();

  function majTempsParcours(immediat) {
    const h = window.innerHeight || 800;
    tempsParcours.forEach(el => {
      const visible = cameraActive && el.getBoundingClientRect().top < h * SEUIL_LECTURE;
      poser(el, visible, immediat);
      if (etatParcours.get(el) === visible) return;
      etatParcours.set(el, visible);
      /* Un bloc interactif invisible ne doit pas rester dans l'ordre de
         tabulation ni sous la souris : l'opacité seule le laisserait
         atteignable, et le focus irait sur un curseur qu'on ne voit pas
         (WCAG 2.4.11). */
      if (el.classList.contains('interaction')) {
        el.style.visibility = visible ? 'visible' : 'hidden';
      }
      /* Les modules qui réagissent à l'arrivée d'un temps, comme la petite
         démonstration du seuil, l'apprennent par ici, sans se connaître. */
      document.dispatchEvent(new CustomEvent('temps:parcours', { detail: { el, visible } }));
    });
    if (figureCourbe && traitsCourbe.length) {
      const visible = cameraActive && phraseSeuil.getBoundingClientRect().top < h * SEUIL_LECTURE;
      if (courbeTracee !== visible) {
        courbeTracee = visible;
        if (immediat) gsap.set(traitsCourbe, { drawSVG: visible ? '0% 100%' : '0% 0%' });
        else gsap.to(traitsCourbe, { drawSVG: visible ? '0% 100%' : '0% 0%',
                                     duration: 1.2, ease: 'power1.inOut', overwrite: 'auto' });
      }
    }
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

  /* --- Le signal afférent ------------------------------------------------
     De petites flèches bleues, une par bout de dendrite, tant que la caméra
     regarde les dendrites. Elles disent que le neurone REÇOIT : le message
     vient d'ailleurs et entre par là. Les billes bleues du curseur du seuil,
     un bloc plus loin, en sont la modélisation. Demande de l'utilisateur,
     11 septembre 2026.

     Elles arrivent en glissant vers l'intérieur, chacune dans sa direction,
     et leur état d'arrivée est statique : en place, pleines. Un seul
     propriétaire, cette fonction, et un mémo pour ne pas relancer l'arrivée
     à chaque événement de défilement. Le mémo est déclaré plus haut, avec
     le reste de l'état : déclaré ici, après le retour anticipé du mouvement
     réduit, il levait une ReferenceError, quatrième fois pour ce piège. */
  function poserAfferents(visibles) {
    if (!afferents || visibles === afferentsVisibles) return;
    afferentsVisibles = visibles;
    const fleches = afferents.querySelectorAll('path');
    if (typeof gsap === 'undefined' || mouvementReduit()) {
      if (typeof gsap !== 'undefined') gsap.set(fleches, { opacity: 1, x: 0, y: 0, overwrite: 'auto' });
      afferents.style.opacity = visibles ? '1' : '0';
      return;
    }
    if (visibles) {
      gsap.set(afferents, { opacity: 1, overwrite: 'auto' });
      gsap.fromTo(fleches,
        { opacity: 0, x: (i, el) => Number(el.dataset.dx) || 0, y: (i, el) => Number(el.dataset.dy) || 0 },
        { opacity: 1, x: 0, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.06, overwrite: 'auto' });
    } else {
      gsap.to(afferents, { opacity: 0, duration: 0.4, overwrite: 'auto' });
    }
  }

  function allerA(nouvelle) {
    if (!VUES[nouvelle]) return;
    const memeVue = nouvelle === cle;
    cle = nouvelle;
    const { vue, partie, titre: nom, scene: etat, boutons: avecBoutons } = VUES[cle];

    /* L'état de la scène d'abord : quel dessin est là. Puis le cadrage. */
    appliquerScene(etat, typeof gsap === 'undefined' || mouvementReduit());
    if (nav) {
      if (typeof gsap === 'undefined') nav.style.opacity = avecBoutons ? '1' : '0';
      else if (mouvementReduit()) gsap.set(nav, { opacity: avecBoutons ? 1 : 0 });
      else gsap.to(nav, { opacity: avecBoutons ? 1 : 0, duration: 0.6, overwrite: 'auto' });
      nav.style.pointerEvents = avecBoutons ? 'auto' : 'none';
    }

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
    poserAfferents(cle === 'dendrites');

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
    if (!b) return;
    /* Un temps peut imposer son propre cadrage, le temps qu'il est là : le
       dernier temps visible du bloc qui en porte un l'emporte sur celui du
       bloc. C'est ce qui permet de plonger sur la synapse au milieu des
       terminaisons, puis d'élargir de nouveau à la phrase suivante. */
    let vue = b.dataset.vue;
    const cadres = [...b.querySelectorAll('.temps-parcours[data-cadrage]')]
      .filter(el => etatParcours.get(el));
    if (cadres.length) vue = cadres[cadres.length - 1].dataset.cadrage;
    allerA(vue);
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
      /* On va à la position ABSOLUE du temps suivant, jamais par un
         déplacement relatif.

         scrollBy partait de la position courante. Or le bloc du bouton est
         en plein écran fixe : la page peut défiler DERRIÈRE lui sans que le
         visiteur le voie. S'il avait bougé avant de cliquer, le saut partait
         de là et atterrissait n'importe où dans la page. C'est ce qui rendait
         le clic imprévisible d'une fois sur l'autre.

         La cible se calcule depuis la position de la section dans le
         document, donc elle ne dépend pas d'où l'on se trouve.

         Surtout pas scrollIntoView sur le temps suivant : les temps vivent
         dans une scène COLLÉE, donc leur position à l'écran ne bouge pas et
         leur position dans le flux est ailleurs. L'appel envoyait la page
         dans le vide et l'écran devenait blanc.

         Ici on déplace le défilement de la distance qui sépare deux temps,
         c'est-à-dire une fraction des rails, ce qui est la seule grandeur
         qui gouverne réellement la progression. */
      const hautSection = section.getBoundingClientRect().top + window.scrollY;
      /* Le MILIEU du temps 2, et pas son seuil. Viser le seuil exact envoyait
         la page à 984,67 px, arrondis à 984 : un cheveu en dessous, donc le
         temps 2 restait invisible et le visiteur devait défiler pour que
         quelque chose se passe après son clic. Constaté par l'utilisateur. */
      const cible = hautSection + rails.offsetHeight * PAS * 1.5;
      window.scrollTo({ top: cible, behavior: mouvementReduit() ? 'auto' : 'smooth' });

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

  /* --- Le bouton de la fin : rejouer l'impulsion dans la silhouette -------
     « Tout ça, pour un clic. » Le bouton du premier écran revient, et le
     cliquer fait repartir le signal de la tête au doigt, une dernière fois.
     Le trajet est retracé du début : c'est le seul tracé qui n'est pas
     asservi au défilement, parce qu'il répond à un clic. */

  function brancherRejouer() {
    const boutons = [...document.querySelectorAll('[data-rejouer]')];
    if (!boutons.length || !traitTrajet.length) return;

    function rejouer() {
      if (typeof gsap === 'undefined' || mouvementReduit()) return;
      gsap.fromTo(traitTrajet, { drawSVG: '0% 0%' },
        { drawSVG: '0% 100%', duration: 1.1, ease: 'power1.inOut', overwrite: 'auto' });
      if (faisceau) {
        gsap.fromTo(faisceau.querySelectorAll('path'), { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 1.1, ease: 'power1.inOut', stagger: 0.05, overwrite: 'auto' });
      }
    }

    boutons.forEach(bouton => {
      bouton.addEventListener('click', () => {
        /* Le bouton de la fin du quiz est en dehors de la scène : quand on
           le clique, la silhouette n'est plus à l'écran. On y retourne
           d'abord, au dernier bloc du récit, et on ne rejoue qu'une fois
           arrivé. Pas pendant : chaque événement de défilement repose le
           trajet, et le tracé aurait eu deux propriétaires. En mouvement
           réduit, le retour suffit : le trajet y est déjà tracé, c'est
           l'état d'arrivée. */
        const cible = bouton.dataset.retour && document.getElementById(bouton.dataset.retour);
        if (!cible) { rejouer(); return; }
        const doux = !mouvementReduit();
        cible.scrollIntoView({ behavior: doux ? 'smooth' : 'auto', block: 'center' });
        if (doux) attendreArret(rejouer);
      });
    });
  }

  /* Appelle `alors` quand la page a cessé de défiler : au moins 400 ms
     après le départ, puis huit images de suite sans changement, et jamais
     plus de 2,5 secondes d'attente, quoi qu'il arrive. */
  function attendreArret(alors) {
    const debut = performance.now();
    let dernier = window.scrollY, stables = 0;
    function image(maintenant) {
      const y = window.scrollY;
      stables = (y === dernier) ? stables + 1 : 0;
      dernier = y;
      const ecoule = maintenant - debut;
      if ((ecoule > 400 && stables >= 8) || ecoule > 2500) { alors(); return; }
      requestAnimationFrame(image);
    }
    requestAnimationFrame(image);
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
  gsap.set(tempsParcours, { opacity: 0, y: 16 });
  gsap.set([titre, nav, porte, porteSil, chrono].filter(Boolean), { opacity: 0 });
  gsap.set([...traitsCourbe, ...traitsNeurone, ...traitTrajet], { drawSVG: '0% 0%' });
  gsap.set(boutsNeurone, { scale: 0, transformOrigin: 'center' });
  poserVue('ensemble', H0);
  poserSilhouette();
  majEtat(true);

  brancherEntree();
  brancherBoutons();
  brancherRejouer();

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
    gsap.killTweensOf([...temps, ...tempsParcours, ...piles, ...corpsSil, svg, porte, porteSil].filter(Boolean));
    toutMontrer();
  });
}
