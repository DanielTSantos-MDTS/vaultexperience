const urlParams   = new URLSearchParams(window.location.search);
const idProduto   = urlParams.get('id');
const vault_token = localStorage.getItem('vault_token');

//--- Objetos do produto ---//
const PRODUTO = {
  id: null,
  categoria: 'Produto',
  subcategoria: '',
  titulo: 'Carregando...',
  descricaoRapida: '',
  imagens: [],
  badges: [],
  precoOriginal: 0,
  precoAtual: 0,
  desconto: 0,
  parcelas: 12,
  valorParcela: 0,
  estoqueStatus: 'in',
  estoqueQtd: 99,
  estoqueMax: 99,
  avaliacaoMedia: 0,
  avaliacaoTotal: 0,
  vendidos: 0,
  distribuicaoEstrelas: [
    { estrelas: 5, pct: 0 }, { estrelas: 4, pct: 0 }, { estrelas: 3, pct: 0 },
    { estrelas: 2, pct: 0 }, { estrelas: 1, pct: 0 },
  ],
  condicoes: [],
  condicaoAtiva: '',
  specsRapidas: [],
  tags: [],
  descricaoCompleta: [],
  especificacoes: [],
  vendedor: { nome: '—', inicial: '?', verificado: false, membroDesde: '—', cidade: '—', reputacao: '—', vendas: 0, aprovacao: '—' },
  reviews: [],
};

//--- Helpers ---//
const fmtPreco = n =>
  Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function renderStars(media, big = false) {
  const full  = Math.floor(media);
  const empty = 5 - full;
  const cls   = big ? 'reviews-stars-big' : 'stars';
  return `<div class="${cls}">`
    + Array(full).fill(`<span class="star full">★</span>`).join('')
    + Array(empty).fill(`<span class="star empty">★</span>`).join('')
    + `</div>`;
}

function stockLabel(status, qtd) {
  if (status === 'out') return { dot: 'out', cls: 'stock-out', txt: 'Sem estoque' };
  if (status === 'low') return { dot: 'low', cls: 'stock-low', txt: `Apenas ${qtd} restante${qtd !== 1 ? 's' : ''}!` };
  return { dot: 'in', cls: 'stock-in', txt: 'Em estoque' };
}

function showToast(html, type = 'success') {
  document.querySelectorAll('.vault-toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = `vault-toast vault-toast--${type}`;
  toast.innerHTML = html;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 3000);
}

//--- Carrinho ---//
function addToCart(qty = 1) {
  const product = {
    id:    PRODUTO.id,
    name:  PRODUTO.titulo,
    price: PRODUTO.precoAtual,
    image: PRODUTO.imagens[0] || '',
  };
  const cart = VaultStore.getCart();
  const idx  = cart.findIndex(i => i.id === product.id);
  if (idx >= 0) {
    VaultStore.updateQty(product.id, Math.min(cart[idx].qty + qty, PRODUTO.estoqueMax));
    showToast(`<strong>${PRODUTO.titulo.slice(0, 30)}…</strong> adicionado ao carrinho!`, 'success');
  } else {
    for (let i = 0; i < qty; i++) VaultStore.addToCart(product);
  }
}

//--- Favoritos — usa VaultStore ---//
function isFaved() { return VaultStore.isFavorited(PRODUTO.id); }

function toggleFav(btnEl) {
  const product = {
    id:    PRODUTO.id,
    name:  PRODUTO.titulo,
    price: PRODUTO.precoAtual,
    image: PRODUTO.imagens[0] || '',
  };
  VaultStore.toggleFavorite(product);
  const faved = isFaved();
  btnEl.classList.toggle('faved', faved);
  btnEl.querySelector('svg').setAttribute('fill', faved ? 'currentColor' : 'none');
  btnEl.innerHTML = faved
    ? `<svg width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Remover dos favoritos`
    : `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Adicionar à lista de desejos`;
}

//--- Lightbox ---//
let lightboxIdx = 0;

function openLightbox(idx) {
  idx = idx || 0;
  lightboxIdx = idx;
  const imgs = PRODUTO.imagens;
  if (!imgs.length) return;

  let overlay = document.getElementById('vault-lightbox');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'vault-lightbox';
    overlay.innerHTML = `
      <div class="lb-backdrop"></div>
      <div class="lb-content">
        <button class="lb-close" title="Fechar"><i class="ti ti-x"></i></button>
        <button class="lb-arrow lb-prev" title="Anterior"><i class="ti ti-chevron-left"></i></button>
        <div class="lb-img-wrap"><img class="lb-img" src="" alt="Imagem ampliada"></div>
        <button class="lb-arrow lb-next" title="Próxima"><i class="ti ti-chevron-right"></i></button>
        <div class="lb-counter"></div>
        <div class="lb-thumbs"></div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
    overlay.querySelector('.lb-close').addEventListener('click', closeLightbox);
    overlay.querySelector('.lb-prev').addEventListener('click', () => moveLightbox(-1));
    overlay.querySelector('.lb-next').addEventListener('click', () => moveLightbox(1));
    document.addEventListener('keydown', onLbKey);
  }

  const thumbsEl = overlay.querySelector('.lb-thumbs');
  thumbsEl.innerHTML = imgs.map((src, i) =>
    `<img src="${src}" class="lb-thumb ${i === idx ? 'active' : ''}" data-idx="${i}" alt="Miniatura ${i+1}">`
  ).join('');
  thumbsEl.querySelectorAll('.lb-thumb').forEach(t => {
    t.addEventListener('click', () => { lightboxIdx = +t.dataset.idx; updateLightboxImg(); });
  });

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateLightboxImg();
}

function closeLightbox() {
  const ov = document.getElementById('vault-lightbox');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onLbKey);
}

function moveLightbox(dir) {
  lightboxIdx = (lightboxIdx + dir + PRODUTO.imagens.length) % PRODUTO.imagens.length;
  updateLightboxImg();
}

function onLbKey(e) {
  if (e.key === 'ArrowRight') moveLightbox(1);
  if (e.key === 'ArrowLeft')  moveLightbox(-1);
  if (e.key === 'Escape')     closeLightbox();
}

function updateLightboxImg() {
  const ov = document.getElementById('vault-lightbox');
  if (!ov) return;
  const imgs = PRODUTO.imagens;
  ov.querySelector('.lb-img').src = imgs[lightboxIdx];
  ov.querySelector('.lb-counter').textContent = `${lightboxIdx + 1} / ${imgs.length}`;
  ov.querySelectorAll('.lb-thumb').forEach((t, i) => t.classList.toggle('active', i === lightboxIdx));
  ov.querySelector('.lb-prev').style.display = imgs.length <= 1 ? 'none' : '';
  ov.querySelector('.lb-next').style.display = imgs.length <= 1 ? 'none' : '';
}

//--- RENDERS ---//
function renderBreadcrumb() {
  const p = PRODUTO;
  const el = document.getElementById('breadcrumb');
  if (!el) return;
  el.innerHTML = `
    <a href="index.html">Início</a>
    <span class="breadcrumb-sep">›</span>
    <a href="categorias.html?cat=${p.categoria.toLowerCase()}">${p.categoria}</a>
    ${p.subcategoria ? `<span class="breadcrumb-sep">›</span><span>${p.subcategoria}</span>` : ''}
    <span class="breadcrumb-sep">›</span>
    <span>${p.titulo.split('—')[0].trim()}</span>
  `;
}

function renderGallery() {
  if (!PRODUTO.imagens.length) {
    PRODUTO.imagens = ['https://placehold.co/600x600/1a1a1a/555555?text=Sem+Foto&font=Montserrat'];
  }
  const imgs   = PRODUTO.imagens;
  const badges = PRODUTO.badges.map((b, i) =>
    `<span class="badge ${b.classe}" style="animation-delay:${i * .1}s">${b.texto}</span>`
  ).join('');
  const thumbs = imgs.map((src, i) => `
    <div class="thumb ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <img src="${src}" alt="Foto ${i + 1}" loading="lazy">
    </div>`
  ).join('');

  return `
    <div class="gallery">
      <div class="gallery-main" id="gallery-main" title="Clique para ampliar">
        <img src="${imgs[0]}" id="main-img" alt="${PRODUTO.titulo}">
        <div class="gallery-badges">${badges}</div>
        <div class="zoom-hint">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          Ampliar
        </div>
      </div>
      <div class="gallery-thumbs" id="gallery-thumbs">${thumbs}</div>
    </div>`;
}

function renderProductInfo() {
  const p  = PRODUTO;
  const vd = p.vendedor;
  const condTabs = p.condicoes.length
    ? p.condicoes.map(c =>
        `<button class="cond-tab ${c === p.condicaoAtiva ? 'active' : ''}" data-cond="${c}">${c}</button>`
      ).join('')
    : '<span style="color:var(--gray-400);font-size:14px">—</span>';
  const specs = p.specsRapidas.map(s => `
    <div class="spec-row">
      <span class="spec-icon">${s.icone}</span>
      <span class="spec-key">${s.chave}</span>
      <span class="spec-val">${s.valor}</span>
    </div>`).join('');
  const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');

  return `
    <div class="product-info">
      <div class="seller-row">
        <div class="seller-avatar">${vd.inicial}</div>
        <div>Vendido por <span class="seller-name">${vd.nome}</span></div>
        ${vd.verificado ? `<div class="seller-verified">
          <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          Verificado</div>` : ''}
      </div>
      <h1 class="product-title">${p.titulo}</h1>
      ${p.avaliacaoMedia > 0 ? `
      <div class="ratings-row">
        ${renderStars(p.avaliacaoMedia)}
        <span class="rating-num">${p.avaliacaoMedia}</span>
        <span class="rating-count">(${p.avaliacaoTotal} avaliações)</span>
        <span class="rating-sep">·</span>
        <span class="sold-count">${p.vendidos} vendidos</span>
      </div>` : ''}
      <hr class="divider">
      <div class="condition-row">
        <span class="condition-label">Condição</span>
        <div class="condition-tabs">${condTabs}</div>
      </div>
      <hr class="divider">
      <p class="desc-snippet">${p.descricaoRapida}</p>
      ${specs ? `<div class="specs-quick">${specs}</div>` : ''}
      ${tags  ? `<div class="tags">${tags}</div>` : ''}
    </div>`;
}

function renderPurchaseBox() {
  const p   = PRODUTO;
  const vd  = p.vendedor;
  const st  = stockLabel(p.estoqueStatus, p.estoqueQtd);
  const favFill = isFaved() ? 'currentColor' : 'none';
  const dis = p.estoqueStatus === 'out' ? 'disabled' : '';

  return `
    <div class="purchase-box">
      <div class="price-block">
        ${p.desconto > 0 ? `<span class="price-original">R$ ${fmtPreco(p.precoOriginal)}</span>` : ''}
        <div class="price-discount-row">
          <span class="price-main">R$ ${fmtPreco(p.precoAtual)}</span>
          ${p.desconto > 0 ? `<span class="price-badge-off">−${p.desconto}%</span>` : ''}
        </div>
        <p class="price-installments">
          ou <strong>${p.parcelas}× de R$ ${fmtPreco(p.valorParcela)}</strong> sem juros no cartão
        </p>
      </div>

      <div class="stock-row">
        <div class="stock-dot ${st.dot}"></div>
        <span class="${st.cls}">${st.txt}</span>
      </div>

      <div class="qty-block">
        <span class="qty-label">Quantidade</span>
        <div class="qty-selector">
          <button class="qty-btn" id="qty-minus">−</button>
          <span class="qty-num" id="qty-num">1</span>
          <button class="qty-btn" id="qty-plus">+</button>
        </div>
      </div>

      <div class="lance-section">
        <div class="lance-header">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M2 21l4.5-4.5"/>
          </svg>
          Fazer uma oferta
        </div>
        <div class="lance-chips">
          <button class="lance-chip" data-add="50">+ R$ 50,00</button>
          <button class="lance-chip" data-add="100">+ R$ 100,00</button>
          <button class="lance-chip" data-add="150">+ R$ 150,00</button>
          <button class="lance-chip" data-add="200">+ R$ 200,00</button>
        </div>
        <div class="lance-input-row">
          <span class="lance-prefix">R$</span>
          <input id="lance-input" class="lance-input" type="number" placeholder="Digite seu valor" min="1" step="0.01">
          <button id="btn-lance" class="btn-lance" disabled>
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M2 21l4.5-4.5"/>
            </svg>
            Dar lance
          </button>
        </div>
      </div>

      <div class="cta-stack">
        <button class="btn-buy" id="btn-buy" ${dis}>⚡ Comprar agora</button>
        <button class="btn-cart" id="btn-cart" ${dis}>
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Adicionar ao carrinho
        </button>
        <button class="btn-wishlist" id="btn-wishlist">
          <svg width="16" height="16" fill="${favFill}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          ${isFaved() ? 'Remover dos favoritos' : 'Adicionar à lista de desejos'}
        </button>
      </div>

      <div class="security-badges">
        <div class="sec-item">
          <svg width="15" height="15" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Compra 100% segura e protegida
        </div>
        <div class="sec-item">
          <svg width="15" height="15" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
          </svg>
          Devolução gratuita em 7 dias
        </div>
        <div class="sec-item">
          <svg width="15" height="15" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Pagamento via Pix, cartão ou boleto
        </div>
      </div>

      <div class="seller-card">
        <div class="seller-card-header">
          <div class="seller-card-avatar">${vd.inicial}</div>
          <div>
            <div class="seller-card-name">${vd.nome}</div>
            <div class="seller-card-meta">Membro desde ${vd.membroDesde} · ${vd.cidade}</div>
          </div>
        </div>
        <div class="seller-card-stats">
          <div class="seller-stat"><span class="seller-stat-val">${vd.reputacao}</span><span class="seller-stat-key">Reputação</span></div>
          <div class="seller-stat"><span class="seller-stat-val">${vd.vendas}</span><span class="seller-stat-key">Vendas</span></div>
          <div class="seller-stat"><span class="seller-stat-val">${vd.aprovacao}</span><span class="seller-stat-key">Aprovação</span></div>
        </div>
        <button class="btn-seller">Ver perfil do vendedor →</button>
      </div>
    </div>`;
}

function renderBottom() {
  const p = PRODUTO;

  const descSections = p.descricaoCompleta.length
    ? p.descricaoCompleta.map(s => {
        const body = s.tipo === 'lista'
          ? `<ul>${s.conteudo.map(i => `<li>${i}</li>`).join('')}</ul>`
          : `<p>${s.conteudo}</p>`;
        return `<h3>${s.titulo}</h3>${body}`;
      }).join('')
    : `<p>${p.descricaoRapida || 'Sem descrição disponível.'}</p>`;

  const specRows = p.especificacoes.length
    ? p.especificacoes.map(e => `<tr><td>${e.chave}</td><td>${e.valor}</td></tr>`).join('')
    : `<tr><td colspan="2" style="color:var(--gray-400);text-align:center;padding:20px">Sem especificações cadastradas.</td></tr>`;

  const bars = p.distribuicaoEstrelas.map(d => `
    <div class="bar-row">
      <span class="bar-label">${d.estrelas}★</span>
      <div class="bar-track"><div class="bar-fill" style="width:${d.pct}%"></div></div>
      <span class="bar-pct">${d.pct}%</span>
    </div>`).join('');

  const reviewCards = p.reviews.length
    ? p.reviews.map(r => {
        const stars =
          Array(Math.floor(r.estrelas)).fill(`<span class="star full">★</span>`).join('') +
          Array(5 - Math.floor(r.estrelas)).fill(`<span class="star empty">★</span>`).join('');
        return `
          <div class="review-card">
            <div class="review-header">
              <div class="review-user">
                <div class="review-avatar">${r.nome[0]}</div>
                <div><div class="review-name">${r.nome}</div><div class="review-date">${r.data}</div></div>
              </div>
              <div class="review-stars">${stars}</div>
            </div>
            <p class="review-text">${r.texto}</p>
            ${r.verificado ? `<div class="review-verified">
              <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Compra verificada</div>` : ''}
          </div>`;
      }).join('')
    : `<div style="color:var(--gray-400);font-size:14px;padding:20px 0">Nenhuma avaliação ainda.</div>`;

  const relCards = Array(5).fill(0).map((_, i) => `
    <a class="rel-card" href="produto.html" aria-label="Ver produto relacionado ${i + 1}">
      <div class="rel-img"></div>
      <div class="rel-body"><div class="rel-title-sk"></div><div class="rel-price-sk"></div></div>
    </a>`).join('');

  return `
    <div>
      <h2 class="section-heading"><span class="section-heading-dot"></span>Descrição do produto</h2>
      <div class="full-desc">${descSections}</div>
    </div>
    <div>
      <h2 class="section-heading"><span class="section-heading-dot"></span>Especificações técnicas</h2>
      <div class="specs-table"><table>${specRows}</table></div>
    </div>
    <div>
      <h2 class="section-heading"><span class="section-heading-dot"></span>Avaliações dos compradores</h2>
      <div class="reviews-layout">
        <div class="reviews-summary">
          <div class="reviews-big-num">${p.avaliacaoMedia || '—'}</div>
          ${p.avaliacaoMedia ? renderStars(p.avaliacaoMedia, true) : ''}
          <div class="reviews-total">${p.avaliacaoTotal} avaliações</div>
          <div class="reviews-bars">${bars}</div>
        </div>
        <div class="reviews-list">${reviewCards}</div>
      </div>
    </div>
    <div>
      <h2 class="section-heading"><span class="section-heading-dot"></span>Perguntas ao vendedor</h2>
      <div class="comments-section">
        <div class="comment-form-wrap">
          <div class="comment-form-inner">
            <div class="comment-avatar" id="comment-user-avatar">?</div>
            <div class="comment-input-wrap">
              <textarea
                id="comment-input"
                class="comment-input"
                placeholder="Tire suas dúvidas com o vendedor... (ex: Ainda tem estoque? Aceita troca?)"
                rows="3"
                maxlength="500"
              ></textarea>
              <div class="comment-footer">
                <span class="comment-counter" id="comment-counter">0/500</span>
                <button class="btn-comment-send" id="btn-comment-send">
                  <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Enviar pergunta
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="comments-list" id="comments-list">
          <div style="color:var(--gray-400);font-size:14px;padding:20px 0">
            Nenhuma pergunta ainda. Seja o primeiro a perguntar!
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2 class="section-heading"><span class="section-heading-dot"></span>Você também pode gostar</h2>
      <div class="related-grid">${relCards}</div>
    </div>`;
}

//--- Render principal ---//
function renderPage() {
  document.title = `${PRODUTO.titulo.split('—')[0].trim()} – Vault Experience`;
  renderBreadcrumb();

  const pagina = document.getElementById('product-page');
  const bottom = document.getElementById('product-bottom');
  if (pagina) pagina.innerHTML = renderGallery() + renderProductInfo() + renderPurchaseBox();
  if (bottom) bottom.innerHTML = renderBottom();

  bindEvents();
  bindComments();

  //--- Comentários / Perguntas ---//
function bindComments() {
  const input   = document.getElementById('comment-input');
  const counter = document.getElementById('comment-counter');
  const btnSend = document.getElementById('btn-comment-send');
  const list    = document.getElementById('comments-list');
  const avatar  = document.getElementById('comment-user-avatar');

  if (!input) return;

  //--- Avatar do usuário logado ---//
  const username  = localStorage.getItem('vault_user')   || null;
  const avatarId  = localStorage.getItem('vault_avatar') || null;
  if (avatar) {
    if (avatarId) {
      avatar.innerHTML = `<img src="assets/avatars/avatar${avatarId}.jpg">`;
    } else if (username) {
      avatar.textContent = username.slice(0, 2).toUpperCase();
    }
  }

  //--- Contador de caracteres ---//
  input.addEventListener('input', () => {
    const len = input.value.length;
    if (counter) counter.textContent = `${len}/500`;
    if (btnSend) btnSend.disabled = len < 3;
  });

  //--- Enviar pergunta ---//
  btnSend?.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text || text.length < 3) return;

    if (!localStorage.getItem('vault_token')) {
      showToast('Faça login para enviar uma pergunta.', 'error');
      return;
    }

    //--- Monta o card ---//
    const card = document.createElement('div');
    card.className = 'comment-card';

    const avatarHtml = avatarId
      ? `<img src="assets/avatars/avatar${avatarId}.jpg">`
      : (username ? username.slice(0, 2).toUpperCase() : '?');

    card.innerHTML = `
      <div class="comment-card-header">
        <div class="comment-user-info">
          <div class="comment-card-avatar">${avatarHtml}</div>
          <div>
            <div class="comment-username">${username || 'Usuário'}</div>
            <div class="comment-date">Agora mesmo</div>
          </div>
        </div>
      </div>
      <div class="comment-text">${_escapeHtml(text)}</div>`;

    if (list) {
      const empty = list.querySelector('[style]');
      if (empty) empty.remove();
      list.insertBefore(card, list.firstChild);
    }

    input.value = '';
    if (counter) counter.textContent = '0/500';
    if (btnSend) btnSend.disabled = true;

    showToast('Pergunta enviada! O vendedor será notificado.', 'success');
  });
}

function _escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
}

function bindEvents() {
  const p = PRODUTO;

  //--- Botão Anunciar na navbar ---//
  document.querySelector('.btn-anunciar')?.addEventListener('click', () => {
    window.location.href = 'anunciar.html';
  });

  //--- Galeria: troca de foto pelo thumbnail ---//
  document.getElementById('gallery-thumbs')?.addEventListener('click', e => {
    const thumb = e.target.closest('.thumb');
    if (!thumb) return;
    const idx = parseInt(thumb.dataset.idx, 10);
    const mainImg = document.getElementById('main-img');
    if (mainImg) mainImg.src = p.imagens[idx] || '';
    document.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
  });

  //--- Galeria: clique na imagem principal abre o lightbox ---//
  document.getElementById('gallery-main')?.addEventListener('click', () => {
    const mainImg = document.getElementById('main-img');
    const src = mainImg ? mainImg.src : '';
    let idx = p.imagens.findIndex(img => src.endsWith(img) || src.includes(img) || img.includes(src));
    openLightbox(idx >= 0 ? idx : 0);
  });

  //--- Quantidade ---//
  let qty = 1;
  const qtyNum   = document.getElementById('qty-num');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus  = document.getElementById('qty-plus');

  qtyMinus?.addEventListener('click', () => {
    if (qty > 1) { qty--; if (qtyNum) qtyNum.textContent = qty; }
  });
  qtyPlus?.addEventListener('click', () => {
    if (qty < p.estoqueMax) { qty++; if (qtyNum) qtyNum.textContent = qty; }
  });

  //--- Comprar agora ---//
  document.getElementById('btn-buy')?.addEventListener('click', () => {
    if (p.estoqueStatus === 'out') return;
    addToCart(qty);
    setTimeout(() => { window.location.href = 'cart.html'; }, 800);
  });

  //--- Adicionar ao carrinho ---//
  document.getElementById('btn-cart')?.addEventListener('click', () => {
    if (p.estoqueStatus === 'out') return;
    addToCart(qty);
    const btn = document.getElementById('btn-cart');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Adicionado!`;
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  });

  //--- Favoritos ---//
  document.getElementById('btn-wishlist')?.addEventListener('click', function () {
    toggleFav(this);
  });

  //--- Abas de condição ---//
  document.querySelectorAll('.cond-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cond-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  //--- Lance / chips ---//
  const lanceInput = document.getElementById('lance-input');
  const btnLance   = document.getElementById('btn-lance');

  document.querySelectorAll('.lance-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (!lanceInput) return;
      const add     = parseFloat(chip.dataset.add);
      const current = parseFloat(lanceInput.value) || 0;
      lanceInput.value = (current + add).toFixed(2);
      lanceInput.dispatchEvent(new Event('input'));
    });
  });

  lanceInput?.addEventListener('input', () => {
    const val = parseFloat(lanceInput.value);
    if (btnLance) btnLance.disabled = !(val > 0);
  });

  btnLance?.addEventListener('click', () => {
    if (!lanceInput) return;
    const val = parseFloat(lanceInput.value);
    if (!val || val <= 0) return;
    const fmtVal = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    btnLance.textContent = '✓ Lance enviado!';
    btnLance.classList.add('lance-enviado');
    btnLance.disabled = true;
    showToast(`<strong>Lance de ${fmtVal} enviado!</strong><br>O vendedor foi notificado.`, 'success');
    setTimeout(() => {
      btnLance.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M2 21l4.5-4.5"/></svg> Dar lance`;
      btnLance.classList.remove('lance-enviado');
      btnLance.disabled = true;
      lanceInput.value = '';
    }, 5000);
  });
}

//--- Busca o produto da API e renderização inicial ----//
const iconeMap = {
  'Plataforma': '🎮', 'Condição': '📋', 'Localização': '📍',
  'Incluso na Caixa': '📦', 'Quantidade': '🔢', 'Modelo': '🕹️',
  'Região de Ativação': '🌎', 'Raridade': '✦',
};

function preencherProduto(dados) {
  PRODUTO.id              = dados._id;
  PRODUTO.titulo          = dados.nome            || 'Produto';
  PRODUTO.descricaoRapida = dados.descricao        || '';
  PRODUTO.precoOriginal   = dados.precoOriginal    || 0;
  PRODUTO.precoAtual      = dados.precoOriginal    || 0;
  PRODUTO.valorParcela    = PRODUTO.precoAtual / PRODUTO.parcelas;
  PRODUTO.categoria       = dados.categoria?.nome  || 'Produto';
  PRODUTO.condicaoAtiva   = dados.estado           || '';
  PRODUTO.condicoes       = dados.estado ? [dados.estado] : [];
  PRODUTO.especificacoes  = dados.especificacoes   || [];
  PRODUTO.imagens         = (dados.imagens || []).map(img =>
    img.startsWith('http') ? img : `http://localhost:3000${img}`
  );
  if (dados.franquia) PRODUTO.subcategoria = dados.franquia;
  PRODUTO.specsRapidas = PRODUTO.especificacoes.slice(0, 5).map(e => ({
    icone: iconeMap[e.chave] || '📌',
    chave: e.chave,
    valor: e.valor,
  }));
  if (dados.dono) {
    PRODUTO.vendedor.nome       = dados.dono.username || 'Vendedor';
    PRODUTO.vendedor.inicial    = (dados.dono.username || 'V')[0].toUpperCase();
    PRODUTO.vendedor.verificado = true;
  }
}

if (idProduto) {
  fetch(`http://localhost:3000/item/${idProduto}`, {
    headers: { 'authorization': `Bearer ${vault_token}` }
  })
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(dados => {
    if (dados.Erro) {
      showToast(`Produto não encontrado: ${dados.Erro}`, 'error');
      renderPage();
      return;
    }
    preencherProduto(dados);
    renderPage();
  })
  .catch(err => {
    console.error('Erro ao buscar produto:', err);
    showToast('Não foi possível carregar o produto. Verifique se o servidor está online.', 'error');
    renderPage(); 
  });
} else {

  PRODUTO.titulo = 'Produto de Demonstração';
  renderPage();
}
