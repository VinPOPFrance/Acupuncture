import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { routes, treatments } from '../src/content.mjs';
import { render, route, notFound } from '../src/templates.mjs';

const root = new URL('../', import.meta.url);
const out = new URL('dist/', root);
const publish = process.env.PUBLISH === '1';
const configuredOrigin = process.env.PUBLIC_SITE_URL || process.env.CF_PAGES_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
let origin = '';
if (configuredOrigin) {
  const url = new URL(configuredOrigin);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('PUBLIC_SITE_URL must be an HTTPS origin, without a path, credentials or query.');
  }
  origin = url.origin;
}
const settings = {
  publish, origin,
  legalName: process.env.LEGAL_NAME || '',
  taxId: process.env.LEGAL_TAX_ID || '',
  hostingName: process.env.HOSTING_NAME || '',
  privacyDetails: process.env.PRIVACY_DETAILS_ES || '',
};
if (publish) {
  for (const name of ['PUBLIC_SITE_URL', 'LEGAL_NAME', 'LEGAL_TAX_ID', 'HOSTING_NAME', 'PRIVACY_DETAILS_ES', 'PRIVACY_DETAILS_EN']) {
    if (!process.env[name]?.trim()) throw new Error(`Publication blocked: ${name} is required. See README.`);
  }
  if (process.env.CONTENT_APPROVED !== '1') throw new Error('Publication blocked: set CONTENT_APPROVED=1 after the practice validates prices, photos, reviews and health copy.');
}

await mkdir(out, { recursive: true });
await cp(new URL('public/', root), out, { recursive: true });
const keys = [...Object.keys(routes), ...treatments.map(t => t.id)];
for (const lang of ['es', 'en']) {
  for (const key of keys) {
    const folder = new URL(`.${route(lang, key)}`, out);
    await mkdir(folder, { recursive: true });
    await writeFile(new URL('index.html', folder), render(lang, key, {
      ...settings, privacyDetails: process.env[`PRIVACY_DETAILS_${lang.toUpperCase()}`] || '',
    }));
  }
}
await writeFile(new URL('404.html', out), notFound());
const urls = keys.flatMap(key => ['es', 'en'].map(lang => origin + route(lang, key)));
await writeFile(new URL('sitemap.xml', out), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin ? urls.map(url => `<url><loc>${url}</loc></url>`).join('') : ''}</urlset>`);
await writeFile(new URL('robots.txt', out), publish ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
const headers = await readFile(new URL('src/headers.txt', root), 'utf8');
await writeFile(new URL('_headers', out), `${headers}${publish ? '' : '\n  X-Robots-Tag: noindex, nofollow\n'}`);
const redirects = {
  '/quienessomos': '/equipo/', '/cursos': '/formacion/', '/galeria': '/equipo/',
  '/descripciontratamiento': '/tratamientos/', '/services-1': '/tratamientos/',
};
await writeFile(new URL('_redirects', out), Object.entries(redirects).map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n');
console.log(`Built ${keys.length * 2} pages + 404 (${publish ? 'production' : 'preview: noindex'}).`);
