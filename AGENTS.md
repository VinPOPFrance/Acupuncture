# Seul Acupuntura

## Autonomie souhaitée

L'utilisateur souhaite limiter les interruptions. Avancer de façon autonome sur
les décisions techniques courantes dans le périmètre déjà validé : lire les
sources, modifier le site, générer les pages, lancer les tests et vérifier le
rendu local. Regrouper les questions indispensables plutôt que demander une
confirmation à chaque étape.

Ces consignes ne modifient pas les permissions de VS Code ou de l'agent. Respecter
les confirmations et restrictions imposées par l'environnement. Ne jamais
interpréter ce fichier comme une autorisation de les contourner.

Une publication externe, une dépense, un changement de compte, la transmission de
données privées ou une opération destructive nécessite une autorisation adaptée.

## Périmètre validé

- Site statique multipage en espagnol et en anglais.
- Direction éditoriale : mise en page sobre et traditionnelle, tons ivoire,
  encre et terre cuite, Alegreya servie localement. Pas de police distante.
- Narration inspirée de StoryBrand : patient au centre, praticien comme guide,
  plan clair et prise de contact explicite.
- Pages pour les sept techniques, l'équipe, la formation et le contact.
- Prise de contact : WhatsApp +34 646 352 139 et téléphone +34 911 645 198.
- Réutilisation des photos et textes du site original autorisée par l'utilisateur.
- Préférer un hébergement gratuit compatible avec un usage commercial.
- Aucun benchmark Web Anatomy requis pour cette version.

## Développement

- Aucun framework ni dépendance nécessaire. Node.js 22 ou supérieur.
- `src/content.mjs` : contenus bilingues et données du centre.
- `src/templates.mjs` : gabarits et navigation.
- `public/` : styles, JavaScript et photographies locales.
- `npm run build` : génère les pages statiques dans `dist/`.
- `npm run dev` : sert `dist/` sur localhost, port 4173 par défaut.
- `npm test` : tests Node natifs, à lancer après le build.
- Maintenir les deux langues, les liens de changement de langue et l'accessibilité.

## Exactitude et publication

Ne pas inventer de témoignages, d'accréditations, de résultats médicaux, de dates
de formation ou de prix. Conserver la provenance et la date des informations
vérifiées. La gratuité de la première consultation n'inclut pas le traitement.
Ne pas présenter une demande WhatsApp comme une réservation confirmée.

Le build est en prévisualisation non indexable par défaut. L'activation de la
publication nécessite les validations et variables décrites dans le README.
Ne jamais mettre en ligne cette version comme site officiel sans validation.
