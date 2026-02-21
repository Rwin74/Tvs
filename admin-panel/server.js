const express = require('express')
const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev, dir: __dirname })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()

    // Proje Kök Klasörü (tekstil tvs) statik olarak sunulacak
    const staticSitePath = path.join(__dirname, '..')
    server.use(express.static(staticSitePath))

    // Geri kalan tüm istekler Next.js (Admin Panel) modülüne paslanacak
    server.use((req, res) => {
        return handle(req, res)
    })

    // Sunucuyu 3000 portunda başlat
    const port = 3000
    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
        console.log(`> Normal site: http://localhost:${port}/`)
        console.log(`> Admin paneli: http://localhost:${port}/admin`)
    })
}).catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
})
