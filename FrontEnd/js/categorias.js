'use strict';
/*--- MAPEAMENTO DE DADOS ---*/
const CATALOG_DATA = {
  'consoles-jogos': {
    label: 'Consoles & Jogos',
    desc: 'PS5, Xbox, Nintendo, PC e joias do retro gaming',
    icon: '🎮',
    color: '#3a7bd5',
    subcats: {
      'playstation':  { label: 'PlayStation',  icon: 'ti-device-gamepad-2', desc: 'PS4, PS5 e acessórios' },
      'xbox':         { label: 'Xbox',          icon: 'ti-brand-xbox',       desc: 'Series X/S e Game Pass', badge: 'HOT' },
      'nintendo':     { label: 'Nintendo',      icon: 'ti-device-nintendo',  desc: 'Switch e portáteis' },
      'retro':        { label: 'Retro',         icon: 'ti-cpu',              desc: 'Mega Drive, SNES e mais', badge: 'NEW' },
      'jogos-pc':     { label: 'Jogos PC',      icon: 'ti-device-desktop',   desc: 'Keys e mídia física' },
    }
  },
  'livros-mangas': {
    label: 'Livros & Mangás',
    desc: 'Mangás, light novels, HQs e artbooks importados',
    icon: '📚',
    color: '#e87a1e',
    subcats: {
      'manga-shonen':  { label: 'Mangá Shonen',  icon: 'ti-books',   desc: 'Ação e aventura', badge: 'HOT' },
      'manga-seinen':  { label: 'Mangá Seinen',  icon: 'ti-book-2',  desc: 'Para público adulto' },
      'light-novels':  { label: 'Light Novels',  icon: 'ti-book',    desc: 'Nacionais e importadas', badge: 'NEW' },
      'hqs-comics':    { label: 'HQs & Comics',  icon: 'ti-writing', desc: 'Marvel, DC e independentes' },
      'artbooks':      { label: 'Artbooks',       icon: 'ti-palette', desc: 'Games, anime e cinema' },
    }
  },
  'funkos-figures': {
    label: 'Funkos & Figures',
    desc: 'Colecionáveis premium, Funko Pop, Nendoroids e mais',
    icon: '🏆',
    color: '#1ec8a0',
    subcats: {
      'funko-pop':       { label: 'Funko Pop',       icon: 'ti-ghost',      desc: 'Anime, games e filmes', badge: 'HOT' },
      'nendoroids':      { label: 'Nendoroids',      icon: 'ti-mood-smile', desc: 'Good Smile Company' },
      'figmas':          { label: 'Figmas',           icon: 'ti-man',        desc: 'Articulados e detalhados' },
      'estatuetas':      { label: 'Estatuetas',       icon: 'ti-crown',      desc: 'Colecionáveis premium' },
      'edicao-limitada': { label: 'Edição Limitada',  icon: 'ti-diamond',    desc: 'Itens exclusivos', badge: '15% OFF' },
    }
  },
  'assinaturas-keys': {
    label: 'Assinaturas & Keys',
    desc: 'Ative agora: PSN, Game Pass, Nintendo Online e Steam',
    icon: '🔑',
    color: '#7b5cf7',
    subcats: {
      'ps-plus':         { label: 'PlayStation Plus', icon: 'ti-device-gamepad-2', desc: 'Essential, Extra e Premium' },
      'game-pass':       { label: 'Xbox Game Pass',   icon: 'ti-brand-xbox',       desc: 'PC e console', badge: 'HOT' },
      'nintendo-online': { label: 'Nintendo Online',  icon: 'ti-device-nintendo',  desc: 'Individual e familiar' },
      'steam':           { label: 'Steam Gift Cards', icon: 'ti-brand-steam',      desc: 'Créditos para sua conta' },
      'ea-play':         { label: 'EA Play',           icon: 'ti-player-play',      desc: 'Acesso ao catálogo EA' },
    }
  },
  'em-alta': {
    label: 'Em Alta',
    desc: 'Os mais quentes do momento: tendências, novidades e ofertas',
    icon: '🔥',
    color: '#e84a3a',
    subcats: {
      'mais-vendidos': { label: 'Mais Vendidos', icon: 'ti-trending-up', desc: 'Os queridinhos da semana', badge: 'HOT' },
      'novidades':     { label: 'Novidades',     icon: 'ti-sparkles',    desc: 'Chegou agora no estoque', badge: 'NEW' },
      'promocoes':     { label: 'Promoções',     icon: 'ti-tag',         desc: 'Descontos imperdíveis', badge: '20% OFF' },
      'pre-venda':     { label: 'Pré-venda',     icon: 'ti-clock',       desc: 'Reserve antes de todo mundo' },
    }
  },
  'acessorios': {
    label: 'Acessórios',
    desc: 'Controles, headsets, periféricos e decoração geek',
    icon: '🎧',
    color: '#3dc94e',
    subcats: {
      'controles':          { label: 'Controles',           icon: 'ti-device-gamepad', desc: 'Para todos os consoles' },
      'headsets':           { label: 'Headsets',            icon: 'ti-headphones',     desc: 'Som imersivo para games' },
      'mousepads-teclados': { label: 'Mousepads & Teclados', icon: 'ti-keyboard',       desc: 'Setup gamer completo', badge: 'NEW' },
      'casa-decor':         { label: 'Casa & Decor',        icon: 'ti-home',           desc: 'Almofadas, canecas e luminárias' },
    }
  },
  'softwares': {
    label: 'Softwares',
    desc: 'Antivírus, produtividade, edição e utilitários',
    icon: '💻',
    color: '#4a9eff',
    subcats: {
      'antivirus':      { label: 'Antivírus',       icon: 'ti-shield',    desc: 'Proteção para seu PC' },
      'produtividade':  { label: 'Produtividade',   icon: 'ti-briefcase', desc: 'Office e ferramentas' },
      'edicao-design':  { label: 'Edição & Design', icon: 'ti-vector',    desc: 'Adobe, Canva e mais', badge: '10% OFF' },
      'utilitarios':    { label: 'Utilitários',     icon: 'ti-tool',      desc: 'VPN, backup e otimização' },
    }
  }
};

/*--- API — catálogo real (GET /item) ---*/
const API_BASE = 'http://localhost:3000';

const CAT_TO_BACKEND = {
  'consoles-jogos':   ['consoles', 'jogos'],
  'livros-mangas':    ['livros', 'mangas', 'mangás'],
  'funkos-figures':   ['figures', 'funkos'],
  'assinaturas-keys': ['assinaturas', 'keys'],
  'em-alta':          null,
  'acessorios':       ['acessorios'],
  'softwares':        ['softwares'],
};

let categorySlugMap = { ...CAT_TO_BACKEND };

function buildCategorySlugMap(apiCategories) {
  const map = {};
  for (const [frontKey, defaults] of Object.entries(CAT_TO_BACKEND)) {
    if (frontKey === 'em-alta') {
      map[frontKey] = null;
      continue;
    }
    const matched = apiCategories.flatMap(c => {
      const slug = (c.slug || '').toLowerCase();
      const nome = (c.nome || '').toLowerCase();
      const hit = defaults.some(d => slug === d || nome === d || slug.includes(d) || nome.includes(d));
      return hit ? [slug, nome].filter(Boolean) : [];
    });
    map[frontKey] = [...new Set([...(defaults || []), ...matched])];
  }
  return map;
}

async function loadCategoriesFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/categoria`);
    if (!res.ok) return;
    const cats = await res.json();
    if (!Array.isArray(cats) || !cats.length) return;
    categorySlugMap = buildCategorySlugMap(cats);
  } catch (err) {
    console.warn('Categorias API indisponível, usando mapeamento local.', err);
  }
}

function toSubcatKey(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function resolveImage(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
}

function mapItemToProduct(item) {
  const price = parseFloat(item.precoOriginal) || 0;
  const badges = Array.isArray(item.badges) ? item.badges : [];
  const badge = badges[0] || null;
  const postedAt = item.dataPostagem ? new Date(item.dataPostagem) : null;
  const isRecent = postedAt && (Date.now() - postedAt.getTime()) < 30 * 24 * 60 * 60 * 1000;
  const subcatLabel = item.subcategoria || item.franquia || item.categoria?.nome || 'Geral';

  return {
    id: item._id,
    name: item.titulo || 'Produto',
    subcat: toSubcatKey(item.subcategoria || item.franquia || ''),
    subcatLabel,
    categoriaNome: (item.categoria?.nome || '').toLowerCase(),
    categoriaSlug: (item.categoria?.slug || '').toLowerCase(),
    franquia: item.franquia || '',
    price,
    priceFrom: null,
    rating: 4.5,
    ratingCount: 0,
    badge,
    inStock: (item.estoqueQtd ?? 1) > 0,
    isNew: badge === 'NEW' || isRecent,
    isPromo: Boolean(badge && String(badge).includes('OFF')),
    image: resolveImage(item.imagens?.[0]),
    postedAt,
  };
}

async function loadProductsFromAPI() {
  const res = await fetch(`${API_BASE}/item`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const items = await res.json();
  if (!Array.isArray(items)) throw new Error('Resposta inválida da API');
  return items.map(mapItemToProduct);
}

function matchesCategory(product, cat) {
  const backendCats = categorySlugMap[cat];
  if (cat === 'em-alta' || !backendCats) return true;
  return backendCats.includes(product.categoriaNome)
    || backendCats.includes(product.categoriaSlug);
}

function matchesSubcategory(product, cat, sub) {
  if (!sub) return true;
  if (cat === 'em-alta') {
    if (sub === 'novidades') return product.isNew;
    if (sub === 'promocoes') return product.isPromo;
    return true;
  }
  const expectedLabel = CATALOG_DATA[cat]?.subcats?.[sub]?.label;
  if (product.subcat === sub) return true;
  if (expectedLabel && product.subcatLabel.toLowerCase() === expectedLabel.toLowerCase()) return true;
  return toSubcatKey(product.subcatLabel) === sub;
}

function getCatalogProducts() {
  let items = [...state.allProducts];

  if (state.filtro) {
    const term = state.filtro.toLowerCase();
    return items.filter(p => (p.franquia || p.name || '').toLowerCase().includes(term));
  }

  items = items.filter(p => matchesCategory(p, state.cat));
  items = items.filter(p => matchesSubcategory(p, state.cat, state.sub));
  return items;
}

/*--- STATE ---*/
const state = {
  cat: '',
  sub: '',
  filtro: '',
  loadError: null,
  sort: 'relevancia',
  view: 'grid',
  priceMin: null,
  priceMax: null,
  rating: null,
  onlyStock: false,
  onlyPromo: false,
  onlyNew: false,
  page: 1,
  perPage: 12,
  allProducts: [],
};

/*=== DOM REFS ===*/
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const dom = {
  bcCat:       $('#bc-cat'),
  bcSub:       $('#bc-sub'),
  bcSubSep:    $('#bc-sub-sep'),
  heroEl:      $('#cat-hero'),
  heroTitle:   $('#cat-hero-title'),
  heroDesc:    $('#cat-hero-desc'),
  heroIcon:    $('#cat-hero-icon'),
  heroStats:   $('#cat-hero-stats'),
  statProds:   $('#stat-products'),
  subcatPills: $('#subcat-pills'),
  subcatWrap:  $('#subcat-pills-wrap'),
  subcatsList: $('#subcats-list'),
  resultsNum:  $('#results-num'),
  sortSel:     $('#sort-select'),
  viewGrid:    $('#view-grid'),
  viewList:    $('#view-list'),
  grid:        $('#catalog-grid'),
  emptyState:  $('#empty-state'),
  pagination:  $('#catalog-pagination'),
  filterBar:   $('#active-filters-bar'),
  filterChips: $('#active-filters-chips'),
  filterBadge: $('#filter-badge'),
  filterMobileBtn: $('#filter-mobile-btn'),
  mobileOverlay:   $('#mobile-filter-overlay'),
  mobileDrawer:    $('#mobile-filter-drawer'),
  mobileBody:      $('#mobile-filter-body'),
  priceMin:    $('#price-min'),
  priceMax:    $('#price-max'),
  applyPrice:  $('#apply-price'),
  filterStock: $('#filter-instock'),
  filterPromo: $('#filter-promo'),
  filterNew:   $('#filter-new'),
  clearFilters:  $('#clear-filters'),
  btnClearAll:   $('#btn-clear-all'),
  clearMobile:   $('#clear-mobile'),
  applyMobile:   $('#apply-mobile'),
  closeMobileFilter: $('#close-filter-drawer'),
  pageTitle:   document.querySelector('title'),
};

/*--- INICIALIZAÇÃO ---*/
async function init() {
  const params = new URLSearchParams(window.location.search);
  state.cat = params.get('cat') || 'em-alta';
  state.sub = params.get('sub') || '';
  state.filtro = params.get('filtro') || '';

  if (!CATALOG_DATA[state.cat]) {
    state.cat = 'em-alta';
  }

  if (state.sub && !CATALOG_DATA[state.cat].subcats[state.sub]) {
    state.sub = '';
  }

  renderBreadcrumb();
  renderSubcatPills();
  renderSidebarSubcats();
  renderSkeletons(12);

  try {
    state.loadError = null;
    await loadCategoriesFromAPI();
    state.allProducts = await loadProductsFromAPI();
  } catch (err) {
    console.error('Erro ao carregar catálogo:', err);
    state.allProducts = [];
    state.loadError = 'Não foi possível carregar os produtos. Verifique se o servidor está online.';
  }

  renderHero();
  renderProducts();
  bindEventsCategorias();
  updateNavbarActive();
}

/*--- RENDER — BREADCRUMB ---*/
function renderBreadcrumb() {

  if (!dom.bcCat) return;
  
  const catInfo = CATALOG_DATA[state.cat];
  dom.bcCat.textContent = catInfo?.label || state.cat;

  if (state.sub && catInfo?.subcats?.[state.sub]) {
    dom.bcSubSep.classList.remove('hidden');
    dom.bcSub.classList.remove('hidden');
    dom.bcSub.textContent = catInfo.subcats[state.sub].label;
  } else {
    dom.bcSubSep.classList.add('hidden');
    dom.bcSub.classList.add('hidden');
  }
}

/*--- RENDER — HERO ---*/
function renderHero() {

  if (!dom.heroEl) return;
  
  const catInfo = CATALOG_DATA[state.cat];
  if (!catInfo) return;

  dom.heroEl.dataset.cat = state.cat;
  if (state.filtro) {
    dom.heroTitle.textContent = state.filtro;
    dom.heroDesc.textContent  = `Produtos da franquia ${state.filtro}`;
  } else {
    dom.heroTitle.textContent = state.sub
      ? catInfo.subcats[state.sub]?.label || catInfo.label
      : catInfo.label;
    dom.heroDesc.textContent  = catInfo.desc;
  }
  dom.heroIcon.textContent  = catInfo.icon;

  // ATUALIZAR TÍTULO DA PÁGINA DINAMICAMENTE
  dom.pageTitle.textContent = `${dom.heroTitle.textContent} – Vault Experience`;

  // COMEÇAR ANIMAÇÃO DO NÚMERO DE PRODUTOS
  animateCount(dom.statProds, 0, getCatalogProducts().length, 800);
}

function animateCount(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(from + (to - from) * easeOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/*--- RENDER — SUBCATEGORIAS ---*/
function renderSubcatPills() {

  if(!dom.subcatPills) return;
  
  const catInfo = CATALOG_DATA[state.cat];
  if (!catInfo) return;

  dom.subcatPills.innerHTML = '';

  const allPill = makePill('', 'Todos', 'ti-layout-grid', !state.sub);
  dom.subcatPills.appendChild(allPill);

  Object.entries(catInfo.subcats).forEach(([key, info]) => {
    const pill = makePill(key, info.label, info.icon, state.sub === key);
    dom.subcatPills.appendChild(pill);
  });
}

function makePill(subKey, label, iconCls, isActive) {
  const btn = document.createElement('button');
  btn.className = 'pill-btn' + (isActive ? ' active' : '');
  btn.innerHTML = `<i class="ti ${iconCls}"></i>${label}`;
  btn.addEventListener('click', () => {
    state.sub   = subKey;
    state.page  = 1;
    renderSubcatPills();
    renderSidebarSubcats();
    renderBreadcrumb();
    renderHero();
    renderProducts();
    updateURL();
  });
  return btn;
}

/*--- RENDER — SUBCATÁLOGOS DA BARRA LATERAL ---*/
function renderSidebarSubcats() {

  if(!dom.subcatsList) return;
  
  const catInfo = CATALOG_DATA[state.cat];
  if (!catInfo) return;
  dom.subcatsList.innerHTML = '';

  Object.entries(catInfo.subcats).forEach(([key, info]) => {
    const btn = document.createElement('button');
    btn.className = 'subcat-filter-btn' + (state.sub === key ? ' active' : '');
    btn.innerHTML = `<i class="ti ${info.icon}"></i>${info.label}`;
    btn.addEventListener('click', () => {
      state.sub   = state.sub === key ? '' : key;
      state.page  = 1;
      renderSubcatPills();
      renderSidebarSubcats();
      renderBreadcrumb();
      renderHero();
      renderProducts();
      updateURL();
    });
    dom.subcatsList.appendChild(btn);
  });
}

/*--- FILTRAR + CLASSIFICAR + PAGINAR ---*/
function getFiltered() {
  let items = getCatalogProducts();

  if (state.priceMin !== null) items = items.filter(p => p.price >= state.priceMin);
  if (state.priceMax !== null) items = items.filter(p => p.price <= state.priceMax);

  if (state.rating)    items = items.filter(p => p.rating >= state.rating);

  if (state.onlyStock) items = items.filter(p => p.inStock);
  if (state.onlyPromo) items = items.filter(p => p.isPromo);
  if (state.onlyNew)   items = items.filter(p => p.isNew);

  switch (state.sort) {
    case 'preco-asc':  items.sort((a, b) => a.price - b.price); break;
    case 'preco-desc': items.sort((a, b) => b.price - a.price); break;
    case 'avaliacao':  items.sort((a, b) => b.rating - a.rating); break;
    case 'novidades':  items.sort((a, b) => (a.isNew ? -1 : 1)); break;
  }

  return items;
}

function getPaged(items) {
  const start = (state.page - 1) * state.perPage;
  return items.slice(start, start + state.perPage);
}

/*--- RENDERS --- */
function renderProducts() {

  if(!dom.resultsNum) return;
  
  const filtered = getFiltered();
  const paged    = getPaged(filtered);

  // RESULTADOS ENCONTRADOS
  dom.resultsNum.textContent = filtered.length;

  // ESTADO DE FILTROS ATIVOS
  updateActiveFiltersBar();
  updateFilterBadge();

  // ESTADO DE VAZIO
  if (filtered.length === 0) {
    dom.grid.innerHTML = '';
    dom.emptyState.classList.remove('hidden');
    const emptyTitle = dom.emptyState.querySelector('h3');
    const emptyText  = dom.emptyState.querySelector('p');
    if (state.loadError && emptyTitle && emptyText) {
      emptyTitle.textContent = 'Erro ao carregar';
      emptyText.textContent = state.loadError;
    } else if (emptyTitle && emptyText) {
      emptyTitle.textContent = 'Nenhum produto encontrado';
      emptyText.textContent = 'Tente ajustar os filtros ou buscar por outro termo.';
    }
    dom.pagination.innerHTML = '';
    return;
  }
  dom.emptyState.classList.add('hidden');

  // ESQUELETO + RENDER FINAL
  renderSkeletons(paged.length);
  setTimeout(() => {
    renderCards(paged);
    renderPagination(filtered.length);
  }, 350);
}

function renderSkeletons(count) {
  dom.grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'skeleton-card';
    el.innerHTML = `
      <div class="sk-img"></div>
      <div class="sk-body">
        <div class="sk-line" style="height:10px;width:45%;"></div>
        <div class="sk-line" style="height:14px;width:90%;"></div>
        <div class="sk-line" style="height:12px;width:65%;"></div>
        <div class="sk-line" style="height:20px;width:40%;margin-top:6px;"></div>
      </div>
    `;
    dom.grid.appendChild(el);
  }
}

function renderCards(products) {
  dom.grid.innerHTML = '';
  products.forEach((p, i) => {
    const card = createProductCard(p, i);
    dom.grid.appendChild(card);
  });

  // APLICAÇÃO DO LAYOUT
  if (state.view === 'list') {
    dom.grid.classList.add('list-view');
  } else {
    dom.grid.classList.remove('list-view');
  }
}

function createProductCard(p, idx) {
  const card = document.createElement('a');
  card.href = `produto.html?id=${p.id}`;
  card.className = 'product-card';
  card.style.animationDelay = `${idx * 0.055}s`;

  const badgeHtml = p.badge
    ? `<div class="product-badges"><span class="badge badge-${badgeCls(p.badge)}">${p.badge}</span></div>`
    : '';

  const stars = renderStars(p.rating);
  const priceFromHtml = p.priceFrom
    ? `<div class="product-price-from">R$ ${fmt(p.priceFrom)}</div>`
    : '';

  const imgHtml = p.image
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />`
    : '<div class="card-skeleton-img"></div>';

  card.innerHTML = `
    <div class="product-card-img">
      ${imgHtml}
      ${badgeHtml}
      <button class="product-fav-btn ${VaultStore.isFavorited(p.id) ? 'faved' : ''}"
  data-item-id="${p.id}" aria-label="Favoritar"
  onclick="event.preventDefault(); vaultToggleFavorite('${p.id}', ${JSON.stringify({ id: p.id, name: p.name, price: p.price, image: p.image }).replace(/"/g,'&quot;')}, this)">
  <i class="ti ${VaultStore.isFavorited(p.id) ? 'ti-heart-filled' : 'ti-heart'}"></i>
</button>
    </div>
    <div class="product-card-body">
      <div class="product-card-tag">${p.subcatLabel}</div>
      <div class="product-card-name">${p.name}</div>
      <div class="product-card-rating">
        <div class="stars-display">${stars}</div>
        <span class="rating-count">(${p.ratingCount})</span>
      </div>
      <div class="product-card-footer">
        <div class="product-price-wrap">
          ${priceFromHtml}
          <div class="product-price"><span>R$</span> ${fmt(p.price)}</div>
        </div>
        <button class="product-add-btn" aria-label="Adicionar ao carrinho"
  onclick="event.preventDefault(); vaultAddToCart('${p.id}', ${JSON.stringify({ id: p.id, name: p.name, price: p.price, image: p.image }).replace(/"/g,'&quot;')})">
          <i class="ti ti-shopping-cart-plus"></i>
        </button>
      </div>
    </div>
  `;

  return card;
}

function badgeCls(badge) {
  if (badge === 'HOT') return 'hot';
  if (badge === 'NEW') return 'new';
  if (badge?.includes('OFF')) return 'off';
  return 'pre';
}

function renderStars(rating) {
  const full  = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

/*--- PAGINAÇÃO ---*/
function renderPagination(total) {
  const totalPages = Math.ceil(total / state.perPage);
  dom.pagination.innerHTML = '';

  if (totalPages <= 1) return;

  const makeBtn = (label, page, disabled = false, active = false) => {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (active ? ' active' : '');
    btn.innerHTML = label;
    btn.disabled  = disabled;
    btn.addEventListener('click', () => {
      state.page = page;
      renderProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return btn;
  };

  dom.pagination.appendChild(makeBtn('<i class="ti ti-chevron-left"></i>', state.page - 1, state.page === 1));

  const pages = getPageNumbers(state.page, totalPages);
  pages.forEach(p => {
    if (p === '…') {
      const el = document.createElement('span');
      el.className = 'page-ellipsis';
      el.textContent = '…';
      dom.pagination.appendChild(el);
    } else {
      dom.pagination.appendChild(makeBtn(p, p, false, p === state.page));
    }
  });
  
  dom.pagination.appendChild(makeBtn('<i class="ti ti-chevron-right"></i>', state.page + 1, state.page === totalPages));
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}

/*--- BARRA DE FILTROS ATIVOS---*/
function updateActiveFiltersBar() {
  const chips = [];

  if (state.sub) {
    const label = CATALOG_DATA[state.cat]?.subcats?.[state.sub]?.label || state.sub;
    chips.push({ label, clear: () => { state.sub = ''; state.page = 1; refresh(); } });
  }
  if (state.priceMin !== null || state.priceMax !== null) {
    const min = state.priceMin ?? 0;
    const max = state.priceMax ?? '∞';
    chips.push({ label: `R$ ${min} – ${max}`, clear: () => { state.priceMin = state.priceMax = null; if (dom.priceMin) dom.priceMin.value = ''; if (dom.priceMax) dom.priceMax.value = ''; refresh(); } });
  }
  if (state.rating) {
    chips.push({ label: `${state.rating}+ ★`, clear: () => { state.rating = null; $$('input[name=rating]').forEach(r => r.checked = false); refresh(); } });
  }
  if (state.onlyStock) chips.push({ label: 'Em estoque',   clear: () => { state.onlyStock = false; if (dom.filterStock) dom.filterStock.checked = false; refresh(); } });
  if (state.onlyPromo) chips.push({ label: 'Em promoção',  clear: () => { state.onlyPromo = false; if (dom.filterPromo) dom.filterPromo.checked = false; refresh(); } });
  if (state.onlyNew)   chips.push({ label: 'Novidades',    clear: () => { state.onlyNew   = false; if (dom.filterNew)   dom.filterNew.checked   = false; refresh(); } });

  if (chips.length === 0) {
    dom.filterBar.classList.add('hidden');
    return;
  }
  dom.filterBar.classList.remove('hidden');
  dom.filterChips.innerHTML = '';
  chips.forEach(chip => {
    const el = document.createElement('button');
    el.className = 'filter-chip';
    el.innerHTML = `${chip.label} <i class="ti ti-x"></i>`;
    el.addEventListener('click', chip.clear);
    dom.filterChips.appendChild(el);
  });
}

function updateFilterBadge() {
  const count = [state.sub, state.priceMin, state.priceMax, state.rating, state.onlyStock, state.onlyPromo, state.onlyNew]
    .filter(v => v !== null && v !== '' && v !== false && v !== undefined).length;

  if (count > 0) {
    dom.filterBadge.classList.remove('hidden');
    dom.filterBadge.textContent = count;
  } else {
    dom.filterBadge.classList.add('hidden');
  }
}

/*--- EVENTOS ---*/
function bindEventsCategorias() {
  // ORGANIZAÇÃO DO SORT
  dom.sortSel?.addEventListener('change', () => {
    state.sort = dom.sortSel.value;
    state.page = 1;
    renderProducts();
  });

  // ALTERNANCIA DE VIEWS
  dom.viewGrid?.addEventListener('click', () => {
    state.view = 'grid';
    dom.viewGrid.classList.add('active');
    dom.viewList.classList.remove('active');
    dom.grid.classList.remove('list-view');
  });
  dom.viewList?.addEventListener('click', () => {
    state.view = 'list';
    dom.viewList.classList.add('active');
    dom.viewGrid.classList.remove('active');
    dom.grid.classList.add('list-view');
  });

  // FILTROS DE PREÇO
  dom.applyPrice?.addEventListener('click', () => {
    const min = parseFloat(dom.priceMin.value);
    const max = parseFloat(dom.priceMax.value);
    state.priceMin = isNaN(min) ? null : min;
    state.priceMax = isNaN(max) ? null : max;
    state.page = 1;
    renderProducts();
  });

  // FILTROS DE AVALIAÇÃO
  $$('input[name=rating]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.rating = parseFloat(radio.value);
      state.page   = 1;
      renderProducts();
    });
  });

  // FILTROS DE DISPONIBILIDADE
  dom.filterStock?.addEventListener('change', () => { state.onlyStock = dom.filterStock.checked; state.page = 1; renderProducts(); });
  dom.filterPromo?.addEventListener('change', () => { state.onlyPromo = dom.filterPromo.checked; state.page = 1; renderProducts(); });
  dom.filterNew?.addEventListener('change',   () => { state.onlyNew   = dom.filterNew.checked;   state.page = 1; renderProducts(); });

  // LIMPAR TUDO
  dom.clearFilters?.addEventListener('click', clearAllFilters);
  dom.btnClearAll?.addEventListener('click',  clearAllFilters);
  dom.clearMobile?.addEventListener('click',  clearAllFilters);

  // FILTRO MOBILE (GAVETA)
  dom.filterMobileBtn?.addEventListener('click', openMobileFilter);
  dom.closeMobileFilter?.addEventListener('click', closeMobileFilter);
  dom.mobileOverlay?.addEventListener('click', (e) => {
    if (e.target === dom.mobileOverlay) closeMobileFilter();
  });
  dom.applyMobile?.addEventListener('click', closeMobileFilter);

  $$('.filter-group-title').forEach(title => {
    title.addEventListener('click', () => {
      title.closest('.filter-group').classList.toggle('collapsed');
    });
  });

  const searchInput = $('#search-input');
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      console.log('Searching:', searchInput.value);
    }
  });
}

function clearAllFilters() {
  state.priceMin  = null;
  state.priceMax  = null;
  state.rating    = null;
  state.onlyStock = false;
  state.onlyPromo = false;
  state.onlyNew   = false;
  state.page      = 1;
  if (dom.priceMin) dom.priceMin.value = '';
  if (dom.priceMax) dom.priceMax.value = '';
  $$('input[name=rating]').forEach(r => r.checked = false);
  if (dom.filterStock) dom.filterStock.checked = false;
  if (dom.filterPromo) dom.filterPromo.checked = false;
  if (dom.filterNew)   dom.filterNew.checked   = false;
  renderProducts();
}

function refresh() {
  state.page = 1;
  renderSubcatPills();
  renderSidebarSubcats();
  renderBreadcrumb();
  renderProducts();
  updateURL();
}

function openMobileFilter() {
  dom.mobileOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeMobileFilter() {
  dom.mobileOverlay.classList.add('hidden');
  document.body.style.overflow = '';
}

/*--- URL UPDATE ---*/
function updateURL() {
  const params = new URLSearchParams();
  if (state.cat) params.set('cat', state.cat);
  if (state.sub) params.set('sub', state.sub);
  if (state.filtro) params.set('filtro', state.filtro);
  history.replaceState(null, '', '?' + params.toString());
}

/*--- NAVBAR ACTIVE STATE ---*/
function updateNavbarActive() {
  const catLabels = {
    'consoles-jogos':   'Consoles & Jogos',
    'livros-mangas':    'Livros & Mangas',
    'funkos-figures':   'Funkos & Figures',
    'assinaturas-keys': 'Assinaturas & Keys',
    'em-alta':          'Em alta',
    'acessorios':       'Acessórios',
    'softwares':        'Softwares',
  };
  const label = catLabels[state.cat];
  $$('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === label);
  });
}

/*--- ATT DO MEGA-MENU LINKS → categorias.html ---*/
function patchMegaMenuLinks() {
  const patchMap = {
    'PlayStation':  '?cat=consoles-jogos&sub=playstation',
    'Xbox':         '?cat=consoles-jogos&sub=xbox',
    'Nintendo':     '?cat=consoles-jogos&sub=nintendo',
    'Retro':        '?cat=consoles-jogos&sub=retro',
    'Jogos PC':     '?cat=consoles-jogos&sub=jogos-pc',
    'Mangá Shonen': '?cat=livros-mangas&sub=manga-shonen',
    'Mangá Seinen': '?cat=livros-mangas&sub=manga-seinen',
    'Light Novels': '?cat=livros-mangas&sub=light-novels',
    'HQs & Comics': '?cat=livros-mangas&sub=hqs-comics',
    'Artbooks':     '?cat=livros-mangas&sub=artbooks',
    'Funko Pop':    '?cat=funkos-figures&sub=funko-pop',
    'Nendoroids':   '?cat=funkos-figures&sub=nendoroids',
    'Figmas':       '?cat=funkos-figures&sub=figmas',
    'Estatuetas':   '?cat=funkos-figures&sub=estatuetas',
    'Edição Limitada': '?cat=funkos-figures&sub=edicao-limitada',
    'PlayStation Plus': '?cat=assinaturas-keys&sub=ps-plus',
    'Xbox Game Pass':   '?cat=assinaturas-keys&sub=game-pass',
    'Nintendo Online':  '?cat=assinaturas-keys&sub=nintendo-online',
    'Steam Gift Cards': '?cat=assinaturas-keys&sub=steam',
    'EA Play':          '?cat=assinaturas-keys&sub=ea-play',
    'Mais Vendidos': '?cat=em-alta&sub=mais-vendidos',
    'Novidades':     '?cat=em-alta&sub=novidades',
    'Promoções':     '?cat=em-alta&sub=promocoes',
    'Pré-venda':     '?cat=em-alta&sub=pre-venda',
    'Controles':     '?cat=acessorios&sub=controles',
    'Headsets':      '?cat=acessorios&sub=headsets',
    'Mousepads & Teclados': '?cat=acessorios&sub=mousepads-teclados',
    'Casa & Decor':  '?cat=acessorios&sub=casa-decor',
    'Antivírus':     '?cat=softwares&sub=antivirus',
    'Produtividade': '?cat=softwares&sub=produtividade',
    'Edição & Design': '?cat=softwares&sub=edicao-design',
    'Utilitários':   '?cat=softwares&sub=utilitarios',
  };

  const catBtnMap = {
    'Consoles & Jogos':   '?cat=consoles-jogos',
    'Livros & Mangas':    '?cat=livros-mangas',
    'Funkos & Figures':   '?cat=funkos-figures',
    'Assinaturas & Keys': '?cat=assinaturas-keys',
    'Em alta':            '?cat=em-alta',
    'Acessórios':         '?cat=acessorios',
    'Softwares':          '?cat=softwares',
  };

  $$('.mega-link').forEach(link => {
    const name = link.querySelector('.mega-link-name')?.textContent?.trim();
    if (name && patchMap[name]) {
      link.href = 'categorias.html' + patchMap[name];
    }
  });

  $$('.mega-footer').forEach(link => {
    const catItem = link.closest('.cat-item');
    const btn = catItem?.querySelector('.cat-btn');
    if (btn) {
      const label = btn.textContent.trim();
      const url   = catBtnMap[label];
      if (url) link.href = 'categorias.html' + url;
    }
  });

  $$('.cat-btn').forEach(btn => {
    const label = btn.textContent.trim();
    const url   = catBtnMap[label];
    if (url) {
      btn.addEventListener('dblclick', () => {
        window.location.href = 'categorias.html' + url;
      });
    }
  });
}

/*--- BOOT ---*/
window.addEventListener('load', () => {
  if (document.getElementById('catalog-grid')) {
    init();
  }
  setTimeout(patchMegaMenuLinks, 150);
});
