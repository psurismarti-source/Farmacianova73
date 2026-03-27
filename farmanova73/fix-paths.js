const fs = require('fs');
const path = require('path');
const dirs = ['es', 'en', 'fr'];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) return;
  
  fs.readdirSync(dirPath).forEach(file => {
    if (file.endsWith('.html')) {
      let content = fs.readFileSync(path.join(dirPath, file), 'utf8');
      
      // Fix assets
      content = content.replace(/(src|href)="assets\//g, '$1="../assets/');
      content = content.replace(/(src|href)="\.\/assets\//g, '$1="../assets/');
      
      // Fix stylesheets and scripts
      content = content.replace(/href="styles\.css"/g, 'href="../styles.css"');
      content = content.replace(/src="main\.js"/g, 'src="../main.js"');
      
      // Fix language selector active states for the specific folder
      // E.g., if we're in /es/, the ES link gets font-weight:700
      if (dir === 'es') {
        content = content.replace(/<a href="\/es\/([^"]+)" style="color:var\(--color-text-m\); text-decoration:none;">ES<\/a>/g, '<a href="/es/$1" style="font-weight:700; color:var(--color-primary-d); text-decoration:underline;" aria-current="page">ES</a>');
        content = content.replace(/<a href="\/([^"]+)" style="font-weight:700; color:var\(--color-primary-d\); text-decoration:underline;" aria-current="page">CA<\/a>/g, '<a href="/$1" style="color:var(--color-text-m); text-decoration:none;">CA</a>');
      } else if (dir === 'en') {
        content = content.replace(/<a href="\/en\/([^"]+)" style="color:var\(--color-text-m\); text-decoration:none;">EN<\/a>/g, '<a href="/en/$1" style="font-weight:700; color:var(--color-primary-d); text-decoration:underline;" aria-current="page">EN</a>');
        content = content.replace(/<a href="\/([^"]+)" style="font-weight:700; color:var\(--color-primary-d\); text-decoration:underline;" aria-current="page">CA<\/a>/g, '<a href="/$1" style="color:var(--color-text-m); text-decoration:none;">CA</a>');
      } else if (dir === 'fr') {
        content = content.replace(/<a href="\/fr\/([^"]+)" style="color:var\(--color-text-m\); text-decoration:none;">FR<\/a>/g, '<a href="/fr/$1" style="font-weight:700; color:var(--color-primary-d); text-decoration:underline;" aria-current="page">FR</a>');
        content = content.replace(/<a href="\/([^"]+)" style="font-weight:700; color:var\(--color-primary-d\); text-decoration:underline;" aria-current="page">CA<\/a>/g, '<a href="/$1" style="color:var(--color-text-m); text-decoration:none;">CA</a>');
      }

      // Also ensure lang selector home links like href="/index.html" match properly
      content = content.replace(/href="\/([^"]+\.html)"/g, 'href="/$1"'); // keeps it the same but safely
      
      fs.writeFileSync(path.join(dirPath, file), content);
    }
  });
});

console.log('Fixed paths and active language states in es/, en/, fr/');
