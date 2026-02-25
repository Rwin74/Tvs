/**
 * TVS Admin - Nav Kategorileri Dinamikleştirme (Basit versiyon)
 * Doğrudan string replacement ile sabit kategorileri kaldırır.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

// Root seviyesi HTML dosyaları - base path boş
const rootFiles = ['index.html', 'about.html', 'contact.html', 'products.html', 'product-detail.html'];

// Kategori HTML dosyaları - base path '../'
const kategoriDir = path.join(ROOT, 'kategori');
const kategoriFiles = fs.existsSync(kategoriDir)
    ? fs.readdirSync(kategoriDir).filter(f => f.endsWith('.html'))
    : [];

// Root nav dropdown içeriği (sabit linkler)
const ROOT_NAV_DROPDOWN_CONTENT = `<a href="kategori/banyo.html" class="nav-dropdown-item" data-i18n="categories.banyo">Banyo</a>
            <a href="kategori/yatak-takimi.html" class="nav-dropdown-item" data-i18n="categories.yatak-takimi">Yatak
              Takımı</a>
            <a href="kategori/ev-kiyafeti.html" class="nav-dropdown-item" data-i18n="categories.ev-kiyafeti">Ev
              Giyimi</a>
            <a href="kategori/bebek-cocuk.html" class="nav-dropdown-item" data-i18n="categories.bebek-cocuk">Bebek &
              Çocuk</a>
            <a href="kategori/yasam.html" class="nav-dropdown-item" data-i18n="categories.yasam">Yaşam</a>
            <a href="kategori/beach-spa.html" class="nav-dropdown-item" data-i18n="categories.beach-spa">Beach & Spa</a>`;

const ROOT_NAV_REPLACEMENT = `<div id="nav-categories-list" data-base=""></div>`;

// Kategori sayfaları nav dropdown içeriği
const KAT_NAV_DROPDOWN_CONTENT = `<a href="../kategori/banyo.html" class="nav-dropdown-item" data-i18n="categories.banyo">Banyo</a>
                        <a href="../kategori/yatak-takimi.html" class="nav-dropdown-item" data-i18n="categories.yatak-takimi">Yatak Takımı</a>
                        <a href="../kategori/ev-kiyafeti.html" class="nav-dropdown-item" data-i18n="categories.ev-kiyafeti">Ev Giyimi</a>
                        <a href="../kategori/bebek-cocuk.html" class="nav-dropdown-item" data-i18n="categories.bebek-cocuk">Bebek & Çocuk</a>
                        <a href="../kategori/yasam.html" class="nav-dropdown-item" data-i18n="categories.yasam">Yaşam</a>
                        <a href="../kategori/beach-spa.html" class="nav-dropdown-item" data-i18n="categories.beach-spa">Beach & Spa</a>`;

const KAT_NAV_REPLACEMENT = `<div id="nav-categories-list" data-base="../"></div>`;

// Footer - root
const ROOT_FOOTER_LINKS = `<a href="kategori/banyo.html" data-i18n="categories.banyo">Banyo</a>
            <a href="kategori/yatak-takimi.html" data-i18n="categories.yatak-takimi">Yatak Takımı</a>
            <a href="kategori/ev-kiyafeti.html" data-i18n="categories.ev-kiyafeti">Ev Giyimi</a>
            <a href="kategori/bebek-cocuk.html" data-i18n="categories.bebek-cocuk">Bebek & Çocuk</a>
            <a href="kategori/yasam.html" data-i18n="categories.yasam">Yaşam</a>
            <a href="kategori/beach-spa.html" data-i18n="categories.beach-spa">Beach & Spa</a>`;

const ROOT_FOOTER_REPLACEMENT = `<div id="footer-categories-list" data-base=""></div>`;

// Footer - kategori sayfaları
const KAT_FOOTER_LINKS = `<a href="../kategori/banyo.html" data-i18n="categories.banyo">Banyo</a>
                        <a href="../kategori/yatak-takimi.html" data-i18n="categories.yatak-takimi">Yatak Takımı</a>
                        <a href="../kategori/ev-kiyafeti.html" data-i18n="categories.ev-kiyafeti">Ev Giyimi</a>
                        <a href="../kategori/bebek-cocuk.html" data-i18n="categories.bebek-cocuk">Bebek & Çocuk</a>
                        <a href="../kategori/yasam.html" data-i18n="categories.yasam">Yaşam</a>
                        <a href="../kategori/beach-spa.html" data-i18n="categories.beach-spa">Beach & Spa</a>`;

const KAT_FOOTER_REPLACEMENT = `<div id="footer-categories-list" data-base="../"></div>`;

let updated = 0;

// Root dosyaları güncelle
for (const file of rootFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) { console.log(`⚠️  Bulunamadı: ${file}`); continue; }

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    content = content.replace(ROOT_NAV_DROPDOWN_CONTENT, ROOT_NAV_REPLACEMENT);
    content = content.replace(ROOT_FOOTER_LINKS, ROOT_FOOTER_REPLACEMENT);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Güncellendi: ${file}`);
        updated++;
    } else {
        console.log(`⚠️  Eşleşme yok: ${file} (farklı whitespace veya format olabilir)`);
    }
}

// Kategori dosyaları güncelle
for (const file of kategoriFiles) {
    const filePath = path.join(kategoriDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    content = content.replace(KAT_NAV_DROPDOWN_CONTENT, KAT_NAV_REPLACEMENT);
    content = content.replace(KAT_FOOTER_LINKS, KAT_FOOTER_REPLACEMENT);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ Güncellendi: kategori/${file}`);
        updated++;
    } else {
        console.log(`⚠️  Eşleşme yok: kategori/${file}`);
    }
}

console.log(`\n✨ ${updated} dosya güncellendi.`);
