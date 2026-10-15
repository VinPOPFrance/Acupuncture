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
- [public/app.js](public/app.js) : menu mobile avec fermeture au clavier.
- [src/assets.json](src/assets.json) : provenance des photographies autorisées.
- [scripts/build.mjs](scripts/build.mjs) : génération du site statique.
- [dist/](dist/) : résultat à héberger, sans sources ni rapports internes.

Pages : accueil, traitements, sept pages de techniques, équipe et galerie,
formation, contact et tarifs, confidentialité et mentions légales. Les treize
pages existent dans chaque langue. Le changement ES/EN conserve la page visitée.
Une véritable page 404 bilingue accompagne le site.

Les pages et FAQ restent utilisables sans JavaScript. Le JavaScript améliore
uniquement le menu mobile. Photos locales, chargement différé sauf pour le visuel
principal, dimensions réservées, liens téléphoniques et barre de contact mobile.

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
La note et les avis Google apparaissent dans le hero puis immédiatement sous
celui-ci ; les citations sont attribuées et renvoient à la fiche publique.

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
- Les deux extraits sont attribués à J.Ch424 et Erica Esteban. Les traductions
  espagnoles sont signalées et le texte anglais original est accessible. Les
  témoignages ne sont pas présentés comme une preuve d'efficacité.
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

Ces rapports utilisent le site rendu et ses sources directes, sans corpus
Web Anatomy, conformément au choix de l'utilisateur. Ils ne sont pas copiés
dans le site public.
