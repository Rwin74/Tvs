import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        // 1. Fetch all products with relations
        const products = await db.product.findMany({
            where: { isActive: true },
            include: {
                variants: true,
                media: true,
                seo: true,
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // 2. Transform to products.js format
        const transformedProducts = products.map(p => {
            const mainImage = p.media.length > 0 ? p.media[0].filePath : "";
            const allImages = p.media.map(m => m.filePath);

            const tags = [
                p.fabricType?.toLowerCase(),
                p.name.toLowerCase().split(' '),
                p.category?.slug || p.categoryId
            ].flat().filter(Boolean) as string[];

            const features = [
                p.fabricType || "Premium Kumaş",
                p.variants.length > 0 ? `${p.variants.length} Varyant` : "Tek Ebat",
                "Hızlı Kargo",
                "Yerli Üretim"
            ];

            return {
                id: p.id,
                name: p.name,
                tags: tags,
                description: p.shortDescription || "",
                descTags: tags.slice(0, 3),
                descTemplate: p.shortDescription || "",
                category: p.category?.slug || p.categoryId || "diger",
                price: Number(p.basePrice),
                features: features,
                image: mainImage,
                images: allImages.length > 0 ? allImages : [mainImage]
            };
        });

        // 3. Fetch categories from DB
        const dbCategories = await db.category.findMany({ orderBy: { createdAt: 'asc' } });
        const categories = dbCategories.map(c => ({
            id: c.slug,
            icon: '📦',
            image: ''
        }));

        const fileContent = `/**
 * TVS Tekstil - Ürün Verileri (Admin Panel Tarafından Oluşturuldu)
 * Tarih: ${new Date().toLocaleString('tr-TR')}
 */
const categories = ${JSON.stringify(categories, null, 4)};

const products = ${JSON.stringify(transformedProducts, null, 4)};

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
`;

        // 4. Write to file
        // Parent directory of admin-panel is the project root
        const targetPath = path.resolve(process.cwd(), "../js/products.js");

        await fs.writeFile(targetPath, fileContent, "utf-8");

        // 5. Fetch Blog Posts
        const posts = await db.blogPost.findMany({
            where: { status: 'Published' },
            include: { seo: true, author: true },
            orderBy: { publishedAt: 'desc' }
        });

        const transformedPosts = posts.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            content: p.content,
            summary: p.seo?.metaDescription || p.content?.substring(0, 150) + "...",
            author: p.author?.fullName || "TVS Editör",
            date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('tr-TR') : "",
            image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80" // Placeholder or actual image if added to model
        }));

        const blogFileContent = `/**
 * TVS Tekstil - Blog Verileri (Admin Panel Tarafından Oluşturuldu)
 * Tarih: ${new Date().toLocaleString('tr-TR')}
 */
const blogPosts = ${JSON.stringify(transformedPosts, null, 4)};

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
`;

        // 6. Write blog.js
        const targetBlogPath = path.resolve(process.cwd(), "../js/blog.js");
        await fs.writeFile(targetBlogPath, blogFileContent, "utf-8");

        return NextResponse.json({
            success: true,
            productsPath: targetPath,
            blogPath: targetBlogPath,
            productCount: products.length,
            postCount: posts.length
        });

    } catch (error: any) {
        console.error("Publish error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
