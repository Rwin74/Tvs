/**
 * TVS Tekstil - Ürün Verileri (Admin Panel Tarafından Oluşturuldu)
 * Tarih: 25.02.2026 14:37:57
 */
const categories = [
    {
        "id": "ev-tekstil",
        "icon": "📦",
        "image": ""
    }
];

const products = [
    {
        "id": "8711d093-8f2d-43ee-a408-8ce9dd762213",
        "name": "Nevresim takımı",
        "tags": [
            "cotton",
            "nevresim",
            "takımı",
            "ev-tekstil"
        ],
        "description": "Tek kişilik",
        "descTags": [
            "cotton",
            "nevresim",
            "takımı"
        ],
        "descTemplate": "Tek kişilik",
        "category": "ev-tekstil",
        "price": 1000,
        "features": [
            "Cotton",
            "2 Varyant",
            "Hızlı Kargo",
            "Yerli Üretim"
        ],
        "image": "/img/uploads/1772019438940-351866324-0b11e90e-3aa9-4f9d-98e6-9438f52b9be4.webp",
        "images": [
            "/img/uploads/1772019438940-351866324-0b11e90e-3aa9-4f9d-98e6-9438f52b9be4.webp"
        ]
    }
];

/**
 * Ürünü kategoriye göre filtrele
 */
function getProductsByCategory(categoryId) {
    if (!categoryId || categoryId === 'all') return products;
    return products.filter(p => p.category === categoryId);
}

/**
 * Ürünü ID'ye göre bul
 * Updated to handle string UUIDs
 */
function getProductById(id) {
    return products.find(p => p.id == id);
}

/**
 * Benzer ürünleri getir
 */
function getRelatedProducts(product, limit = 4) {
    return products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, limit);
}

// Node.js ortamı için export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        categories,
        products,
        getProductsByCategory,
        getProductById,
        getRelatedProducts
    };
}
