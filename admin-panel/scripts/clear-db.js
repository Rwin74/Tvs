/**
 * TVS Admin Panel - Database Cleanup Script
 * 
 * Bu script: Tüm eski/seed edilmiş kategorileri, ürünleri ve ilişkili verileri siler.
 * Kullanım: node scripts/clear-db.js
 */

const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function clearDatabase() {
    console.log('🗑️  Veritabanı temizleniyor...\n')

    try {
        // 1. İlişkili tablolar önce silinmeli (FK constraint)
        const variantCount = await db.productVariant.deleteMany({})
        console.log(`✅ ${variantCount.count} ürün varyantı silindi`)

        const mediaCount = await db.mediaLibrary.deleteMany({})
        console.log(`✅ ${mediaCount.count} medya kaydı silindi`)

        const seoCount = await db.seoSetting.deleteMany({})
        console.log(`✅ ${seoCount.count} SEO ayarı silindi`)

        const productCount = await db.product.deleteMany({})
        console.log(`✅ ${productCount.count} ürün silindi`)

        const categoryCount = await db.category.deleteMany({})
        console.log(`✅ ${categoryCount.count} kategori silindi`)

        console.log('\n✨ Veritabanı temizlendi! Admin panelinden yeni veriler ekleyebilirsiniz.')
    } catch (error) {
        console.error('❌ Hata:', error.message)
    } finally {
        await db.$disconnect()
    }
}

clearDatabase()
