import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { routes, treatments, clinic, reviews, cv } from '../src/content.mjs';
import { render, route } from '../src/templates.mjs';

const root = new URL('../', import.meta.url);
const out = new URL('dist/', root);
const keys = [...Object.keys(routes), ...treatments.map(t => t.id)];

test('26 statically rendered pages have one H1, the correct language and complete local links', async () => {
  assert.equal(keys.length * 2, 26);
  for (const lang of ['es', 'en']) {
    for (const key of keys) {
      const path = route(lang, key);
      const html = await readFile(new URL(`.${path}index.html`, out), 'utf8');
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path);
      assert.ok(html.includes(`<html lang="${lang}">`), path);
      assert.ok(html.includes('noindex, nofollow'), 'Previews must not be indexed');
      assert.ok(!html.includes('undefined') && !html.includes('[object Object]'), path);
      assert.match(html, /<meta name="description" content="[^"]{30,}">/);
      for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
        if (!href.startsWith('/') && !href.startsWith('#')) continue;
        const url = new URL(href, `http://local${path}`);
        const file = new URL(`.${url.pathname}${url.pathname.endsWith('/') ? 'index.html' : ''}`, out);
        assert.ok((await stat(file)).isFile(), `${path}: ${href}`);
        if (url.hash) {
          const target = await readFile(file, 'utf8');
          assert.ok(target.includes(`id="${url.hash.slice(1)}"`), `${path}: broken anchor ${href}`);
        }
      }
      for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
        assert.ok(src.startsWith('/'), `${path}: external image ${src}`);
        assert.ok((await stat(new URL(`.${src}`, out))).size > 0, src);
      }
    }
  }
});

test('language switch preserves the exact page, including every technique', () => {
  for (const key of keys) {
    assert.ok(render('es', key).includes(`href="${route('en', key)}" hreflang="en"`));
    assert.ok(render('en', key).includes(`href="${route('es', key)}" hreflang="es"`));
  }
  assert.throws(() => route('es', 'missing'), /Unknown route/);
});

test('contact and training links open the correct channel without promising a confirmed booking', () => {
  const home = render('es', 'home');
  assert.ok(home.includes('https://wa.me/34646352139?text='));
  assert.ok(home.includes('href="tel:+34911645198"'));
  assert.ok(home.includes('La cita queda acordada cuando el centro la confirma.'));
  const training = render('en', 'training');
  assert.ok(training.includes(encodeURIComponent('Hello, I would like information about your upcoming training activities.')));
  assert.ok(training.includes('An enquiry does not constitute enrolment.'));
  assert.equal(new URL(clinic.maps).searchParams.get('cid'), BigInt('0xdf44238842f28db6').toString());
});

test('prices, assessment exclusions and sourced review data are preserved', () => {
  const html = render('es', 'home');
  for (const text of ['234', '4,9', '60 €', '270 €', '500 €', 'No incluye tratamiento.', 'Traducción del original en inglés.', 'J.Ch424', 'Erica Esteban']) assert.ok(html.includes(text), text);
  assert.ok(render('es', 'privacy').includes('consultada el 18 de noviembre de 2026'), 'Review source date');
  assert.ok(html.includes('He&#39;s by far one of the best acupuncturist I&#39;ve been to'));
  assert.ok(html.includes('I can&#39;t speak highly enough of Dr. Shim and his acupuncture clinic.'));
  assert.ok(!html.includes('Adrien Coutant'));
  assert.ok(!html.includes('garantizamos') && !html.includes('curación'));
  assert.ok(render('en', 'home').includes('confirm the language of your consultation'));
});

test('Google reviews follow the hero, are visible in both languages and use local fonts', () => {
  const es = render('es', 'home');
  const en = render('en', 'home');
  for (const [html, lang] of [[es, 'es'], [en, 'en']]) {
    const hero = html.indexOf('class="hero"');
    const reviews = html.indexOf('id="opiniones"');
    const problem = html.indexOf('class="section problem"');
    assert.ok(hero >= 0 && hero < reviews && reviews < problem);
    assert.match(html, /class="hero-rating-link" href="#opiniones"/);
    assert.match(html, /4[,.]9 (?:sobre 5|out of 5)/);
    assert.match(html, /234/);
    assert.match(html, /class="review-card"/);
    assert.match(html, /href="https:\/\/www\.google\.com\/maps\?cid=/);
    assert.ok(render(lang, 'privacy').includes(lang === 'es' ? '18 de noviembre de 2026' : '18 November 2026'));
    assert.ok(!html.includes('review-bottom'), 'The review footer block was removed');
    assert.match(html, /href="\/editorial\.css"/);
  }
  assert.match(es, /<p lang="en">He&#39;s by far one of the best acupuncturist/);
  assert.match(es, /<blockquote lang="es"><p>Es, con diferencia/);
  assert.match(en, /<blockquote lang="en"><p>He&#39;s by far/);
});

test('Google reviews form a carousel with the Google mark, translations and accessible controls', () => {
  assert.ok(reviews.length >= 25, 'At least 25 reviews in the carousel');
  for (const review of reviews) {
    assert.ok(['es', 'en'].includes(review.lang), review.author);
    assert.ok(review.es?.length > 20 && review.en?.length > 20, `${review.author} needs both languages`);
    assert.ok(review.stars >= 1 && review.stars <= 5, review.author);
  }
  assert.ok(!reviews.some(review => review.author === 'Adrien Coutant'));
  for (const lang of ['es', 'en']) {
    for (const key of ['home', 'treatments', 'team', 'contact', 'acupuncture']) {
      const html = render(lang, key);
      assert.equal((html.match(/class="review-card"/g) || []).length, reviews.length, `${lang}/${key}`);
      assert.equal((html.match(/id="opiniones"/g) || []).length, 1, `${lang}/${key}`);
      assert.match(html, /<div class="review-carousel" data-carousel data-autoplay>/);
      assert.match(html, /<ul class="carousel-track review-track" tabindex="0" aria-label="[^"]+">/);
      assert.match(html, /<button type="button" class="carousel-toggle" data-toggle/, 'Autoplay can be paused');
      assert.match(html, /<div class="carousel-controls" hidden>/);
      assert.match(html, /fill="#4285F4"/, 'Google logo');
      const translated = reviews.filter(review => review.lang !== lang).length;
      assert.equal((html.match(/class="quote-original"/g) || []).length, translated, `${lang}/${key} originals`);
    }
  }
});

test('the CV and the new photo of Dr. Shim are published in both languages', () => {
  for (const lang of ['es', 'en']) {
    const team = render(lang, 'team');
    assert.match(team, /<section class="section cv" id="curriculum">/);
    assert.match(team, /src="\/images\/dr-shim\.jpg"[^>]*width="991" height="1100"/);
    for (const item of [...cv.education, ...cv.career]) assert.ok(team.includes(item.place), item.place);
    for (const membership of cv.memberships[lang]) assert.ok(team.includes(membership), membership);
    assert.ok(team.includes(lang === 'es' ? 'Usamos agujas desechables.' : 'We use disposable needles.'));
    assert.ok(team.includes(lang === 'es' ? 'No implica una acreditación como médico en España.' : 'does not imply accreditation as a medical doctor in Spain'));
    const home = render(lang, 'home');
    assert.ok(home.includes(`href="${route(lang, 'team')}#curriculum"`));
    assert.match(home, /src="\/images\/dr-shim\.jpg"/);
  }
});

test('every page shows the call and WhatsApp dock with the WhatsApp logo', () => {
  for (const lang of ['es', 'en']) {
    for (const key of keys) {
      const html = render(lang, key);
      assert.match(html, /<div class="contact-dock"><a class="dock-call" href="tel:\+34911645198"/, `${lang}/${key}`);
      assert.match(html, /<a class="dock-wa" href="https:\/\/wa\.me\/34646352139\?text=[^"]+"><svg class="wa-icon"/, `${lang}/${key}`);
      assert.ok(!html.includes('mobile-contact'), `${lang}/${key}`);
      assert.ok(!/ style="/.test(html), `${lang}/${key}: inline styles are blocked by the CSP`);
    }
  }
});

test('location section includes an accessible Google map and privacy disclosure', () => {
  for (const lang of ['es', 'en']) {
    const home = render(lang, 'home');
    assert.match(home, /<iframe src="https:\/\/www\.google\.com\/maps\?q=40\.415438,-3\.6677628&amp;z=16&amp;output=embed"/);
    assert.match(home, new RegExp(`title="${lang === 'es' ? 'Mapa de Seul Acupuntura en Madrid' : 'Map showing Seul Acupuntura in Madrid'}"`));
    assert.match(home, /loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen/);
    const privacy = render(lang, 'privacy');
    assert.ok(privacy.includes('Google Maps'));
    assert.ok(privacy.includes(lang === 'es' ? 'dirección IP' : 'IP address'));
    assert.ok(!privacy.includes('embedded maps'));
  }
});

test('production metadata is absolute, localised and escaped', () => {
  const html = render('en', 'cupping', { origin: 'https://seul.example', publish: true });
  assert.ok(html.includes('<meta name="robots" content="index, follow">'));
  assert.ok(html.includes('rel="canonical" href="https://seul.example/en/cupping/"'));
  assert.ok(html.includes('hreflang="es" href="https://seul.example/ventosas/"'));
  assert.ok(html.includes('Cupping at Seul Acupuntura'));
  const legal = render('es', 'privacy', { legalName: '<script>unsafe</script>' });
  assert.ok(legal.includes('&lt;script&gt;unsafe&lt;/script&gt;'));
});

test('publication cannot accidentally enable indexing with incomplete approvals', () => {
  const result = spawnSync(process.execPath, ['scripts/build.mjs'], {
    cwd: root, encoding: 'utf8',
    env: { ...process.env, PUBLISH: '1', PUBLIC_SITE_URL: '', CF_PAGES_URL: '', VERCEL_URL: '' },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Publication blocked/);
});

test('preview server serves the root, bilingual deep links, assets and genuine 404 responses', async t => {
  const child = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(async () => {
    if (child.exitCode === null) {
      child.kill();
      await once(child, 'exit');
    }
  });
  const origin = await new Promise((resolve, reject) => {
    let text = '';
    const timeout = setTimeout(() => reject(new Error('Preview server startup timed out')), 5000);
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.stdout.on('data', data => {
      text += data;
      const match = text.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) { clearTimeout(timeout); resolve(match[0]); }
    });
    child.stderr.on('data', data => { clearTimeout(timeout); reject(new Error(data.toString())); });
  });
  for (const path of ['/', '/en/', '/en/korean-hand-acupuncture/', '/styles.css', '/editorial.css', '/fonts/alegreya-variable.ttf', '/images/equipo.jpg']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
  }
  assert.equal((await fetch(`${origin}/no-such-page/`)).status, 404);
  assert.equal((await fetch(`${origin}/en/team`, { redirect: 'manual' })).status, 308);
  assert.equal((await fetch(`${origin}/`, { method: 'POST' })).status, 405);
  assert.equal((await fetch(`${origin}/%E0%A4%A`)).status, 400);
});

test('treatment cards use the live-site photos and the home page shows every technique in a carousel', () => {
  for (const lang of ['es', 'en']) {
    const home = render(lang, 'home');
    const carousel = home.slice(home.indexOf('<div class="treatment-carousel" data-carousel>'), home.indexOf('class="section-bottom"', home.indexOf('treatment-carousel')));
    assert.ok(carousel.length > 0, 'Treatment carousel on the home page');
    assert.match(carousel, /<ul class="carousel-track treatment-track" tabindex="0" aria-label="[^"]+">/);
    for (const item of treatments) {
      assert.ok(carousel.includes(`href="${route(lang, item.id)}"`), `${lang}: ${item.id} in the carousel`);
      assert.ok(carousel.includes(`src="/images/${item.photo.file}.jpg"`), `${lang}: ${item.id} photo`);
    }
    assert.ok(!carousel.includes('data-autoplay') && !carousel.includes('data-toggle'), 'Only the reviews scroll on their own');
    const all = render(lang, 'treatments');
    assert.equal((all.match(/class="card-media"/g) || []).length, treatments.length);
    for (const item of treatments) {
      const page = render(lang, item.id);
      assert.match(page, new RegExp(`<figure><img class="[^"]*" src="/images/${item.photo.file}\\.jpg" alt="[^"]{10,}" width="${item.photo.size[0]}" height="${item.photo.size[1]}" fetchpriority="high"`), `${lang}/${item.id} hero photo`);
      assert.equal((page.match(/class="carousel-slide"><a class="treatment-card"/g) || []).length, treatments.length - 1, `${lang}/${item.id} other techniques`);
    }
  }
});

test('the three starting questions link to their answers', () => {
  for (const lang of ['es', 'en']) {
    const home = render(lang, 'home');
    for (const target of ['faq-2', 'faq-3', 'tarifas']) {
      assert.ok(home.includes(`<li><a href="#${target}">`), `${lang}: link to ${target}`);
      assert.ok(home.includes(`id="${target}"`), `${lang}: target ${target}`);
    }
  }
});
