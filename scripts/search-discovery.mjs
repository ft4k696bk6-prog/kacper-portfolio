import { execFileSync } from 'node:child_process';

// Use the public canonical host, never a preview or a user-supplied destination.
const origin = 'https://bernecki.dev';
const key = 'b622567a17030d37de8f641811455efd';
const get = (url) => execFileSync('curl', ['--fail', '--silent', '--show-error', '--max-time', '30', url], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
const xml = get(`${origin}/sitemap.xml`);
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!urls.length || urls.some(url => new URL(url).origin !== origin)) throw new Error('Invalid sitemap host or empty sitemap');
const robots = get(`${origin}/robots.txt`);
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) throw new Error('Sitemap missing from robots.txt');
const titles = new Set();
for (const url of urls) {
  const html = get(url);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title || titles.has(title)) throw new Error(`Missing or duplicate title: ${url}`);
  titles.add(title);
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  if (canonical?.replace(/\/$/, '') !== url.replace(/\/$/, '')) throw new Error(`Canonical mismatch: ${url}`);
  if (/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html)) throw new Error(`Noindex: ${url}`);
  if ((html.match(/<h1\b/g) || []).length !== 1) throw new Error(`Expected one H1: ${url}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(match[1]);
  console.log(`OK ${url}`);
}
if (process.argv.includes('--submit')) {
  if (get(`${origin}/${key}.txt`).trim() !== key) throw new Error('IndexNow key mismatch');
  const body = JSON.stringify({host:'bernecki.dev', key, keyLocation:`${origin}/${key}.txt`, urlList:urls});
  const status = execFileSync('curl', ['--silent','--show-error','--max-time','30','--output','/dev/null','--write-out','%{http_code}','--header','Content-Type: application/json','--data-binary','@-','https://api.indexnow.org/indexnow'], {input:body,encoding:'utf8'});
  if (!['200','202'].includes(status)) throw new Error(`IndexNow rejected request: ${status}`);
  console.log(`IndexNow: ${status}; ${urls.length} URLs submitted. This does not confirm indexing.`);
}
