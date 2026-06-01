(function initHeaderDropdown() {

  //--- Mapeamento de texto para tabId do DashboardContext ---//
  const TAB_MAP = {
    'meus anuncios':          'meus-anuncios',
    'meus anúncios':          'meus-anuncios',
    'meus pedidos':           'meus-pedidos',
    'carteira':               'carteira',
    'minha conta':            'minha-conta',
    'seguranca & privacidade':'seguranca',
    'segurança & privacidade':'seguranca',
    'ajuda':                  'ajuda',       // caso especial → página externa 
  };

  function normalize(el) {
    return el.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function bindDropdownItems() {
    const dropdown = document.getElementById('user-dropdown');
    if (!dropdown) return;

    const links = dropdown.querySelectorAll('.dropdown-list a');

    links.forEach(link => {
      if (link.dataset.ctxBound) return;
      link.dataset.ctxBound = 'true';

      const label = normalize(link);
      const tabId = TAB_MAP[label];

      if (!tabId) return; 

      // Substitui a navegação padrão pelo contexto
      link.addEventListener('click', e => {
        e.preventDefault();
        // Fecha o dropdown visualmente
        dropdown.classList.remove('active');
        // fromHeader: true → redireciona para dashboard.html se necessário
        window.DashboardContext.setTab(tabId, { fromHeader: true });
      });
    });
  }

  //--- INICIALIZAÇÃO ---//
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindDropdownItems);
  } else {
    bindDropdownItems();
  }

  //--- OBSERVAÇÃO DE MUTAÇÕES ---/
  const observer = new MutationObserver(() => {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      bindDropdownItems();
      // Desconecta depois de encontrar — evita overhead contínuo
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
