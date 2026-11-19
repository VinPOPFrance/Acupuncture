# Seul Acupuntura

Refonte statique multipage en espagnol et en anglais. Aucun framework, aucune
dépendance npm, aucune police externe et aucun service de formulaire.

## Utilisation locale

Node.js 22 ou supérieur.

```sh
npm run build
npm run dev
```

Ouvrir <http://127.0.0.1:4173/> ou <http://127.0.0.1:4173/en/>.
Les tâches VS Code **Build Seul Acupuntura** et **Preview Seul Acupuntura**
effectuent les mêmes opérations.

Le serveur sert les fichiers générés ; reconstruire après chaque modification.

```sh
npm run build
npm test
```

Les tests utilisent le runner natif de Node et vérifient notamment les 26 pages,
les liens et ancres, les images, les langues, les coordonnées, les prix, les
métadonnées et les réponses du serveur local. Les formulaires externes ne sont
jamais soumis et aucun message WhatsApp n'est envoyé pendant les tests.

## Structure

- [src/content.mjs](src/content.mjs) : textes ES/EN, coordonnées, tarifs et techniques.
- [src/templates.mjs](src/templates.mjs) : gabarits, liens et interactions HTML.
- [public/styles.css](public/styles.css) et
  [public/editorial.css](public/editorial.css) : styles, typographie et responsive.
- [public/fonts/](public/fonts/) : Alegreya servie localement, sous licence OFL.
- [public/app.js](public/app.js) : menu mobile, carrousel d'avis, apparitions au
  défilement, compteur de la note et barre de progression de lecture.
- [src/assets.json](src/assets.json) : provenance des photographies du site original.
  `public/images/dr-shim.jpg` (portrait du Dr Shim) a été fourni par l'utilisateur
  le 18 novembre 2026 et n'est pas téléchargé par `npm run assets`.
- [scripts/build.mjs](scripts/build.mjs) : génération du site statique.
- [dist/](dist/) : résultat à héberger, sans sources ni rapports internes.

Pages : accueil, traitements, sept pages de techniques, équipe et galerie,
formation, contact et tarifs, confidentialité et mentions légales. Les treize
pages existent dans chaque langue. Le changement ES/EN conserve la page visitée.
Une véritable page 404 bilingue accompagne le site.

Les pages, la FAQ et les avis restent utilisables sans JavaScript : le carrousel
est une liste à défilement horizontal natif. Le JavaScript ajoute les boutons, le
défilement automatique (pause au survol, au focus, au toucher ou via le bouton),
les apparitions au défilement et le compteur de la note. Toutes les animations
sont désactivées si le visiteur demande moins de mouvement
(`prefers-reduced-motion`). Aucun attribut `style` dans le HTML, pour respecter la
CSP ; le JavaScript passe par le CSSOM. Photos locales, chargement différé sauf
pour le visuel principal, dimensions réservées, liens téléphoniques.

La barre d'appel et WhatsApp (logo WhatsApp) est visible sur toutes les pages :
barre fixe en bas sur mobile, pastille flottante en bas à droite au-delà de 600 px.

## Choix éditoriaux

Le parcours suit StoryBrand sans dramatisation médicale :

1. Le patient cherche à comprendre ses options.
2. Les questions et hésitations sont reconnues sans inventer de diagnostic.
3. L'équipe est le guide, pas le héros.
4. Un plan en trois étapes explique le premier contact.
5. Le CTA ouvre WhatsApp ; le centre doit ensuite confirmer la date.
6. Prix, précautions et FAQ permettent une décision informée.

L'accueil s'adresse aux patients. La formation possède sa page et son message
WhatsApp propres ; aucune session ni certification n'est inventée.

Typographie Alegreya traditionnelle, hébergée localement avec sa licence OFL.
Aucune police n'est chargée depuis un service externe. La mise en page est
éditoriale, avec des photos rectangulaires et moins d'ornements décoratifs.
La note et les avis Google (logo Google) apparaissent dans le hero puis
immédiatement sous celui-ci, ainsi que sur les pages traitements, techniques,
équipe et contact ; les citations sont attribuées et renvoient à la fiche publique.
L'équipe présente le currículum du Dr Shim et de la Dra Park (`#curriculum`).

## Sources vérifiées le 15 octobre 2026

- [Site original](https://www.seulacupuntura.com/), inspecté dans un navigateur.
- [Équipe](https://www.seulacupuntura.com/quienessomos) : parcours entre la Chine,
  la Corée et l'Espagne ; Madrid depuis 2013.
- [Galerie](https://www.seulacupuntura.com/galeria) et
  [formation](https://www.seulacupuntura.com/cursos) : photographies réutilisées
  avec l'autorisation indiquée par l'utilisateur.
- [Contact et tarifs](https://www.seulacupuntura.com/contacto) : téléphone,
  adresse, horaires, séance à 60 €, cinq séances à 270 €, dix à 500 €.
- Première consultation gratuite limitée à l'entretien/anamnèse et à la
  valorisation du cas. Le traitement n'est pas inclus.
- [Google Maps](https://www.google.com/maps?cid=16088022837019970998) :
  note **4,9/5, 232 avis**, relevée directement dans le DOM de la fiche. Le lien
  utilisé dans le site est dérivé de l'identifiant hexadécimal fourni par
  l'utilisateur, pour éviter les erreurs de transcription.
- Un plan Google Maps intégré affiche les coordonnées publiques du centre dans
  la section localisation. Sa présence est signalée dans la page confidentialité ;
  Google peut recevoir des données techniques lorsque la carte se charge.
- Mise à jour du 18 novembre 2026 : **4,9/5, 234 avis, dont 224 à 5 étoiles**,
  relevés sur la fiche Google (panneau d'avis de la recherche Google, sans
  connexion). 33 avis réels figurent dans `reviews` de
  [src/content.mjs](src/content.mjs), texte original non corrigé, extraits
  signalés par « … » ou « […] ». Chaque avis a sa traduction, signalée, avec
  l'original accessible. Écartés volontairement : l'avis de l'utilisateur
  lui-même et les avis promettant une guérison, l'évitement d'une chirurgie ou
  un résultat sur une maladie grave. Les témoignages ne sont pas présentés comme
  une preuve d'efficacité.
- Photos des techniques (18 novembre 2026) : la photo unique de chaque page
  technique du site actuel (`/acupuntura`, `/moxibustion`, etc.), listée dans
  [src/assets.json](src/assets.json). Celle de la manopuntura est un schéma de la
  main, cadré à gauche par CSS (`img-left`). Plusieurs semblent issues de banques
  d'images : vérifier les licences avant une publication officielle.
- Currículum : dépliant imprimé du centre photographié par l'utilisateur le
  18 novembre 2026, reproduit sans ajout. La ligne « Miembro de Médico en
  China » du dépliant est rendue par « Miembro médico en China » : à faire
  confirmer par le centre.
- WhatsApp **+34 646 352 139** confirmé par l'utilisateur.

La mise à jour de la note et du nombre d'avis est manuelle, sans scraper ni widget
tiers. Ne pas présenter ces données datées comme des chiffres synchronisés.
Les horaires, prix, conditions des bonos et disponibilité de la première
consultation doivent être reconfirmés avant une publication officielle.

Pour télécharger à nouveau les six photos depuis leurs sources :

```sh
npm run assets
```

Les images existent déjà localement ; cette commande n'est pas nécessaire pour
construire ou héberger le site.

## Hébergement gratuit proposé : Cloudflare Pages

Le site est compatible avec une URL standard
`https://nom-du-projet.pages.dev`, sous réserve de disponibilité du nom.
Cloudflare Pages propose une offre gratuite utilisable pour un site d'entreprise,
dans les limites et conditions en vigueur. Les fichiers statiques ne nécessitent
ni base de données ni fonction serveur.

Sources :
[limites Pages](https://developers.cloudflare.com/pages/platform/limits/),
[réponse de la communauté Cloudflare sur l'usage commercial](https://community.cloudflare.com/t/is-cloudflare-pages-workers-free-plan-free-for-commercial-use/291741),
[conditions Cloudflare](https://www.cloudflare.com/legal/ssa/),
[guide Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/).

### Aperçu partageable

1. Créer ou ouvrir un compte Cloudflare.
2. Dans Workers & Pages, créer un projet **Pages / Direct Upload**.
3. Choisir un nom de projet disponible.
4. Exécuter `npm run build` localement.
5. Déposer uniquement le dossier [dist/](dist/) dans l'interface de déploiement.
6. Ouvrir l'URL `pages.dev` fournie par Cloudflare.

Le build par défaut est **non indexable** : `robots.txt`, balise robots et
en-tête `X-Robots-Tag` sur Cloudflare Pages. Une URL publique n'est toutefois
pas un accès privé : ne pas y mettre de données confidentielles.

Direct Upload ne peut pas être converti en intégration Git sur le même projet.
Pour des mises à jour automatiques, choisir dès le départ l'intégration Git avec
`npm run build` comme commande et `dist` comme répertoire de sortie.

Un déploiement nécessite l'accès au compte de l'utilisateur. Aucun compte,
projet distant ou déploiement n'est créé par ce code.

### Vercel en alternative

[vercel.json](vercel.json) prépare une publication de `dist`, les redirections
et les en-têtes. L'offre
[Hobby de Vercel](https://vercel.com/docs/plans/hobby) est réservée à l'usage
personnel non commercial : ne pas la recommander pour le site officiel du cabinet.
Une offre commerciale adaptée est nécessaire, même avec un sous-domaine
`vercel.app`. Les en-têtes `_headers` de Cloudflare ne sont pas interprétés par
Vercel ; le mode aperçu y reste non indexable par les balises et `robots.txt`.

## Balise Google (Google Ads)

Relevé le 19 novembre 2026 dans le HTML du site Wix (accueil et `/contacto`) : une seule balise,
Google Ads **`AW-829553432`**, chargée par l'intégration Wix avec le mode de consentement Google
entièrement « refusé » et sans bannière de cookies. Aucun identifiant Google Analytics 4 (`G-…`) n'y était
chargé, et seuls des `page_view` étaient envoyés (aucune conversion).

- Identifiants : `clinic.googleTags` dans [src/content.mjs](src/content.mjs) (`ads`, et `analytics` vide
  tant qu'aucun GA4 n'est fourni). Vider les deux retire la balise de toutes les pages.
- Chargement : [public/google-tag.js](public/google-tag.js), appelé par `googleTag()` dans
  [src/templates.mjs](src/templates.mjs) sur les 26 pages (pas sur la 404). Fichier séparé car la CSP
  interdit les scripts en ligne. Consentement par défaut : tout refusé, comme sur Wix, donc aucun cookie
  publicitaire ni de mesure, seulement des signaux sans cookie.
- CSP : les domaines Google (`googletagmanager.com`, `pagead2.googlesyndication.com`, `doubleclick.net`,
  `googleadservices.com`, `google.com`, `google.es`, `google-analytics.com`) sont ajoutés **à la fois** dans
  [vercel.json](vercel.json) et [src/headers.txt](src/headers.txt) (Cloudflare). Les deux doivent rester
  identiques ; sinon la balise est bloquée sur l'un des hébergeurs. Le serveur local n'envoie pas la CSP :
  la vérifier sur l'URL hébergée.
- Confidentialité : la page `privacidad` décrit la balise et le mode refusé (ES/EN). Ajouter une bannière
  de consentement (pour mesurer avec cookies) imposerait d'adapter ce texte et la CSP.
- Sur l'hébergement Wix, cette balise est retirée au profit de celle que Wix injecte (section Hébergement Wix).
- Vérifié en local le 19 novembre 2026 : `gtag/js?id=AW-829553432` chargé, `page_view` envoyé à
  `pagead2.googlesyndication.com`, aucun cookie posé.

## Hébergement Wix (migration Headless, depuis le 19 novembre 2026)

Décision du 19 novembre 2026 (Adrien) : garder les abonnements Wix et y héberger ce site, plutôt que
Vercel (offre Hobby non commerciale). Wix « Headless migration » : le site Wix actuel (parent
`920b58b9-c98e-49db-ac62-06a8b04cb313`, plan Premium, domaine) garde plan et domaine ; un site technique
(`3e40ea89-33e5-4990-8628-448e96bcec27`, app `50a10e5f-08bf-48d8-912b-38caca5af716`) sert l'aperçu
<https://headless-scuwxudrwru-seuinformatica-140e.wix-site-host.com>. Migration `bb1ae032-8553-4e5d-a919-9f8c5d69fdb4`.
**Migration terminée le 19 novembre 2026 vers 15:27 (heure de Madrid)** (Adrien : « fais la migration complète en attendant que le
centre m'envoie les informations ») : état `COMPLETED`, www.seulacupuntura.com sert ce site. « Switch back » dans
les paramètres Headless du tableau de bord remet l'ancien site. Depuis, `wix/wix.config.json` pointe sur le **parent**
(`siteId` `920b58b9-…`, `appId` `5a87bc97-e6aa-4ed2-a38c-69f399d0dd10`) et `.env.local` a `EDITOR_MIGRATION_STATUS="COMPLETED"` :
chaque nouvelle version se publie sur le site parent.

- [wix/](wix/) : projet Astro fourni par Wix (`wix.config.json`, `astro.config.mjs`). Les pages ne sont pas
  réécrites : [scripts/build-wix.mjs](scripts/build-wix.mjs) prend `dist/` et crée une page Astro par page HTML,
  qui renvoie le HTML tel quel. Fichiers générés (non versionnés) : `wix/public/`, `wix/src/pages/`, `wix/src/site/`.
- Différences avec `dist/`, faites par `build-wix.mjs` : pas de `robots.txt`, `sitemap.xml`, `_headers`,
  `_redirects` (Wix sert les siens) ; **pas de `google-tag.js`** (voir ci-dessous) ; liens internes, canonical,
  hreflang et og:url **sans « / » final**, car Wix redirige `/acupuntura/` vers `/acupuntura`.
- Redirections des anciennes pages Wix : `redirects` de `wix/astro.config.mjs` (celles de `vercel.json` plus les six
  `/services-1/<technique>` du sitemap de l'ancien site, relevé le 19 novembre 2026 ; cibles
  sans « / »). `trailingSlash: "ignore"` : `/acupuntura` et `/contacto` de l'ancien site répondent directement.
- **Google Ads sur Wix :** Wix injecte lui-même l'intégration Google Ads du site (`AW-829553432`, consentement
  refusé par défaut) et envoie sa page vue (`did=dYzMzMD`). Avec notre balise en plus, chaque visite était comptée
  deux fois (mesuré sur l'aperçu le 19 novembre 2026). La version Wix ne garde donc que celle de Wix. Si
  l'intégration Google Ads est retirée dans Wix (Marketing → Intégrations), retirer `google-tag.js` de `skip` et
  la suppression du `<script>` dans `fix()` de `build-wix.mjs`, sinon le site n'a plus de balise.
- `.env.local` (non versionné) : `WIX_CLIENT_ID` = app compagnon du **parent** `5a87bc97-e6aa-4ed2-a38c-69f399d0dd10`,
  variables `EDITOR_MIGRATION_*`, et trois valeurs factices que l'hébergement Wix remplace à la publication.
- Node 26 (installé le 19 novembre 2026) : Astro 7.4, exigé par l'adaptateur d'hébergement Wix, refuse Node 22.17.
  `astro dev` échoue sous Windows (environnement Cloudflare de l'adaptateur) ; vérifier sur l'aperçu.
- Publier une nouvelle version : `npm run build` (racine) ; `node scripts/build-wix.mjs` ; dans `wix/`,
  `npx astro build` ; zipper `.wix` et `dist` (`tar.exe -a -c -f build.zip .wix dist`, chemins en « / ») et le
  source (sans `node_modules`, `dist`, `.wix`, `.astro`, `.env*`) ; envoi par `UploadHeadlessWebsiteFiles` du
  connecteur Wix (appel `prepare` avec la taille, `curl PUT` sur les deux URL, second appel). Dernière révision
  source sur le parent : `37b3ee2c47fa9af4f6ffc618bdce74506a628f7a` (publication du 19 novembre 2026, 16:50 : « técnicas » au lieu de « tratamientos », mention « no es un centro sanitario ») (à passer en `expectedHeadRevisionId`).
- Build publié (indexable) : `PUBLISH=1 LEGAL_PENDING=1 PUBLIC_SITE_URL=https://www.seulacupuntura.com
  HOSTING_NAME="Wix.com Ltd" CONTENT_APPROVED=1 node scripts/build.mjs`. `CONTENT_APPROVED` : Adrien, 19 novembre 2026,
  « le centre a vérifié tout le site et tout est bon ». `LEGAL_PENDING=1` : nom légal et NIF pas encore fournis (absents
  aussi de l'ancien site Wix et du compte Wix, vérifié le 19 novembre 2026) ; la page confidentialité nomme « Seul
  Acupuntura » et donne un paragraphe de droits minimal (accès, rectification, suppression, AEPD). **Dès réception** :
  construire sans `LEGAL_PENDING`, avec `LEGAL_NAME`, `LEGAL_TAX_ID`, `PRIVACY_DETAILS_ES/EN` (LSSI-CE art. 10), puis publier.
- Vérifié sur www.seulacupuntura.com le 19 novembre 2026 : `index, follow`, canonical absolu sans « / » final, une seule
  balise `AW-829553432` (Wix, injectée quelques secondes après le chargement) avec sa paire de signaux `page_view`
  habituelle, redirections `/quienessomos`, `/cursos`, `/services-1/tui-na` → 200, page inconnue → 404.

## Bascule du domaine seulacupuntura.com

État relevé le 19 novembre 2026 : domaine enregistré chez **Wix** (registrar Wix.com Ltd., échéance
2027-10-03), DNS gérés par Wix (`ns2.wixdns.net`, `ns3.wixdns.net`), `www` en CNAME vers
`cdn3.wixdns.net`, aucun enregistrement MX (pas d'e-mail sur le domaine ; le centre utilise Gmail).
Avant de faire pointer le domaine : construire en mode publication (`PUBLISH=1` et variables
ci-dessous), sinon le site officiel serait servi en `noindex` et sortirait de Google.

## Validation obligatoire avant publication officielle

Le build fonctionne immédiatement en mode aperçu. Pour une version officielle
indexable, fournir ces variables au moment de construire :

| Variable | Valeur attendue |
| --- | --- |
| `PUBLIC_SITE_URL` | Origine HTTPS définitive, sans chemin. Exemple : `https://nom.pages.dev`. |
| `LEGAL_NAME` | Identité juridique réelle du titulaire, validée par le centre. |
| `LEGAL_TAX_ID` | Identifiant fiscal validé. |
| `HOSTING_NAME` | Hébergeur effectivement choisi et informations d'identification nécessaires. |
| `PRIVACY_DETAILS_ES` | Texte juridique espagnol validé pour les demandes de contact. |
| `PRIVACY_DETAILS_EN` | Version anglaise correspondante. |
| `CONTENT_APPROVED` | `1`, une fois les prix, photos, avis et textes santé approuvés. |
| `PUBLISH` | `1`, uniquement après les validations ci-dessus. |
| `LEGAL_PENDING` | `1` pour publier sans `LEGAL_NAME`, `LEGAL_TAX_ID` ni `PRIVACY_DETAILS_*` (décision du 19 novembre 2026, en attendant le centre). À retirer dès réception. |

Le build refuse le mode publication si ces données manquent. Les textes
juridiques doivent préciser les bases légales, finalités, conservation,
destinataires/transferts éventuels, droits et voie de réclamation applicables.
Vérifier aussi les éventuelles informations professionnelles obligatoires. Le
générateur échappe le texte fourni et conserve ses paragraphes comme texte
simple : pas de HTML arbitraire injecté.

La page de confidentialité n'est pas un avis juridique. L'absence de cookies
dans le code du site n'exonère pas de décrire le traitement des demandes,
WhatsApp, email et journaux de l'hébergeur.

Ne pas affirmer que la formation académique décrite implique une habilitation
médicale en Espagne. Ne pas promettre une guérison, une absence d'effets
indésirables ou un nombre de séances garanti. La traduction du site ne confirme
pas que les consultations ou formations sont disponibles en anglais.

## Rapports

- [Diagnostic de l'ancien accueil](.webanatomy/audit-page/homepage-2026-10-15/report.md).
- [Rapport visuel de refonte](.webanatomy/write-page/homepage-2026-10-15/report.html).
- [Historique de la conversation du 19 novembre 2026](docs/historique-conversation-2026-11-19.md) : balise
  Google Ads, choix de l'hébergement, migration Headless Wix, liste des informations légales demandées au centre.

Ces rapports utilisent le site rendu et ses sources directes, sans corpus
Web Anatomy, conformément au choix de l'utilisateur. Ils ne sont pas copiés
dans le site public.
