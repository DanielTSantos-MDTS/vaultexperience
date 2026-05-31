 //--- Auth ---//
  const _authArea     = document.getElementById('auth-area');
  const _userMenu     = document.getElementById('user-menu');
  const _userBtn      = document.getElementById('user-btn');
  const _userDropdown = document.getElementById('user-dropdown');
  const _usernameDisp = document.getElementById('username-display');
  const _loginBtn     = document.getElementById('login-btn');
  const _logoutBtn    = document.getElementById('logout-btn');

  const _token    = localStorage.getItem('vault_token');
  const _username = localStorage.getItem('vault_user');

  if (_token) {
    _authArea?.classList.add('hidden');
    _userMenu?.classList.remove('hidden');
    if (_usernameDisp && _username) _usernameDisp.textContent = _username;
  } else {
    _authArea?.classList.remove('hidden');
    _userMenu?.classList.add('hidden');
  }

  _loginBtn?.addEventListener('click', () => { window.location.href = 'login.html'; });

  if (_userBtn && _userDropdown) {
    _userBtn.addEventListener('click', e => { e.stopPropagation(); _userDropdown.classList.toggle('active'); });
    document.addEventListener('click', () => _userDropdown.classList.remove('active'));
    _userDropdown.addEventListener('click', e => e.stopPropagation());
  }

  _logoutBtn?.addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem('vault_token');
    localStorage.removeItem('vault_user');
    window.location.href = 'index.html';
  });

  //--- FAQ accordion ---//
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Fecha todos
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });

      //--- Abre o clicado (se estava fechado) ---//
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  //--- Busca no FAQ (filtra visualmente) ---//
  document.getElementById('help-search-input')?.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    document.querySelectorAll('.faq-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  });