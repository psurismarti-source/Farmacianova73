const fs = require('fs');

const filesToUpdate = [
  'index.html', 'sobre.html', 'blog.html', 'b2b.html', 'contacte.html', 'privacitat.html', 'main.js'
];

for (let file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Update phone numbers
    content = content.replace(/\+34XXXXXXXXX/g, '+34931352170');
    content = content.replace(/\+34 XXX XXX XXX/g, '+34 931 35 21 70');
    // For placeholders like placeholder="6XX XXX XXX" in forms:
    content = content.replace(/placeholder="6XX XXX XXX"/g, 'placeholder="Ej. 600 000 000"');
    
    // Update emails
    content = content.replace(/info@farmanova73\.cat/g, 'farmanova@farmanova73.cat');
    
    fs.writeFileSync(file, content);
  }
}
