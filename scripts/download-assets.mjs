import { readFile, mkdir, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const assets = JSON.parse(await readFile(new URL('src/assets.json', root), 'utf8'));
await mkdir(new URL('public/images/', root), { recursive: true });
for (const asset of assets) {
  const filename = asset.source.split('/').at(-1);
  const response = await fetch(`${asset.source}/v1/fit/w_1600,h_1200,q_85/${filename}`);
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
    throw new Error(`Photo download failed: ${asset.file} (${response.status})`);
  }
  const data = Buffer.from(await response.arrayBuffer());
  await writeFile(new URL(`public/images/${asset.file}`, root), data);
  console.log(`${asset.file}: ${Math.round(data.length / 1024)} KB`);
}
