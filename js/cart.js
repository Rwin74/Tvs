/**
 * TVS Tekstil - Sepet & WhatsApp Sipariş Sistemi
 * localStorage tabanlı sepet, WhatsApp üzerinden sipariş gönderimi
 */
const Cart = {
    items: [],
    isOpen: false,
    whatsappNumber: '905551234567', // TODO: Gerçek numara ile değiştir

    /**
     * Sepeti başlat
     */
    init() {
        this.load();
        this.updateBadge();
        this.bindEvents();
    },

    /**
     * localStorage'dan sepeti yükle
     */
    load() {
        try {
            const saved = localStorage.getItem('tvs_cart');
            this.items = saved ? JSON.parse(saved) : [];
        } catch {
            this.items = [];
        }
    },

    /**
     * localStorage'a kaydet
     */
    save() {
        localStorage.setItem('tvs_cart', JSON.stringify(this.items));
    },

    /**
     * Ürün ekle
     */
    add(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) return;

        const existing = this.items.find(item => item.id === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                quantity: quantity
            });
        }

        this.save();
        this.updateBadge();
        this.showAddedFeedback(productId);

        if (this.isOpen) this.render();
    },

    /**
     * Ürün kaldır
     */
    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateBadge();
        if (this.isOpen) this.render();
    },

    /**
     * Miktarı güncelle 
     */
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.remove(productId);
            return;
        }
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.save();
            this.updateBadge();
            if (this.isOpen) this.render();
        }
    },

    /**
     * Sepeti temizle
     */
    clear() {
        this.items = [];
        this.save();
        this.updateBadge();
        if (this.isOpen) this.render();
    },

    /**
     * Toplam ürün sayısı
     */
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    /**
     * Toplam fiyat
     */
    getTotalPrice() {
        return this.items.reduce((sum, item) => {
            const product = getProductById(item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
    },

    /**
     * Header'daki sepet badge'ini güncelle
     */
    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const total = this.getTotalItems();
            badge.textContent = total;
            badge.style.display = total > 0 ? 'flex' : 'none';
        }
    },

    /**
     * Ürün eklendi feedback'i
     */
    showAddedFeedback(productId) {
        // Kısa bir popup göster
        const feedback = document.createElement('div');
        feedback.className = 'cart-feedback';
        feedback.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span data-i18n="cart_modal.added">${I18n.t('products_page.add_to_cart')} ✓</span>
    `;
        document.body.appendChild(feedback);

        requestAnimationFrame(() => feedback.classList.add('show'));

        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 1500);
    },

    /**
     * Sepet modalını aç/kapa
     */
    toggle() {
        this.isOpen = !this.isOpen;
        const modal = document.getElementById('cart-modal');
        const overlay = document.getElementById('cart-overlay');

        if (this.isOpen) {
            this.render();
            modal.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    },

    /**
     * Sepet içeriğini render et
     */
    render() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        const emptyEl = document.getElementById('cart-empty');
        const actionsEl = document.getElementById('cart-actions');

        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            if (actionsEl) actionsEl.style.display = 'none';
            if (totalEl) totalEl.textContent = '€0.00';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';
        if (actionsEl) actionsEl.style.display = 'flex';

        container.innerHTML = this.items.map(item => {
            const product = getProductById(item.id);
            if (!product) return '';

            const name = I18n.translateProduct(product);

            return `
        <div class="cart-item">
          <img src="${product.image}" alt="${name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-name">${name}</h4>
            <span class="cart-item-price">€${product.price.toFixed(2)}</span>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="Cart.remove(${item.id})" title="${I18n.t('cart_modal.remove')}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
        }).join('');

        if (totalEl) {
            totalEl.textContent = `€${this.getTotalPrice().toFixed(2)}`;
        }
    },

    /**
     * WhatsApp sipariş mesajı oluştur ve gönder
     */
    sendWhatsApp() {
        if (this.items.length === 0) return;

        const lang = I18n.currentLang;
        let message = I18n.t('whatsapp.greeting') + '\n\n';

        this.items.forEach(item => {
            const product = getProductById(item.id);
            if (!product) return;

            const name = I18n.translateProduct(product);
            const line = I18n.t('whatsapp.product_line')
                .replace('{qty}', item.quantity)
                .replace('{name}', name)
                .replace('{price}', `€${(product.price * item.quantity).toFixed(2)}`);

            message += line + '\n';
        });

        message += '\n' + I18n.t('whatsapp.total_line')
            .replace('{total}', `€${this.getTotalPrice().toFixed(2)}`);

        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;

        window.open(url, '_blank');
    },

    /**
     * Tek ürün için WhatsApp mesajı
     */
    sendSingleWhatsApp(productId) {
        const product = getProductById(productId);
        if (!product) return;

        const name = I18n.translateProduct(product);
        const message = I18n.t('whatsapp.single_product')
            .replace('{name}', `${name} (€${product.price.toFixed(2)})`);

        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;

        window.open(url, '_blank');
    },

    /**
     * Event listener'ları bağla
     */
    bindEvents() {
        // Sepet butonuna tıklama
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }

        // Overlay'e tıklayınca kapat
        const overlay = document.getElementById('cart-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.toggle());
        }

        // Kapat butonuna tıklama
        const closeBtn = document.getElementById('cart-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggle());
        }
    }
};
