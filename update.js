const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

const indexContent = fs.readFileSync('index.html', 'utf8');

const headerRegex = /<header[\s\S]*?<\/header>/i;
const footerRegex = /<footer[\s\S]*?<\/footer>/i;

const headerMatch = indexContent.match(headerRegex);
const footerMatch = indexContent.match(footerRegex);

if (!headerMatch || !footerMatch) {
    console.error("Could not find header or footer in index.html");
    process.exit(1);
}

const newHeader = headerMatch[0];
const newFooter = footerMatch[0];

let updatedFiles = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let updated = false;
    
    if (headerRegex.test(content)) {
        content = content.replace(headerRegex, newHeader);
        updated = true;
    }
    
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, newFooter);
        updated = true;
    }
    
    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        updatedFiles++;
        console.log(`Updated ${file}`);
    }
}

console.log(`Finished updating ${updatedFiles} files.`);
