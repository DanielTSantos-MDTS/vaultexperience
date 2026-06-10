'use strict';

const API_BASE = 'http://localhost:3000';

/*--- Utilitários ---*/
const $    = id => document.getElementById(id);
const qs   = sel => document.querySelector(sel);
const qsa  = sel => document.querySelectorAll(sel);

/*--- MOCK DOS CUPONS ---*/
const CUPONS = {
  'VAULT10': { desc: '10% OFF', type: 'percent', value: 10 },
  'GEEK20' : { desc: '20% OFF', type: 'percent', value: 20 },
  'FRETE'  : { desc: 'Frete Grátis', type: 'frete', value: 0 },
  'RETRO15': { desc: 'R$ 15,00 OFF', type: 'fixed',  value: 15 },
};

/*--- MASKS ---*/
function maskCPF(el) {
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
         .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    el.value = v;
  });
}
function maskPhone(el) {
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{2})(\d)/, '($1) $2')
         .replace(/(\(\d{2}\) \d{5})(\d)/, '$1-$2');
    el.value = v;
  });
}
function maskCEP(el) {
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').slice(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    el.value = v;
  });
}
function maskCard(el) {
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').slice(0, 16);
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    el.value = v.trim();
    detectBrand(v.replace(/\s/g, ''));
  });
}
function maskExp(el) {
  el.addEventListener('input', () => {
    let v = el.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    el.value = v;
  });
}

function detectBrand(num) {
  const el = $('cc-brand');
  if (!el) return;
  if (/^4/.test(num))        el.textContent = '💳'; // Visa
  else if (/^5[1-5]/.test(num)) el.textContent = '💳'; // MC
  else if (/^3[47]/.test(num))  el.textContent = '💳'; // Amex
  else el.textContent = '';
}

/*--- CHECKOUT ---*/ 
const State = {
  step: 1,
  customer: {},
  address: {},
  shipping: { label: 'SEDEX', price: 29.90, days: 2 },
  payment: { method: 'pix' },
  coupon: null,
  appliedCoupon: null,
  apiCart: null,
};

function isLoggedIn() {
  return !!localStorage.getItem('vault_token');
}

function getUserId() {
  const stored = localStorage.getItem('vault_id');
  if (stored) return stored;
  const token = localStorage.getItem('vault_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || null;
  } catch {
    return null;
  }
}

function getVendaStatus(paymentMethod) {
  return ['pix', 'boleto'].includes(paymentMethod) ? 'Pendente' : 'Concluída';
}

async function registrarVendas(order) {
  const token = localStorage.getItem('vault_token');
  if (!token) return;

  if (!getUserId()) {
    throw new Error('Não foi possível identificar o usuário. Faça login novamente.');
  }

  const status = getVendaStatus(order.payment.method);

  for (const item of order.items) {
    const res = await fetch(`${API_BASE}/venda/comprar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        itemId: item.id,
        valorOfertado: item.price * item.qty,
        quantidade: item.qty,
        status,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.erro || data.Erro || `Erro ao registrar venda (${res.status})`);
    }
  }
}

function mapApiCartItem(ci) {
  const item = ci.item || {};
  const id = (item._id || ci.item || '').toString();
  const image = item.imagens?.[0] || '';
  return {
    id,
    name: item.titulo || 'Produto',
    price: parseFloat(ci.precoUnitario) || 0,
    qty: parseInt(ci.quantidade, 10) || 1,
    estoqueMax: parseInt(item.estoqueQtd, 10) || 99,
    subcat: item.subcategoria || item.franquia || '',
    subcatLabel: item.subcategoria || item.franquia || '',
    image: image.startsWith('http') ? image : (image ? `http://localhost:3000${image}` : ''),
  };
}

function getActiveCart() {
  if (isLoggedIn()) {
    if (!State.apiCart?.itens) return [];
    return State.apiCart.itens.map(mapApiCartItem);
  }
  return VaultStore.getCart();
}

function getActiveCartTotal() {
  return getActiveCart().reduce((s, i) => s + i.price * i.qty, 0);
}

/*--- RENDER CARRINHO ---*/
function renderCartItems() {
  const cart = getActiveCart();
  const list = $('cart-items-list');
  const empty = $('cart-empty');
  if (!list) return;

  list.innerHTML = '';

  if (cart.length === 0) {
    empty && (empty.style.display = 'flex');
    return;
  }
  empty && (empty.style.display = 'none');

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.id = `ci-${item.id}`;
    row.innerHTML = `
      <div class="cart-item-img"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-sub">${item.subcatLabel || item.subcat || ''}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="Checkout.changeQty('${item.id}', -1)">−</button>
        <span class="qty-val" id="qty-${item.id}">${item.qty}</span>
        <button class="qty-btn" onclick="Checkout.changeQty('${item.id}', 1)">+</button>
      </div>
      <div class="cart-item-price">R$ ${fmt(item.price * item.qty)}</div>
      <button class="cart-item-remove" title="Remover" onclick="Checkout.removeItem('${item.id}')">
        <i class="ti ti-x"></i>
      </button>
    `;
    list.appendChild(row);
  });

  updateSummary();
}

/*--- SIDEBAR ---*/
function updateSummary() {
  const cart     = getActiveCart();
  const subtotal = getActiveCartTotal();
  const frete    = State.shipping.price;
  let   discount = 0;

  if (State.appliedCoupon) {
    const c = State.appliedCoupon;
    if (c.type === 'percent') discount = subtotal * (c.value / 100);
    if (c.type === 'fixed')   discount = Math.min(c.value, subtotal);
    if (c.type === 'frete')   discount = frete; // "frete grátis" desconta o frete
  }

  const total = Math.max(0, subtotal + frete - discount);

  /*--- Sidebar ---*/
  const sumItems = $('summary-items');
  if (sumItems) {
    sumItems.innerHTML = cart.map(i =>
      `<div class="summary-item">
        <span class="summary-item-name">${i.qty}x ${i.name}</span>
        <span>R$ ${fmt(i.price * i.qty)}</span>
      </div>`
    ).join('');
  }

  setText('sum-subtotal', `R$ ${fmt(subtotal)}`);
  setText('sum-frete',    State.shipping.price === 0 ? 'Grátis' : `R$ ${fmt(frete)}`);
  setText('sum-total',    `R$ ${fmt(total)}`);

  /*--- Revisão (step 4) ---*/
  setText('rev-subtotal', `R$ ${fmt(subtotal)}`);
  setText('rev-frete',    State.shipping.price === 0 ? 'Grátis' : `R$ ${fmt(frete)}`);
  setText('rev-total',    `R$ ${fmt(total)}`);

  const discRow = $('rev-discount-row');
  if (discRow) {
    discRow.style.display = discount > 0 ? 'flex' : 'none';
    setText('rev-discount', `- R$ ${fmt(discount)}`);
    if (State.appliedCoupon) setText('rev-coupon-tag', State.appliedCoupon.desc);
  }

  /*--- Parcelas do cartão ---*/
  fillParcelas(total);
}

function setText(id, txt) { const el = $(id); if (el) el.textContent = txt; }

/*--- PARCELAS ---*/
function fillParcelas(total) {
  const sel = $('cc-parcelas');
  if (!sel) return;
  sel.innerHTML = '';
  for (let i = 1; i <= 12; i++) {
    const juros  = i <= 6 ? 0 : 0.0199;
    const valor  = (total * Math.pow(1 + juros, i)) / i;
    const label  = i === 1
      ? `1x de R$ ${fmt(valor)} sem juros`
      : i <= 6
        ? `${i}x de R$ ${fmt(valor)} sem juros`
        : `${i}x de R$ ${fmt(valor)} (com juros)`;
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = label;
    sel.appendChild(opt);
  }
}

/*--- REVIEW STEP 4 ---*/
function renderReview() {
  /* Entrega */
  const a = State.address;
  const c = State.customer;
  const revDelivery = $('review-delivery');
  if (revDelivery) {
    revDelivery.innerHTML = `
      <strong>${c.nome} ${c.sobrenome}</strong><br>
      CPF: ${c.cpf}<br>
      Telefone: ${c.telefone}<br><br>
      ${a.rua}, ${a.numero}${a.complemento ? ' — ' + a.complemento : ''}<br>
      ${a.bairro} — ${a.cidade} / ${a.estado}<br>
      CEP: ${a.cep}<br><br>
      <strong>Frete:</strong> ${State.shipping.label} — até ${State.shipping.days} dias úteis
    `;
  }

  /*--- Pagamento ---*/
  const p = State.payment;
  const revPayment = $('review-payment');
  if (revPayment) {
    const labels = { pix: '⚡ Pix', boleto: '📄 Boleto Bancário', carteira: '💰 Saldo na Carteira', cartao: '💳 Cartão de Crédito' };
    let extra = '';
    if (p.method === 'cartao' && p.number) {
      extra = `<br>${p.name}<br>**** **** **** ${p.number.slice(-4)}<br>${$('cc-parcelas')?.options[$('cc-parcelas')?.selectedIndex]?.text || ''}`;
    }
    revPayment.innerHTML = `<strong>${labels[p.method] || p.method}</strong>${extra}`;
  }

  /*--- Produtos ---*/
  const revProds = $('review-products');
  if (revProds) {
    revProds.innerHTML = getActiveCart().map(i => `
      <div class="review-product-row">
        <div class="review-product-img"></div>
        <div class="review-product-name">${i.name}</div>
        <div class="review-product-qty">x${i.qty}</div>
        <div class="review-product-price">R$ ${fmt(i.price * i.qty)}</div>
      </div>
    `).join('');
  }

  updateSummary();
}

/*--- VALIDAÇÕES ---*/
function validateStep1() {
  const fields = [
    { id: 'cust-nome',      key: 'nome',      min: 2 },
    { id: 'cust-sobrenome', key: 'sobrenome', min: 2 },
    { id: 'cust-cpf',       key: 'cpf',       min: 14 },
    { id: 'cust-telefone',  key: 'telefone',  min: 14 },
  ];
  let ok = true;
  State.customer = {};
  fields.forEach(f => {
    const el = $(f.id);
    const v  = el ? el.value.trim() : '';
    if (v.length < f.min) {
      el && el.classList.add('error');
      ok = false;
    } else {
      el && el.classList.remove('error');
      State.customer[f.key] = v;
    }
  });
  if (!ok) { alert('Preencha todos os dados obrigatórios corretamente.'); return false; }
  if (getActiveCart().length === 0) { alert('Adicione ao menos um produto ao carrinho.'); return false; }
  return true;
}

function validateStep2() {
  const required = ['addr-cep','addr-rua','addr-numero','addr-bairro','addr-cidade','addr-estado'];
  let ok = true;
  State.address = {};
  required.forEach(id => {
    const el = $(id);
    const v  = el ? el.value.trim() : '';
    if (!v) { el && el.classList.add('error'); ok = false; }
    else    { el && el.classList.remove('error'); State.address[id.replace('addr-', '')] = v; }
  });
  const comp = $('addr-complemento');
  State.address.complemento = comp ? comp.value.trim() : '';

  // Frete selecionado
  const sel = qs('input[name="frete"]:checked');
  if (sel) {
    State.shipping = {
      label: sel.value === 'sedex' ? 'SEDEX' : sel.value === 'pac' ? 'PAC' : 'Transportadora',
      price: parseFloat(sel.dataset.price),
      days:  parseInt(sel.dataset.days),
    };
  }
  if (!ok) { alert('Preencha o endereço completo.'); return false; }
  return true;
}

function validateStep3() {
  const method = State.payment.method;
  if (method === 'cartao') {
    const num  = $('cc-number')?.value.replace(/\s/g, '') || '';
    const name = $('cc-name')?.value.trim() || '';
    const exp  = $('cc-exp')?.value.trim() || '';
    const cvv  = $('cc-cvv')?.value.trim() || '';
    if (num.length < 16 || !name || exp.length < 5 || cvv.length < 3) {
      alert('Preencha todos os dados do cartão corretamente.'); return false;
    }
    State.payment = { method, number: num, name, exp, cvv, save: $('cc-save')?.checked };
    // Salvar cartão
    if ($('cc-save')?.checked) saveCard(State.payment);
  }
  return true;
}

/*--- SAVED CARDS ---*/
function saveCard(p) {
  const cards = JSON.parse(localStorage.getItem('valt_cards') || '[]');
  const masked = { number: p.number, name: p.name, exp: p.exp };
  if (!cards.find(c => c.number === p.number)) {
    cards.push(masked);
    localStorage.setItem('valt_cards', JSON.stringify(cards));
  }
  renderSavedCards();
}

function renderSavedCards() {
  const cards = JSON.parse(localStorage.getItem('valt_cards') || '[]');
  const wrap  = $('saved-cards-wrap');
  const list  = $('saved-cards-list');
  if (!wrap || !list) return;
  if (cards.length === 0) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  list.innerHTML = cards.map((c, i) => `
    <div class="saved-card-item" onclick="Checkout.useSavedCard(${i})">
      <i class="ti ti-credit-card" style="font-size:20px;color:var(--yellow)"></i>
      <span>**** **** **** ${c.number.slice(-4)}</span>
      <span style="font-size:12px;color:var(--gray-400);margin-left:auto">${c.exp}</span>
    </div>
  `).join('');
}

/*--- VIACEP ---*/
async function fetchCep() {
  const cep = $('addr-cep')?.value.replace(/\D/g, '');
  if (!cep || cep.length < 8) { alert('Digite um CEP válido.'); return; }
  try {
    const r    = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await r.json();
    if (data.erro) { alert('CEP não encontrado.'); return; }
    if ($('addr-rua'))     $('addr-rua').value     = data.logradouro || '';
    if ($('addr-bairro'))  $('addr-bairro').value  = data.bairro     || '';
    if ($('addr-cidade'))  $('addr-cidade').value  = data.localidade || '';
    if ($('addr-estado'))  $('addr-estado').value  = data.uf         || '';
    $('addr-numero')?.focus();
  } catch { alert('Erro ao buscar CEP. Tente novamente.'); }
}

/*--- CUPOM ---*/
function applyCoupon() {
  const code = $('coupon-input')?.value.trim().toUpperCase();
  const fb   = $('coupon-feedback');
  if (!code) return;
  const coupon = CUPONS[code];
  if (coupon) {
    State.appliedCoupon = coupon;
    fb.className = 'coupon-feedback ok';
    fb.textContent = `✅ Cupom "${code}" aplicado: ${coupon.desc}`;
    updateSummary();
  } else {
    State.appliedCoupon = null;
    fb.className = 'coupon-feedback err';
    fb.textContent = '❌ Cupom inválido ou expirado.';
  }
}

/*--- CONFIRMAÇÃO / SIMULAÇÃO DE PAGAMENTO ---*/
async function confirm() {
  const btn = $('btn-confirm');
  if (!btn.dataset.originalLabel) btn.dataset.originalLabel = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin 1s linear infinite"></i> Processando...';

  const method = State.payment.method;

  // PRA SIMULAR PAGAMENTO RECUSADO, USE O NÚMERO DE CARTÃO "4000 0000 0000 0002" (QUALQUER NOME/EXP/CVV SERVE)
  const ccNum = State.payment.number || '';
  const declined = ccNum.startsWith('4000'); //SO PRA TESTE GENTE, VAMOS APAGAR DPS QUE TIVER O BACK END REAL, OK?

  if (!declined) {
    const order = buildOrderPayload();
    const btnLabel = btn.dataset.originalLabel || btn.innerHTML;

    try {
      if (isLoggedIn()) {
        await registrarVendas(order);
      }
      sessionStorage.setItem('valt_last_order', JSON.stringify(order));
      if (isLoggedIn() && window.CarrinhoUI) {
        await window.CarrinhoUI.limparCarrinho();
      } else {
        VaultStore.clearCart();
      }
      window.location.href = 'checkout-success.html';
    } catch (err) {
      console.error('Erro no checkout:', err);
      alert(err.message || 'Não foi possível finalizar a compra. Tente novamente.');
      btn.disabled = false;
      btn.innerHTML = btnLabel;
    }
  } else {
    // ❌ Recusado
    sessionStorage.setItem('valt_error_method', method);
    window.location.href = 'checkout-error.html';
  }
}

function buildOrderPayload() {
  const cart     = getActiveCart();
  const subtotal = getActiveCartTotal();
  const frete    = State.shipping.price;
  let   discount = 0;
  if (State.appliedCoupon) {
    const c = State.appliedCoupon;
    if (c.type === 'percent') discount = subtotal * (c.value / 100);
    if (c.type === 'fixed')   discount = Math.min(c.value, subtotal);
    if (c.type === 'frete')   discount = frete;
  }
  return {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    customer: State.customer,
    address:  State.address,
    shipping: State.shipping,
    payment:  State.payment,
    coupon:   State.appliedCoupon,
    items:    cart,
    subtotal, frete, discount,
    total: Math.max(0, subtotal + frete - discount),
  };
}

/*--- STEPPER NAVIGATION ---*/
function goStep(n) {
  if (n > State.step) {
    if (State.step === 1 && !validateStep1()) return;
    if (State.step === 2 && !validateStep2()) return;
    if (State.step === 3 && !validateStep3()) return;
    if (n === 4) renderReview();
  }

  // Atualiza step
  State.step = n;

  /*--- Esconde/mostra seções ---*/
  qsa('.checkout-step').forEach(s => s.classList.remove('active'));
  const target = $(`step-${n}`);
  if (target) target.classList.add('active');

  /*--- Atualiza stepper visual ---*/
  qsa('.stepper-item').forEach(item => {
    const s = parseInt(item.dataset.step);
    item.classList.remove('active', 'done');
    if (s === n)  item.classList.add('active');
    if (s < n)    item.classList.add('done');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/*--- METODO DE PAGAMENTO ---*/
function selectPayment(method) {
  State.payment.method = method;
  qsa('.payment-tab').forEach(t => t.classList.toggle('active', t.dataset.method === method));
  qsa('.payment-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${method}`));

  if (method === 'carteira') {

    // Mock (PRA TESTE GENTE): saldo R$ 120,00
    const saldo   = 120.00;
    const total   = getActiveCartTotal() + State.shipping.price;
    const walletEl = $('wallet-balance');
    const statusEl = $('wallet-status');
    if (walletEl) walletEl.textContent = `R$ ${fmt(saldo)}`;
    if (statusEl) {
      if (saldo >= total) {
        statusEl.className = 'wallet-status wallet-status--ok';
        statusEl.textContent = '✅ Saldo suficiente para esta compra.';
      } else {
        statusEl.className = 'wallet-status wallet-status--err';
        statusEl.textContent = `❌ Saldo insuficiente. Faltam R$ ${fmt(total - saldo)}.`;
      }
    }
  }
}

/*--- API PUBLICA ---*/
const Checkout = {
  goStep,
  selectPayment,
  fetchCep,
  applyCoupon,
  confirm,
  async changeQty(id, delta) {
    const item = getActiveCart().find(i => String(i.id) === String(id));
    if (!item) return;

    const nextQty = Number(item.qty) + delta;
    if (nextQty < 1) {
      await Checkout.removeItem(id);
      return;
    }

    const maxQty = Number(item.estoqueMax) || 99;
    if (nextQty > maxQty) {
      _showCartMsg(`Estoque máximo: ${maxQty} un.`);
      return;
    }

    if (isLoggedIn() && window.CarrinhoUI) {
      try {
        await window.CarrinhoUI.atualizarQuantidade(id, nextQty);
      } catch (err) {
        _showCartMsg(err.message || 'Erro ao atualizar carrinho');
      }
      return;
    }

    VaultStore.updateQty(id, nextQty);
    renderCartItems();
  },
  async removeItem(id) {
    if (isLoggedIn() && window.CarrinhoUI) {
      await window.CarrinhoUI.removerDoCarrinho(id);
      return;
    }
    VaultStore.removeFromCart(id);
    renderCartItems();
  },
  useSavedCard(idx) {
    const cards = JSON.parse(localStorage.getItem('valt_cards') || '[]');
    const c = cards[idx];
    if (!c) return;
    if ($('cc-number')) $('cc-number').value = '**** **** **** ' + c.number.slice(-4);
    if ($('cc-name'))   $('cc-name').value   = c.name;
    if ($('cc-exp'))    $('cc-exp').value    = c.exp;
    qsa('.saved-card-item').forEach((el, i) => el.classList.toggle('selected', i === idx));
    State.payment = { method: 'cartao', number: c.number, name: c.name, exp: c.exp };
  },
};

function _showCartMsg(msg) {
  if (typeof _showToast === 'function') _showToast(msg, 'cart');
  else alert(msg);
}

function refreshCartView() {
  renderCartItems();
  updateSummary();
}

/*--- INICIALIZAÇÃO ---*/
document.addEventListener('DOMContentLoaded', () => {

  maskCPF($('cust-cpf'));
  maskPhone($('cust-telefone'));
  maskCEP($('addr-cep'));
  maskCard($('cc-number'));
  maskExp($('cc-exp'));

  $('addr-cep')?.addEventListener('keydown', e => e.key === 'Enter' && fetchCep());

  qsa('input[name="frete"]').forEach(r => {
    r.addEventListener('change', () => {
      State.shipping.price = parseFloat(r.dataset.price);
      State.shipping.label = r.value;
      State.shipping.days  = parseInt(r.dataset.days);
      updateSummary();
    });
  });

  renderSavedCards();

  document.addEventListener('carrinho:updated', (e) => {
    State.apiCart = e.detail?.carrinho || null;
    if ($('cart-items-list')) refreshCartView();
  });

  function syncApiCart() {
    if (isLoggedIn() && window.CarrinhoUI) {
      window.CarrinhoUI.sincronizarCarrinho();
    }
  }

  document.addEventListener('carrinho:ready', syncApiCart);

  if (isLoggedIn()) {
    syncApiCart();
  } else {
    refreshCartView();
  }
});

window.Checkout = Checkout;

const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);
