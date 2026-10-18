import { readFile, readdir, stat } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';

const outputDir = resolve(process.argv[2] ?? 'dist');
const problems = [];
const existenceCache = new Map();
let checkedLinks = 0;
let scannedFiles = 0;

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) yield* walk(file);
    else if (entry.isFile()) yield file;
  }
}

async function existsAsFile(path) {
  if (!existenceCache.has(path)) {
    existenceCache.set(
      path,
      stat(path)
        .then((info) => info.isFile())
        .catch((error) => {
          if (error.code === 'ENOENT') return false;
          throw error;
        }),
    );
  }
  return existenceCache.get(path);
}

function displayPath(file) {
  return relative(outputDir, file).split(sep).join('/');
}

async function main() {
  const indexHtml = await readFile(resolve(outputDir, 'index.html'), 'utf8');
  const canonicalTag = indexHtml.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0];
  const canonicalUrl = canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
  if (!canonicalUrl) throw new Error('В dist/index.html не найден canonical URL.');

  const site = new URL(canonicalUrl);
  const basePath = site.pathname.replace(/\/$/, '');

  async function check(raw, source) {
    const value = raw.trim().replaceAll('&amp;', '&');
    if (!value || value.startsWith('#')) return;

    let target;
    try {
      target = new URL(value, new URL(basePath + '/' + displayPath(source), site.origin));
    } catch {
      problems.push(displayPath(source) + ': некорректный URL ' + JSON.stringify(raw));
      return;
    }
    if (!['http:', 'https:'].includes(target.protocol) || target.origin !== site.origin) return;

    checkedLinks++;
    const pathname = target.pathname;
    if (basePath && pathname !== basePath && !pathname.startsWith(basePath + '/')) {
      problems.push(displayPath(source) + ': ' + raw + ' ведёт за пределы адреса сайта ' + basePath + '/');
      return;
    }

    let localPath;
    try {
      localPath = decodeURIComponent(pathname.slice(basePath.length)).replace(/^\/+/, '');
    } catch {
      problems.push(displayPath(source) + ': некорректная кодировка URL ' + JSON.stringify(raw));
      return;
    }

    const file = resolve(outputDir, localPath);
    if (file !== outputDir && !file.startsWith(outputDir + sep)) {
      problems.push(displayPath(source) + ': ' + raw + ' выходит за пределы dist/');
      return;
    }

    const candidates = pathname.endsWith('/')
      ? [resolve(file, 'index.html')]
      : [file, resolve(file, 'index.html')];
    for (const candidate of candidates) {
      if (await existsAsFile(candidate)) return;
    }
    problems.push(displayPath(source) + ': ' + raw + ' → файл не найден в dist/');
  }

  for await (const file of walk(outputDir)) {
    const name = displayPath(file);
    if (name.endsWith('.html')) {
      scannedFiles++;
      const html = await readFile(file, 'utf8');
      const attributes = /\b(href|src|poster|action|content|srcset|imagesrcset)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
      for (const match of html.matchAll(attributes)) {
        const attribute = match[1].toLowerCase();
        const value = match[2] ?? match[3] ?? match[4];
        if (attribute === 'content' && !/^(?:\/|\.\/|\.\.\/|https?:\/\/)/i.test(value)) continue;
        if (attribute === 'srcset' || attribute === 'imagesrcset') {
          for (const candidate of value.split(',')) {
            const url = candidate.trim().split(/\s+/)[0];
            if (url) await check(url, file);
          }
        } else {
          await check(value, file);
        }
      }
    } else if (name.endsWith('.css')) {
      scannedFiles++;
      const css = await readFile(file, 'utf8');
      const urls = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi;
      for (const match of css.matchAll(urls)) {
        await check(match[1] ?? match[2] ?? match[3], file);
      }
    } else if (name.endsWith('.webmanifest')) {
      scannedFiles++;
      const manifest = JSON.parse(await readFile(file, 'utf8'));
      if (manifest.start_url) await check(manifest.start_url, file);
      for (const icon of manifest.icons ?? []) {
        if (icon.src) await check(icon.src, file);
      }
    } else if (name.endsWith('.xml')) {
      scannedFiles++;
      const xml = await readFile(file, 'utf8');
      for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        await check(match[1], file);
      }
    } else if (name === 'robots.txt') {
      scannedFiles++;
      const robots = await readFile(file, 'utf8');
      for (const match of robots.matchAll(/^Sitemap:\s*(\S+)/gim)) {
        await check(match[1], file);
      }
    }
  }

  if (problems.length) {
    for (const problem of problems) console.error('✗ ' + problem);
    console.error('Найдено недоступных локальных ссылок: ' + problems.length + '.');
    process.exitCode = 1;
  } else {
    console.log('Проверено ' + checkedLinks + ' локальных ссылок в ' + scannedFiles + ' файлах dist/: все цели существуют.');
  }
}

main().catch((error) => {
  console.error('Не удалось проверить ссылки: ' + error.message);
  process.exitCode = 1;
});
