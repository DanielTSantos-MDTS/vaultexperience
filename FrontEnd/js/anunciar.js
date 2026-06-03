const state = {
  step: 1,
  categoria: null,   // consoles | jogos | livros | figures | assinaturas | acessorios | softwares
  modelo: null,      // normal | dinamico | servicos
  condicao: null,
  variacoes: [],     // Nome, preco, estoque - usado apenas para modelo dinâmico
  fotos: [],
};


const SUPORTA_DINAMICO = ['consoles', 'assinaturas', 'livros'];
const SUPORTA_SERVICOS = ['softwares', 'acessorios'];

//--- Elementos do DOM ---//
const form        = document.getElementById('anunciar-form');
const submitBtn   = document.getElementById('anunciar-submit');
const cardSubtitle = document.getElementById('card-subtitle');

// Steps
const step1El = document.getElementById('step-1');
const step2El = document.getElementById('step-2');
const step3El = document.getElementById('step-3');

// Step indicator
const stepDot1 = document.getElementById('step-dot-1');
const stepDot2 = document.getElementById('step-dot-2');
const stepDot3 = document.getElementById('step-dot-3');
const stepLine1 = document.getElementById('step-line-1');
const stepLine2 = document.getElementById('step-line-2');

// Navegação
const btnGoStep2   = document.getElementById('btn-go-step2');
const btnGoStep3   = document.getElementById('btn-go-step3');
const btnBackTo1   = document.getElementById('btn-back-to-1');
const btnBackTo2   = document.getElementById('btn-back-to-2');

// Upload
const uploadArea  = document.getElementById('upload-area');
const fotoInput   = document.getElementById('foto-input');
const fotoPreview = document.getElementById('foto-preview');

// Variações
const variacoesList = document.getElementById('variacoes-list');
const btnAddVariacao = document.getElementById('btn-add-variacao');

// Preço
const precoLabel = document.getElementById('preco-label');
const precoInput = document.getElementById('preco');
const SUBTITLES = {
  1: 'Escolha a categoria do seu produto',
  2: 'Como você quer anunciar?',
  3: 'Preencha as informações do produto',
};

//--- STEP INDICATOR ---//
function updateStepIndicator(currentStep) {
  [stepDot1, stepDot2, stepDot3].forEach((dot, i) => {
    const n = i + 1;
    dot.classList.remove('active', 'done');
    if (n < currentStep)  dot.classList.add('done'),  (dot.innerHTML = '<i class="ti ti-check" style="font-size:14px"></i>');
    if (n === currentStep) dot.classList.add('active'), (dot.textContent = n);
    if (n > currentStep)  dot.textContent = n;
  });
  stepLine1.classList.toggle('done', currentStep > 1);
  stepLine2.classList.toggle('done', currentStep > 2);
  cardSubtitle.textContent = SUBTITLES[currentStep];
}

//--- NAVEGAÇÃO ENTRE STEPS ---//
function goToStep(n) {
  state.step = n;
  step1El.classList.toggle('visible', n === 1);
  step2El.classList.toggle('visible', n === 2);
  step3El.classList.toggle('visible', n === 3);
  updateStepIndicator(n);

  document.querySelector('.anunciar-right').scrollTo({ top: 0, behavior: 'smooth' });
}

btnGoStep2.addEventListener('click', () => goToStep(2));
btnGoStep3.addEventListener('click', () => {
  applyModeloUX();
  goToStep(3);
});
btnBackTo1.addEventListener('click', () => goToStep(1));
btnBackTo2.addEventListener('click', () => goToStep(2));

//--- SELEÇÃO DE CATEGORIA ---//
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.categoria = btn.dataset.cat;
    btnGoStep2.disabled = false;

    updateModeloAvailability();

    // Reset modelo se ficou inválido
    if (state.modelo && !isModeloAvailable(state.modelo)) {
      state.modelo = null;
      document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('selected'));
      btnGoStep3.disabled = true;
    }
  });
});

function isModeloAvailable(modelo) {
  if (modelo === 'dinamico') return SUPORTA_DINAMICO.includes(state.categoria);
  return true;
}

function updateModeloAvailability() {
  const modeloDinamico = document.getElementById('model-dinamico');
  if (SUPORTA_DINAMICO.includes(state.categoria)) {
    modeloDinamico.style.opacity = '1';
    modeloDinamico.style.pointerEvents = 'auto';
    modeloDinamico.title = '';
  } else {
    modeloDinamico.style.opacity = '0.35';
    modeloDinamico.style.pointerEvents = 'none';
    modeloDinamico.title = 'Modelo Dinâmico não disponível para esta categoria';
  }
}

//--- SELEÇÃO DE MODELO (normal, dinâmico, serviços) no STEP 2 ---//
document.querySelectorAll('.model-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.modelo = btn.dataset.model;
    btnGoStep3.disabled = false;
  });
});

//--- APLICAÇÕES DE UX POR MODELO/CATEGORIA - renderização condicional de campos, labels, etc. ---//
function applyModeloUX() {

  document.querySelectorAll('.cat-fields').forEach(el => {
    el.style.display = 'none';
  });
  const catEl = document.getElementById(`fields-${state.categoria}`);
  if (catEl) catEl.style.display = 'flex';

  const secVariacoes = document.getElementById('section-variacoes');
  if (state.modelo === 'dinamico') {
    secVariacoes.style.display = 'flex';
    document.getElementById('fotos-group').style.display = 'none';
    if (state.variacoes.length === 0) addVariacao();
  } else {
    secVariacoes.style.display = 'none';
    document.getElementById('fotos-group').style.display = 'block';
  }

  if (state.modelo === 'servicos') {
    precoLabel.textContent = 'Preço Base / Orçamento (R$)';
    precoInput.placeholder = 'Valor mínimo ou estimado';
  } else {
    precoLabel.textContent = 'Preço (R$)';
    precoInput.placeholder = '0,00';
  }

  // Assinaturas/Keys: travar condição como Digital
  if (state.categoria === 'assinaturas') {
  }

  checkSubmitForm();
}

//--- VARIAÇÕES DINÂMICAS ---//
let varId = 0;

function addVariacao() {
  varId++;
  const id = varId;
  state.variacoes.push({ id, nome: '', preco: '', estoque: 1 });

  const item = document.createElement('div');
  item.className = 'variacao-item';
  item.dataset.id = id;
  item.innerHTML = `
    <div class="v-fields">
      <input type="text" placeholder="Nome da variação" class="v-nome" data-id="${id}">
      <input type="number" placeholder="Preço R$" min="0" step="0.01" class="v-preco" data-id="${id}">
      <input type="number" placeholder="Qtd" min="1" value="1" class="v-estoque" data-id="${id}">
    </div>
    <button type="button" class="btn-remove-variacao" data-id="${id}" title="Remover variação">
      <i class="ti ti-trash"></i>
    </button>
  `;

  item.querySelector('.v-nome').addEventListener('input', e => {
    const v = state.variacoes.find(x => x.id === id);
    if (v) v.nome = e.target.value;
    checkSubmitForm();
  });
  item.querySelector('.v-preco').addEventListener('input', e => {
    const v = state.variacoes.find(x => x.id === id);
    if (v) v.preco = e.target.value;
  });
  item.querySelector('.v-estoque').addEventListener('input', e => {
    const v = state.variacoes.find(x => x.id === id);
    if (v) v.estoque = e.target.value;
  });
  item.querySelector('.btn-remove-variacao').addEventListener('click', () => {
    if (state.variacoes.length <= 1) return; // mínimo 1
    state.variacoes = state.variacoes.filter(x => x.id !== id);
    item.remove();
    checkSubmitForm();
  });

  variacoesList.appendChild(item);
}

btnAddVariacao.addEventListener('click', () => addVariacao());

//--- RADIO BUTTONS ESTILIZADOS ---//
document.querySelectorAll('.radio-group').forEach(group => {
  group.addEventListener('click', e => {
    const btn = e.target.closest('.radio-btn');
    if (!btn || btn.classList.contains('disabled')) return;
    group.querySelectorAll('.radio-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.condicao = btn.dataset.val;
    checkSubmitForm();
  });
});

//--- UPLOAD DE FOTOS ---//
uploadArea.addEventListener('click', () => fotoInput.click());

uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  addFiles([...e.dataTransfer.files]);
});
fotoInput.addEventListener('change', () => {
  addFiles([...fotoInput.files]);
  fotoInput.value = '';
});

function addFiles(files) {
  const allowed = files.filter(f => f.type.startsWith('image/'));
  const remaining = 8 - state.fotos.length;
  allowed.slice(0, remaining).forEach(f => {
    state.fotos.push({ file: f, url: URL.createObjectURL(f) });
  });
  renderPreview();
}

function renderPreview() {
  fotoPreview.innerHTML = '';
  state.fotos.forEach((foto, i) => {
    const item = document.createElement('div');
    item.className = 'foto-preview-item';
    item.innerHTML = `
      <img src="${foto.url}" alt="Foto ${i + 1}">
      <button class="foto-preview-remove" data-i="${i}" title="Remover">
        <i class="ti ti-x"></i>
      </button>
    `;
    fotoPreview.appendChild(item);
  });
  fotoPreview.querySelectorAll('.foto-preview-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = +btn.dataset.i;
      URL.revokeObjectURL(state.fotos[idx].url);
      state.fotos.splice(idx, 1);
      renderPreview();
    });
  });
}

//--- VALIDAÇÃO DO SUBMIT (habilita/desabilita botão de submit) ---//
function checkSubmitForm() {
  const tituloOk = (document.getElementById('titulo')?.value.trim().length ?? 0) > 2;

  let precoOk = true;
  if (state.modelo !== 'dinamico') {
    precoOk = parseFloat(precoInput.value) > 0;
  } else {
    precoOk = state.variacoes.length > 0 && state.variacoes.every(v => v.nome.trim().length > 0);
  }

  submitBtn.disabled = !(tituloOk && precoOk);
}

document.getElementById('titulo').addEventListener('input', checkSubmitForm);
precoInput.addEventListener('input', checkSubmitForm);

//--- COLETA SPECS POR CATEGORIA ---//
function coletarEspecificacoes() {
  const specs = [];
  const cat = state.categoria;

  const pick = (id, chave) => {
    const el = document.getElementById(id);
    if (el && el.value) specs.push({ chave, valor: el.value });
  };

  if (cat === 'consoles') {
    pick('console-modelo', 'Modelo');
    if (state.condicao) specs.push({ chave: 'Condição', valor: state.condicao });
    pick('console-incluso', 'Incluso na Caixa');
    pick('console-midia', 'Mídia');
    pick('console-localidade', 'Localização');
    pick('console-quantidade', 'Quantidade');
    pick('console-raridade', 'Raridade');
  } else if (cat === 'jogos') {
    pick('jogo-plataforma', 'Plataforma');
    pick('jogo-localidade', 'Localização');
    pick('jogo-estado', 'Estado do Produto');
  } else if (cat === 'livros') {
    if (state.condicao) specs.push({ chave: 'Condição', valor: state.condicao });
    pick('livro-editora', 'Editora');
    pick('livro-volume', 'Volume');
    pick('livro-localidade', 'Localização');
    pick('livro-quantidade', 'Quantidade');
  } else if (cat === 'figures') {
    pick('figure-personagem', 'Personagem');
    pick('figure-escala', 'Escala/Tamanho');
    if (state.condicao) specs.push({ chave: 'Condição', valor: state.condicao });
    pick('figure-localidade', 'Localização');
    const caixa = document.getElementById('figure-caixa');
    if (caixa) specs.push({ chave: 'Caixa Original', valor: caixa.checked ? 'Sim' : 'Não' });
  } else if (cat === 'assinaturas') {
    specs.push({ chave: 'Condição', valor: 'Produto Digital' });
    pick('key-subcategoria', 'Subcategoria');
    pick('key-plataforma', 'Plataforma');
    pick('key-quantidade', 'Quantidade');
    pick('key-regiao', 'Região de Ativação');
  } else if (cat === 'acessorios') {
    pick('aces-tipo', 'Tipo de Acessório');
    pick('aces-localidade', 'Localização');
    if (state.condicao) specs.push({ chave: 'Condição', valor: state.condicao });
    pick('aces-incluso', 'Incluso na Caixa');
    pick('aces-compat', 'Compatibilidade');
  } else if (cat === 'softwares') {
    pick('sw-categoria', 'Categoria de Software');
    pick('sw-plataforma', 'Plataforma');
    pick('sw-licenca', 'Tipo de Licença');
    pick('sw-incluso', 'Incluso');
  }

  if (state.modelo) specs.push({ chave: 'Modelo do Anúncio', valor: state.modelo });

  return specs;
}

//--- SUBMIT ---//
form.addEventListener('submit', async e => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin .8s linear infinite"></i> Publicando...';

  const vault_token = localStorage.getItem('vault_token');
  const formData = new FormData();

  formData.append('titulo', document.getElementById('titulo').value.trim());
  formData.append('descricao', document.getElementById('descricao').value.trim());
  formData.append('categoria', state.categoria);
  formData.append('modelo', state.modelo);

  if (state.modelo === 'dinamico') {
    formData.append('variacoes', JSON.stringify(state.variacoes));
    formData.append('precoOriginal', 0);
  } else {
    formData.append('precoOriginal', document.getElementById('preco').value);
  }

  const franquiaEl = document.getElementById('franquia');
  if (franquiaEl.value) formData.append('franquia', franquiaEl.value);

  const specs = coletarEspecificacoes();
  formData.append('especificacoes', JSON.stringify(specs));

  //--- Estado (condicao) — trata assinaturas automaticamente ---//
  const condicaoFinal = state.categoria === 'assinaturas'
    ? 'Produto Digital'
    : (state.condicao || 'Não informado');
  formData.append('estado', condicaoFinal);

  state.fotos.forEach(f => formData.append('imagens', f.file));

  try {
    const resposta = await fetch('http://localhost:3000/item/anunciar', {
      method: 'POST',
      headers: { 'authorization': `Bearer ${vault_token}` },
      body: formData,
    });
    const dados = await resposta.json();

    if (dados.Erro) {
      alert(`Erro: ${dados.Erro}`);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="ti ti-speakerphone"></i> Publicar anúncio';
    } else {
      submitBtn.innerHTML = '<i class="ti ti-check"></i> Anúncio publicado!';
      submitBtn.style.background = '#22c55e';
      submitBtn.style.color = '#fff';
      setTimeout(() => { window.location.href = 'index.html'; }, 1800);
    }
  } catch (err) {
    console.error('Erro ao publicar:', err);
    alert('Falha na conexão. Verifique se o servidor está rodando.');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="ti ti-speakerphone"></i> Publicar anúncio';
  }
});

//--- ANIMAÇÃO DO SPINNER ---//
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

//--- INIT ---//
updateStepIndicator(1);
