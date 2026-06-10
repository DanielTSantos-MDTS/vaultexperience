const DashboardContext = (() => {

  /*--- Abas válidas ---*/
  const VALID_TABS = [
    'resumo', 'carteira', 'transacoes',
    'meus-anuncios', 'meus-pedidos', 'minhas-vendas',
    'perguntas', 'retiradas', 'recargas',
    'minha-conta', 'seguranca', 'verificacoes',
  ];

  /*--- Estado interno ---*/
  const STORAGE_KEY = 'vault_dashboard_tab';
  let _activeTab    = _resolveInitialTab();
  let _listeners    = [];

  /*--- Resolução da aba inicial ---*/
  function _resolveInitialTab() {
    const params   = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && VALID_TABS.includes(tabParam)) return tabParam;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_TABS.includes(saved)) return saved;

    return 'resumo';
  }

  /*--- Notifica ouvintes ---*/
  function _notify(tab) {
    _listeners.forEach(fn => fn(tab));
  }

  /*--- API pública ---*/
  return {

    getTab() {
      return _activeTab;
    },

    setTab(tab, { fromHeader = false } = {}) {
      if (tab === 'ajuda') {
        window.location.href = 'ajuda.html';
        return;
      }

      if (!VALID_TABS.includes(tab)) {
        console.warn(`[DashboardContext] Aba inválida: "${tab}"`);
        return;
      }

      if (fromHeader) {
        localStorage.setItem(STORAGE_KEY, tab);
        window.location.href = `dashboard.html?tab=${tab}`;
        return;
      }

      _activeTab = tab;
      localStorage.setItem(STORAGE_KEY, tab);

      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());

      _notify(tab);
    },

    onChange(fn) {
      if (typeof fn === 'function') _listeners.push(fn);
    },

    offChange(fn) {
      _listeners = _listeners.filter(l => l !== fn);
    },

    VALID_TABS,
  };

})();

window.DashboardContext = DashboardContext;