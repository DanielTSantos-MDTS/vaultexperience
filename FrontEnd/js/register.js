const registerForm  = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const nomeInput = document.getElementById('inputNome');
const sobrenomeInput = document.getElementById('inputSobrenome');
const contatoInput = document.getElementById('inputContato');
const dataInput = document.getElementById('data-input');
const submitButton  = document.getElementById('register-btn');

submitButton.disabled = true;

/*--- SELECTS CUSTOMIZADOS ---*/
function initCustomSelect(selectId, listId, items) {
  const container = document.getElementById(selectId);
  const valueEl   = container.querySelector('.custom-select__value');
  const list      = listId ? document.getElementById(listId) : container.querySelector('.custom-select__list');

  if (listId && items) {
    items.forEach(item => {
      const opt = document.createElement('div');
      opt.className = 'custom-select__option';
      opt.dataset.value = item;
      opt.textContent = item;
      list.appendChild(opt);
    });
  }

  container.querySelector('.custom-select__trigger').addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = container.classList.contains('open');
    closeAllSelects();
    if (!isOpen) container.classList.add('open');
  });

  list.addEventListener('click', (e) => {
    const opt = e.target.closest('.custom-select__option');
    if (!opt) return;
    list.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    valueEl.textContent = opt.dataset.value;
    valueEl.classList.add('selected');
    container.dataset.selected = opt.dataset.value;
    container.classList.remove('open');
  });
}

function closeAllSelects() {
  document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
}

document.addEventListener('click', closeAllSelects);

const days = Array.from({ length: 31 }, (_, i) => i + 1);
initCustomSelect('birth-day-select', 'birth-day-list', days);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
initCustomSelect('birth-year-select', 'birth-year-list', years);

initCustomSelect('birth-month-select', null, null);


/*--- VALIDAÇÃO SENHA FORTE ---*/
const rules = {
  length:  { el: document.getElementById('rule-length'),  test: p => p.length >= 8 },
  upper:   { el: document.getElementById('rule-upper'),   test: p => /[A-Z]/.test(p) },
  lower:   { el: document.getElementById('rule-lower'),   test: p => /[a-z]/.test(p) },
  number:  { el: document.getElementById('rule-number'),  test: p => /[0-9]/.test(p) },
  special: { el: document.getElementById('rule-special'), test: p => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
};

function validatePassword(password) {
  let allValid = true;
  for (const key in rules) {
    const { el, test } = rules[key];
    const passed = test(password);
    if (el) {
      el.style.color      = passed ? '#4caf50' : '';
      el.style.fontWeight = passed ? '700'     : '';
    }
    if (!passed) allValid = false;
  }
  return allValid;
}

passwordInput.addEventListener('input', () => {
  submitButton.disabled = !validatePassword(passwordInput.value);
});


/*--- SUBMIT — CADASTRAR ---*/
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // localStorage.setItem('vault_logged', 'true');
  // localStorage.setItem('vault_user', username);
  
  /*--- FORMATAÇÃO — DA — DATA  ---*/
  const mapaDeMeses = {
    "Janeiro": "01", "Fevereiro": "02", "Março": "03", "Abril": "04",
    "Maio": "05", "Junho": "06", "Julho": "07", "Agosto": "08",
    "Setembro": "09", "Outubro": "10", "Novembro": "11", "Dezembro": "12"
  };
  const textoDia = document.querySelector('#birth-day-select .custom-select__value').textContent;
  const textoMes = document.querySelector('#birth-month-select .custom-select__value').textContent;
  const textoAno = document.querySelector('#birth-year-select .custom-select__value').textContent;
  
  if (textoDia === 'Dia' || textoMes === 'Mês' || textoAno === 'Ano') {
    alert("Por favor, preencha a sua data de nascimento completa!");
    return; 
  }
  
  const mesEmNumero = mapaDeMeses[textoMes];
  const dataFormatada = `${textoAno}-${mesEmNumero}-${textoDia.padStart(2, '0')}`;

  fetch('http://localhost:3000/usuarios/registrar', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: nomeInput.value,
      sobrenome: sobrenomeInput.value,
      dataNascimento: dataFormatada,
      contatoPrincipal: contatoInput.value,
      username: usernameInput.value,
      password: passwordInput.value
    })
  })
  .then(resposta => resposta.json())
  .then(dados => {
    if(dados.Erro) {
      alert (`Erro: ${dados.Erro}`)
    } else {
      alert("Registro Concluído com sucesso!");
      saveLocalStorage(dados);
      window.location.href = 'login.html';
    }
  })
  .catch(erro => {
    console.error(`Erro na comunicação com o banco de dados. Erro: ${erro}`);
  })
});

/*--- Salvar localStorage ---*/

function saveLocalStorage(dados){
  localStorage.setItem('vault_token', dados.token);
  localStorage.setItem('vault_user', dados.username);
  localStorage.setItem('vault_nascimento', dados.dataNascimento);
  localStorage.setItem('vault_contato', dados.contatoPrincipal);
  localStorage.setItem('vault_id', dados._id);
  localStorage.setItem('vault_logged', 'true');
  window.location.href = 'index.html';
}