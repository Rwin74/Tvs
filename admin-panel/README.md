# TVS Tekstil - Admin Paneli (v0.1)

Bu proje Next.js 14, Tailwind CSS ve Shadcn/UI kullanılarak hazırlanmış modern bir yönetim panelidir.

## Özellikler
- **Dashboard:** Özet metrikler ve grafik alanları.
- **Ürün Yönetimi:**
  - **Liste Görünümü:** Filtrelenebilir ürün tablosu.
  - **Ürün Ekleme:** Gelişmiş "Tab" yapılı form (Genel, Varyant, Fiyat, Medya, SEO).
  - **Varyant Matrisi:** Renk/Beden stok yönetimi simülasyonu.
- **Tasarım:** Siyah/Beyaz kurumsal ve minimalist (Clean Code).

## Kurulum ve Çalıştırma

1.  Bağımlılıkları yükleyin:
    ```bash
    cd admin-panel
    npm install
    ```

2.  Projeyi başlatın:
    ```bash
    npm run dev
    ```

3.  Tarayıcıda açın: `http://localhost:3000`

## Notlar
- **Veritabanı:** Prisma ORM kurulumu yapılmıştır ancak yerel ortam sorunları nedeniyle SQLite veritabanı tam olarak senkronize edilmemiştir. Sadece Frontend (UI) tarafı çalışmaktadır.
- **Formlar:** "Ürün Ekle" formu `react-hook-form` ve `zod` ile doğrulamaya sahiptir, ancak "Kaydet" butonu şimdilik sadece konsola veri yazar.
