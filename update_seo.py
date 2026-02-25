import os, re

root = r'c:\Users\Atakan\Desktop\tekstil tvs'
skip_dirs = {'node_modules', '.git', 'admin-panel'}
base = 'https://www.tvstekstil.com'

# Page-specific SEO data
pages = {
    'index.html': {
        'canonical': base + '/',
        'title': 'TVS Tekstil | Premium Ev Tekstili',
        'desc': 'TVS Tekstil - Havlu, bornoz, nevresim ve ev tekstili ürünleri. Yüksek kalite, dünya standartlarında üretim.',
        'image': base + '/img/tvslogo_yeni.webp',
    },
    'about.html': {
        'canonical': base + '/about.html',
        'title': 'Hakkımızda | TVS Tekstil',
        'desc': 'TVS Tekstil hakkında bilgi edinin. Dünya standartlarında üretim kapasitesiyle premium ev tekstili üreticisi.',
        'image': base + '/img/tvslogo_yeni.webp',
    },
    'contact.html': {
        'canonical': base + '/contact.html',
        'title': 'İletişim | TVS Tekstil',
        'desc': 'TVS Tekstil ile iletişime geçin. +90 532 477 0375 - ozkan@tvstekstil.com',
        'image': base + '/img/tvslogo_yeni.webp',
    },
    'products.html': {
        'canonical': base + '/products.html',
        'title': 'Ürünlerimiz | TVS Tekstil',
        'desc': 'TVS Tekstil premium ürün kataloğu. Havlu, bornoz, nevresim, ev giyimi ve daha fazlası.',
        'image': base + '/img/tvslogo_yeni.webp',
    },
    'blog.html': {
        'canonical': base + '/blog.html',
        'title': 'Blog | TVS Tekstil',
        'desc': 'TVS Tekstil blog - Tekstil dünyasından haberler, ipuçları ve ürün önerileri.',
        'image': base + '/img/tvslogo_yeni.webp',
    },
    'product-detail.html': {
        'canonical': base + '/product-detail.html',
        'title': 'Ürün Detayı | TVS Tekstil',
        'desc': 'TVS Tekstil premium ev tekstili ürünleri. Detaylı ürün bilgileri ve sipariş.',
        'image': base + '/img/tvslogo_yeni.webp',
    },
    '404.html': {
        'canonical': base + '/404.html',
        'title': 'Sayfa Bulunamadı | TVS Tekstil',
        'desc': 'Aradığınız sayfa bulunamadı. TVS Tekstil ana sayfasına dönün.',
        'image': base + '/img/tvslogo_yeni.webp',
    },
}
# Kategori pages
for slug, name in [
    ('banyo', 'Banyo Tekstili'),
    ('yatak-takimi', 'Yatak Takımları'),
    ('ev-kiyafeti', 'Ev Giyimi'),
    ('bebek-cocuk', 'Bebek & Çocuk'),
    ('yasam', 'Yaşam Ürünleri'),
    ('beach-spa', 'Beach & Spa'),
]:
    pages[f'kategori/{slug}.html'] = {
        'canonical': f'{base}/kategori/{slug}.html',
        'title': f'{name} | TVS Tekstil',
        'desc': f'TVS Tekstil {name} ürünleri. Premium kalite, dünya standartlarında üretim.',
        'image': base + '/img/tvslogo_yeni.webp',
    }

# JSON-LD for index.html only
INDEX_LD = '''  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "TVS Tekstil",
        "url": "https://www.tvstekstil.com",
        "logo": "https://www.tvstekstil.com/img/tvslogo_yeni.webp",
        "description": "Premium ev tekstili üreticisi. Havlu, bornoz, nevresim, ev giyimi.",
        "telephone": "+90-532-477-0375",
        "email": "ozkan@tvstekstil.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "TR"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+90-532-477-0375",
          "contactType": "customer service"
        }
      },
      {
        "@type": "WebSite",
        "name": "TVS Tekstil",
        "url": "https://www.tvstekstil.com",
        "description": "Premium Ev Tekstili - Havlu, Bornoz, Nevresim ve daha fazlası"
      }
    ]
  }
  </script>'''

def make_og(info):
    return (
        f'  <meta property="og:type" content="website">\n'
        f'  <meta property="og:url" content="{info["canonical"]}">\n'
        f'  <meta property="og:title" content="{info["title"]}">\n'
        f'  <meta property="og:description" content="{info["desc"]}">\n'
        f'  <meta property="og:image" content="{info["image"]}">\n'
        f'  <meta property="og:site_name" content="TVS Tekstil">\n'
        f'  <meta name="twitter:card" content="summary_large_image">\n'
        f'  <meta name="twitter:title" content="{info["title"]}">\n'
        f'  <meta name="twitter:description" content="{info["desc"]}">\n'
        f'  <meta name="twitter:image" content="{info["image"]}">\n'
        f'  <link rel="canonical" href="{info["canonical"]}">'
    )

# Remove existing OG/canonical tags to avoid duplicates
og_strip = re.compile(
    r'\s*<meta property="og:[^"]*"[^>]*>\s*'
    r'|\s*<meta name="twitter:[^"]*"[^>]*>\s*'
    r'|\s*<link rel="canonical"[^>]*>\s*',
    re.DOTALL
)

# Also remove existing ld+json scripts
ld_strip = re.compile(r'\s*<script type="application/ld\+json">.*?</script>', re.DOTALL)

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in skip_dirs]
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        fp = os.path.join(dirpath, fn)
        # Determine key for page lookup
        rel = os.path.relpath(fp, root).replace('\\', '/')
        info = pages.get(rel)
        if not info:
            print('Skip (no SEO data):', rel)
            continue

        try:
            with open(fp, 'r', encoding='utf-8') as f:
                c = f.read()

            # Strip old OG/canonical/ld+json
            nc = og_strip.sub('', c)
            nc = ld_strip.sub('', nc)

            # Build insert block
            og_block = '\n' + make_og(info)

            # For index.html: also inject JSON-LD
            if rel == 'index.html':
                og_block = '\n' + INDEX_LD + '\n' + make_og(info)

            # Insert before </head>
            nc = nc.replace('</head>', og_block + '\n</head>', 1)

            with open(fp, 'w', encoding='utf-8') as f:
                f.write(nc)
            print('Updated:', rel)
        except Exception as e:
            print('ERR:', rel, str(e))

print('Done.')
