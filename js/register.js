const registerForm  = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
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
  const username = usernameInput.value.trim();
  localStorage.setItem('vault_logged', 'true');
  localStorage.setItem('vault_user', username);
  window.location.href = 'index.html';
});
