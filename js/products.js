/**
 * TVS Tekstil - Ürün Verileri
 * Dinamik olarak admin API'sinden çekilir.
 */
const categories = [
    { id: 'banyo', icon: '🛁', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80' },
    { id: 'yatak-takimi', icon: '🛏️', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80' },
    { id: 'ev-kiyafeti', icon: '👘', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80' },
    { id: 'bebek-cocuk', icon: '👶', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80' },
    { id: 'yasam', icon: '🏠', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80' },
    { id: 'beach-spa', icon: '🏖️', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' }
];

let products = [];

/**
 * Admin API'sinden ürünleri çek
 */
async function fetchProducts() {
    try {
        const res = await fetch('/admin/api/products');
        if (res.ok) {
            const data = await res.json();
            products = data.map(p => ({
                id: p.id,
                name: p.name,
                category: p.categoryId || 'diger',
                description: p.shortDescription || p.htmlDescription || '',
                price: Number(p.basePrice) || 0,
                // Assuming media is an array returned by API, map to image/images
                image: (p.media && p.media.length > 0) ? p.media[0].filePath : 'https://placehold.co/600x600?text=Görsel+Yok',
                images: (p.media && p.media.length > 0) ? p.media.map(m => m.filePath) : ['https://placehold.co/600x600?text=Görsel+Yok'],
                features: [] // Mapping if any
            }));
        } else {
            console.warn('API returned non-OK status:', res.status);
            products = []; // Fallback to empty
        }
    } catch (e) {
        console.error('API fetch error:', e);
        products = [];
    }
}

/**
 * Ürünü kategoriye göre filtrele
 */
function getProductsByCategory(categoryId) {
    if (!categoryId || categoryId === 'all') return products;
    return products.filter(p => p.category === categoryId);
}

/**
 * Ürünü ID'ye göre bul
 */
function getProductById(id) {
    // ID can be string/UUID now from Prisma
    return products.find(p => String(p.id) === String(id));
}

/**
 * Benzer ürünleri getir (aynı kategori, kendisi hariç)
 */
function getRelatedProducts(product, limit = 4) {
    if (!product) return [];
    return products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, limit);
}

/**
 * Otomatik olarak kategori sayfasındaki ürünleri render et
 */
function renderCategoryPageProducts() {
    const grid = document.getElementById('category-products-grid');
    if (!grid) return;

    const categoryId = grid.getAttribute('data-category');
    const catProducts = getProductsByCategory(categoryId);

    if (catProducts.length === 0) {
        grid.innerHTML = '<p class="no-products" data-i18n="products_page.no_products">Bu kategoride henüz ürün bulunmamaktadır.</p>';
        return;
    }

    grid.innerHTML = catProducts.map(p => {
        const pName = I18n.translateProduct ? I18n.translateProduct(p) : p.name;
        return `
            <div class="product-card">
              <a href="../product-detail.html?id=${p.id}" class="product-card-image">
                <img src="${p.image}" alt="${pName}" loading="lazy">
              </a>
              <div class="product-card-body">
                <h3 class="product-card-name">${pName}</h3>
                <div class="product-card-price">€${p.price.toFixed(2)}</div>
                <div class="product-card-actions">
                  <a href="../product-detail.html?id=${p.id}" class="btn-detail" style="width: 100%;">
                    <span data-i18n="products_page.detail">Detay</span>
                  </a>
                </div>
              </div>
            </div>
        `;
    }).join('');

    // Çeviri uygulanmasını sağla
    if (typeof I18n !== 'undefined' && I18n.translatePage) {
        I18n.translatePage();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        categories,
        products,
        fetchProducts,
        getProductsByCategory,
        getProductById,
        getRelatedProducts
    };
}
