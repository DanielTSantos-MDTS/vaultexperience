'use strict';
function renderStars(rating) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

function createFavCard(p) {
  const card = document.createElement('a');
  card.href = 'produto.html';
  card.className = 'product-card';
  card.dataset.productId = p.id;

  const priceFromHtml = p.priceFrom
    ? `<div class="product-price-from">R$ ${fmt(p.priceFrom)}</div>`
    : '';

  const badgeHtml = p.badge
    ? `<div class="product-badges"><span class="badge badge-${badgeCls(p.badge)}">${p.badge}</span></div>`
    : '';

  const stars = renderStars(p.rating || 4.5);

  card.innerHTML = `
    <div class="product-card-img">
      <div class="card-skeleton-img"></div>
      ${badgeHtml}
      <button class="product-fav-btn faved" aria-label="Remover dos favoritos"
        onclick="event.preventDefault(); removeFav('${p.id}')">
        <i class="ti ti-heart-filled"></i>
      </button>
    </div>
    <div class="product-card-body">
      <div class="product-card-tag">${p.subcatLabel || p.subcat || 'Produto'}</div>
      <div class="product-card-name">${p.name}</div>
      <div class="product-card-rating">
        <div class="stars-display">${stars}</div>
        <span class="rating-count">(${p.ratingCount || 0})</span>
      </div>
      <div class="product-card-footer">
        <div class="product-price-wrap">
          ${priceFromHtml}
          <div class="product-price"><span>R$</span> ${fmt(p.price)}</div>
        </div>
        
        <button class="product-add-btn" aria-label="Adicionar ao carrinho"
          onclick="event.preventDefault(); addToCartFromFav(${JSON.stringify(p).replace(/"/g, '&quot;')})">
          <i class="ti ti-shopping-cart-plus"></i>
        </button>
      </div>
    </div>
  `;
  return card;
}

function badgeCls(badge) {
  if (badge === 'HOT')      return 'hot';
  if (badge === 'NEW')      return 'new';
  if (badge?.includes('OFF')) return 'off';
  return 'pre';
}

function renderFavorites() {
  const favs    = VaultStore.getFavorites();
  const grid    = document.getElementById('fav-grid');
  const empty   = document.getElementById('fav-empty');
  const label   = document.getElementById('fav-count-label');
  const clearBtn = document.getElementById('fav-clear-btn');

  if (label) {
    label.textContent = `${favs.length} produto${favs.length !== 1 ? 's' : ''} salvo${favs.length !== 1 ? 's' : ''}`;
  }

  if (!grid || !empty) return;

  if (favs.length === 0) {
    grid.style.display  = 'none';
    empty.style.display = 'flex';
    if (clearBtn) clearBtn.style.display = 'none';
  } else {
    grid.style.display  = 'grid';
    empty.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'flex';
    grid.innerHTML = '';
    favs.forEach(p => grid.appendChild(createFavCard(p)));
  }
}

function removeFav(productId) {
  const favs = VaultStore.getFavorites();
  const product = favs.find(p => p.id === productId);
  if (product) {
    VaultStore.toggleFavorite(product);
    renderFavorites(); 
  }
}

function addToCartFromFav(product) {
  VaultStore.addToCart(product);

  if (typeof updateHeaderBadges === 'function') {
    updateHeaderBadges();
  }
}

function clearAllFavorites() {
  if (!confirm('Deseja remover todos os favoritos?')) return;
  
  // Clonagem do array para evitar problemas de concorrência ao deletar dentro do loop (não apaga isso gente)
  const favs = [...VaultStore.getFavorites()];
  favs.forEach(p => VaultStore.toggleFavorite(p));
  renderFavorites();
}

window.removeFav = removeFav;
window.addToCartFromFav = addToCartFromFav;

/*--- INICIALIZAÇÃO ÚNICA DA PÁGINA ---*/
document.addEventListener('DOMContentLoaded', () => {
  renderFavorites();
  const clearBtn = document.getElementById('fav-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllFavorites);
  }
});

document.addEventListener('vault:favorites_updated', renderFavorites);
document.addEventListener('vault:store_ready', renderFavorites);