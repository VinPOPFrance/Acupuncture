import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { routes, treatments, clinic } from '../src/content.mjs';
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
      for (const [, src] of html.matchAll(/src="([^"]+)"/g)) {
        assert.ok(src.startsWith('/'), `${path}: external asset ${src}`);
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
  for (const text of ['232', '4,9', '60 €', '270 €', '500 €', 'No incluye tratamiento.', '15 de octubre de 2026', 'Traducción del original en inglés.', 'J.Ch424', 'Erica Esteban']) assert.ok(html.includes(text), text);
  assert.ok(html.includes("He's by far one of the best acupuncturist I've been to…"));
  assert.ok(html.includes("I can't speak highly enough of Dr. Shim and his acupuncture clinic."));
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
    assert.match(html, /232/);
    assert.match(html, /class="review-card"/);
    assert.match(html, /href="https:\/\/www\.google\.com\/maps\?cid=/);
    assert.ok(html.includes(lang === 'es' ? '15 de octubre de 2026' : '15 October 2026'));
    assert.match(html, /href="\/editorial\.css"/);
  }
  assert.match(es, /lang="en">He's by far one of the best acupuncturist I've been to…/);
  assert.match(es, /lang="es">«Es, con diferencia/);
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
