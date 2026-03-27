const fs = require('fs');
const path = require('path');
const dirs = ['.', 'es', 'en', 'fr'];

// Notice: .*? matches any character for the flag/span contents.
// Fran.ais perfectly matches Français without encoding bugs.
const garbageRegex = /(<\/li>|<\/div>)(?:\n\s*<li><a href="\/es\/[^"]+" class="lang-option "><span>.*?<\/span> Castellano<\/a><\/li>\n\s*<li><a href="\/en\/[^"]+" class="lang-option "><span>.*?<\/span> English<\/a><\/li>\n\s*<li><a href="\/fr\/[^"]+" class="lang-option "><span>.*?<\/span> Fran.ais<\/a><\/li>\n\s*<\/ul>\n\s*(?:<\/li>|<\/div>))+/g;

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) return;
  fs.readdirSync(dirPath).forEach(file => {
    if (file.endsWith('.html')) {
      const filePath = path.join(dirPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      let previous = "";
      while (content !== previous && garbageRegex.test(content)) {
        previous = content;
        content = content.replace(garbageRegex, '$1');
      }
      
      fs.writeFileSync(filePath, content);
    }
  });
});
console.log('Final specific regex cleanup executed');
