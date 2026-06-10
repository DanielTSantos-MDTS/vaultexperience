// favoritos-ui.js - Integração UI de Favoritos

import FavoritosAPI from './favoritos-api.js';
import { getToken } from './api.js';

const API_BASE = 'http://localhost:3000';

function resolveImage(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

function mapFavToProduct(fav) {
  const item = fav.item || {};
  return {
    id: String(item._id || fav.item),
    name: item.titulo || 'Produto',
    price: parseFloat(item.precoOriginal) || 0,
    image: resolveImage(item.imagens?.[0]),
    subcat: item.subcategoria || item.franquia || '',
    subcatLabel: item.subcategoria || item.franquia || item.categoria?.nome || 'Produto',
    rating: 4.5,
    ratingCount: 0,
  };
}

const FavoritosUI = {
  init() {
    this.sincronizarFavoritos();
  },

  async getFavorites() {
    if (!getToken()) return [];
    const favoritos = await FavoritosAPI.listar();
    return favoritos.map(mapFavToProduct);
  },

  async remover(itemId) {
    if (!getToken()) return;
    await FavoritosAPI.remover(itemId);
    await this.sincronizarFavoritos();
    this.showToast('Removido dos favoritos', 'success');
  },

  async toggleFavorito(btn, itemId) {
    try {
      if (!getToken()) {
        this.showToast('Faça login para adicionar favoritos', 'error');
        window.location.href = 'login.html';
        return;
      }

      const isFavorito = btn.classList.contains('faved');
      await FavoritosAPI.toggle(itemId, isFavorito);
      this.setButtonState(btn, !isFavorito);
      this.showToast(isFavorito ? 'Removido dos favoritos' : 'Adicionado aos favoritos!', 'success');
      await this.sincronizarFavoritos();
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      this.showToast('Erro ao atualizar favoritos', 'error');
    }
  },

  setButtonState(btn, faved) {
    btn.classList.toggle('faved', faved);

    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('ti-heart-filled', faved);
      icon.classList.toggle('ti-heart', !faved);
      return;
    }

    if (btn.classList.contains('btn-wishlist') || btn.id === 'btn-wishlist') {
      btn.innerHTML = faved
        ? `<svg width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Remover dos favoritos`
        : `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Adicionar à lista de desejos`;
    }
  },

  async sincronizarFavoritos() {
    try {
      if (!getToken()) return;

      const favoritos = await FavoritosAPI.listar();
      const itemIds = new Set(favoritos.map(f => String(f.item?._id || f.item)));

      document.querySelectorAll('[data-item-id]').forEach(btn => {
        if (!btn.classList.contains('product-fav-btn') && btn.id !== 'btn-wishlist') return;
        const itemId = String(btn.dataset.itemId || '');
        this.setButtonState(btn, itemIds.has(itemId));
      });

      this.updateHeaderBadge(itemIds.size);
      document.dispatchEvent(new CustomEvent('favoritos:updated', {
        detail: { favoritos: favoritos.map(mapFavToProduct) },
      }));
    } catch (error) {
      console.error('Erro ao sincronizar favoritos:', error);
    }
  },

  updateHeaderBadge(favCount) {
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
  },

  showToast(message, type = 'fav') {
    let container = document.getElementById('valt-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'valt-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `valt-toast valt-toast--${type === 'error' ? 'cart' : 'fav'}`;
    toast.innerHTML = `
      <span class="valt-toast-icon">${type === 'error' ? '⚠️' : '❤️'}</span>
      <span class="valt-toast-msg">${message}</span>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('valt-toast--show'));
    setTimeout(() => {
      toast.classList.remove('valt-toast--show');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  },
};

window.vaultToggleFavorite = async function (itemId, product, btn) {
  if (getToken()) {
    await FavoritosUI.toggleFavorito(btn, itemId);
    return;
  }
  if (typeof VaultStore === 'undefined') return;
  VaultStore.toggleFavorite(product);
  const faved = VaultStore.isFavorited(itemId);
  FavoritosUI.setButtonState(btn, faved);
};

window.FavoritosUI = FavoritosUI;

async function bootFavoritosUI() {
  await FavoritosUI.init();
  document.dispatchEvent(new CustomEvent('favoritos:ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootFavoritosUI);
} else {
  bootFavoritosUI();
}

export default FavoritosUI;
