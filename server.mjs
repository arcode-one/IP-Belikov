import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, 'data');
const leadsFile = path.join(dataDir, 'leads.json');
const port = Number(process.env.PROTOTYPE_PORT || 4187);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.otf': 'font/otf', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.ico': 'image/x-icon' };

function readBody(req, limit = 10_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

// Заявки пока пишутся в data/leads.json. На WordPress они будут уходить на zakaz@easy-wood.ru.
async function handleLead(req, res) {
  let body;
  try { body = JSON.parse(await readBody(req)); } catch { json(res, 400, { ok: false }); return; }
  const str = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
  const lead = {
    name: str(body.name, 100),
    email: str(body.email, 120),
    phone: str(body.phone, 20),
    message: str(body.message, 2000),
    createdAt: new Date().toISOString(),
  };
  // Скрытое поле заполняют только боты: отвечаем «ок», но ничего не сохраняем
  if (str(body.website, 200)) { json(res, 200, { ok: true }); return; }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
  const phoneOk = lead.phone.replace(/\D/g, '').length === 11;
  // Нужны имя, согласие и хотя бы один способ связи
  if (lead.name.length < 2 || !(emailOk || phoneOk) || body.consent !== true) {
    json(res, 422, { ok: false });
    return;
  }
  await mkdir(dataDir, { recursive: true });
  let leads = [];
  try { leads = JSON.parse(await readFile(leadsFile, 'utf8')); } catch {}
  leads.push(lead);
  await writeFile(leadsFile, JSON.stringify(leads, null, 2));
  console.log(`Новая заявка: ${lead.name}, ${lead.phone || lead.email}`);
  json(res, 200, { ok: true });
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/lead') {
      if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }
      await handleLead(req, res);
      return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const pathname = decodeURIComponent(url.pathname);
    const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root, filename);
    // Не отдаём заявки, служебные файлы и всё, что начинается с точки (.git и т.п.)
    const parts = relative.split(path.sep);
    const blocked = parts.some((part) => part.startsWith('.')) || parts[0] === 'data' || filename.endsWith('.mjs');
    if (!filename.startsWith(root + path.sep) || blocked) { res.writeHead(403); res.end(); return; }
    const data = await readFile(filename);
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { if (!res.headersSent) { res.writeHead(404); res.end('File not found'); } }
}).listen(port, '127.0.0.1', () => console.log(`Сайт: http://localhost:${port}`));
