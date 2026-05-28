const form        = document.getElementById('anunciar-form');
const submitBtn   = document.getElementById('anunciar-submit');
const tituloInput = document.getElementById('titulo');
const descricaoInput = document.getElementById('descricao');
const precoInput  = document.getElementById('preco');
const categoriaEl = document.getElementById('categoria');
const condicaoEl  = document.getElementById('condicao');
const franquiaEl  = document.getElementById('franquia'); // opcional
const uploadArea  = document.getElementById('upload-area');
const fotoInput   = document.getElementById('foto-input');
const fotoPreview = document.getElementById('foto-preview');

let fotos = [];

// ─── Habilitar botão quando campos obrigatórios preenchidos ───────────────────
// Franquia é opcional: não entra na validação do checkForm.
function checkForm() {
  const ok =
    tituloInput.value.trim().length > 3 &&
    precoInput.value > 0 &&
    categoriaEl.value !== '' &&
    condicaoEl.value !== '';

  submitBtn.disabled = !ok;
}

[tituloInput, precoInput, categoriaEl, condicaoEl].forEach(el => {
  el.addEventListener('input', checkForm);
  el.addEventListener('change', checkForm);
});

// ─── Upload de fotos ──────────────────────────────────────────────────────────
uploadArea.addEventListener('click', () => fotoInput.click());

uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

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
  const remaining = 8 - fotos.length;
  allowed.slice(0, remaining).forEach(f => {
    const url = URL.createObjectURL(f);
    fotos.push({ file: f, url });
    renderPreview();
  });
}

function renderPreview() {
  fotoPreview.innerHTML = '';
  fotos.forEach((foto, i) => {
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
      URL.revokeObjectURL(fotos[idx].url);
      fotos.splice(idx, 1);
      renderPreview();
    });
  });
}

// ─── Submit ───────────────────────────────────────────────────────────────────
form.addEventListener('submit', e => {
  e.preventDefault();

  // Coleta os dados do formulário (incluindo franquia, que é opcional)
  const payload = {
    titulo:    tituloInput.value.trim(),
    categoria: categoriaEl.value,
    condicao:  condicaoEl.value,
    franquia:  franquiaEl.value || null, // null quando não selecionado
    descricao: document.getElementById('descricao').value.trim(),
    preco:     parseFloat(precoInput.value),
    fotos:     fotos.map(f => f.file),
  };

  // Log para depuração — substituir pela chamada real à API
  console.log('Payload do anúncio:', payload);

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ti ti-loader-2" style="animation:spin .8s linear infinite"></i> Publicando...';

  // Simula envio (substituir por chamada real à API)

  const vault_token = localStorage.getItem('vault_token');  

  fetch('http://localhost:3000/item/anunciar',{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'authorization': `Bearer ${vault_token}`
    },
    body: JSON.stringify({
      nome: tituloInput.value,
      descricao: descricaoInput.value,
      valor: precoInput.value,
      categoria: categoriaEl.value,
      estado: condicaoEl.value,
      franquia: franquiaEl.value
    })
  })
  .then(resposta => resposta.json())
  .then(dados =>{
    if(dados.Erro){
      alert(`Erro: ${dados.Erro}`)
    } else{
      console.log(`Dados Enviado: \r ${dados}`);      
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="ti ti-check"></i> Anúncio publicado!';
        submitBtn.style.background = '#22c55e';
        submitBtn.style.color = '#fff';
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1800);
      }, 1800);
    }
  })
  
});

// ─── Animação do spinner ──────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
