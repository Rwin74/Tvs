const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/Atakan/Desktop/tekstil tvs';

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'admin-panel') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = findHtmlFiles(projectRoot);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Change lang to fr
    content = content.replace(/<html lang="[^"]+">/i, '<html lang="fr">');

    // 2. Remove script src cart.js
    content = content.replace(/<script src="(?:\.\.\/)?js\/cart\.js"><\/script>\s*/gi, '');

    // 3. Remove Cart Button
    content = content.replace(/<button class="cart-btn" id="cart-btn" title="Sepet">[\s\S]*?<\/button>\s*/gi, '');

    // 4. Remove Cart Modal
    content = content.replace(/<!-- CART MODAL -->[\s\S]*?(?=<!-- SCRIPTS -->|<script)/gi, '');
    content = content.replace(/<div class="cart-overlay" id="cart-overlay"><\/div>\s*<div class="cart-modal" id="cart-modal">[\s\S]*?(?=<!-- SCRIPTS -->|<script)/gi, '');

    // 5. Update Language Switcher
    const newSwitcher = `<button class="lang-btn active" data-lang="fr">FR</button>
                    <button class="lang-btn" data-lang="tr">TR</button>
                    <button class="lang-btn" data-lang="en">EN</button>
                    <button class="lang-btn" data-lang="de">DE</button>`;

    content = content.replace(/<div class="lang-switcher">[\s\S]*?<\/div>/i, `<div class="lang-switcher">\n                    ${newSwitcher}\n                </div>`);

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
});
