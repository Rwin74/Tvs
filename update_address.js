const fs = require('fs');
const path = require('path');

const dirs = ['.', './kategori', './urun'];

const oldAddress = 'Organize Sanayi Bölgesi, Denizli / Türkiye';
const newAddress = 'Akçeşme M Ertuğrul Gazi Cd No :4 20030 Merkezefendi Denizli';

function updateFile(filePath) {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes(oldAddress)) {
        content = content.split(oldAddress).join(newAddress);
        fs.writeFileSync(filePath, content);
        console.log('Updated', filePath);
    }
}

dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isFile()) {
                updateFile(fullPath);
            }
        });
    }
});
