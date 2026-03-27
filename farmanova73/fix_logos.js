const fs = require('fs');
const files = ['index.html', 'sobre.html', 'blog.html', 'b2b.html', 'contacte.html', 'privacitat.html'];
const cssFile = 'styles.css';

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Revert header logo
  content = content.replace(
    /<a href="index.html" class="logo"( aria-label="Farmàcia Nova 73 - Inici")?>\s*<img src="assets\/logo\.png" alt="Farmàcia Nova 73 - farmanova 73" class="logo-img">\s*<\/a>/,
    `<a href="index.html" class="logo"$1>
        <img src="assets/logo-icon.png" alt="Logo" class="logo-icon-img">
        <div class="logo-text">
          <span class="logo-name">Farmàcia Nova 73</span>
          <span class="logo-tagline">La Garriga</span>
        </div>
      </a>`
  );
  // Revert header logo for ones without aria-label
  content = content.replace(
    /<a href="index.html" class="logo">\s*<img src="assets\/logo\.png" alt="Farmàcia Nova 73 - farmanova 73" class="logo-img">\s*<\/a>/,
    `<a href="index.html" class="logo">
        <img src="assets/logo-icon.png" alt="Logo" class="logo-icon-img">
        <div class="logo-text">
          <span class="logo-name">Farmàcia Nova 73</span>
          <span class="logo-tagline">La Garriga</span>
        </div>
      </a>`
  );
  
  // Revert footer logo
  content = content.replace(
    /<a href="index.html" class="footer-logo" aria-label="Farmàcia Nova 73">\s*<img src="assets\/logo\.png" alt="Farmàcia Nova 73" class="footer-logo-img">\s*<\/a>/,
    `<a href="index.html" class="footer-logo" aria-label="Farmàcia Nova 73">
            <img src="assets/logo-icon.png" alt="Logo" class="footer-logo-img"> Farmàcia Nova 73
          </a>`
  );
  fs.writeFileSync(file, content);
}

// Fix CSS
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(
/\.logo-img \{\n\s*height: 38px;\n\s*width: auto;\n\s*display: block;\n\}/g,
`.logo-icon-img {
  height: 28px;
  width: auto;
  display: block;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--color-primary-d);
}

.logo-tagline {
  font-size: 0.7rem;
  color: var(--color-text-m);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}`
);
css = css.replace(
  /\.footer-logo-img \{\n\s*height: 48px;\n\s*width: auto;\n\s*display: block;\n\s*filter: brightness\(0\) invert\(1\);\n\}/,
  `.footer-logo-img {
  height: 24px;
  width: auto;
  display: block;
  /* El icono usará brightness(0) invert(1) para volverse blanco puro */
  filter: brightness(0) invert(1);
}`
);

fs.writeFileSync(cssFile, css);

