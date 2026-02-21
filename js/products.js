/**
 * TVS Tekstil - Ürün Verileri
 * Tüm ürünler Türkçe isimle saklanır + sözlük tag'leri ile çevrilir
 * Görseller: Picsum & Unsplash verified URLs
 */
const categories = [
    { id: 'banyo', icon: '🛁', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80' },
    { id: 'yatak-takimi', icon: '🛏️', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80' },
    { id: 'ev-kiyafeti', icon: '👘', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80' },
    { id: 'bebek-cocuk', icon: '👶', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80' },
    { id: 'yasam', icon: '🏠', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80' },
    { id: 'beach-spa', icon: '🏖️', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' }
];

const products = [
    // === BANYO (6 ürün) ===
    {
        id: 1,
        name: "Bambu Pamuk Havlu",
        tags: ["bambu", "pamuk", "havlu"],
        description: "Bambu pamuk karışımlı, yüksek emiciliğe sahip, ultra yumuşak havlu. Çeşitli renk ve ebatlarda üretilmektedir.",
        descTags: ["bambu", "pamuk"],
        descTemplate: "{bambu} {pamuk} blended, highly absorbent, ultra soft towel. Available in various colors and sizes.",
        category: "banyo",
        price: 24.99,
        features: ["100% Doğal", "Yüksek Emicilik", "Anti-Bakteriyel", "Hızlı Kuruma"],
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
            "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600&q=80",
            "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=80"
        ]
    },
    {
        id: 2,
        name: "Jakarlı Havlu Set",
        tags: ["jakarlı", "havlu", "set"],
        description: "Jakarlı dokuma tekniğiyle üretilmiş, şık desenli havlu seti. Banyo ve el havlusu dahil.",
        descTags: ["jakarlı", "havlu"],
        descTemplate: "{jakarlı} woven technique, stylish patterned towel set. Includes bath and hand towels.",
        category: "banyo",
        price: 49.99,
        features: ["Jakarlı Dokuma", "3'lü Set", "Özel Desen", "Uzun Ömürlü"],
        image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600&q=80",
            "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
            "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=80"
        ]
    },
    {
        id: 3,
        name: "Premium Pamuk Bornoz",
        tags: ["premium", "pamuk", "bornoz"],
        description: "Premium kalite pamuklu bornoz, kadife dokusuyla lüks bir kullanım deneyimi sunar.",
        descTags: ["premium", "pamuk", "bornoz"],
        descTemplate: "{premium} quality {pamuk} {bornoz}, offering a luxurious experience with velvet texture.",
        category: "banyo",
        price: 79.99,
        features: ["Premium Kalite", "Kadife Doku", "Şal Yaka", "Cepli"],
        image: "https://images.unsplash.com/photo-1620756235644-9ae16208d7f1?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1620756235644-9ae16208d7f1?w=600&q=80",
            "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80"
        ]
    },
    {
        id: 4,
        name: "Waffle Paspas",
        tags: ["waffle", "paspas"],
        description: "Waffle dokuma yapısında, kaymaz tabanlı banyo paspası.",
        descTags: ["waffle", "paspas"],
        descTemplate: "{waffle} woven, non-slip {paspas}.",
        category: "banyo",
        price: 19.99,
        features: ["Kaymaz Taban", "Waffle Doku", "Hızlı Kuruma", "Makine Yıkanabilir"],
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
            "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=80"
        ]
    },
    {
        id: 5,
        name: "Bukle Terlik",
        tags: ["bukle", "terlik"],
        description: "Bukle havlu kumaşından üretilmiş, yumuşak ve rahat banyo terliği.",
        descTags: ["bukle", "terlik"],
        descTemplate: "{bukle} terry cloth, soft and comfortable bath {terlik}.",
        category: "banyo",
        price: 14.99,
        features: ["Bukle Kumaş", "Kaymaz Taban", "Rahat Kullanım", "Tek Beden"],
        image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&q=80"
        ]
    },
    {
        id: 6,
        name: "Pamuk Kese",
        tags: ["pamuk", "kese"],
        description: "Doğal pamuktan üretilmiş, geleneksel hamam kesesi.",
        descTags: ["pamuk", "kese"],
        descTemplate: "Natural {pamuk} {kese}, traditional hammam glove.",
        category: "banyo",
        price: 9.99,
        features: ["Doğal Pamuk", "Geleneksel Dokuma", "Peeling Etkisi", "Dayanıklı"],
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80",
            "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80"
        ]
    },

    // === YATAK TAKIMI (5 ürün) ===
    {
        id: 7,
        name: "Saten Nevresim Takımı",
        tags: ["saten", "nevresim", "takım"],
        description: "Saten dokuma, ipeksi hisli lüks nevresim takımı. Çarşaf, nevresim ve yastık kılıfı dahil.",
        descTags: ["saten", "nevresim"],
        descTemplate: "{saten} woven, silky feel luxury {nevresim} set. Includes sheet, duvet cover and pillow cases.",
        category: "yatak-takimi",
        price: 149.99,
        features: ["Saten Dokuma", "300 Thread Count", "4 Parça", "İpeksi Doku"],
        image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
            "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80"
        ]
    },
    {
        id: 8,
        name: "Ranforce Nevresim Takımı",
        tags: ["ranforce", "nevresim", "takım"],
        description: "Ranforce kumaştan üretilmiş, sağlam ve uzun ömürlü nevresim takımı.",
        descTags: ["ranforce", "nevresim"],
        descTemplate: "{ranforce} fabric, durable and long-lasting {nevresim} set.",
        category: "yatak-takimi",
        price: 89.99,
        features: ["Ranforce Kumaş", "Kolay Ütülenir", "4 Parça", "Canlı Renkler"],
        image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"
        ]
    },
    {
        id: 9,
        name: "Jakarlı Pike Takımı",
        tags: ["jakarlı", "pike", "takım"],
        description: "Jakarlı dokuma pike, yaz ayları için ideal yatak örtüsü takımı.",
        descTags: ["jakarlı", "pike"],
        descTemplate: "{jakarlı} woven {pike}, ideal bedcover set for summer months.",
        category: "yatak-takimi",
        price: 69.99,
        features: ["Jakarlı Doku", "Yazlık", "Hafif", "Nefes Alan"],
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80",
            "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&q=80"
        ]
    },
    {
        id: 10,
        name: "Pamuk Battaniye",
        tags: ["pamuk", "battaniye"],
        description: "Saf pamuktan üretilmiş, dört mevsim kullanıma uygun battaniye.",
        descTags: ["pamuk", "battaniye"],
        descTemplate: "Pure {pamuk} {battaniye}, suitable for all seasons.",
        category: "yatak-takimi",
        price: 59.99,
        features: ["Saf Pamuk", "4 Mevsim", "Hipoalerjenik", "Makine Yıkanabilir"],
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"
        ]
    },
    {
        id: 11,
        name: "Saten Yastık Kılıfı Set",
        tags: ["saten", "yastık"],
        description: "Saten yastık kılıfı seti, saç ve cilt sağlığı için ideal.",
        descTags: ["saten", "yastık"],
        descTemplate: "{saten} {yastık} set, ideal for hair and skin health.",
        category: "yatak-takimi",
        price: 34.99,
        features: ["Saten Kumaş", "Anti-Aging", "2'li Set", "Fermuarlı"],
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80"
        ]
    },

    // === EV GİYİMİ (4 ürün) ===
    {
        id: 12,
        name: "Pamuk Pijama Takımı",
        tags: ["pamuk", "pijama", "takım"],
        description: "Saf pamuk kumaştan üretilmiş, rahat kesimli pijama takımı.",
        descTags: ["pamuk", "pijama"],
        descTemplate: "Pure {pamuk} fabric, comfortable cut {pijama} set.",
        category: "ev-kiyafeti",
        price: 44.99,
        features: ["Saf Pamuk", "Rahat Kesim", "Düğmeli", "Cepli"],
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
            "https://images.unsplash.com/photo-1434389677669-e08b4cda3a46?w=600&q=80"
        ]
    },
    {
        id: 13,
        name: "Kadife Sabahlık",
        tags: ["kadife", "sabahlık"],
        description: "Kadife kumaştan, şık ve zarif kadın sabahlığı.",
        descTags: ["kadife", "sabahlık"],
        descTemplate: "{kadife} fabric, elegant women's {sabahlık}.",
        category: "ev-kiyafeti",
        price: 59.99,
        features: ["Kadife Kumaş", "Kuşak Detay", "Uzun Boy", "Şık Tasarım"],
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a46?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1434389677669-e08b4cda3a46?w=600&q=80",
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80"
        ]
    },
    {
        id: 14,
        name: "Muslin Şort Takımı",
        tags: ["muslin", "şort", "takım"],
        description: "Muslin kumaştan üretilmiş, yazlık şort ve tişört takımı.",
        descTags: ["muslin", "şort"],
        descTemplate: "{muslin} fabric, summer {şort} and t-shirt set.",
        category: "ev-kiyafeti",
        price: 39.99,
        features: ["Muslin Kumaş", "Yazlık", "Nefes Alan", "Hafif"],
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80"
        ]
    },
    {
        id: 15,
        name: "Waffle Ev Elbisesi",
        tags: ["waffle", "elbise"],
        description: "Waffle dokuma kumaştan, günlük kullanım için rahat ev elbisesi.",
        descTags: ["waffle", "elbise"],
        descTemplate: "{waffle} woven fabric, comfortable home {elbise} for daily use.",
        category: "ev-kiyafeti",
        price: 34.99,
        features: ["Waffle Doku", "Günlük Kullanım", "Cepli", "Rahat Kesim"],
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
            "https://images.unsplash.com/photo-1434389677669-e08b4cda3a46?w=600&q=80"
        ]
    },

    // === BEBEK & ÇOCUK (5 ürün) ===
    {
        id: 16,
        name: "Bebek Bornoz Seti",
        tags: ["bebek", "bornoz", "set"],
        description: "Organik pamuktan üretilmiş, çok parçalı bebek bornoz seti.",
        descTags: ["bebek", "bornoz"],
        descTemplate: "Organic cotton {bebek} {bornoz} set, multi-piece.",
        category: "bebek-cocuk",
        price: 39.99,
        features: ["Organik Pamuk", "Kapüşonlu", "0-2 Yaş", "3 Parça Set"],
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80",
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80"
        ]
    },
    {
        id: 17,
        name: "Muslin Kundak",
        tags: ["muslin", "kundak"],
        description: "Muslin kumaştan, nefes alan bebek kundak örtüsü.",
        descTags: ["muslin", "kundak"],
        descTemplate: "{muslin} fabric, breathable {bebek} {kundak} wrap.",
        category: "bebek-cocuk",
        price: 19.99,
        features: ["Muslin Kumaş", "Nefes Alan", "120x120cm", "Çok Amaçlı"],
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80",
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80"
        ]
    },
    {
        id: 18,
        name: "Bebek Havlu Seti",
        tags: ["bebek", "havlu", "set"],
        description: "Bebek için özel üretilmiş, kapüşonlu havlu ve el havlusu seti.",
        descTags: ["bebek", "havlu"],
        descTemplate: "Specially made {bebek} hooded {havlu} and hand towel set.",
        category: "bebek-cocuk",
        price: 29.99,
        features: ["Kapüşonlu", "Organik", "3 Parça", "Nakışlı"],
        image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&q=80",
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80"
        ]
    },
    {
        id: 19,
        name: "Çocuk Pijama Takımı",
        tags: ["çocuk", "pijama", "takım"],
        description: "Pamuklu kumaştan, eğlenceli desenli çocuk pijama takımı.",
        descTags: ["çocuk", "pijama"],
        descTemplate: "Cotton fabric, fun patterned {çocuk} {pijama} set.",
        category: "bebek-cocuk",
        price: 29.99,
        features: ["Saf Pamuk", "Eğlenceli Desenler", "3-12 Yaş", "Rahat Kesim"],
        image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80",
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80"
        ]
    },
    {
        id: 20,
        name: "Bebek Önlük Seti",
        tags: ["bebek", "önlük", "set"],
        description: "Muslin kumaştan, farklı desenlerde 5'li bebek önlük seti.",
        descTags: ["bebek", "önlük"],
        descTemplate: "Muslin fabric, 5-piece {bebek} {önlük} set with different patterns.",
        category: "bebek-cocuk",
        price: 14.99,
        features: ["Muslin Kumaş", "5 Adet", "Çıtçıtlı", "Farklı Desenler"],
        image: "https://images.unsplash.com/photo-1522771930-78b353280916?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1522771930-78b353280916?w=600&q=80",
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80"
        ]
    },

    // === YAŞAM (5 ürün) ===
    {
        id: 21,
        name: "Keten Masa Örtüsü",
        tags: ["keten", "masa_örtüsü"],
        description: "Doğal keten kumaştan, şık masa örtüsü.",
        descTags: ["keten", "masa_örtüsü"],
        descTemplate: "Natural {keten} fabric, elegant {masa_örtüsü}.",
        category: "yasam",
        price: 54.99,
        features: ["Doğal Keten", "Leke Tutmaz", "Çeşitli Boyutlar", "Zarif Tasarım"],
        image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
        ]
    },
    {
        id: 22,
        name: "Jakarlı Runner",
        tags: ["jakarlı", "runner"],
        description: "Jakarlı dokuma, şık masa runner'ı.",
        descTags: ["jakarlı", "runner"],
        descTemplate: "{jakarlı} woven, elegant table {runner}.",
        category: "yasam",
        price: 24.99,
        features: ["Jakarlı Dokuma", "Saçaklı", "Dekoratif", "Çeşitli Renkler"],
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
            "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80"
        ]
    },
    {
        id: 23,
        name: "Pamuk Peçete Seti",
        tags: ["pamuk", "peçete", "set"],
        description: "Pamuklu kumaştan, 6'lı peçete seti.",
        descTags: ["pamuk", "peçete"],
        descTemplate: "{pamuk} fabric, 6-piece {peçete} set.",
        category: "yasam",
        price: 19.99,
        features: ["Saf Pamuk", "6 Adet", "Ütülenebilir", "Yıkanabilir"],
        image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80",
            "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80"
        ]
    },
    {
        id: 24,
        name: "Kadife Yastık Kılıfı",
        tags: ["kadife", "yastık_kılıfı"],
        description: "Kadife kumaştan dekoratif kırlent kılıfı.",
        descTags: ["kadife", "yastık_kılıfı"],
        descTemplate: "{kadife} fabric decorative {yastık_kılıfı}.",
        category: "yasam",
        price: 17.99,
        features: ["Kadife Kumaş", "Fermuarlı", "45x45cm", "Dekoratif"],
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
        ]
    },
    {
        id: 25,
        name: "Keten Perde",
        tags: ["keten", "perde"],
        description: "Doğal keten kumaştan, hafif geçirgen tül perde.",
        descTags: ["keten", "perde"],
        descTemplate: "Natural {keten} fabric, semi-transparent {perde}.",
        category: "yasam",
        price: 44.99,
        features: ["Doğal Keten", "Yarı Geçirgen", "Halkalı", "140x260cm"],
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"
        ]
    },

    // === BEACH & SPA (5 ürün) ===
    {
        id: 26,
        name: "Plaj Havlusu",
        tags: ["pamuk", "plaj_havlusu"],
        description: "Büyük boy pamuklu plaj havlusu, canlı renkler ve desenler.",
        descTags: ["pamuk", "plaj_havlusu"],
        descTemplate: "Large size {pamuk} {plaj_havlusu}, vibrant colors and patterns.",
        category: "beach-spa",
        price: 29.99,
        features: ["Büyük Boy", "Hızlı Kuruma", "Canlı Renkler", "100x180cm"],
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80"
        ]
    },
    {
        id: 27,
        name: "Hamam Havlusu",
        tags: ["pamuk", "hamam"],
        description: "Geleneksel Türk hamam havlusu, ince ve hafif.",
        descTags: ["hamam"],
        descTemplate: "Traditional Turkish {hamam}, thin and lightweight.",
        category: "beach-spa",
        price: 22.99,
        features: ["Geleneksel Dokuma", "İnce & Hafif", "Çok Amaçlı", "Hızlı Kuruma"],
        image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"
        ]
    },
    {
        id: 28,
        name: "Pareo",
        tags: ["pamuk", "pareo"],
        description: "Hafif pamuklu pareo, plajda ve havuzda kullanıma uygun.",
        descTags: ["pareo"],
        descTemplate: "Lightweight cotton {pareo}, suitable for beach and pool use.",
        category: "beach-spa",
        price: 18.99,
        features: ["Hafif Kumaş", "Çok Amaçlı", "Baskılı", "100x180cm"],
        image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"
        ]
    },
    {
        id: 29,
        name: "Spa Bornoz",
        tags: ["lüks", "bornoz"],
        description: "Spa kalitesinde, lüks bukle bornoz. Otel ve spa kullanımı için ideal.",
        descTags: ["lüks", "bornoz"],
        descTemplate: "Spa quality, {lüks} terry {bornoz}. Ideal for hotel and spa use.",
        category: "beach-spa",
        price: 89.99,
        features: ["Spa Kalite", "Ağır Gramaj", "Şal Yaka", "Nakışlı"],
        image: "https://images.unsplash.com/photo-1620756235644-9ae16208d7f1?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1620756235644-9ae16208d7f1?w=600&q=80",
            "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600&q=80"
        ]
    },
    {
        id: 30,
        name: "Plaj Çantası Set",
        tags: ["pamuk", "plaj_havlusu", "set"],
        description: "Plaj havlusu ve çanta seti, yaz tatili için eksiksiz paket.",
        descTags: ["plaj_havlusu"],
        descTemplate: "{plaj_havlusu} and bag set, complete package for summer vacation.",
        category: "beach-spa",
        price: 49.99,
        features: ["Havlu + Çanta", "Su Geçirmez Çanta", "Fermuarlı", "Canlı Desenler"],
        image: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=600&q=80",
            "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80"
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
 */
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

/**
 * Benzer ürünleri getir (aynı kategori, kendisi hariç)
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
