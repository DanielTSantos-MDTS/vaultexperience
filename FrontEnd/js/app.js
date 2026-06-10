const CATEGORIES  = ['Consoles & Jogos','Livros & Mangas','Funkos & Figures','Assinaturas & Keys','Em alta','Acessórios','Softwares'];
let activeCategory = 'Em alta';
let activeSlide    = 0;
const TOTAL_SLIDES = 3;
const TOTAL_CARDS  = 5;

/* --- Dropdown de perfil ---*/
const userBtn      = document.getElementById('user-btn');
const userDropdown = document.getElementById('user-dropdown');

if (userBtn && userDropdown) {
  userBtn.addEventListener('click', e => {
    e.stopPropagation();
    userDropdown.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    userDropdown.classList.remove('active');
  });

  userDropdown.addEventListener('click', e => e.stopPropagation());
}

/* --- Submenu de categorias & dados mega menu --- */
const MEGA_DATA = {
  'Consoles & Jogos': {
    header: 'Consoles & Jogos',
    links: [
      { name: 'PlayStation',  desc: 'PS4, PS5 e acessórios',       icon: 'ti-device-gamepad-2', badge: null },
      { name: 'Xbox',         desc: 'Series X/S e Game Pass',      icon: 'ti-brand-xbox',       badge: { text: 'HOT', cls: 'badge-hot' } },
      { name: 'Nintendo',     desc: 'Switch e portáteis',          icon: 'ti-device-nintendo',  badge: null },
      { name: 'Retro',        desc: 'Mega Drive, SNES e mais',     icon: 'ti-cpu',              badge: { text: 'NEW', cls: 'badge-new' } },
      { name: 'Jogos PC',     desc: 'Keys e mídia física',         icon: 'ti-device-desktop',   badge: null },
    ],
    footer: 'Ver todos os consoles & jogos →'
  },

  'Livros & Mangas': {
    header: 'Livros & Mangás',
    links: [
      { name: 'Mangá Shonen',  desc: 'Ação e aventura',              icon: 'ti-books',    badge: { text: 'HOT', cls: 'badge-hot' } },
      { name: 'Mangá Seinen',  desc: 'Para público adulto',          icon: 'ti-book-2',   badge: null },
      { name: 'Light Novels',  desc: 'Nacionais e importadas',       icon: 'ti-book',     badge: { text: 'NEW', cls: 'badge-new' } },
      { name: 'HQs & Comics',  desc: 'Marvel, DC e independentes',   icon: 'ti-writing',  badge: null },
      { name: 'Artbooks',      desc: 'Games, anime e cinema',        icon: 'ti-palette',  badge: null },
    ],
    footer: 'Ver todos os livros & mangás →'
  },

  'Funkos & Figures': {
    header: 'Funkos & Figures',
    links: [
      { name: 'Funko Pop',       desc: 'Anime, games e filmes',      icon: 'ti-ghost',      badge: { text: 'HOT', cls: 'badge-hot' } },
      { name: 'Nendoroids',      desc: 'Good Smile Company',         icon: 'ti-mood-smile', badge: null },
      { name: 'Figmas',          desc: 'Articulados e detalhados',   icon: 'ti-man',        badge: null },
      { name: 'Estatuetas',      desc: 'Colecionáveis premium',      icon: 'ti-crown',      badge: null },
      { name: 'Edição Limitada', desc: 'Itens exclusivos',           icon: 'ti-diamond',    badge: { text: '15% OFF', cls: 'badge-off' } },
    ],
    footer: 'Ver todos os funkos & figures →'
  },

  'Assinaturas & Keys': {
    header: 'Assinaturas & Keys',
    links: [
      { name: 'PlayStation Plus', desc: 'Essential, Extra e Premium', icon: 'ti-device-gamepad-2', badge: null },
      { name: 'Xbox Game Pass',   desc: 'PC e console',               icon: 'ti-brand-xbox',       badge: { text: 'HOT', cls: 'badge-hot' } },
      { name: 'Nintendo Online',  desc: 'Individual e familiar',      icon: 'ti-device-nintendo',  badge: null },
      { name: 'Steam Gift Cards', desc: 'Créditos para sua conta',    icon: 'ti-brand-steam',      badge: null },
      { name: 'EA Play',          desc: 'Acesso ao catálogo EA',      icon: 'ti-player-play',      badge: null },
    ],
    footer: 'Ver todas as assinaturas →'
  },

  'Em alta': {
    header: 'Em Alta Agora',
    links: [
      { name: 'Mais Vendidos', desc: 'Os queridinhos da semana',    icon: 'ti-trending-up', badge: { text: 'HOT', cls: 'badge-hot' } },
      { name: 'Novidades',     desc: 'Chegou agora no estoque',     icon: 'ti-sparkles',    badge: { text: 'NEW', cls: 'badge-new' } },
      { name: 'Promoções',     desc: 'Descontos imperdíveis',       icon: 'ti-tag',         badge: { text: '20% OFF', cls: 'badge-off' } },
      { name: 'Pré-venda',     desc: 'Reserve antes de todo mundo', icon: 'ti-clock',       badge: null },
    ],
    footer: 'Ver tudo que está em alta →'
  },

  'Acessórios': {
    header: 'Acessórios',
    links: [
      { name: 'Controles',            desc: 'Para todos os consoles',          icon: 'ti-device-gamepad', badge: null },
      { name: 'Headsets',             desc: 'Som imersivo para games',         icon: 'ti-headphones',     badge: null },
      { name: 'Mousepads & Teclados', desc: 'Setup gamer completo',            icon: 'ti-keyboard',       badge: { text: 'NEW', cls: 'badge-new' } },
      { name: 'Casa & Decor',         desc: 'Almofadas, canecas e luminárias', icon: 'ti-home',           badge: null },
    ],
    footer: 'Ver todos os acessórios →'
  },

  'Softwares': {
    header: 'Softwares',
    links: [
      { name: 'Antivírus',       desc: 'Proteção para seu PC',      icon: 'ti-shield',    badge: null },
      { name: 'Produtividade',   desc: 'Office e ferramentas',      icon: 'ti-briefcase', badge: null },
      { name: 'Edição & Design', desc: 'Adobe, Canva e mais',       icon: 'ti-vector',    badge: { text: '10% OFF', cls: 'badge-off' } },
      { name: 'Utilitários',     desc: 'VPN, backup e otimização',  icon: 'ti-tool',      badge: null },
    ],
    footer: 'Ver todos os softwares →'
  }
};

/* --- Slug maps para URLs do catálogo --- */
const CAT_SLUG = {
  'Consoles & Jogos':   'consoles-jogos',
  'Livros & Mangas':    'livros-mangas',
  'Funkos & Figures':   'funkos-figures',
  'Assinaturas & Keys': 'assinaturas-keys',
  'Em alta':            'em-alta',
  'Acessórios':         'acessorios',
  'Softwares':          'softwares',
};

const SUBCAT_SLUG = {
  'PlayStation':          'playstation',
  'Xbox':                 'xbox',
  'Nintendo':             'nintendo',
  'Retro':                'retro',
  'Jogos PC':             'jogos-pc',
  'Mangá Shonen':         'manga-shonen',
  'Mangá Seinen':         'manga-seinen',
  'Light Novels':         'light-novels',
  'HQs & Comics':         'hqs-comics',
  'Artbooks':             'artbooks',
  'Funko Pop':            'funko-pop',
  'Nendoroids':           'nendoroids',
  'Figmas':               'figmas',
  'Estatuetas':           'estatuetas',
  'Edição Limitada':      'edicao-limitada',
  'PlayStation Plus':     'ps-plus',
  'Xbox Game Pass':       'game-pass',
  'Nintendo Online':      'nintendo-online',
  'Steam Gift Cards':     'steam',
  'EA Play':              'ea-play',
  'Mais Vendidos':        'mais-vendidos',
  'Novidades':            'novidades',
  'Promoções':            'promocoes',
  'Pré-venda':            'pre-venda',
  'Controles':            'controles',
  'Headsets':             'headsets',
  'Mousepads & Teclados': 'mousepads-teclados',
  'Casa & Decor':         'casa-decor',
  'Antivírus':            'antivirus',
  'Produtividade':        'produtividade',
  'Edição & Design':      'edicao-design',
  'Utilitários':          'utilitarios',
};

  const prateleiraFranquias = document.getElementById('grid-franquias');

/* --- Menu de categorias --- */
function buildCatMenu() {
  const container = document.getElementById('cat-menu');
  if (!container) return;

  container.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const data = MEGA_DATA[cat];

    const item = document.createElement('div');
    item.className = 'cat-item';

    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      activeCategory = cat;

      document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.remove('active');
      });

      btn.classList.add('active');

      document.querySelectorAll('.cat-item').forEach(menuItem => {
        if (menuItem !== item) {
          menuItem.classList.remove('active');
        }
      });

      item.classList.toggle('active');
    });

    let megaHtml = '';

    if (data) {
      const catSlugPai = CAT_SLUG[cat] || cat.toLowerCase().replace(' ', '-');

      const linksHtml = data.links.map(l => {
        const subSlug = SUBCAT_SLUG[l.name] || l.name.toLowerCase().split(' ').join('-');
        const destinoUrl = `categorias.html?cat=${catSlugPai}&sub=${subSlug}`;
        
        return `
            <a href="${destinoUrl}" 
               onclick="e.stopPropagation(); window.location.href='${destinoUrl}'; return false;" 
               class="mega-link">
                <div class="mega-link-icon">
                    <i class="ti ${l.icon}"></i>
                </div>
                <div>
                    <div class="mega-link-name">${l.name}</div>
                    <div class="mega-link-desc">${l.desc}</div>
                </div>
                ${l.badge ? `<span class="mega-badge ${l.badge.cls}">${l.badge.text}</span>` : ''}
            </a>
        `;
      }).join('');

      megaHtml = `
        <div class="mega-menu">
          <div class="mega-menu-header">${data.header}</div>
          <div class="mega-links">
            ${linksHtml}
          </div>
          <a href="categorias.html?cat=${catSlugPai}" class="mega-footer">
            ${data.footer}
          </a>
        </div>
      `;
    }

    item.innerHTML = megaHtml;
    item.prepend(btn);
    container.appendChild(item);
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.cat-item').forEach(item => {
      item.classList.remove('active');
    });
  });
}

/* --- Menu Mobile --- */
function buildMobileMenu() {
  const list = document.getElementById('mobile-cat-list');
  if (!list) return;

  list.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;

    if (cat === activeCategory) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      activeCategory = cat;
      document.querySelectorAll('.mobile-cat-list button, .cat-btn').forEach(b => {
        b.classList.toggle('active', b.textContent === cat);
      });
      closeOverlay();
    });

    list.appendChild(btn);
  });
}

function openOverlay() {
  document.getElementById('mobile-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  document.getElementById('mobile-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileClose  = document.getElementById('mobile-close');

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', openOverlay);
}

if (mobileClose) {
  mobileClose.addEventListener('click', closeOverlay);
}

/* --- Carrossel --- */
function goToSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  slides.forEach((s, i) => {
    s.classList.toggle('active', i === index);
  });
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });

  activeSlide = index;
}

function buildDots() {
  const container = document.getElementById('hero-dots');
  if (!container) return;

  container.innerHTML = '';
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const btn = document.createElement('button');
    btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Slide ' + (i + 1));
    btn.addEventListener('click', () => goToSlide(i));
    container.appendChild(btn);
  }
}

setInterval(() => {
  goToSlide((activeSlide + 1) % TOTAL_SLIDES);
}, 7000);

/* --- Cards skeleton --- */
function buildCards() {
  const grids = document.querySelectorAll('.js-product-grid');
  if (grids.length === 0) return;

  grids.forEach(grid => {
    grid.innerHTML = '';
    for (let i = 0; i < TOTAL_CARDS; i++) {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animation = 'slide-in .5s ease ' + (i * 0.08) + 's both';
      card.style.cursor = 'pointer';
      card.innerHTML =
        '<div class="card-img"></div>' +
        '<div class="card-body">' +
          '<div class="card-line" style="height:13px;width:80%"></div>' +
          '<div class="card-line" style="height:11px;width:55%"></div>' +
          '<div class="card-line" style="height:18px;width:42%"></div>' +
        '</div>';

      card.addEventListener('click', () => {
        window.location.href = 'produto.html';
      });

      grid.appendChild(card);
    }
  });
}

fetch('http://localhost:3000/item')
  .then(resposta => resposta.json())
  .then(listaDeItens => {
      const prateleiraPopulares = document.getElementById('grid-populares');
      const prateleiraOfertas = document.getElementById('grid-ofertas');


      
      const itensEmOferta = listaDeItens.filter(item => item.precoOriginal < 100);
      
      if(prateleiraPopulares) {
        prateleiraPopulares.innerHTML = ''; 

        listaDeItens.slice(0, TOTAL_CARDS).forEach((item, index) => {

        const imagemCapa = (item.imagens && item.imagens.length > 0)
        ? `<img src="${item.imagens[0]}" alt="${item.titulo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 8px 0 0;" />`
    : `<div style="display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: center; background-color: #1a1a1a; border-radius: 8px 8px 0 0; color: #444;">
         <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin-bottom: 8px;">
           <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
           <circle cx="8.5" cy="8.5" r="1.5"></circle>
           <polyline points="21 15 16 10 5 21"></polyline>
         </svg>
         <span style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Sem Foto</span>
       </div>`;
        
          const quadradinhoHTML = `
            <div class="card" style="animation: slide-in .5s ease ${index * 0.08}s both; cursor: pointer;" onclick="window.location.href='produto.html?id=${item._id}'">
              <div class="card-img" style="display: flex; align-items: center; justify-content: center; background-color: #222;">
                ${imagemCapa}
              </div>
              <div class="card-body">
                <h3 style="color: #fff; font-size: 16px; margin: 0 0 5px 0;">${item.titulo}</h3>
                <p style="color: #aaa; font-size: 12px; margin: 0 0 10px 0;">${item.categoria?.nome || 'Sem Categoria'}</p>
                <h3 style="color: #f1c40f; margin: 0;">R$ ${item.precoOriginal}</h3>
                <p style="color: #555; font-size: 11px; margin-top: 10px;">Vendedor: ${item.dono?.username || 'Desconhecido'}</p>
              </div>
            </div>
          `;
          prateleiraPopulares.innerHTML += quadradinhoHTML;
      });
}
    if(prateleiraOfertas){
      prateleiraOfertas.innerHTML = '';
      itensEmOferta.slice(0, TOTAL_CARDS).forEach((item, index) => {
        const imagemCapa = (item.imagens && item.imagens.length > 0)
        ? `<img src="${item.imagens[0]}" alt="${item.titulo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 8px 0 0;" />`
    : `<div style="display: flex; flex-direction: column; width: 100%; height: 100%; align-items: center; justify-content: center; background-color: #1a1a1a; border-radius: 8px 8px 0 0; color: #444;">
         <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin-bottom: 8px;">
           <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
           <circle cx="8.5" cy="8.5" r="1.5"></circle>
           <polyline points="21 15 16 10 5 21"></polyline>
         </svg>
         <span style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Sem Foto</span>
       </div>`;
          const quadradinhoHTML = `
            <div class="card" style="animation: slide-in .5s ease ${index * 0.08}s both; cursor: pointer;" onclick="window.location.href='produto.html?id=${item._id}'">
              <div class="card-img" style="display: flex; align-items: center; justify-content: center; background-color: #222;">
                ${imagemCapa}
              </div>
              <div class="card-body">
                <h3 style="color: #fff; font-size: 16px; margin: 0 0 5px 0;">${item.titulo}</h3>
                <p style="color: #aaa; font-size: 12px; margin: 0 0 10px 0;">${item.categoria?.nome || 'Sem Categoria'}</p>
                <h3 style="color: #f1c40f; margin: 0;">R$ ${item.precoOriginal}</h3>
                <p style="color: #555; font-size: 11px; margin-top: 10px;">Vendedor: ${item.dono?.username || 'Desconhecido'}</p>
              </div>
            </div>
          `;
          prateleiraOfertas.innerHTML += quadradinhoHTML;
      });
    };
      
  })
  .catch(erro => {
      console.error("Erro na requisição:", erro);
  });
      
  fetch('http://localhost:3000/item')
  .then(resposta => resposta.json())
  .then(listaDeItens =>{
    
    const itensComFranquia = listaDeItens.filter(item => item.franquia !== undefined && item.franquia !== "");
    
    const franquiasUnicas = [...new Set(itensComFranquia.map(item => item.franquia))];
    
    if(prateleiraFranquias){
    prateleiraFranquias.innerHTML = ''; 
    franquiasUnicas.forEach((nomeDaFranquia, index) => {
        const cardFranquia = `
            <div class="card" style="animation: slide-in .5s ease ${index * 0.08}s both; cursor: pointer;" onclick="window.location.href='categorias.html?filtro=${nomeDaFranquia}'">
              
              <div class="card-img" style="display: flex; align-items: center; justify-content: center; background-color: #222;">
                <span style="color: #555; font-size: 12px;">Sem foto</span>
              </div>
              
              <div class="card-body">
                <p style="color: #aaa; font-size: 12px; margin: 0 0 10px 0;">${nomeDaFranquia}</p>
              </div>

            </div>
        `;

        prateleiraFranquias.innerHTML += cardFranquia;
    });
  };
  })
  .catch(erro => {
    console.error("Erro na requisição:", erro);
  })

/* --- Utilitários --- */
const fmt = (n) =>
  n.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

function renderStars(media) {
  const cheia = Math.floor(media);
  const vazia = 5 - cheia;
  return `<div class="stars">` +
    '★'.repeat(cheia).split('').map(() => `<span class="star full">★</span>`).join('') +
    '★'.repeat(vazia).split('').map(() => `<span class="star empty">★</span>`).join('') +
    `</div>`;
}

function stockLabel(status, qtd) {
  if (status === 'low') {
    return { dot: 'low', cls: 'stock-low', txt: `Apenas ${qtd} restantes!` };
  }
  return { dot: 'in', cls: 'stock-in', txt: 'Em estoque' };
}

/* --- Init Executions --- */
buildCatMenu();

if (document.getElementById('mobile-cat-list')) {
  buildMobileMenu();
}

if (document.getElementById('hero-dots')) {
  buildDots();
}

if (document.querySelectorAll('.js-product-grid').length) {
  buildCards();
}

window.onload = () => {
  if (typeof initInteractions === 'function') {
    initInteractions();
  }
  if (typeof populateGrids === 'function') {
    populateGrids();
  }
};

/* --- LOGIN CONTROL & DOM MANIPULATION --- */
const authArea = document.getElementById('auth-area');
const userMenu = document.getElementById('user-menu');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');
const loginBtn = document.getElementById('login-btn');

const isLogged = localStorage.getItem('vault_token');
const username = localStorage.getItem('vault_user');

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
}

if (isLogged) {
  // Tem crachá! Esconde a caixa do Entrar e mostra a do Usuário
  if (authArea) authArea.classList.add('hidden');
  if (userMenu) userMenu.classList.remove('hidden');
  
  // Escreve o nome do Zemundo na tela
  if (usernameDisplay && username) usernameDisplay.textContent = username;
} else {
  // Não tem crachá! Mostra a caixa do Entrar e esconde a do Usuário
  if (authArea) authArea.classList.remove('hidden');
  if (userMenu) userMenu.classList.add('hidden');
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem('vault_token');
    localStorage.removeItem('vault_user');
    window.location.reload();
  });
}

// if (isLogged) {
//   if (loginBtn) loginBtn.style.display = 'none';
//   if (userMenu) userMenu.style.display = 'flex';
// } else {
//   if (loginBtn) loginBtn.style.display = '';
//   if (userMenu) userMenu.style.display = 'none';
// }