const fs = require('fs');
const path = require('path');

const dirs = ['.', './kategori', './urun'];

function updateFile(filePath) {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('class="header-brand"')) return;

    const regex = /(<a\s+href="[^"]*"\s+class="logo"\s*>[\s\S]*?<\/a>)/i;

    const match = content.match(regex);
    if (!match) return;

    const originalLogo = match[1];

    const replacement = `<div class="header-brand">
        ${originalLogo}
        <div class="header-contact">
          <div class="header-contact-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div class="header-contact-info">
            <a href="tel:+905551234567">+90 555 123 4567</a>
            <a href="mailto:info@tvstekstil.com">info@tvstekstil.com</a>
          </div>
        </div>
      </div>`;

    content = content.replace(regex, replacement);

    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
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
