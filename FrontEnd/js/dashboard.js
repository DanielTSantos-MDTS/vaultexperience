(function initDashboard() {

  /*--- Páginas e títulos ---*/
  const ALL_PAGES = [
    'resumo', 'carteira', 'transacoes',
    'meus-anuncios', 'meus-pedidos', 'minhas-vendas',
    'perguntas', 'retiradas', 'recargas',
    'minha-conta', 'seguranca', 'verificacoes',
  ];

  const PAGE_TITLES = {
    'resumo':        'Resumo — Vault Experience',
    'carteira':      'Carteira — Vault Experience',
    'transacoes':    'Transações — Vault Experience',
    'meus-anuncios': 'Meus Anúncios — Vault Experience',
    'meus-pedidos':  'Meus Pedidos — Vault Experience',
    'minhas-vendas': 'Minhas Vendas — Vault Experience',
    'perguntas':     'Perguntas Recebidas — Vault Experience',
    'retiradas':     'Minhas Retiradas — Vault Experience',
    'recargas':      'Recargas — Vault Experience',
    'minha-conta':   'Minha Conta — Vault Experience',
    'seguranca':     'Segurança & Privacidade — Vault Experience',
    'verificacoes':  'Verificações — Vault Experience',
  };

  /*--- Troca de aba ---*/
  function activatePage(tab) {
    ALL_PAGES.forEach(id => {
      document.getElementById('page-' + id)?.classList.remove('active');
      document.getElementById('sb-' + id)?.classList.remove('active');
    });

    const targetPage = document.getElementById('page-' + tab);
    const targetSb   = document.getElementById('sb-' + tab);

    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    if (targetSb) targetSb.classList.add('active');
    if (PAGE_TITLES[tab]) document.title = PAGE_TITLES[tab];
  }

  /*--- Sidebar ---*/
  function bindSidebar() {
    ALL_PAGES.forEach(tab => {
      document.getElementById('sb-' + tab)?.addEventListener('click', () => {
        window.DashboardContext.setTab(tab, { fromHeader: false });
      });
    });

    document.getElementById('sb-ajuda')?.addEventListener('click', () => {
      window.location.href = 'ajuda.html';
    });
  }

  /*--- Links data-tab no header do dashboard ---*/
  function bindTopNavLinks() {
    document.querySelectorAll('[data-tab]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        window.DashboardContext.setTab(el.dataset.tab, { fromHeader: false });
      });
    });
  }

  /*--- Tabs de período (Resumo) ---*/
  function bindPeriodTabs() {
    const container = document.querySelector('[data-period-tabs]');
    if (!container) return;

    const MESSAGES = {
      'hoje':        '0 vendas hoje',
      'ontem':       '0 vendas ontem',
      'esta-semana': '0 vendas esta semana',
      'este-mes':    '0 vendas este mês',
    };

    container.querySelectorAll('[data-period]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const output = document.getElementById('period-output');
        if (output) {
          output.innerHTML = `
            <div style="text-align:center;padding:20px 0">
              <div style="font-family:var(--font-retro);font-size:24px;color:var(--yellow);margin-bottom:8px">R$ 0,00</div>
              <div style="font-size:13px;color:var(--gray-300)">${MESSAGES[btn.dataset.period] || '0 vendas'}</div>
            </div>`;
        }
      });
    });
  }

  /*--- Filtros pill ---*/
  function bindFilterButtons() {
    document.querySelectorAll('[data-filter-group]').forEach(group => {
      group.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
          group.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    });
  }

  /*--- Responder perguntas inline ---*/
  function bindReplyButtons() {
    document.querySelectorAll('[data-reply-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        const card      = btn.closest('[data-question-card]');
        const input     = card?.querySelector('[data-reply-input]');
        const badge     = card?.querySelector('[data-question-badge]');
        const replyArea = card?.querySelector('[data-reply-area]');

        if (!input || !input.value.trim()) return;

        if (replyArea) {
          replyArea.innerHTML = `
            <div style="background:rgba(76,209,55,.06);border:1px solid rgba(76,209,55,.2);
                        border-radius:6px;padding:10px;font-size:12px;color:#9be887;margin-top:4px">
              <span style="font-weight:700">Sua resposta:</span> ${_escapeHtml(input.value.trim())}
            </div>`;
        }

        if (badge) {
          badge.textContent = 'Respondida';
          badge.className   = 'badge badge-green';
        }
      });
    });
  }

  /*--- Desativar conta ---*/
  function bindDeactivateAccount() {
    document.getElementById('btn-deactivate-account')?.addEventListener('click', () => {
      const confirmed = window.confirm(
        '⚠️ Tem certeza que deseja desativar sua conta?\n' +
        'Seus anúncios serão pausados e o acesso ficará bloqueado.'
      );
      if (confirmed) {
        alert('Conta desativada. Redirecionando...');
        localStorage.removeItem('vault_token');
        localStorage.removeItem('vault_user');
        window.location.href = 'index.html';
      }
    });
  }

  function _syncProfileLocalStorage(user) {
    if (!user) return;
    if (user.username) localStorage.setItem('vault_user', user.username);
    if (user._id) localStorage.setItem('vault_id', user._id);
    if (user.nome || user.sobrenome) {
      localStorage.setItem('vault_nome', `${user.nome || ''} ${user.sobrenome || ''}`.trim());
    }
    if (user.dataNascimento) {
      localStorage.setItem(
        'vault_nascimento',
        new Date(user.dataNascimento).toLocaleDateString('pt-BR')
      );
    }
    if (user.contatoPrincipal) {
      localStorage.setItem('vault_contato', user.contatoPrincipal);
      if (user.contatoPrincipal.includes('@')) {
        localStorage.setItem('vault_email', user.contatoPrincipal);
      } else {
        localStorage.setItem('vault_tel', user.contatoPrincipal);
      }
    }
  }

  function _applyProfileToForm(user) {
    const form = document.getElementById('form-minha-conta');
    if (!form || !user) return;

    const usernameInput = document.getElementById('input-username');
    if (usernameInput) usernameInput.value = user.username || '';

    const emailInput = form.querySelector('input[type="email"]');
    const telInput = document.getElementById('input-telefone');
    const contato = user.contatoPrincipal || '';

    if (contato.includes('@')) {
      if (emailInput) emailInput.value = contato;
    } else if (telInput && contato) {
      telInput.value = contato;
    }

    const profileUsername = document.getElementById('profile-username');
    if (profileUsername) profileUsername.textContent = user.username || 'Vault User';

    const segNome = document.getElementById('seg-nome');
    if (segNome) segNome.textContent = `${user.nome || ''} ${user.sobrenome || ''}`.trim() || '—';

    const segNasc = document.getElementById('seg-nascimento');
    if (segNasc && user.dataNascimento) {
      segNasc.textContent = new Date(user.dataNascimento).toLocaleDateString('pt-BR');
    }

    _syncProfileLocalStorage(user);
    syncVerificacoes();
  }

  async function loadMinhaConta() {
    const form = document.getElementById('form-minha-conta');
    if (!form) return;

    const userId = localStorage.getItem('vault_id');
    const token = localStorage.getItem('vault_token');
    if (!userId || !token) return;

    try {
      const res = await fetch(`${API_BASE}/usuarios/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const user = await res.json();
      _applyProfileToForm(user);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    }
  }

  /*--- Salvar conta ---*/
  function bindSaveAccount() {
    const form = document.getElementById('form-minha-conta');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();

      const userId = localStorage.getItem('vault_id');
      const token = localStorage.getItem('vault_token');
      if (!userId || !token) {
        alert('Faça login para salvar alterações.');
        return;
      }

      const username = document.getElementById('input-username')?.value.trim();
      const telefone = document.getElementById('input-telefone')?.value.trim();
      const email = form.querySelector('input[type="email"]')?.value.trim();
      const senhaNova = document.getElementById('input-senha-nova')?.value || '';
      const senhaConfirm = document.getElementById('input-senha-confirm')?.value || '';

      if (!username) {
        alert('Informe um nome de usuário.');
        return;
      }

      const body = { username };
      if (telefone) body.contatoPrincipal = telefone;
      else if (email) body.contatoPrincipal = email;

      if (senhaNova || senhaConfirm) {
        if (senhaNova !== senhaConfirm) {
          alert('As senhas não coincidem.');
          return;
        }
        if (senhaNova.length < 8) {
          alert('A nova senha deve ter pelo menos 8 caracteres.');
          return;
        }
        body.password = senhaNova;
      }

      const btn = form.querySelector('[type="submit"]');
      const original = btn?.textContent;
      if (btn) {
        btn.textContent = 'Salvando...';
        btn.disabled = true;
      }

      try {
        const res = await fetch(`${API_BASE}/usuarios/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || data.Erro || 'Erro ao salvar perfil');

        _applyProfileToForm(data);
        document.getElementById('input-senha-nova').value = '';
        document.getElementById('input-senha-confirm').value = '';

        if (btn) {
          btn.textContent = '✓ Salvo!';
          setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
          }, 2000);
        }
      } catch (err) {
        alert(err.message || 'Não foi possível salvar. Tente novamente.');
        if (btn) {
          btn.textContent = original;
          btn.disabled = false;
        }
      }
    });
  }

  /*--- Avatar picker ---*/
  function bindAvatarPicker() {
    const trigger    = document.getElementById('av-trigger');
    const btnOpen    = document.getElementById('av-btn-open');
    const picker     = document.getElementById('av-picker');
    const preview    = document.getElementById('av-preview');
    const overlay    = document.getElementById('av-overlay');
    const btnSave    = document.getElementById('av-confirm');
    const btnCancel  = document.getElementById('av-cancel');
    const usernameEl = document.getElementById('av-username');
    const savedMsg   = document.getElementById('av-saved');
    if (!trigger || !picker) return;

    const username = localStorage.getItem('vault_user') || 'Vault User';
    if (usernameEl) {
  const id = localStorage.getItem('vault_id') || '#000000';
  usernameEl.innerHTML = `${username} <span style="font-family:var(--font-body);font-size:11px;color:var(--gray-400);font-weight:600">${id}</span>`;
}

    let pendingId = localStorage.getItem('vault_avatar') || null;

    function open()  { picker.style.display = 'block'; }
    function close() { picker.style.display = 'none'; }

    trigger.addEventListener('click', open);
    btnOpen.addEventListener('click', open);
    btnCancel.addEventListener('click', close);
    trigger.addEventListener('mouseenter', () => overlay.style.opacity = '1');
    trigger.addEventListener('mouseleave', () => overlay.style.opacity = '0');

    document.querySelectorAll('.av-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.av-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        pendingId = opt.dataset.id;
      });
    });

    btnSave.addEventListener('click', () => {
      if (!pendingId) return;
      _applyAvatar(pendingId, preview);
      localStorage.setItem('vault_avatar', pendingId);
      close();
      if (savedMsg) {
        savedMsg.style.display = 'inline';
        setTimeout(() => savedMsg.style.display = 'none', 2500);
      }
    });

    if (pendingId) {
      _applyAvatar(pendingId, preview);
      document.querySelector(`.av-option[data-id="${pendingId}"]`)?.classList.add('selected');
    } else {
      preview.textContent = username.slice(0, 2).toUpperCase();
    }
  }

  function _applyAvatar(id, preview) {
    const img = `<img src="assets/avatars/avatar${id}.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    if (preview) preview.innerHTML = img;
    const bannerAvatar = document.getElementById('avatar-initials');
    if (bannerAvatar) bannerAvatar.innerHTML = img;
  }

  /*--- Upload de documentos ---*/
  function bindDocumentos() {
    document.querySelectorAll('[data-upload]').forEach(input => {
      input.addEventListener('change', () => {
        const doc      = input.dataset.upload;
        const statusEl = document.querySelector(`.doc-status[data-doc="${doc}"]`);
        if (!statusEl || !input.files.length) return;

        const saved = JSON.parse(localStorage.getItem('vault_docs') || '{}');

        if (saved[doc]) {
          alert('Este documento já foi enviado e não pode ser alterado. Para correções, abra um ticket de suporte.');
          input.value = '';
          return;
        }

        saved[doc] = 'pendente';
        localStorage.setItem('vault_docs', JSON.stringify(saved));
        statusEl.innerHTML = `<span class="badge badge-yellow"><span class="ms" style="font-size:13px">schedule</span> Em análise</span>`;
        syncVerificacoes();
      });
    });

    const saved = JSON.parse(localStorage.getItem('vault_docs') || '{}');
    Object.entries(saved).forEach(([doc, status]) => {
      const statusEl = document.querySelector(`.doc-status[data-doc="${doc}"]`);
      if (!statusEl) return;
      if (status === 'pendente') {
        statusEl.innerHTML = `<span class="badge badge-yellow"><span class="ms" style="font-size:13px">schedule</span> Em análise</span>`;
      } else if (status === 'aprovado') {
        statusEl.innerHTML = `<span class="badge badge-green"><span class="ms" style="font-size:13px">check</span> Verificado</span>`;
      }
    });
  }

  /*--- Botões de verificação ---*/
  function bindVerificacoes() {
    document.getElementById('btn-verificar-tel')?.addEventListener('click', () => {
      alert('Código SMS enviado! Funcionalidade será integrada com o back-end.');
    });

    document.getElementById('btn-verificar-email')?.addEventListener('click', () => {
      alert('Link de verificação enviado para seu e-mail! Funcionalidade será integrada com o back-end.');
    });
  }

  /*--- Segurança: dados da conta ---*/
  function bindSeguranca() {
    const nome       = localStorage.getItem('vault_nome')      || '—';
    const nascimento = localStorage.getItem('vault_nascimento') || '—';
    const endereco   = localStorage.getItem('vault_endereco')   || null;
    const cpfSalvo   = localStorage.getItem('vault_cpf')        || null;

    const segNome = document.getElementById('seg-nome');
    if (segNome) segNome.textContent = nome;

    const segNasc = document.getElementById('seg-nascimento');
    if (segNasc) segNasc.textContent = nascimento;

    if (cpfSalvo) {
      document.getElementById('bloco-cpf-form').style.display = 'none';
      document.getElementById('bloco-cpf-view').style.display = 'block';
      const segCpf = document.getElementById('seg-cpf');
      if (segCpf) segCpf.textContent = cpfSalvo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.$3-**');
    } else {
      document.getElementById('bloco-cpf-form').style.display = 'block';
      document.getElementById('bloco-cpf-view').style.display = 'none';
    }

    document.getElementById('btn-salvar-cpf')?.addEventListener('click', () => {
      const val = document.getElementById('input-cpf')?.value.replace(/\D/g, '');
      if (!val || val.length !== 11) { alert('CPF inválido. Digite os 11 números.'); return; }
      if (!window.confirm('Atenção: o CPF não poderá ser alterado após salvo. Confirmar?')) return;
      localStorage.setItem('vault_cpf', val);
      document.getElementById('bloco-cpf-form').style.display = 'none';
      document.getElementById('bloco-cpf-view').style.display = 'block';
      const segCpf = document.getElementById('seg-cpf');
      if (segCpf) segCpf.textContent = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.$3-**');
    });

    if (endereco) {
      const parsed = JSON.parse(endereco);
      document.getElementById('bloco-endereco-view').style.display = 'block';
      document.getElementById('bloco-endereco-form').style.display = 'none';
      document.getElementById('seg-endereco').textContent =
        `${parsed.rua} · ${parsed.bairro} · CEP ${parsed.cep} · ${parsed.estado} · Brasil`;
    }

    document.getElementById('seg-cep')?.addEventListener('blur', async () => {
      const cep = document.getElementById('seg-cep').value.replace(/\D/g, '');
      if (cep.length !== 8) return;
      try {
        const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (data.erro) { alert('CEP não encontrado.'); return; }
        document.getElementById('seg-rua').value    = data.logradouro || '';
        document.getElementById('seg-bairro').value = data.bairro     || '';
        document.getElementById('seg-estado').value = data.uf         || '';
      } catch { alert('Erro ao buscar CEP. Verifique sua conexão.'); }
    });

    document.getElementById('btn-salvar-endereco')?.addEventListener('click', () => {
      const cep    = document.getElementById('seg-cep')?.value.trim();
      const estado = document.getElementById('seg-estado')?.value.trim();
      const rua    = document.getElementById('seg-rua')?.value.trim();
      const bairro = document.getElementById('seg-bairro')?.value.trim();
      if (!cep || !estado || !rua || !bairro) { alert('Preencha todos os campos de endereço.'); return; }
      localStorage.setItem('vault_endereco', JSON.stringify({ cep, estado, rua, bairro }));
      document.getElementById('bloco-endereco-view').style.display = 'block';
      document.getElementById('bloco-endereco-form').style.display = 'none';
      document.getElementById('seg-endereco').textContent =
        `${rua} · ${bairro} · CEP ${cep} · ${estado} · Brasil`;
    });

    document.getElementById('btn-enviar-docs')?.addEventListener('click', () => {
      const saved = JSON.parse(localStorage.getItem('vault_docs') || '{}');
      const total = Object.keys(saved).length;
      if (total < 3) { alert(`Você enviou ${total} de 3 documentos. Envie todos antes de submeter.`); return; }
      const btn = document.getElementById('btn-enviar-docs');
      btn.disabled = true;
      btn.innerHTML = '<span class="ms" style="font-size:18px">check</span> Enviado';
      alert('Documentos enviados! Nossa equipe responderá em até 2 dias úteis.');
    });
  }

  /*--- Toggle 2FA ---*/
  function bind2FA() {
    const toggle = document.getElementById('toggle-2fa');
    const track  = document.getElementById('track-2fa');
    const thumb  = document.getElementById('thumb-2fa');
    const label  = document.getElementById('label-2fa');
    if (!toggle) return;

    const saved = localStorage.getItem('vault_2fa') === 'true';
    toggle.checked = saved;
    _apply2FA(saved, track, thumb, label);

    toggle.addEventListener('change', () => {
      _apply2FA(toggle.checked, track, thumb, label);
      localStorage.setItem('vault_2fa', toggle.checked);
      if (toggle.checked) alert('2FA ativado! Será integrado com o back-end.');
    });
  }

  function _apply2FA(active, track, thumb, label) {
    track.style.background = active ? 'var(--yellow)' : 'var(--gray-700)';
    thumb.style.left       = active ? '21px' : '3px';
    thumb.style.background = active ? '#000' : '#fff';
    label.textContent      = active ? 'Ativado' : 'Desativado';
    label.style.color      = active ? 'var(--yellow)' : 'var(--gray-400)';
  }

  /*--- Sincroniza verificações ---*/
  function syncVerificacoes() {
    const emailOk    = localStorage.getItem('vault_email_verified') === 'true';
    const vEmail     = document.getElementById('verify-email-status');
    const vEmailIcon = document.getElementById('verify-email-icon');
    const vEmailAddr = document.getElementById('verify-email-address');
    if (vEmailAddr) vEmailAddr.textContent = localStorage.getItem('vault_email') || '—';
    if (vEmail) vEmail.innerHTML = emailOk
      ? `<span class="ms" style="font-size:16px;color:var(--green)">check</span> Verificado`
      : `<span style="font-size:12px;color:var(--gray-400)">Não verificado</span>`;
    if (vEmailIcon) { vEmailIcon.textContent = emailOk ? 'check_circle' : 'radio_button_unchecked'; vEmailIcon.style.color = emailOk ? 'var(--green)' : 'var(--gray-400)'; }

    const telOk    = localStorage.getItem('vault_tel_verified') === 'true';
    const vTel     = document.getElementById('verify-tel-status');
    const vTelIcon = document.getElementById('verify-tel-icon');
    const vTelNum  = document.getElementById('verify-tel-number');
    if (vTelNum) { const tel = localStorage.getItem('vault_tel') || ''; vTelNum.textContent = tel ? `***${tel.slice(-3)}` : '***'; }
    if (vTel) vTel.innerHTML = telOk
      ? `<span class="ms" style="font-size:16px;color:var(--green)">check</span> Verificado`
      : `<span style="font-size:12px;color:var(--gray-400)">Não verificado</span>`;
    if (vTelIcon) { vTelIcon.textContent = telOk ? 'check_circle' : 'radio_button_unchecked'; vTelIcon.style.color = telOk ? 'var(--green)' : 'var(--gray-400)'; }

    const docs      = JSON.parse(localStorage.getItem('vault_docs') || '{}');
    const docLabels = { identidade: 'Identidade (RG/CNH)', selfie: 'Selfie com documento', comprovante: 'Comprovante de residência' };
    let docsOk      = true;
    ['identidade','selfie','comprovante'].forEach(doc => {
      const el     = document.getElementById(`verify-doc-${doc}`);
      if (!el) return;
      const status = docs[doc];
      if (status === 'aprovado') {
        el.innerHTML = `<span class="ms" style="font-size:16px;color:var(--green)">check</span> ${docLabels[doc]}`;
      } else if (status === 'pendente') {
        el.innerHTML = `<span class="ms" style="font-size:16px;color:var(--yellow)">schedule</span> ${docLabels[doc]} — Em análise`;
        docsOk = false;
      } else {
        el.innerHTML = `<span class="ms" style="font-size:16px;color:var(--gray-400)">close</span> ${docLabels[doc]} — Não enviado`;
        docsOk = false;
      }
    });
    const vDocsIcon = document.getElementById('verify-docs-icon');
    if (vDocsIcon) { vDocsIcon.textContent = docsOk ? 'check_circle' : 'radio_button_unchecked'; vDocsIcon.style.color = docsOk ? 'var(--green)' : 'var(--gray-400)'; }

    const perfilOk    = !!(localStorage.getItem('vault_user') && localStorage.getItem('vault_email'));
    const vPerfil     = document.getElementById('verify-perfil-status');
    const vPerfilIcon = document.getElementById('verify-perfil-icon');
    if (vPerfil) vPerfil.innerHTML = perfilOk
      ? `<span class="ms" style="font-size:16px;color:var(--green)">check</span> Completo`
      : `<span style="font-size:12px;color:var(--gray-400)">Incompleto</span>`;
    if (vPerfilIcon) { vPerfilIcon.textContent = perfilOk ? 'check_circle' : 'radio_button_unchecked'; vPerfilIcon.style.color = perfilOk ? 'var(--green)' : 'var(--gray-400)'; }
  }

  function _formatVendaDate(dateStr) {
    const d = new Date(dateStr);
    return {
      data: d.toLocaleDateString('pt-BR'),
      hora: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  }

  function _statusBadgeClass(status) {
    const map = {
      'Concluída': 'badge-green',
      'Aceita': 'badge-green',
      'Pendente': 'badge-yellow',
      'Em negociação': 'badge-yellow',
      'Cancelada': 'badge-red',
      'Recusada': 'badge-red',
    };
    return map[status] || 'badge-gray';
  }

  function _pagamentoFromStatus(status) {
    if (status === 'Concluída') return 'Aprovado';
    if (status === 'Pendente') return 'Pendente';
    return '—';
  }

  function _shortVendaId(id) {
    return String(id).slice(-8).toUpperCase();
  }

  function mapVendaToPedido(venda) {
    const dt = _formatVendaDate(venda.dataOferta);
    const total = parseFloat(venda.valorOfertado) || 0;
    const itemId = venda.item?._id || venda.item;
    return {
      id: _shortVendaId(venda._id),
      vendaId: venda._id,
      produto: venda.item?.titulo || 'Produto',
      itemId,
      quantidade: 1,
      vendedor: venda.vendedor?.username || '—',
      pagamento: _pagamentoFromStatus(venda.status),
      total: total.toFixed(2).replace('.', ','),
      data: dt.data,
      hora: dt.hora,
      status: venda.status,
      badgeClass: _statusBadgeClass(venda.status),
    };
  }

  function mapVendaToVendaRow(venda) {
    const dt = _formatVendaDate(venda.dataOferta);
    const total = parseFloat(venda.valorOfertado) || 0;
    const itemId = venda.item?._id || venda.item;
    return {
      id: _shortVendaId(venda._id),
      vendaId: venda._id,
      produto: venda.item?.titulo || 'Produto',
      itemId,
      quantidade: 1,
      comprador: venda.comprador?.username || '—',
      pagamento: _pagamentoFromStatus(venda.status),
      total: total.toFixed(2).replace('.', ','),
      data: dt.data,
      hora: dt.hora,
      status: venda.status,
      badgeClass: _statusBadgeClass(venda.status),
    };
  }

  /*--- Renders (integração com back-end) ---*/
  function renderPedidos(pedidos) {
    const tbody = document.getElementById('tbody-meus-pedidos');
    if (!tbody) return;

    if (!pedidos.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:28px;color:var(--gray-400)">
            Você ainda não fez nenhuma compra.
            <a href="categorias.html" style="color:var(--yellow);margin-left:6px">Explorar catálogo</a>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = pedidos.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>
          <div style="font-weight:700;color:var(--white)">${_escapeHtml(p.produto)}</div>
          <div style="font-size:11px;color:var(--gray-400)">Qtd: ${p.quantidade}</div>
          <div style="font-size:11px;color:var(--gray-400)">Vendedor: ${_escapeHtml(p.vendedor)}</div>
        </td>
        <td>${p.pagamento}</td>
        <td>R$ ${p.total}</td>
        <td><div>${p.data}</div><div style="font-size:11px;color:var(--gray-400)">${p.hora}</div></td>
        <td><span class="badge ${p.badgeClass}">${p.status}</span></td>
        <td>${p.itemId ? `<a href="produto.html?id=${p.itemId}" class="btn btn-outline btn-sm">Ver pedido</a>` : '<button class="btn btn-outline btn-sm" disabled>Ver pedido</button>'}</td>
      </tr>`).join('');
  }

  function renderTransacoes(dados) {
    const tbody = document.getElementById('tbody-transacoes');
    if (!tbody) return;
    tbody.innerHTML = dados.map(t => `
      <tr>
        <td>${t.id}</td><td>${t.data}</td><td>${t.descricao}</td>
        <td><span class="badge ${t.badgeClass}">${t.status}</span></td>
        <td style="color:${t.valor > 0 ? 'var(--green)' : 'var(--red)'}">${t.valor > 0 ? '+' : ''}R$ ${t.valor}</td>
        <td>R$ ${t.totalNaConta}</td>
      </tr>`).join('');
  }

  const API_BASE = 'http://localhost:3000';
  let cachedAnuncios = [];

  function mapItemToAnuncio(item) {
    const estoque = item.estoqueQtd ?? 0;
    const ativo = estoque > 0;
    return {
      id: item._id,
      titulo: item.titulo || 'Sem título',
      preco: parseFloat(item.precoOriginal || 0).toFixed(2),
      estoque,
      categoria: item.categoria?.nome || '—',
      status: ativo ? 'Ativo' : 'Sem estoque',
      badgeClass: ativo ? 'badge-green' : 'badge-gray',
      ativo,
    };
  }

  function renderAnuncios(dados) {
    const tbody = document.getElementById('tbody-meus-anuncios');
    if (!tbody) return;

    if (!dados.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;padding:28px;color:var(--gray-400)">
            Você ainda não tem anúncios.
            <a href="anunciar.html" style="color:var(--yellow);margin-left:6px">Criar anúncio</a>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = dados.map(a => `
      <tr>
        <td>
          <div style="font-weight:700;color:var(--white)">${_escapeHtml(a.titulo)}</div>
          <div style="font-size:11px;color:var(--gray-400)">${_escapeHtml(a.categoria)} · ${a.id}</div>
        </td>
        <td>R$ ${a.preco}</td>
        <td>${a.estoque} un.</td>
        <td><span class="badge ${a.badgeClass}">${a.status}</span></td>
        <td>
          <a href="produto.html?id=${a.id}" class="btn btn-outline btn-sm">Ver anúncio</a>
        </td>
      </tr>`).join('');
  }

  async function loadMeusAnuncios() {
    const tbody = document.getElementById('tbody-meus-anuncios');
    if (!tbody) return;

    const token = localStorage.getItem('vault_token');
    if (!token) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;padding:28px;color:var(--gray-400)">
            Faça <a href="login.html" style="color:var(--yellow)">login</a> para ver seus anúncios.
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:28px;color:var(--gray-400)">Carregando anúncios...</td>
      </tr>`;

    try {
      const res = await fetch(`${API_BASE}/item/usuario/meus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const itens = await res.json();
      if (!Array.isArray(itens)) throw new Error('Resposta inválida');
      cachedAnuncios = itens.map(mapItemToAnuncio);
      renderAnuncios(cachedAnuncios);
    } catch (err) {
      console.error('Erro ao carregar anúncios:', err);
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;padding:28px;color:var(--red)">
            Não foi possível carregar seus anúncios. Verifique se o servidor está online.
          </td>
        </tr>`;
    }
  }

  function renderVendas(dados) {
    const tbody = document.getElementById('tbody-minhas-vendas');
    if (!tbody) return;

    if (!dados.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;padding:28px;color:var(--gray-400)">
            Nenhuma venda registrada ainda.
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = dados.map(v => `
      <tr>
        <td>${v.id}</td>
        <td><div style="font-weight:700;color:var(--white)">${_escapeHtml(v.produto)}</div><div style="font-size:11px;color:var(--gray-400)">Qtd: ${v.quantidade}</div></td>
        <td>${_escapeHtml(v.comprador)}</td><td>${v.pagamento}</td><td>R$ ${v.total}</td>
        <td><div>${v.data}</div><div style="font-size:11px;color:var(--gray-400)">${v.hora}</div></td>
        <td><span class="badge ${v.badgeClass}">${v.status}</span></td>
        <td>${v.itemId ? `<a href="produto.html?id=${v.itemId}" class="btn btn-outline btn-sm">Ver</a>` : '<button class="btn btn-outline btn-sm" disabled>Ver</button>'}</td>
      </tr>`).join('');
  }

  async function loadMeusPedidos() {
    const tbody = document.getElementById('tbody-meus-pedidos');
    if (!tbody) return;

    const token = localStorage.getItem('vault_token');
    if (!token) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:28px;color:var(--gray-400)">
            Faça <a href="login.html" style="color:var(--yellow)">login</a> para ver seus pedidos.
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:28px;color:var(--gray-400)">Carregando pedidos...</td>
      </tr>`;

    try {
      const res = await fetch(`${API_BASE}/venda/usuario/compras`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const vendas = await res.json();
      if (!Array.isArray(vendas)) throw new Error('Resposta inválida');
      renderPedidos(vendas.map(mapVendaToPedido));
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:28px;color:var(--red)">
            Não foi possível carregar seus pedidos. Verifique se o servidor está online.
          </td>
        </tr>`;
    }
  }

  async function loadMinhasVendas() {
    const tbody = document.getElementById('tbody-minhas-vendas');
    if (!tbody) return;

    const token = localStorage.getItem('vault_token');
    if (!token) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;padding:28px;color:var(--gray-400)">
            Faça <a href="login.html" style="color:var(--yellow)">login</a> para ver suas vendas.
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;padding:28px;color:var(--gray-400)">Carregando vendas...</td>
      </tr>`;

    try {
      const res = await fetch(`${API_BASE}/venda/usuario/vendas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const vendas = await res.json();
      if (!Array.isArray(vendas)) throw new Error('Resposta inválida');
      renderVendas(vendas.map(mapVendaToVendaRow));
    } catch (err) {
      console.error('Erro ao carregar vendas:', err);
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center;padding:28px;color:var(--red)">
            Não foi possível carregar suas vendas. Verifique se o servidor está online.
          </td>
        </tr>`;
    }
  }

  function renderRetiradas(dados) {
    const tbody = document.getElementById('tbody-retiradas');
    if (!tbody) return;
    tbody.innerHTML = dados.map(r => `
      <tr>
        <td>${r.data}</td><td>R$ ${r.valor}</td>
        <td><div style="font-weight:700">${r.recebedor}</div><div style="font-size:11px;color:var(--gray-400)">${r.chavePix}</div></td>
        <td><span class="badge ${r.badgeClass}">${r.status}</span></td>
      </tr>`).join('');
  }

  function renderRecargas(dados) {
    const tbody = document.getElementById('tbody-recargas');
    if (!tbody) return;
    tbody.innerHTML = dados.map(r => `
      <tr>
        <td style="font-family:var(--font-retro);font-size:10px;color:var(--yellow)">${r.id}</td>
        <td>${r.data}</td><td>${r.hora}</td><td>R$ ${r.valor}</td>
        <td><span class="badge ${r.badgeClass}">${r.status}</span></td>
      </tr>`).join('');
  }

  function renderPerguntas(dados) {
    const lista = document.getElementById('lista-perguntas');
    if (!lista) return;
    lista.innerHTML = dados.map(p => `
      <div class="q-card" data-question-card>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--white)">${p.usuario}</div>
            <div style="font-size:11px;color:var(--gray-400);margin-top:2px">${p.data} · ${p.hora}</div>
          </div>
          <span class="badge ${p.badgeClass}" data-question-badge>${p.status}</span>
        </div>
        <div style="font-size:13px;color:#ccc;line-height:1.5;margin-bottom:4px">${p.mensagem}</div>
        <div class="q-reply" data-reply-area>
          <input type="text" data-reply-input placeholder="Escreva sua resposta..." />
          <button class="btn btn-yellow btn-sm" data-reply-btn>
            <span class="ms" style="font-size:14px">send</span> Responder
          </button>
        </div>
      </div>`).join('');
    bindReplyButtons();
  }

  /*--- Utilitários ---*/
  function _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /*--- Init ---*/
  function init() {
    window.DashboardContext.onChange(tab => {
      activatePage(tab);
      if (tab === 'meus-anuncios') loadMeusAnuncios();
      if (tab === 'meus-pedidos') loadMeusPedidos();
      if (tab === 'minhas-vendas') loadMinhasVendas();
      if (tab === 'minha-conta') loadMinhaConta();
    });
    const initialTab = window.DashboardContext.getTab();
    activatePage(initialTab);
    if (initialTab === 'meus-anuncios') loadMeusAnuncios();
    if (initialTab === 'meus-pedidos') loadMeusPedidos();
    if (initialTab === 'minhas-vendas') loadMinhasVendas();
    if (initialTab === 'minha-conta') loadMinhaConta();
    bindSidebar();
    bindTopNavLinks();
    bindPeriodTabs();
    bindFilterButtons();
    bindReplyButtons();
    bindDeactivateAccount();
    bindSaveAccount();
    bindAvatarPicker();
    bindDocumentos();
    bindVerificacoes();
    bindSeguranca();
    bind2FA();
    syncVerificacoes();

    const profileUsername = document.getElementById('profile-username');
    if (profileUsername) {
      profileUsername.textContent = localStorage.getItem('vault_user') || 'Vault User';
    }

    const emailVerificado = localStorage.getItem('vault_email_verified') === 'true';
    document.getElementById('email-nao-verificado').style.display = emailVerificado ? 'none' : 'flex';
    document.getElementById('email-verificado').style.display     = emailVerificado ? 'flex' : 'none';

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


