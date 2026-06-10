'use strict';

const VaultStore = (() => {

  /*--- Chaves do localStorage ---*/
  const CART_KEY  = 'valt_cart';
  const FAV_KEY   = 'valt_favorites';

  /* ── Leitura/Escrita ── */
  const load  = key => JSON.parse(localStorage.getItem(key) || '[]');
  const save  = (key, data) => localStorage.setItem(key, JSON.stringify(data));
  const emit  = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  /*--- CARRINHO ---*/
  function getCart() { return load(CART_KEY); }

  function addToCart(product) {
    const cart = getCart();
    const idx  = cart.findIndex(i => i.id === product.id);
    if (idx > -1) {
      cart[idx].qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    save(CART_KEY, cart);
    emit('cart:updated', { cart });
    _showToast(`"${product.name}" adicionado ao carrinho!`, 'cart');
  }

  function removeFromCart(productId) {
    const cart = getCart().filter(i => i.id !== productId);
    save(CART_KEY, cart);
    emit('cart:updated', { cart });
  }

  function updateQty(productId, qty) {
    if (qty < 1) { removeFromCart(productId); return; }
    const cart = getCart();
    const idx  = cart.findIndex(i => i.id === productId);
    if (idx > -1) { cart[idx].qty = qty; save(CART_KEY, cart); emit('cart:updated', { cart }); }
  }

  function clearCart() {
    save(CART_KEY, []);
    emit('cart:updated', { cart: [] });
  }

  function getCartCount()  { return getCart().reduce((s, i) => s + i.qty, 0); }
  function getCartTotal()  { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }

  /*--- FAVORITOS ---*/
  function getFavorites() { return load(FAV_KEY); }

  function toggleFavorite(product) {
    const favs = getFavorites();
    const idx  = favs.findIndex(i => i.id === product.id);
    let msg;
    if (idx > -1) {
      favs.splice(idx, 1);
      msg = `"${product.name}" removido dos favoritos.`;
    } else {
      favs.push(product);
      msg = `"${product.name}" adicionado aos favoritos!`;
    }
    save(FAV_KEY, favs);
    emit('favorites:updated', { favs });
    _showToast(msg, 'fav');
  }

  function isFavorited(productId) { return getFavorites().some(i => i.id === productId); }
  function getFavCount()          { return getFavorites().length; }

  /*AVISOS DE NOTIFICAÇÕES*/
  function _showToast(msg, type = 'cart') {
    let container = document.getElementById('valt-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'valt-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `valt-toast valt-toast--${type}`;
    toast.innerHTML = `
      <span class="valt-toast-icon">${type === 'cart' ? '🛒' : '❤️'}</span>
      <span class="valt-toast-msg">${msg}</span>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('valt-toast--show'));
    setTimeout(() => {
      toast.classList.remove('valt-toast--show');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  /*--- API PÚBLICA ---*/
  return {
    // Cart
    getCart, addToCart, removeFromCart, updateQty, clearCart,
    getCartCount, getCartTotal,
    // Favorites
    getFavorites, toggleFavorite, isFavorited, getFavCount,
  };
})();

(function initHeaderBadges() {
  function updateBadges() {
    const favCount   = VaultStore.getFavCount();
    const isLoggedIn = !!localStorage.getItem('vault_token');

    /* alerta do Carrinho (visitantes: localStorage; logados: carrinho-ui) */
    if (!isLoggedIn) {
      const cartCount = VaultStore.getCartCount();
      document.querySelectorAll('[data-valt="cart-btn"]').forEach(btn => {
        btn.setAttribute('aria-label', `Carrinho (${cartCount})`);
        let badge = btn.querySelector('.valt-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'valt-badge';
          btn.style.position = 'relative';
          btn.appendChild(badge);
        }
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
      });
    }

    /*--- alerta dos Favoritos (visitantes: localStorage; logados: favoritos-ui) ---*/
    if (!isLoggedIn) {
      document.querySelectorAll('[data-valt="fav-btn"]').forEach(btn => {
        btn.setAttribute('aria-label', `Favoritos (${favCount})`);
        let badge = btn.querySelector('.valt-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'valt-badge';
          btn.style.position = 'relative';
          btn.appendChild(badge);
        }
        badge.textContent = favCount;
        badge.style.display = favCount > 0 ? 'flex' : 'none';
      });
    }
  }

  document.addEventListener('cart:updated',      updateBadges);
  document.addEventListener('favorites:updated', updateBadges);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateBadges);
  } else {
    updateBadges();
  }
})();
