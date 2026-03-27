const fs = require('fs');
const path = require('path');
const dirs = ['.', 'es', 'en', 'fr'];

// Match from the container all the way to </nav> to safely swallow the broken unclosed tags
const oldSelectorRegex1 = /<li role="none" class="lang-dropdown-container">[\s\S]*?<\/ul>\s*<\/nav>/g;
const oldSelectorRegex2 = /<div class="lang-dropdown-container">[\s\S]*?<\/ul>\s*<\/nav>/g;

const FLAG_CA_IMG = '<img src="assets/cat-flag.svg" alt="CAT" style="width:1.2em; height:auto; border-radius:2px; box-shadow:0 0 2px rgba(0,0,0,0.2); vertical-align:middle;">';
const FLAG_ES = '\ud83c\uddea\ud83c\uddf8';
const FLAG_GB = '\ud83c\uddec\ud83c\udde7';
const FLAG_FR = '\ud83c\uddeb\ud83c\uddf7';

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) return;
  fs.readdirSync(dirPath).forEach(file => {
    if (file.endsWith('.html')) {
      const filePath = path.join(dirPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      const fileName = file;
      const isEs = dir === 'es';
      const isEn = dir === 'en';
      const isFr = dir === 'fr';
      const isCa = dir === '.';
      
      const currentFlag = isEs ? FLAG_ES : (isEn ? FLAG_GB : (isFr ? FLAG_FR : FLAG_CA_IMG));
      const activeText = isEs ? 'ES' : (isEn ? 'EN' : (isFr ? 'FR' : 'CA'));
      const isPrivacitat = fileName === 'privacitat.html';
      
      const dropdownHTML = `${isPrivacitat ? '<div class="lang-dropdown-container">' : '<li role="none" class="lang-dropdown-container">'}
  <button class="lang-btn" aria-haspopup="true" aria-expanded="false" style="display:flex; align-items:center;">
    <span class="lang-flag" style="display:flex; align-items:center;">${currentFlag}</span> <span style="margin:0 0.4rem;">${activeText}</span> <span style="font-size:0.7em;">\u25BC</span>
  </button>
  <ul class="lang-menu">
    <li><a href="/${fileName}" class="lang-option ${isCa ? 'active' : ''}"><span style="display:flex; align-items:center; width:1.5em">${FLAG_CA_IMG}</span> Catal\u00e0</a></li>
    <li><a href="/es/${fileName}" class="lang-option ${isEs ? 'active' : ''}"><span style="font-size:1.2em; width:1.25em; text-align:center;">${FLAG_ES}</span> Castellano</a></li>
    <li><a href="/en/${fileName}" class="lang-option ${isEn ? 'active' : ''}"><span style="font-size:1.2em; width:1.25em; text-align:center;">${FLAG_GB}</span> English</a></li>
    <li><a href="/fr/${fileName}" class="lang-option ${isFr ? 'active' : ''}"><span style="font-size:1.2em; width:1.25em; text-align:center;">${FLAG_FR}</span> Fran\u00e7ais</a></li>
  </ul>
${isPrivacitat ? '</div>' : '</li>'}
    </nav>`;

      content = content.replace(oldSelectorRegex1, dropdownHTML);
      content = content.replace(oldSelectorRegex2, dropdownHTML);
      
      fs.writeFileSync(filePath, content);
    }
  });
});
console.log('Language dropdown fully restored successfully.');
