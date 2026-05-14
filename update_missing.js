const fs = require('fs');
const path = require('path');

const dir = './';
const files = ['404.html', 'login.html', 'register.html'];

const indexContent = fs.readFileSync('index.html', 'utf8');
const headerMatch = indexContent.match(/<header[\s\S]*?<\/header>/i);
const footerMatch = indexContent.match(/<footer[\s\S]*?<\/footer>/i);

const newHeader = headerMatch[0];
const newFooter = footerMatch[0];

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!/<header/i.test(content)) {
        content = content.replace(/(<body[^>]*>)/i, `$1\n${newHeader}`);
    }
    
    if (!/<footer/i.test(content)) {
        if (content.includes('<script src="assets/js/main.js"></script>')) {
            content = content.replace(/<script src="assets\/js\/main\.js"><\/script>/i, `${newFooter}\n    <script src="assets/js/main.js"></script>`);
        } else {
            content = content.replace(/(<\/body>)/i, `${newFooter}\n$1`);
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
}
