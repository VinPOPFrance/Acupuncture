// Wraps the static site of dist/ into the Wix Astro project of wix/ (Wix Headless migration, 2026-11-19).
// Run `npm run build` first. Each dist/<route>/index.html becomes wix/src/pages/<route>/index.astro, which
// returns that HTML unchanged; styles, scripts, fonts and images go to wix/public/. robots.txt and
// sitemap.xml are left out (Wix serves its own), as are _headers and _redirects (Cloudflare only; the
// redirects live in wix/astro.config.mjs). Generated folders are rebuilt from scratch on every run.
import { readdir, readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const wix = new URL('wix/', root);
// google-tag.js is left out too: on Wix hosting, Wix injects the site's own Google Ads integration
// (AW-829553432, Wix marketing integrations, consent denied by default) and it sends its own page_view.
// Measured on the preview 2026-11-19: with both tags, every visit was counted twice. If that Wix integration
// is ever disconnected, remove this exclusion and the strip in fix() so the site's own tag comes back.
const skip = new Set(['robots.txt', 'sitemap.xml', '_headers', '_redirects', 'google-tag.js']);
// Wix hosting answers /acupuntura and redirects /acupuntura/ to it: internal links, canonical, hreflang and
// og:url lose the trailing slash so no click or crawler goes through that redirect. The root "/" stays.
const fix = html => html
  .replace(/<script src="\/google-tag\.js"[^>]*><\/script>/g, '')
  .replace(/(href|content)="((?:https:\/\/[^"\/]+)?\/[^"#?]*[^"#?\/])\/((?:[#?][^"]*)?)"/g, '$1="$2$3"');

for (const dir of ['public/', 'src/pages/', 'src/site/']) {
  await rm(new URL(dir, wix), { recursive: true, force: true });
  await mkdir(new URL(dir, wix), { recursive: true });
}

const pages = [];
async function walk(rel) {
  for (const entry of await readdir(new URL(rel, dist), { withFileTypes: true })) {
    const path = rel + entry.name;
    if (entry.isDirectory()) { await walk(path + '/'); continue; }
    if (!rel && skip.has(entry.name)) continue;
    if (entry.name.endsWith('.html')) pages.push(path);
    else {
      await mkdir(new URL('public/' + rel, wix), { recursive: true });
      await cp(new URL(path, dist), new URL('public/' + path, wix));
    }
  }
}
await walk('');

for (const page of pages) {
  // index.html → index.astro in the same folder; 404.html → 404.astro.
  const target = page.replace(/\.html$/, '.astro');
  await mkdir(new URL('src/site/' + page.replace(/[^/]+$/, ''), wix), { recursive: true });
  await mkdir(new URL('src/pages/' + target.replace(/[^/]+$/, ''), wix), { recursive: true });
  // Astro writes its own doctype; the page keeps everything after it.
  const html = fix((await readFile(new URL(page, dist), 'utf8')).replace(/^<!doctype html>/i, ''));
  await writeFile(new URL('src/site/' + page, wix), html);
  const depth = target.split('/').length - 1;
  const site = '../'.repeat(depth + 1) + 'site/' + page;
  await writeFile(new URL('src/pages/' + target, wix),
    `---\nimport html from '${site}?raw';\n${page === '404.html' ? 'Astro.response.status = 404;\n' : ''}---\n<Fragment set:html={html} />\n`);
}
console.log(`Wix project: ${pages.length} pages wrapped, assets copied to wix/public/.`);
