const fs = require('fs');
const path = require('path');

const banyoHtml = fs.readFileSync(path.join(__dirname, 'kategori', 'banyo.html'), 'utf-8');

const regex = /<div class="products-grid">[\s\S]*?<\/div>\s*<\/div>\s*<!-- FOOTER -->/i;
// Wait, regex might fail depending on how it ends.

// Safest is to replace everything from <div class="products-grid"> up to but not including <!-- FOOTER -->.
function updateCategoryFiles() {
    const dir = path.join(__dirname, 'kategori');
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        // Find the category id from the file name, e.g. banyo.html -> banyo
        const catId = file.replace('.html', '');

        // Remove hardcoded products in <div class="products-grid"> ... </div>
        // Replacing everything between: <div class="products-grid"> ... </div></div> <!-- FOOTER -->
        // We'll just replace the `<div class="products-grid">...</div></div>` with a container ready for JS.

        const updatedGrid = `<div class="products-grid" id="category-products-grid" data-category="${catId}"></div>\n    </div>\n\n    <!-- FOOTER -->`;
        content = content.replace(/<div class="products-grid">[\s\S]*?<\/div>[\s\n]*<\/div>[\s\n]*<!-- FOOTER -->/mi, updatedGrid);

        // Also add the script to render the products in the page itself, just before </body> if we prefer,
        // but adding it to js/app.js is cleaner. Let's just do the HTML replacement here.

        fs.writeFileSync(filePath, content);
        console.log('Updated ' + file);
    }
}

updateCategoryFiles();
