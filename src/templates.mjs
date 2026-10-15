import { clinic, copy, routes, treatments } from './content.mjs';

export const escape = (value) => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function route(lang, key) {
  const slug = routes[key]?.[lang] ?? treatments.find(item => item.id === key)?.slug[lang];
  if (slug === undefined) throw new Error(`Unknown route: ${lang}/${key}`);
  return `${lang === 'en' ? '/en/' : '/'}${slug ? `${slug}/` : ''}`;
}

const arrow = '<span aria-hidden="true">↗</span>';
const wa = (lang, training = false) => {
  const message = training
    ? (lang === 'es' ? 'Hola, me gustaría recibir información sobre las próximas actividades formativas.' : 'Hello, I would like information about your upcoming training activities.')
    : (lang === 'es' ? 'Hola, me gustaría consultar disponibilidad para una primera visita.' : 'Hello, I would like to check availability for a first visit.');
  return `https://wa.me/${clinic.mobile.slice(1)}?text=${encodeURIComponent(message)}`;
};

function button(lang, training = false) {
  return `<a class="button" href="${wa(lang, training)}">${training ? copy[lang].trainingBook : copy[lang].book}${arrow}</a>`;
}

function image(file, alt, cls = '', eager = false) {
  const sizes = file === 'equipo' ? [1174, 747] : file === 'sala' ? [1600, 900] : file === 'formacion' ? [1500, 844] : [1600, 1066];
  return `<img class="${cls}" src="/images/${file}.jpg" alt="${escape(alt)}" width="${sizes[0]}" height="${sizes[1]}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

function techniqueIcon(index) {
  const paths = [
    '<path d="m20 46 24-28m-17 2 12 11M18 38l8 7M39 9l13 11M20 46l-4 8"/><path d="M12 53h40"/>',
    '<path d="M32 9c8 10 17 19 17 30a17 17 0 0 1-34 0c0-7 4-14 9-20 0 10 2 13 5 15 5-7 6-16 3-25Z"/><path d="M32 38c7 9 7 14 0 17-7-3-7-8 0-17Z"/>',
    '<path d="M18 16h28l-3 12c10 20 7 26-11 26S11 48 21 28l-3-12Z"/><path d="M19 22h26M22 44c6 4 14 4 20 0"/>',
    '<path d="M22 41c-17-28 20-42 25-19 3 16-13 15-13 26 0 9-12 10-13 0M27 33c-5-11 10-18 13-8 2 6-8 8-9 15"/><circle cx="30" cy="28" r="2"/>',
    '<path d="m32 8-14 27h13l-3 21 18-29H33l-1-19Z"/>',
    '<path d="M18 37V21c0-5 6-5 6 0v11-17c0-5 6-5 6 0v16-20c0-5 6-5 6 0v20-15c0-5 6-5 6 0v22l3-7c3-6 8-3 6 2l-7 18c-4 9-19 9-23 0l-7-13c-3-5 1-8 4-1Z"/>',
    '<path d="M11 32c9-18 33-18 42 0M11 44c9-18 33-18 42 0M21 12v12M32 8v12M43 12v12"/>',
  ];
  return `<svg class="technique-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[index]}</svg>`;
}

function header(lang, key) {
  const c = copy[lang];
  const other = lang === 'es' ? 'en' : 'es';
  return `<a class="skip" href="#main">${c.skip}</a>
  <div class="topline"><div class="container"><span>Madrid · Retiro</span><a href="tel:${clinic.phone}">+34 911 645 198</a></div></div>
  <header class="header"><div class="container header-inner">
    <a class="brand" href="${route(lang, 'home')}" aria-label="Seul Acupuntura · ${lang === 'es' ? 'Inicio' : 'Home'}"><span class="brand-name">Seul</span><span class="brand-detail">ACUPUNTURA · MADRID</span></a>
    <button class="menu-toggle" hidden aria-controls="navigation" aria-expanded="false" data-open="${c.menu}" data-close="${c.close}">${c.menu}<span aria-hidden="true">☰</span></button>
    <nav id="navigation" aria-label="${lang === 'es' ? 'Principal' : 'Main'}">
      ${['treatments', 'team', 'training', 'contact'].map((item, i) => `<a href="${route(lang, item)}" ${key === item || (item === 'treatments' && treatments.some(t => t.id === key)) ? 'aria-current="page"' : ''}>${c.nav[i]}</a>`).join('')}
    </nav>
    <div class="header-actions"><a class="language" href="${route(other, key)}" hreflang="${other}" lang="${other}" aria-label="${other === 'en' ? 'Read this page in English' : 'Leer esta página en español'}"><span ${lang === 'es' ? 'class="selected"' : ''}>ES</span><span aria-hidden="true">/</span><span ${lang === 'en' ? 'class="selected"' : ''}>EN</span></a>
    <a class="button button-small" href="${wa(lang)}">${c.appointment}${arrow}</a></div>
  </div></header>`;
}

function footer(lang) {
  const c = copy[lang];
  return `<footer class="footer"><div class="container footer-grid">
    <div><a class="brand footer-brand" href="${route(lang, 'home')}"><span class="brand-name">Seul</span><span class="brand-detail">ACUPUNTURA · MADRID</span></a><p>${c.footerLine}</p></div>
    <div><h2>${c.explore}</h2>${['treatments', 'team', 'training', 'contact'].map((item, i) => `<a href="${route(lang, item)}">${c.nav[i]}</a>`).join('')}</div>
    <div><h2>${c.visit}</h2><address>${clinic.address}<br>${clinic.postcode}</address><a href="${clinic.maps}" target="_blank" rel="noopener noreferrer">${c.directions} ${arrow}</a><p>${c.hours}<br>9:30–14:00 · 16:00–20:00</p></div>
    <div><h2>${c.contactLabel}</h2><a href="tel:${clinic.phone}">+34 911 645 198</a><a href="tel:${clinic.mobile}">+34 646 352 139</a><a class="email-link" href="mailto:${clinic.email}">${clinic.email}</a><a href="${wa(lang)}">WhatsApp ${arrow}</a></div>
    </div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Seul Acupuntura</span><a href="${route(lang, 'privacy')}">${c.privacy}</a><p>${c.health}</p></div></footer>
    <div class="mobile-contact"><a href="tel:${clinic.phone}">${lang === 'es' ? 'Llamar' : 'Call'}</a><a href="${wa(lang)}">${c.appointment} · WhatsApp ${arrow}</a></div>`;
}

function cards(lang, items = treatments) {
  const c = copy[lang];
  return `<div class="treatment-grid">${items.map(item => `<a class="treatment-card" href="${route(lang, item.id)}">
    <div class="card-top">${techniqueIcon(treatments.indexOf(item))}<span class="card-no">0${treatments.indexOf(item) + 1}</span></div>
    <span class="eyebrow">${item.tag[lang]}</span><h3>${item.name[lang]}</h3><p>${item.short[lang]}</p><span class="text-link">${c.discover}${arrow}</span>
  </a>`).join('')}</div>`;
}

function plan(lang) {
  const c = copy[lang];
  return `<section class="section plan" id="primera-visita"><div class="container">
    <div class="section-heading"><p class="eyebrow">${c.planEyebrow}</p><h2>${c.planTitle}</h2></div>
    <ol class="steps">${c.steps.map(([title, text], i) => `<li><span class="step-number">0${i + 1}</span><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol>
    <div class="plan-action">${button(lang)}<span class="small">${c.finalCue}</span></div>
  </div></section>`;
}

function reviews(lang) {
  const c = copy[lang];
  return `<section class="section reviews" id="opiniones"><div class="container">
    <div class="section-heading review-heading"><div><p class="eyebrow">${c.reviewEyebrow}</p><h2>${c.reviewTitle}</h2></div><a class="review-score" href="${clinic.maps}" target="_blank" rel="noopener noreferrer" aria-label="${c.readReviews}"><span class="review-score-number">${lang === 'es' ? '4,9' : '4.9'}</span><span class="review-score-stars" aria-label="${lang === 'es' ? 'sobre 5 estrellas' : 'out of 5 stars'}">★★★★★</span><span class="review-score-count">${clinic.reviewCount} ${c.reviewLabel} ${arrow}</span></a></div>
    <div class="quote-grid">${c.quotes.map(review => `<figure class="review-card"><div class="review-stars" aria-label="${c.starLabel}">★★★★★</div><blockquote lang="${lang}">${review.quote}</blockquote>${lang === 'es' ? `<small class="translation-note">${c.translated}</small>` : ''}<figcaption><strong>${review.author}</strong><span>${review.note}</span></figcaption>${lang === 'es' ? `<details class="quote-original"><summary>${c.original}</summary><p lang="en">${review.original}</p></details>` : ''}</figure>`).join('')}</div>
    <div class="review-bottom"><p class="review-summary">${c.reviewSummary}</p><a class="text-link" href="${clinic.maps}" target="_blank" rel="noopener noreferrer">${c.readReviews}${arrow}</a><p class="small">${c.reviewDisclosure}<br>${c.reviewDate}</p></div>
  </div></section>`;
}

function prices(lang) {
  const c = copy[lang];
  return `<section class="section prices" id="tarifas"><div class="container prices-layout"><div><p class="eyebrow">${c.pricesEyebrow}</p><h2>${c.pricesTitle}</h2><p class="price-footnote">${c.priceNote}</p></div><div class="price-list">${c.prices.map(([title, price, text]) => `<div class="price-row"><div><h3>${title}</h3><p>${text}</p></div><span>${price}</span></div>`).join('')}</div></div></section>`;
}

function faq(lang) {
  const c = copy[lang];
  return `<section class="section faq"><div class="container faq-layout"><div><p class="eyebrow">${c.faqEyebrow}</p><h2>${c.faqTitle}</h2></div><div>${c.faq.map(([question, answer]) => `<details class="faq-item"><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`).join('')}</div></div></section>`;
}

function location(lang, full = false) {
  const c = copy[lang];
  return `<section class="section location"><div class="container location-grid"><div class="location-photo">${image('consulta', c.galleryAlts[0])}<span class="photo-label">Seul Acupuntura · Madrid</span></div><div class="location-copy"><p class="eyebrow">${c.locationEyebrow}</p><h2>${c.locationTitle}</h2><address>${clinic.address}<br>${clinic.postcode}</address><p>${c.transport}<br><span class="small">${c.buses}</span></p><div class="hours"><span>${c.hours}</span><span>9:30–14:00<br>16:00–20:00</span></div>${full ? `<p class="small">${c.scheduleNote}</p>` : ''}<a class="text-link" href="${clinic.maps}" target="_blank" rel="noopener noreferrer">${c.directions}${arrow}</a></div></div></section>`;
}

function finalCTA(lang) {
  const c = copy[lang];
  return `<section class="final-cta"><div class="container final-grid"><div><p class="eyebrow">SEUL ACUPUNTURA · MADRID</p><h2>${c.finalTitle}</h2></div><div><p>${c.finalText}</p>${button(lang)}<p class="small">${c.finalCue}</p><a class="phone-link" href="tel:${clinic.phone}">${c.call}</a></div></div></section>`;
}

function home(lang) {
  const c = copy[lang];
  return `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="eyebrow">${c.eyebrow}</p><h1>${c.hero}</h1><p class="hero-intro">${c.intro}</p><a class="hero-rating-link" href="#opiniones"><span aria-hidden="true">★★★★★</span> ${c.heroRating}</a><div class="hero-actions">${button(lang)}<p class="small">${c.cue}</p></div></div>
    <figure class="hero-figure">${image('equipo', c.caption, 'hero-image', true)}<figcaption>${c.caption}</figcaption></figure>
  </div></section>${reviews(lang)}
  <section class="section problem"><div class="container problem-grid"><div><p class="eyebrow">${c.problemEyebrow}</p><h2>${c.problemTitle}</h2></div><div><p class="lead">${c.problemText}</p><ul class="concerns">${c.concerns.map(q => `<li><span aria-hidden="true">↳</span>${q}</li>`).join('')}</ul></div></div></section>
  <section class="section services"><div class="container"><div class="section-heading heading-split"><div><p class="eyebrow">${c.servicesEyebrow}</p><h2>${c.servicesTitle}</h2></div><p>${c.servicesText}</p></div>${cards(lang, treatments.slice(0, 3))}<div class="section-bottom"><a class="text-link" href="${route(lang, 'treatments')}">${c.allTreatments}${arrow}</a></div></div></section>
  <section class="section team-feature"><div class="container team-grid"><figure>${image('cabinet', c.caption)}<figcaption>${c.teamCaption}</figcaption></figure><div class="team-copy"><p class="eyebrow">${c.teamEyebrow}</p><h2>${c.teamTitle}</h2><p>${c.teamText}</p><a class="text-link" href="${route(lang, 'team')}">${c.teamLink}${arrow}</a></div></div></section>
  ${plan(lang)}${prices(lang)}${faq(lang)}${location(lang)}${finalCTA(lang)}`;
}

function pageHero(lang, title, lead, eyebrow, photo, alt) {
  return `<section class="page-hero"><div class="container ${photo ? 'page-hero-grid' : ''}"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${lead}</p></div>${photo ? `<figure>${image(photo, alt, '', true)}</figure>` : ''}</div></section>`;
}

function team(lang) {
  const c = copy[lang];
  return `${pageHero(lang, c.teamPageTitle, c.teamLead, c.teamEyebrow, 'equipo', c.caption)}
  <section class="section"><div class="container bio-grid"><div><p class="eyebrow">SEUL ACUPUNTURA</p><h2>${c.teamBioTitle}</h2><p>${c.teamBio}</p><h3>${c.shim}</h3><p class="eyebrow">${c.shimRole}</p><p>${c.shimBio}</p><p class="small notice">${c.credentials}</p></div><ol class="timeline">${c.timeline.map(([year, title]) => `<li><span>${year}</span><h3>${title}</h3></li>`).join('')}</ol></div></section>
  <section class="section gallery"><div class="container"><div class="section-heading"><p class="eyebrow">SEUL · MADRID</p><h2>${c.spaceTitle}</h2></div><div class="gallery-grid">${['consulta', 'sala', 'detalle'].map((file, i) => `<figure>${image(file, c.galleryAlts[i])}<figcaption>${c.galleryAlts[i]}</figcaption></figure>`).join('')}</div></div></section>${finalCTA(lang)}`;
}

function training(lang) {
  const c = copy[lang];
  return `${pageHero(lang, c.trainingTitle, c.trainingLead, c.nav[2], 'formacion', c.trainingPhoto)}
  <section class="section"><div class="container training-grid"><div><p class="eyebrow">SEUL · ${lang === 'es' ? 'FORMACIÓN' : 'TRAINING'}</p><h2>${c.trainingBodyTitle}</h2><p>${c.trainingBody}</p><p class="notice">${c.trainingNotice}</p></div><div class="training-enquiry"><h3>${lang === 'es' ? 'La información que conviene tener' : 'What to ask before enrolling'}</h3><ul class="check-list">${c.trainingChecks.map(text => `<li>${text}</li>`).join('')}</ul>${button(lang, true)}<p class="small">${c.trainingCue}</p><a class="text-link" href="mailto:${clinic.email}?subject=${encodeURIComponent(lang === 'es' ? 'Información sobre formación' : 'Training enquiry')}">${c.email}${arrow}</a></div></div></section>${location(lang)}`;
}

function contact(lang) {
  const c = copy[lang];
  return `${pageHero(lang, c.contactTitle, c.contactLead, c.nav[3])}
  <section class="section contact-section"><div class="container contact-grid"><div class="contact-panel"><p class="eyebrow">${c.contactLabel}</p>${button(lang)}<a class="contact-phone" href="tel:${clinic.phone}">+34 911 645 198 ${arrow}</a><a class="text-link" href="tel:${clinic.mobile}">+34 646 352 139 ${arrow}</a><a class="email-link" href="mailto:${clinic.email}">${clinic.email}</a><p class="small">${c.contactPrivacy}</p></div><div><h2>${c.appointmentTitle}</h2><ul class="check-list">${c.appointmentList.map(text => `<li>${text}</li>`).join('')}</ul><p class="notice">${c.finalCue}</p></div></div></section>${location(lang, true)}${prices(lang)}${faq(lang)}`;
}

function treatmentPage(lang, item) {
  const c = copy[lang];
  return `${pageHero(lang, item.name[lang], item.short[lang], c.servicesEyebrow)}
  <section class="section"><div class="container technique-layout"><article><p class="eyebrow">${c.technique}</p><h2>${lang === 'es' ? 'En qué consiste' : 'What it involves'}</h2><p class="lead">${item.detail[lang]}</p><h3>${c.precaution}</h3><p>${item.consider[lang]}</p><p class="notice small">${c.techniqueNote}</p></article><aside class="technique-aside">${techniqueIcon(treatments.indexOf(item))}<h2>${c.before}</h2><p>${lang === 'es' ? 'Una primera valoración permite hablar de tu caso antes de elegir una técnica.' : 'An initial assessment gives you a chance to discuss your situation before choosing a technique.'}</p>${button(lang)}<p class="small">${c.cue}</p><a class="text-link" href="${route(lang, 'contact')}#tarifas">${c.pricesEyebrow}${arrow}</a></aside></div></section>
  <section class="section services"><div class="container"><div class="section-heading"><h2>${c.otherTreatments}</h2></div>${cards(lang, treatments.filter(t => t.id !== item.id).slice(0, 3))}<div class="section-bottom"><a class="text-link" href="${route(lang, 'treatments')}">${c.allTreatments}${arrow}</a></div></div></section>`;
}

function privacy(lang, settings) {
  const es = lang === 'es';
  const c = copy[lang];
  const operator = settings.legalName ? escape(settings.legalName) : (es ? 'Datos del titular pendientes de validación. Esta versión es una vista previa y no debe publicarse como sitio oficial.' : 'Operator details are awaiting validation. This is a preview and must not be published as the official website.');
  return `${pageHero(lang, c.privacy, es ? 'Información sobre este sitio y las vías de contacto.' : 'Information about this website and its contact channels.', 'SEUL ACUPUNTURA')}
  <section class="section"><article class="container legal-content">
  <h2>${es ? 'Titular y contacto' : 'Operator and contact'}</h2><p>${operator}${settings.taxId ? `<br>${es ? 'Identificación fiscal' : 'Tax identification'}: ${escape(settings.taxId)}` : ''}</p><address>${clinic.address}, ${clinic.postcode}</address><p><a href="mailto:${clinic.email}">${clinic.email}</a><br><a href="tel:${clinic.phone}">+34 911 645 198</a></p>
  <h2>${es ? 'Datos y navegación' : 'Data and browsing'}</h2><p>${es ? 'Esta versión no incorpora formularios, analítica publicitaria, fuentes externas ni mapas incrustados. No utiliza cookies ni almacenamiento local desde el código del sitio. El alojamiento puede procesar datos técnicos, como la dirección IP y registros de acceso, para prestar y proteger el servicio.' : 'This version has no forms, advertising analytics, external fonts or embedded maps. The site code does not use cookies or local storage. The hosting provider may process technical information such as IP addresses and access logs to deliver and protect the service.'}</p>
  ${settings.hostingName ? `<p>${es ? 'Alojamiento' : 'Hosting'}: ${escape(settings.hostingName)}.</p>` : `<p class="notice">${es ? 'El proveedor de alojamiento y sus condiciones se deben identificar antes de publicar.' : 'The hosting provider and its terms must be identified before publication.'}</p>`}
  <h2>${es ? 'Contacto por servicios externos' : 'Contact through external services'}</h2><p>${es ? 'Los enlaces a WhatsApp, Google Maps y email abren servicios ajenos al sitio. Al utilizarlos se aplican las condiciones y políticas del proveedor elegido. Evita enviar información de salud sensible en un primer contacto. Las consultas recibidas serán atendidas por el centro.' : 'WhatsApp, Google Maps and email links open services outside this website. Their respective providers’ terms and privacy policies apply. Avoid sending sensitive health information in an initial enquiry. The practice handles the enquiries it receives.'}</p>
  <h2>${es ? 'Información sanitaria' : 'Health information'}</h2><p>${c.health} ${es ? 'Las técnicas descritas tienen evidencia e indicaciones variables. No interrumpas un tratamiento prescrito. En una urgencia, llama al 112.' : 'The techniques described have varying evidence and indications. Do not stop prescribed treatment. In an emergency, call 112.'}</p>
  <h2>${es ? 'Fotografías y opiniones' : 'Photographs and reviews'}</h2><p>${es ? 'Las fotografías proceden del sitio original del centro y se reutilizan con autorización facilitada para este proyecto. La puntuación y los extractos de opiniones proceden de la ficha pública de Google, consultada el 15 de octubre de 2026. Las traducciones se identifican y el texto original se puede consultar junto a cada extracto.' : 'Photographs come from the practice’s original website and are reused with permission provided for this project. The rating and review excerpts come from the public Google listing, checked on 15 October 2026. Translations are labelled and the original text is available alongside each excerpt.'}</p>
  ${settings.privacyDetails ? `<h2>${es ? 'Tratamiento de consultas y derechos' : 'Enquiries and privacy rights'}</h2><p>${escape(settings.privacyDetails)}</p>` : `<p class="notice">${es ? 'Antes de publicar, el titular debe validar las bases jurídicas, plazos de conservación, destinatarios y procedimiento de ejercicio de derechos aplicables a las consultas que recibe.' : 'Before publication, the operator must validate the lawful bases, retention periods, recipients and rights procedure applicable to the enquiries it receives.'}</p>`}
  </article></section>`;
}

export function render(lang, key, settings = {}) {
  const c = copy[lang];
  const item = treatments.find(t => t.id === key);
  const title = key === 'home' ? c.title : `${item ? item.name[lang] : ({ treatments: c.nav[0], team: c.nav[1], training: c.nav[2], contact: c.nav[3], privacy: c.privacy })[key]} · Seul Acupuntura · Madrid`;
  let main;
  switch (key) {
    case 'home': main = home(lang); break;
    case 'treatments': main = `${pageHero(lang, c.treatmentTitle, c.treatmentLead, c.servicesEyebrow)}<section class="section all-treatments"><div class="container">${cards(lang)}</div></section>${plan(lang)}${finalCTA(lang)}`; break;
    case 'team': main = team(lang); break;
    case 'training': main = training(lang); break;
    case 'contact': main = contact(lang); break;
    case 'privacy': main = privacy(lang, settings); break;
    default:
      if (!item) throw new Error(`Unknown page: ${key}`);
      main = treatmentPage(lang, item);
  }
  const canonical = settings.origin ? `${settings.origin}${route(lang, key)}` : '';
  const description = item ? `${item.name[lang]} ${lang === 'es' ? 'en' : 'at'} Seul Acupuntura, Madrid. ${item.short[lang]}` : ({
    home: c.description, treatments: c.treatmentLead, team: c.teamLead,
    training: c.trainingLead, contact: c.contactLead,
    privacy: lang === 'es' ? 'Información legal, privacidad y uso de fotografías y opiniones en el sitio de Seul Acupuntura.' : 'Legal information, privacy and use of photographs and reviews on the Seul Acupuntura website.',
  })[key];
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title><meta name="description" content="${escape(description)}">
  <meta name="robots" content="${settings.publish ? 'index, follow' : 'noindex, nofollow'}"><meta name="theme-color" content="#f8f7f2">
  ${canonical ? `<link rel="canonical" href="${escape(canonical)}">${['es', 'en'].map(l => `<link rel="alternate" hreflang="${l}" href="${escape(settings.origin + route(l, key))}">`).join('')}<link rel="alternate" hreflang="x-default" href="${escape(settings.origin + route('es', key))}">` : ''}
  <meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:locale" content="${lang === 'es' ? 'es_ES' : 'en_GB'}">${canonical ? `<meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(settings.origin)}/images/equipo.jpg">` : ''}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/editorial.css"><script src="/app.js" defer></script></head>
  <body>${header(lang, key)}<main id="main" tabindex="-1">${main}</main>${footer(lang)}</body></html>`;
}

export function notFound() {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 · Seul Acupuntura</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/styles.css"><link rel="icon" href="/favicon.svg"></head><body><main class="not-found"><p class="eyebrow">SEUL ACUPUNTURA · 404</p><h1>Esta página<br><em>no está aquí.</em></h1><p>This page could not be found.</p><a class="button" href="/">Volver al inicio ↗</a><a class="text-link" href="/en/">English homepage ↗</a></main></body></html>`;
}
