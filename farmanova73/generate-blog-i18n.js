/* eslint-disable no-console */
/**
 * Generate i18n blog post HTML files from a combined text dump.
 *
 * Input format: blocks separated by lines like:
 *   =====FILE:04_Acne_Castellano.docx=====
 * followed by the DOCX-to-text content.
 *
 * Usage:
 *   node generate-blog-i18n.js "/absolute/path/to/extracted.txt"
 */

const fs = require('fs');
const path = require('path');

const SLUG_BY_KEY = {
  Conjuntivitis: 'conjuntivitis-guia-rapida',
  Acne: 'adeu-acne',
  Colesterol: 'colesterol-a-ratlla',
  FetgeGras: 'fetge-gras',
  RecetaMedica: 'recepta-medica',
  Menopausa: 'menopausa-viatge',
  Tos: 'tens-tos-guia',
};

const KEY_BY_FILENAME = [
  ['Conjuntivitis', 'Conjuntivitis'],
  ['Acne', 'Acne'],
  ['Colesterol', 'Colesterol'],
  ['FetgeGras', 'FetgeGras'],
  ['RecetaMedica', 'RecetaMedica'],
  ['Menopausa', 'Menopausa'],
  ['Tos', 'Tos'],
];

const LANG_BY_FILENAME = [
  ['Castellano', 'es'],
  ['English', 'en'],
  ['Francais', 'fr'],
];

function inferKey(fileName) {
  for (const [needle, key] of KEY_BY_FILENAME) {
    if (fileName.includes(needle)) return key;
  }
  return null;
}

function inferLang(fileName) {
  for (const [needle, lang] of LANG_BY_FILENAME) {
    if (fileName.includes(needle)) return lang;
  }
  return null;
}

function escapeHtml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function renderContent(lines) {
  const out = [];
  let inList = false;

  const flushList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };

  const isBullet = (l) => /^\s*[•·]\s+/.test(l);
  const stripBullet = (l) => l.replace(/^\s*[•·]\s+/, '').trim();
  const isNumberHeading = (l) => /^\s*\d+\.\s+/.test(l);

  for (const raw of lines) {
    const line = raw.replace(/\r/g, '').trim();
    if (!line) {
      flushList();
      continue;
    }

    if (isBullet(line)) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${escapeHtml(stripBullet(line))}</li>`);
      continue;
    }

    flushList();

    if (isNumberHeading(line)) {
      out.push(`<h3>${escapeHtml(line)}</h3>`);
      continue;
    }

    // Keep emoji and quotes as-is; just escape HTML.
    out.push(`<p>${escapeHtml(line)}</p>`);
  }

  flushList();
  return out.join('\n          ');
}

function buildHtml({ lang, slug, title, intro, bodyHtml }) {
  const cssPath = '../../styles.css';
  const jsPath = '../../main.js';
  const homePath = '../index.html';
  const blogIndexPath = '../blog.html';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} · Blog · Farmàcia Nova 73</title>
  <meta name="description" content="${escapeHtml(intro).slice(0, 155)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssPath}">
  <style>
    .hero{background:linear-gradient(135deg,var(--color-primary-d),var(--color-primary) 60%,rgba(232,160,32,.35));color:#fff;padding:calc(var(--nav-h) + 3rem) 0 3rem}
    .hero .meta{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;font-size:.82rem;color:rgba(255,255,255,.75);margin-bottom:1rem}
    .hero h1{font-family:var(--font-display);font-size:clamp(2rem,5vw,3.25rem);font-weight:900;line-height:1.12;margin-bottom:.75rem;max-width:860px}
    .hero p{font-size:1.1rem;color:rgba(255,255,255,.85);max-width:720px;line-height:1.7}
    .body{padding:var(--space-xl) 0}
    .inner{max-width:760px;margin:0 auto}
    .inner h2,.inner h3{font-family:var(--font-display);color:var(--color-primary-d)}
    .inner h2{font-size:1.55rem;margin:2rem 0 .75rem}
    .inner h3{font-size:1.2rem;margin:1.6rem 0 .5rem}
    .inner p{color:var(--color-text-m);margin-bottom:1rem;line-height:1.85}
    .inner ul{margin:.5rem 0 1rem 1.35rem}
    .inner ul li{color:var(--color-text-m);margin-bottom:.4rem;line-height:1.7}
    .callout{background:var(--color-primary-l);border-left:3px solid var(--color-primary);border-radius:0 var(--radius-sm) var(--radius-sm) 0;padding:1rem 1.25rem;margin:1.25rem 0}
    .callout p{margin:0;color:var(--color-primary-d);font-weight:600}
    .back{display:inline-flex;align-items:center;gap:.35rem;font-weight:700;color:var(--color-primary)}
    .back:hover{color:var(--color-primary-d)}
  </style>
</head>
<body>
  <header class="site-header" id="site-header">
    <nav class="nav-container">
      <button class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <a href="${homePath}" class="logo" aria-label="Farmàcia Nova 73">
        <img src="../../assets/logo-icon.png" alt="Logo" class="logo-icon-img">
        <div class="logo-text"><span class="logo-name">Farmàcia Nova 73</span><span class="logo-tagline">La Garriga</span></div>
      </a>
      <div class="nav-spacer"></div>
      <div class="nav-right">
        <a href="../contacte.html" class="nav-contacte-desktop nav-link">Contacte</a>
        <a href="../reservar.html" class="nav-cta">Reserva cita</a>
      </div>
      <ul class="nav-menu" id="nav-menu" role="menu">
        <li><a href="../sobre.html" class="nav-link" role="menuitem">Sobre</a></li>
        <li><a href="../serveis.html" class="nav-link" role="menuitem">Serveis</a></li>
        <li><a href="../blog.html" class="nav-link active" role="menuitem">Blog</a></li>
        <li><a href="../b2b.html" class="nav-link" role="menuitem">B2B</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <div class="meta"><span>Farmanova 73</span></div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(intro)}</p>
      </div>
    </section>

    <section class="body">
      <div class="container">
        <div class="inner">
          <a class="back" href="${blogIndexPath}">← Blog</a>

          ${bodyHtml}
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom" style="padding:1.5rem 0;">
        <p>© 2025 Farmàcia Nova 73 · La Garriga · Tots els drets reservats</p>
        <div class="footer-legal">
          <a href="../privacitat.html">Privacitat</a>
          <a href="${blogIndexPath}">← Blog</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="${jsPath}"></script>
</body>
</html>
`;
}

function parseBlocks(input) {
  const lines = input.split('\n');
  const blocks = [];
  let current = null;

  const headerRe = /^=====FILE:(.+)=====$/;
  for (const line of lines) {
    const m = line.match(headerRe);
    if (m) {
      if (current) blocks.push(current);
      current = { fileName: m[1], lines: [] };
      continue;
    }
    if (!current) continue;
    current.lines.push(line);
  }
  if (current) blocks.push(current);
  return blocks;
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Missing input file path');
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const blocks = parseBlocks(raw);

  const written = [];

  for (const b of blocks) {
    const lang = inferLang(b.fileName);
    const key = inferKey(b.fileName);
    if (!lang || !key) continue;

    const slug = SLUG_BY_KEY[key];
    if (!slug) continue;

    const cleaned = b.lines.map((l) => l.replace(/\t/g, ' ').replace(/\u00A0/g, ' '));
    const nonEmpty = cleaned.filter((l) => l.trim().length > 0);
    if (nonEmpty.length < 2) continue;

    const title = nonEmpty[0].trim();
    const intro = nonEmpty[1].trim();
    const bodyLines = nonEmpty.slice(2);
    const bodyHtml = renderContent(bodyLines);

    const html = buildHtml({ lang, slug, title, intro, bodyHtml });
    const outPath = path.join(__dirname, lang, 'blog', `${slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    written.push(outPath);
  }

  console.log(`Generated ${written.length} files:`);
  for (const p of written) console.log(' - ' + p);
}

main();

