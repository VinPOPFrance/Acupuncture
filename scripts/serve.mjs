import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml' };
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }); res.end('Method not allowed'); return;
    }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    try {
      if ((await stat(file)).isDirectory()) {
        if (!pathname.endsWith('/')) {
          res.writeHead(308, { Location: `${encodeURI(pathname)}/` }); res.end(); return;
        }
        file = resolve(file, 'index.html');
      }
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
      const html = await readFile(resolve(root, '404.html'));
      res.writeHead(404, { 'Content-Type': types['.html'] });
      res.end(req.method === 'HEAD' ? undefined : html);
    }
  } catch (error) {
    console.error('Preview request failed:', error.message);
    res.writeHead(error instanceof URIError ? 400 : 500);
    res.end(error instanceof URIError ? 'Bad request' : 'Preview server error');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${server.address().port}`));
