# Le texte du site, en relecture

L'utilisateur corrige le texte du site dans un document Word, puis on reporte
ses corrections dans le code. Ce dossier contient les deux pièces de cet
aller-retour.

| Fichier | Rôle |
|---|---|
| `texte-du-site.docx` | Le document envoyé à l'utilisateur, relevé le 14 septembre 2026 au commit `7994cbf`. 136 blocs, dans l'ordre où le visiteur les découvre |
| `original.json` | **L'instantané de référence.** Pour chaque bloc : son repère, son texte d'origine, ses mises en forme (gras, mot-clé magenta, sous-titre) et l'endroit du code d'où il vient |

## Comment le document est construit

Chaque bloc occupe deux paragraphes : un **repère** gris (style `Repere`,
par exemple « 027 · source S6 ») puis le **texte** (style `Texte`). Les
titres d'actes sont en `Heading1` et `Heading2`, les descriptions de ce qui
se passe à l'écran en `Note`. Le gras est du gras ; un mot-clé magenta porte
à la fois un surligneur `magenta` et un fond `FF4FD8`, pour être visible dans
Word, Pages, Google Docs et Quick Look.

## Au retour du document corrigé

1. Lire le `.docx` paragraphe par paragraphe. Un paragraphe `Repere` ouvre un
   bloc ; les paragraphes de texte qui le suivent, **même ajoutés sans
   repère**, lui appartiennent. Si le style a été perdu à l'export, se rabattre
   sur le motif `^\d{3} ·` en tête de paragraphe.
2. Comparer chaque bloc à `original.json`, en traitant l'espace insécable comme
   une espace. Un mot-clé magenta se reconnaît au surligneur **ou** au fond.
   Un bloc vidé signifie « supprimer ».
3. Lire aussi les commentaires Word (`word/comments.xml`) : ce sont des
   consignes, pas des corrections.
4. **Montrer la liste des changements à l'utilisateur avant de l'appliquer.**
5. Reporter chaque changement **à sa source**, donnée par le champ `source` :
   - `outils-dessin-neurone.py` pour tout ce qui est entre `<main>` et
     `</main>`, puis régénérer `index.html` avec ce script. **Ne jamais éditer
     cette partie de `index.html` à la main** : la régénération l'écraserait ;
   - `index.html` directement pour l'en-tête, le titre de l'onglet et le pied ;
   - le fichier JS indiqué pour les verdicts, titres du dessin et annonces.
6. Reporter aussi dans `docs/02-CONTENU.md`, qui est la source de vérité du
   texte. Un bloc marqué `source S…` se revérifie contre `docs/10-SOURCES.md`,
   et `02-CONTENU` signale des formulations surveillées à ne pas réintroduire.
7. Aucun tiret long, nulle part. Garder les espaces insécables avant `: ; ? !`.
8. Vérifier dans le navigateur, aux captures, comme pour toute modification.

## Ce que le relevé ne contient pas

- Le temps du chronomètre, calculé en direct (0,51 s au départ).
- Les textes qui changent selon la réponse au curseur sont donnés sous forme de
  gabarit, avec `[nombre]` et `[temps]` à la place des valeurs.
