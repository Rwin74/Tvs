const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin paneli için proxy (Next.js uygulaması 3001 portunda çalışacak)
// next.config.mjs'de basePath: '/admin' tanımlı — Next.js /admin prefix'ini zaten bekliyor
app.use(
    '/admin',
    createProxyMiddleware({
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true, // WebSocket desteği (Next.js HMR için)
        on: {
            error: (err, req, res) => {
                console.error('Admin proxy hatası:', err.message);
                res.status(502).send(`
                    <h2>Admin Paneli Bağlanamadı</h2>
                    <p>Admin paneli çalışmıyor olabilir. Lütfen <code>npm run dev</code> komutunu çalıştırın.</p>
                    <p><small>Hata: ${err.message}</small></p>
                `);
            }
        }
    })
);

// Statik dosyaları sunucu
app.use(express.static(path.join(__dirname, '')));

// Kök dizinde index.html gönderilsin
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Belirli rotalar için (products gibi html uzantısız sayfalara rewrite)
app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

// Bilinmeyen her şey için 404.html göster
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Tekstil TVS sunucusu başlatıldı: http://localhost:${PORT}`);
    console.log(`🔧 Admin Paneli erişimi: http://localhost:${PORT}/admin`);
});
