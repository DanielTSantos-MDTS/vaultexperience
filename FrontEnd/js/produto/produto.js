const urlParams = new URLSearchParams(window.location.search);
const idProduto = urlParams.get('id');
const vault_token = localStorage.getItem('vault_token');
const urlFetch = `http://localhost:3000/item/${idProduto}`;


const PRODUTO = {
  id: 1,
  categoria: "Exemplo",
  subcategoria: "base",
  slug: "base",

  titulo: "Base",
  descricaoRapida: "Base",
  imagens: [
    "https://via.placeholder.com/600x600/1a1a1a/ffcc00?text=Foto+1",
    "https://via.placeholder.com/600x600/1a1a1a/ffcc00?text=Foto+2",
    "https://via.placeholder.com/600x600/1a1a1a/ffcc00?text=Foto+3",
    "https://via.placeholder.com/600x600/1a1a1a/ffcc00?text=Foto+4",
    "https://via.placeholder.com/600x600/1a1a1a/ffcc00?text=Foto+5",
  ],

  /*--- DADOS DA PÁGINA DE PRODUTO ---*/
  badges: [
    { texto: "−30%",       classe: "badge-off"  },
    { texto: "🔥 Em alta", classe: "badge-hot"  },
    { texto: "✦ Raro",     classe: "badge-rare" },
  ],

  precoOriginal: 14.2,
  precoAtual:    524.90,
  desconto:      30,
  parcelas:      12,
  valorParcela:  52.99,

  estoqueStatus: "low",
  estoqueQtd:    3,
  estoqueMax:    3,

  avaliacaoMedia: 4.8,
  avaliacaoTotal: 127,
  vendidos: 312,
  distribuicaoEstrelas: [
    { estrelas: 5, pct: 78 },
    { estrelas: 4, pct: 14 },
    { estrelas: 3, pct: 5  },
    { estrelas: 2, pct: 2  },
    { estrelas: 1, pct: 1  },
  ],

  condicoes: ["Seminovo", "Usado", "Novo"],
  condicaoAtiva: ["Seminovo"],

  specsRapidas: [
    { icone: "🎮", chave: "Plataforma",           valor: "Super Nintendo (SNES)"               },
    { icone: "📦", chave: "Incluso na caixa",     valor: "Console + 2 controles + cabos"       },
    { icone: "🕹️", chave: "Jogos pré-instalados", valor: "21 títulos clássicos"                },
    { icone: "📍", chave: "Localização",          valor: "São Paulo, SP"                       },
    { icone: "🚚", chave: "Envio",                valor: "Correios + seguro — 3 a 7 dias úteis" },
  ],

  tags: ["Nintendo", "SNES", "Retrô", "Console", "Clássico", "16-bit"],

  descricaoCompleta: [
    {
      titulo: "Sobre o produto",
      tipo: "paragrafo",
      conteudo: "O Super Nintendo Classic Edition é a versão mini do icônico videogame dos anos 90 lançada pela Nintendo. Este exemplar está em excelente estado de conservação, com funcionamento perfeito e todos os acessórios originais incluídos."
    },
    {
      titulo: "O que está incluso",
      tipo: "lista",
      conteudo: [
        "Console Super Nintendo Classic Edition",
        "2 controles sem fio SNES originais",
        "Cabo HDMI (1m)",
        "Fonte de alimentação USB",
        "Manual de instruções original em português"
      ]
    },
    {
      titulo: "Jogos pré-instalados (21 títulos)",
      tipo: "lista",
      conteudo: [
        "Super Mario World · Super Mario Kart · Super Mario RPG",
        "The Legend of Zelda: A Link to the Past",
        "Super Metroid · F-Zero · Donkey Kong Country",
        "Street Fighter II Turbo · Mega Man X",
        "Star Fox · Star Fox 2 (inédito!) · e mais 10 clássicos"
      ]
    },
    {
      titulo: "Estado de conservação",
      tipo: "paragrafo",
      conteudo: "Classificado como <strong>Seminovo</strong> — produto utilizado com cuidado, sem arranhões visíveis na carcaça, botões funcionando perfeitamente e saída HDMI sem interferências. Testado por 2 horas antes do envio."
    }
  ],

  especificacoes: [
    { chave: "Fabricante",        valor: "Nintendo"                                   },
    { chave: "Modelo",            valor: "Super Nintendo Classic Edition (CLV-301)"   },
    { chave: "Processador",       valor: "Allwinner R16 (emulação SNES)"              },
    { chave: "Armazenamento",     valor: "512 MB Flash"                               },
    { chave: "Saída de vídeo",    valor: "HDMI 720p / 1080p upscale"                  },
    { chave: "Áudio",             valor: "Estéreo via HDMI"                           },
    { chave: "Controles",         valor: "2 × controle com fio (1,5m)"                },
    { chave: "Alimentação",       valor: "5V DC / 1,5A via USB-C"                     },
    { chave: "Dimensões",         valor: "10,3 × 6,8 × 3,3 cm"                        },
    { chave: "Peso",              valor: "183g (sem cabos)"                            },
    { chave: "Jogos inclusos",    valor: "21 jogos pré-instalados"                    },
    { chave: "Região",            valor: "NTSC-U/C (funciona em qualquer TV com HDMI)" },
    { chave: "Ano de lançamento", valor: "2017 (Nintendo) · Este exemplar: 2019"      },
    { chave: "Condição",          valor: "Seminovo — excelente estado"                },
  ],

  vendedor: {
    nome: "RetroVault_BR",
    inicial: "R",
    verificado: true,
    membroDesde: "2019",
    cidade: "São Paulo",
    reputacao: "4.9 ★",
    vendas: 847,
    aprovacao: "99%",
  },

  reviews: [
    {
      nome: "Marcelo T.",
      data: "15 de abril de 2026",
      estrelas: 5,
      verificado: true,
      texto: "Produto chegou exatamente como descrito. Embalagem impecável, console sem nenhum arranhão. Joguei Super Mario World na hora e a saudade bateu forte! Vendedor muito atencioso, recomendo demais.",
    },
    {
      nome: "Juliana R.",
      data: "3 de março de 2026",
      estrelas: 4,
      verificado: true,
      texto: "Ótima compra! Os jogos funcionam perfeitamente e a qualidade de imagem via HDMI surpreendeu. Tirei uma estrela só porque o prazo de entrega foi um dia além do previsto, mas o vendedor avisou antes.",
    },
    {
      nome: "Felipe G.",
      data: "18 de fevereiro de 2026",
      estrelas: 5,
      verificado: true,
      texto: "Presente perfeito para o meu pai que jogava SNES nos anos 90. Ele não parou mais de jogar desde que recebeu! Console em estado impecável, todos os controles funcionando. Vault Experience é top demais.",
    },
  ],
};

fetch(urlFetch, {
  headers: {
    'authorization': `Bearer ${vault_token}`
  }
})
.then(resposta => resposta.json())
.then(dados => {
  if (dados.Erro) {
    alert(`Erro ao buscar produto: ${dados.Erro}`);
    return;
  }
  
  PRODUTO.id = dados._id;
  PRODUTO.titulo = dados.nome;
  PRODUTO.descricaoRapida = dados.descricao;
  PRODUTO.precoOriginal = dados.precoOriginal;
  PRODUTO.precoAtual = dados.precoOriginal;
  PRODUTO.condicaoAtiva = dados.estado;
  PRODUTO.vendedor.nome = dados.dono.username;

  PRODUTO.categoria = dados.categoria?.nome || 'Sem Categoria';

  if(dados.franquia) PRODUTO.subcategoria = dados.franquia;

  PRODUTO.especificacoes = dados.especificacoes || [];
  PRODUTO.imagens = dados.imagens || [];

  console.log(dados.especificacoes);
  
  renderPage();
})
.catch(erro => {
  console.error("Erro fatal ao buscar a encomenda:", erro);
});

/* --- Utilitários (HELPERS) ---*/
const fmtPreco = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
  if (status === 'low') return { dot: 'low', cls: 'stock-low', txt: `Apenas ${qtd} unidade${qtd > 1 ? 's' : ''} restante${qtd > 1 ? 's' : ''}!` };
  return { dot: 'in', cls: 'stock-in', txt: 'Em estoque' };
}


/*--- RENDER'S — BREADCRUMB ---*/
function renderBreadcrumb() {
  const p = PRODUTO;
  document.getElementById('breadcrumb').innerHTML = `
    <a href="index.html">Início</a>
    <span class="breadcrumb-sep">›</span>
    <a href="listagem.html?cat=${p.categoria.toLowerCase()}">${p.categoria}</a>
    <span class="breadcrumb-sep">›</span>
    <a href="listagem.html?cat=${p.slug}">${p.subcategoria}</a>
    <span class="breadcrumb-sep">›</span>
    <span>${p.titulo.split('—')[0].trim()}</span>
  `;
}


/*--- RENDER — GALERIA ---*/
function renderGallery() {
  const imgs = (PRODUTO.imagens && PRODUTO.imagens.length > 0) 
      ? PRODUTO.imagens 
      : ["https://placehold.co/600x600/1a1a1a/555555?text=Sem+Foto&font=Montserrat"];
  const badges = PRODUTO.badges.map((b, i) =>
    `<span class="badge ${b.classe}" style="animation-delay:${i * .1}s">${b.texto}</span>`
  ).join('');
  const thumbs = imgs.map((src, i) => `
    <div class="thumb ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <img src="${src}" alt="Foto ${i + 1}" loading="lazy" />
    </div>`
  ).join('');

  return `
    <div class="gallery">
      <div class="gallery-main">
        <img src="${imgs[0]}" id="main-img" alt="${PRODUTO.titulo}" />
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


/*--- RENDER — INFO DO PRODUTO ---*/
function renderProductInfo() {
  const p  = PRODUTO;
  const vd = p.vendedor;

  const condTabs = p.condicoes.map(c =>
    `<button class="cond-tab ${c === p.condicaoAtiva ? 'active' : ''}" data-cond="${c}">${c}</button>`
  ).join('');

  const specs = p.specsRapidas.map(s => `
    <div class="spec-row">
      <span class="spec-icon">${s.icone}</span>
      <span class="spec-key">${s.chave}</span>
      <span class="spec-val">${s.valor}</span>
    </div>`
  ).join('');

  const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');

  return `
    <div class="product-info">
      <div class="seller-row">
        <div class="seller-avatar">${vd.inicial}</div>
        <div>Vendido por <span class="seller-name">${vd.nome}</span></div>
        ${vd.verificado ? `
          <div class="seller-verified">
            <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Verificado
          </div>` : ''}
      </div>

      <h1 class="product-title">${p.titulo}</h1>

      <div class="ratings-row">
        ${renderStars(p.avaliacaoMedia)}
        <span class="rating-num">${p.avaliacaoMedia}</span>
        <span class="rating-count">(${p.avaliacaoTotal} avaliações)</span>
        <span class="rating-sep">·</span>
        <span class="sold-count">${p.vendidos} vendidos</span>
      </div>

      <hr class="divider" />

      <div class="condition-row">
        <span class="condition-label">Condição</span>
        <div class="condition-tabs">${condTabs}</div>
      </div>

      <hr class="divider" />

      <p class="desc-snippet">${p.descricaoRapida}</p>
      <div class="specs-quick">${specs}</div>
      <div class="tags">${tags}</div>
    </div>`;
}


/*--- RENDER — CAIXA DE COMPRA ---*/
function renderPurchaseBox() {
  const p  = PRODUTO;
  const vd = p.vendedor;
  const st = stockLabel(p.estoqueStatus, p.estoqueQtd);

  return `
    <div class="purchase-box">
      <div class="price-block">
        <span class="price-original">R$ ${fmtPreco(p.precoOriginal)}</span>
        <div class="price-discount-row">
          <span class="price-main">R$ ${fmtPreco(p.precoAtual)}</span>
          <span class="price-badge-off">−${p.desconto}%</span>
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

      <!-- SEÇÃO DE LANCE -->
      <div class="lance-section">
        <div class="lance-header">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M2 21l4.5-4.5"/></svg>
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
          <button id="btn-lance" class="btn-lance">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M2 21l4.5-4.5"/></svg>
            Dar lance
          </button>
        </div>
      </div>

      <div class="cta-stack">
        <button class="btn-buy">⚡ Comprar agora</button>
        <button class="btn-cart">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Adicionar ao carrinho
        </button>
        <button class="btn-wishlist">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          Adicionar à lista de desejos
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
          <div class="seller-stat">
            <span class="seller-stat-val">${vd.reputacao}</span>
            <span class="seller-stat-key">Reputação</span>
          </div>
          <div class="seller-stat">
            <span class="seller-stat-val">${vd.vendas}</span>
            <span class="seller-stat-key">Vendas</span>
          </div>
          <div class="seller-stat">
            <span class="seller-stat-val">${vd.aprovacao}</span>
            <span class="seller-stat-key">Aprovação</span>
          </div>
        </div>
        <button class="btn-seller">Ver perfil do vendedor →</button>
      </div>
    </div>`;
}


/*--- RENDER — SEÇÕES INFERIORES ---*/
function renderBottom() {
  const p = PRODUTO;

  const descSections = p.descricaoCompleta.map(s => {
    const body = s.tipo === 'lista'
      ? `<ul>${s.conteudo.map(i => `<li>${i}</li>`).join('')}</ul>`
      : `<p>${s.conteudo}</p>`;
    return `<h3>${s.titulo}</h3>${body}`;
  }).join('');

  const specRows = p.especificacoes.map(e =>
    `<tr><td>${e.chave}</td><td>${e.valor}</td></tr>`
  ).join('');

  const bars = p.distribuicaoEstrelas.map(d => `
    <div class="bar-row">
      <span class="bar-label">${d.estrelas}★</span>
      <div class="bar-track"><div class="bar-fill" style="width:${d.pct}%"></div></div>
      <span class="bar-pct">${d.pct}%</span>
    </div>`
  ).join('');

  const reviewCards = p.reviews.map(r => {
    const stars =
      Array(Math.floor(r.estrelas)).fill(`<span class="star full">★</span>`).join('') +
      Array(5 - Math.floor(r.estrelas)).fill(`<span class="star empty">★</span>`).join('');
    return `
      <div class="review-card">
        <div class="review-header">
          <div class="review-user">
            <div class="review-avatar">${r.nome[0]}</div>
            <div>
              <div class="review-name">${r.nome}</div>
              <div class="review-date">${r.data}</div>
            </div>
          </div>
          <div class="review-stars">${stars}</div>
        </div>
        <p class="review-text">${r.texto}</p>
        ${r.verificado ? `
          <div class="review-verified">
            <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Compra verificada
          </div>` : ''}
      </div>`;
  }).join('');

  const relCards = Array(5).fill(0).map((_, i) => `
    <a class="rel-card" href="produto.html" aria-label="Ver produto relacionado ${i + 1}">
      <div class="rel-img"></div>
      <div class="rel-body">
        <div class="rel-title-sk"></div>
        <div class="rel-price-sk"></div>
      </div>
    </a>`
  ).join('');

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
          <div class="reviews-big-num">${p.avaliacaoMedia}</div>
          ${renderStars(p.avaliacaoMedia, true)}
          <div class="reviews-total">${p.avaliacaoTotal} avaliações</div>
          <div class="reviews-bars">${bars}</div>
        </div>
        <div class="reviews-list">${reviewCards}</div>
      </div>
    </div>
    <div>
      <h2 class="section-heading"><span class="section-heading-dot"></span>Você também pode gostar</h2>
      <div class="related-grid">${relCards}</div>
    </div>`;
}


/*--- RENDER PRINCIPAL ---*/
function renderPage() {
  document.title = `${PRODUTO.titulo.split('—')[0].trim()} – Vault Experience`;
  renderBreadcrumb();
  document.getElementById('product-page').innerHTML =
    renderGallery() + renderProductInfo() + renderPurchaseBox();
  document.getElementById('product-bottom').innerHTML = renderBottom();
  bindEvents();
}


/*--- EVENTOS ---*/
function bindEvents() {
  const p = PRODUTO;

  /* Galeria: troca de foto */
  document.getElementById('gallery-thumbs').addEventListener('click', e => {
    const thumb = e.target.closest('.thumb');
    if (!thumb) return;
    const idx = parseInt(thumb.dataset.idx, 10);
    document.getElementById('main-img').src = p.imagens[idx];
    document.querySelectorAll('.thumb').forEach((t, i) =>
      t.classList.toggle('active', i === idx)
    );
  });

  /*--- Quantidade ---*/
  let qty = 1;
  const qtyNum = document.getElementById('qty-num');
  document.getElementById('qty-minus').addEventListener('click', () => {
    if (qty > 1) qtyNum.textContent = --qty;
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    if (qty < p.estoqueMax) qtyNum.textContent = ++qty;
  });

  /*--- Abas de condição ---*/
  document.querySelectorAll('.cond-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cond-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  /*--- Lance / Oferta ---*/
  const lanceInput = document.getElementById('lance-input');
  const btnLance   = document.getElementById('btn-lance');

  /* Chips de incremento */
  document.querySelectorAll('.lance-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const add      = parseFloat(chip.dataset.add);
      const current  = parseFloat(lanceInput.value) || 0;
      lanceInput.value = (current + add).toFixed(2);
      lanceInput.dispatchEvent(new Event('input'));
    });
  });

  /* Mostrar/esconder estado do botão */
  lanceInput.addEventListener('input', () => {
    const val = parseFloat(lanceInput.value);
    btnLance.disabled = !(val > 0);
  });
  btnLance.disabled = true;

  /* Enviar lance */
  btnLance.addEventListener('click', () => {
    const val = parseFloat(lanceInput.value);
    if (!val || val <= 0) return;

    const fmtVal = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    /* Feedback visual */
    btnLance.textContent = '✓ Lance enviado!';
    btnLance.classList.add('lance-enviado');
    btnLance.disabled = true;

    /* Toast de confirmação */
    const toast = document.createElement('div');
    toast.className = 'lance-toast';
    toast.innerHTML = `<strong>Lance de ${fmtVal} enviado!</strong><br>O vendedor foi notificado e irá responder em breve.`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  });
}

// /*--- INIT ---*/
// renderPage();