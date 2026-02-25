/**
 * TVS Tekstil - Blog Verileri (Admin Panel Tarafından Oluşturuldu)
 * Tarih: 25.02.2026 15:26:16
 */
const blogPosts = [
    {
        "id": "f8779925-1bd2-4d07-93ec-942327244dcd",
        "title": "Müslim kumaş",
        "slug": "muslim-kumas",
        "content": "Müslim kumaş yazları ferah kışları sıcak tutan mükkeemmel bir kumaştır",
        "summary": "Müslim kumaş yazları ferah kışları sıcak tutan mükkeemmel bir kumaştır...",
        "author": "TVS Editör",
        "date": "25.02.2026",
        "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80"
    }
];

/**
 * Slug'a göre yazı getir
 */
function getPostBySlug(slug) {
    return blogPosts.find(p => p.slug === slug);
}

// Node.js ortamı için export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        blogPosts,
        getPostBySlug
    };
}
