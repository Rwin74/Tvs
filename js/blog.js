/**
 * TVS Tekstil - Blog Verileri (Admin Panel Tarafından Oluşturuldu)
 * Tarih: 25.02.2026 16:11:36
 */
const blogPosts = [
    {
        "id": "c4e7869d-2aad-4910-a39e-b4822a116e51",
        "title": "Ahmete sapliyim",
        "slug": "ahmete-sapliyim",
        "content": "ahmete giriyim",
        "summary": "ahmete giriyim...",
        "author": "TVS Editör",
        "date": "25.02.2026",
        "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80"
    },
    {
        "id": "f8779925-1bd2-4d07-93ec-942327244dcd",
        "title": "Müslim kumaş",
        "slug": "muslim-kumas",
        "content": "Müslim kumaş yazları ferah kışları sıcak tutan mükkeemmel bir kumaştır\n\nyansın",
        "summary": "Müslim kumaş yazları ferah kışları sıcak tutan mükkeemmel bir kumaştır\n\nyansın...",
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
