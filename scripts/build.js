const fs = require('fs');
const path = require('path');

// Load modules
// We need to load these files. Since they are designed for browser first,
// we might need to mock some browser globals if they use them immediately.
// But based on my review, products.js and dictionary.js just define data/functions.

const { products, getRelatedProducts } = require('../js/products');
const { translateProductName, translateProductDescription } = require('../js/dictionary');

// Configuration
const TEMPLATE_PATH = path.join(__dirname, '../product-detail.html');
const OUTPUT_DIR = path.join(__dirname, '../urun');

// Create output directory if not exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read template
let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// Helper to slugify text
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Advanced slugify for Turkish characters
function trSlugify(text) {
  const trMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'I': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };

  text = text.replace(/[çğıİöşüÇĞIÖŞÜ]/g, function (s) { return trMap[s]; });
  return slugify(text);
}

console.log(`Starting build process for ${products.length} products...`);

products.forEach(product => {
  // 1. Prepare Data
  // Default language is Turkish
  const title = translateProductName(product, 'tr');
  const description = translateProductDescription(product, 'tr');
  const slug = trSlugify(title);
  const filename = `${slug}.html`;
  const canonicalUrl = `https://www.tvstekstil.com/urun/${filename}`; // Domain placeholder

  // 2. Prepare Meta Tags
  const metaTags = `
    <title>${title} | TVS Tekstil</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title} | TVS Tekstil">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${product.image}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="product">
    <meta property="product:price:amount" content="${product.price}">
    <meta property="product:price:currency" content="EUR">
    `;

  // 3. Prepare Schema.org JSON-LD
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": title,
    "image": product.images,
    "description": description,
    "sku": `TVS-${product.id.toString().padStart(4, '0')}`,
    "brand": {
      "@type": "Brand",
      "name": "TVS Tekstil"
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "EUR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  // 4. Inject Logic
  // We need to replace specific parts of the template.
  // The current template relies heavily on JS. We will inject content into the #product-detail-layout div
  // But ideally, we should replace the JS rendering implementation with static HTML.

  let html = template;

  // Inject Meta Tags (in <head>)
  // Finding </title> and appending meta tags after it
  html = html.replace('</title>', `</title>\n${metaTags}`);

  // Inject Schema (before </head>)
  html = html.replace('</head>', `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>\n</head>`);

  // Inject Content (Naive approach: replace the JS container with actual HTML)
  // The template has <div id="product-detail-layout">...</div>
  // We will generate the inner HTML for this.

  const productDetailHtml = `
      <div class="product-gallery">
          <img class="product-gallery-main" id="main-image" src="${product.images[0]}" alt="${title}">
          <div class="product-gallery-thumbs">
            ${product.images.map((img, i) => `
              <img class="product-gallery-thumb ${i === 0 ? 'active' : ''}" 
                   src="${img}" alt="${title}" 
                   onclick="changeMainImage(${i}, this)">
            `).join('')}
          </div>
        </div>
        <div class="product-detail-info">
          <a href="../kategori/${product.category}.html" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            <span data-i18n="product_detail.back">Geri Dön</span>
          </a>
          <!-- Added id for dynamic translation hook -->
          <h1 class="product-detail-name" id="product-name" data-product-id="${product.id}">${title}</h1>
          <div class="product-detail-price">€${product.price.toFixed(2)}</div>
          <p class="product-detail-desc" id="product-desc">${description}</p>
          <div class="product-features">
            <h3 data-i18n="product_detail.features">Özellikler</h3>
            <ul>
              ${product.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
          <div class="product-detail-actions">
            <button class="btn-primary" onclick="Cart.add(${product.id})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span data-i18n="product_detail.add_to_cart">Sepete Ekle</span>
            </button>
            <button class="btn-whatsapp" onclick="Cart.sendSingleWhatsApp(${product.id})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span data-i18n="product_detail.whatsapp_order">WhatsApp ile Sipariş Ver</span>
            </button>
          </div>
        </div>
    `;

  // Replace the placeholder container content
  // Note: The template has <div class="product-detail-layout" id="product-detail-layout">...</div>
  // We want to keep the container div but replace its innerHTML (which is effectively empty/placeholder)

  html = html.replace(
    /<div class="product-detail-layout" id="product-detail-layout">[\s\S]*?<\/div>/,
    `<div class="product-detail-layout" id="product-detail-layout">${productDetailHtml}</div>`
  );

  // Fix CSS/JS locations since we are in a subdir
  html = html.replace(/src="js\//g, 'src="../js/');
  html = html.replace(/href="css\//g, 'href="../css/');
  html = html.replace(/href="index.html"/g, 'href="../index.html"');
  html = html.replace(/href="products.html"/g, 'href="../products.html"');
  html = html.replace(/href="about.html"/g, 'href="../about.html"');
  html = html.replace(/href="contact.html"/g, 'href="../contact.html"');

  // Fix Category Links explicitly (Robust fix for Product Pages)
  const categoryIds = ['banyo', 'yatak-takimi', 'ev-kiyafeti', 'bebek-cocuk', 'yasam', 'beach-spa'];
  categoryIds.forEach(cid => {
    // 1. Handle href="products.html#cid"
    const regex1 = new RegExp(`href="products.html#${cid}"`, 'g');
    html = html.replace(regex1, `href="../kategori/${cid}.html"`);

    // 2. Handle href="../products.html#cid" (if already prefixed by general fix)
    const regex2 = new RegExp(`href="\\.\\./products.html#${cid}"`, 'g');
    html = html.replace(regex2, `href="../kategori/${cid}.html"`);

    // 3. Handle href="kategori/cid.html"
    const regex3 = new RegExp(`href="kategori/${cid}.html"`, 'g');
    html = html.replace(regex3, `href="../kategori/${cid}.html"`);
  });

  // Fix Category Links in Menu
  html = html.replace(/href="kategori\//g, 'href="../kategori/');

  // Remove the dynamic rendering script and replace with static gallery interaction
  const staticScript = `
    <script>
        function changeMainImage(index, thumb) {
            const mainImg = document.getElementById('main-image');
            if (mainImg) {
                mainImg.src = thumb.src;
                document.querySelectorAll('.product-gallery-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            }
        }
    </script>
    `;
  html = html.replace(/<script>[\s\S]*?function renderProductDetail[\s\S]*?<\/script>/, staticScript);


  // Write file
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), html);
  console.log(`Generated: ${filename}`);
});

// --- CATEGORY PAGES GENERATION ---
console.log('Generating category pages...');

const CAT_TEMPLATE_PATH = path.join(__dirname, '../products.html');
const CAT_OUTPUT_DIR = path.join(__dirname, '../kategori');
const TRANSLATIONS_PATH = path.join(__dirname, '../lang/tr.json');

if (!fs.existsSync(CAT_OUTPUT_DIR)) {
  fs.mkdirSync(CAT_OUTPUT_DIR, { recursive: true });
}

let catTemplate = fs.readFileSync(CAT_TEMPLATE_PATH, 'utf8');
const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));

// We need to generate a page for each category
const categoryIds = ['banyo', 'yatak-takimi', 'ev-kiyafeti', 'bebek-cocuk', 'yasam', 'beach-spa'];

categoryIds.forEach(catId => {
  let html = catTemplate;
  const catName = translations.categories[catId];
  const catDesc = translations.category_desc[catId];

  // 1. Meta Tags
  const title = `${catName} | TVS Tekstil`;
  const cleanDesc = catDesc.replace(/"/g, '&quot;');
  const canonicalUrl = `https://www.tvstekstil.com/kategori/${catId}.html`;

  const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${cleanDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${cleanDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="website">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Anasayfa",
        "item": "https://www.tvstekstil.com"
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "Ürünler",
        "item": "https://www.tvstekstil.com/products.html"
      },{
        "@type": "ListItem",
        "position": 3,
        "name": "${catName}",
        "item": "${canonicalUrl}"
      }]
    }
    </script>
    `;

  html = html.replace(/<title>.*?<\/title>/, metaTags); // Replace existing title
  html = html.replace(/<meta name="description".*?>/, ''); // Remove existing description to avoid duplicate

  // 2. Fix Paths (same as products)
  html = html.replace(/src="js\//g, 'src="../js/');
  html = html.replace(/href="css\//g, 'href="../css/');
  html = html.replace(/href="index.html"/g, 'href="../index.html"');
  html = html.replace(/href="products.html"/g, 'href="../products.html"');
  html = html.replace(/href="about.html"/g, 'href="../about.html"');
  html = html.replace(/href="contact.html"/g, 'href="../contact.html"');

  // Fix Category Links explicitly
  // Replace products.html#banyo with ../kategori/banyo.html
  categoryIds.forEach(cid => {
    // 1. Handle href="products.html#cid"
    const regex1 = new RegExp(`href="products.html#${cid}"`, 'g');
    html = html.replace(regex1, `href="../kategori/${cid}.html"`);

    // 2. Handle href="../products.html#cid" (if already prefixed)
    const regex2 = new RegExp(`href="\\.\\./products.html#${cid}"`, 'g');
    html = html.replace(regex2, `href="../kategori/${cid}.html"`);

    // 3. Handle href="kategori/cid.html"
    const regex3 = new RegExp(`href="kategori/${cid}.html"`, 'g');
    html = html.replace(regex3, `href="../kategori/${cid}.html"`);

    // 4. Handle href="../kategori/cid.html" (ensure no double prefix if run multiple times)
    // We don't need to change this, but if we wanted to be safe we could match and replace with itself
  });

  // 3. Inject Product Grid
  // Filter products for this category
  const catProducts = products.filter(p => p.category === catId);

  let gridHtml = `
    <div class="container" style="padding: 4rem 0;">
        <div class="cat-header">
            <h1 data-i18n="categories.${catId}">${catName}</h1>
            <p data-i18n="category_desc.${catId}">${catDesc}</p>
        </div>
        <div class="products-grid">
    `;

  if (catProducts.length > 0) {
    gridHtml += catProducts.map(p => {
      const pName = translateProductName(p, 'tr');
      const pSlug = trSlugify(pName);
      return `
            <div class="product-card">
              <a href="../urun/${pSlug}.html" class="product-card-image">
                <img src="${p.image}" alt="${pName}" loading="lazy">
              </a>
              <div class="product-card-body">
                <h3 class="product-card-name">${pName}</h3>
                <div class="product-card-price">€${p.price.toFixed(2)}</div>
                <div class="product-card-actions">
                  <button class="btn-add-cart" onclick="Cart.add(${p.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    <span data-i18n="products_page.add_to_cart">Sepete Ekle</span>
                  </button>
                  <a href="../urun/${pSlug}.html" class="btn-detail">
                    <span data-i18n="products_page.detail">Detay</span>
                  </a>
                </div>
              </div>
            </div>
             `;
    }).join('');
  } else {
    gridHtml += `<p class="no-products" data-i18n="products_page.no_products">Bu kategoride ürün bulunamadı.</p>`;
  }

  gridHtml += `</div></div>`;

  // Replace the showcase section
  html = html.replace(
    /<section class="category-showcase" id="category-showcase">[\s\S]*?<\/section>/,
    gridHtml
  );

  // Remove the Page Banner because we have a custom header
  html = html.replace(/<section class="page-banner">[\s\S]*?<\/section>/, '');

  // Remove script that renders showcase
  html = html.replace(/<script>[\s\S]*?renderCategoryShowcase[\s\S]*?<\/script>/, '');

  fs.writeFileSync(path.join(CAT_OUTPUT_DIR, `${catId}.html`), html);
  console.log(`Generated Category: ${catId}.html`);
});

// --- SITEMAP GENERATION ---
const BASE_URL = 'https://www.tvstekstil.com';
const SITEMAP_PATH = path.join(__dirname, '../sitemap.xml');
const today = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

// 1. Static Pages
const staticPages = ['', 'about.html', 'contact.html', 'products.html'];
staticPages.forEach(page => {
  sitemap += `  <url>
    <loc>${BASE_URL}/${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`;
});

// 2. Category Pages
categoryIds.forEach(catId => {
  sitemap += `  <url>
    <loc>${BASE_URL}/kategori/${catId}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
});

// 3. Product Pages
products.forEach(p => {
  const pName = translateProductName(p, 'tr');
  const pSlug = trSlugify(pName);
  sitemap += `  <url>
    <loc>${BASE_URL}/urun/${pSlug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${p.image}</image:loc>
      <image:title>${pName}</image:title>
    </image:image>
  </url>
`;
});

sitemap += `</urlset>`;
fs.writeFileSync(SITEMAP_PATH, sitemap);
console.log('Generated: sitemap.xml');
// --------------------------

console.log('Build completed!');
