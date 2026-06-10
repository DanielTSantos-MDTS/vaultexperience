// lances-ui.js - Integração UI de Lances/Leilão

import LancesAPI from './lances-api.js';
import { getToken } from './api.js';

const LancesUI = {
  async init() {
    this.setupListeners();
    document.addEventListener('produto:rendered', () => this.carregarLances());
    await this.carregarLances();
  },

  setupListeners() {
    document.addEventListener('submit', async (e) => {
      const form = e.target.closest('[data-form-lance]');
      if (!form) return;
      e.preventDefault();

      const itemId = form.dataset.itemId;
      const valorInput = form.querySelector('[name="valor"]');
      const valor = parseFloat(valorInput?.value);

      if (!valor || valor <= 0) {
        this.showToast('Valor inválido', 'error');
        return;
      }

      await this.fazerLance(itemId, valor, form);
    });
  },

  async fazerLance(itemId, valor, form) {
    try {
      if (!getToken()) {
        this.showToast('Faça login para fazer um lance', 'error');
        window.location.href = 'login.html';
        return;
      }

      await LancesAPI.validarLance(itemId, valor);
      await LancesAPI.fazer(itemId, valor);
      this.showToast('Lance realizado com sucesso!', 'success');

      form.reset();
      const btn = form.querySelector('#btn-lance, .btn-lance');
      if (btn) btn.disabled = true;

      await this.carregarLances();
    } catch (error) {
      console.error('Erro ao fazer lance:', error);
      this.showToast(error.message || 'Erro ao fazer lance', 'error');
    }
  },

  async carregarLances() {
    const container = document.querySelector('[data-lances-container]');
    const itemId = container?.dataset.itemId;
    if (!itemId) return;

    try {
      const lances = await LancesAPI.listar(itemId);
      this.renderizarLances(lances);

      const maiorLance = await LancesAPI.obterMaiorLance(itemId);
      this.atualizarPrecoMinimo(maiorLance.priceFloor);
    } catch (error) {
      console.error('Erro ao carregar lances:', error);
    }
  },

  renderizarLances(lances) {
    const container = document.querySelector('[data-lances-container]');
    if (!container) return;

    if (!lances.length) {
      container.innerHTML = '<p class="lance-empty">Nenhum lance ainda. Seja o primeiro!</p>';
      return;
    }

    container.innerHTML = `
      <div class="lances-lista">
        <h3>Histórico de Lances (${lances.length})</h3>
        <div class="lances-items">
          ${lances.map((lance, idx) => `
            <div class="lance-item ${idx === 0 ? 'maior-lance' : ''}">
              <div class="lance-rank">#${idx + 1}</div>
              <div class="lance-info">
                <p class="lance-usuario">
                  <strong>${lance.usuario?.username || 'Usuário'}</strong>
                  ${idx === 0 ? '<span class="badge-maior">Maior Lance</span>' : ''}
                </p>
                <p class="lance-tempo">${new Date(lance.dataLance).toLocaleString('pt-BR')}</p>
              </div>
              <p class="lance-valor">R$ ${parseFloat(lance.valor).toFixed(2)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  atualizarPrecoMinimo(priceFloor) {
    const minimo = parseFloat(priceFloor) || 0;

    const elemento = document.querySelector('[data-price-floor]');
    if (elemento) {
      elemento.textContent = `R$ ${minimo.toFixed(2)}`;
    }

    const input = document.querySelector('[data-form-lance] [name="valor"]');
    if (input) {
      input.min = minimo;
      input.placeholder = `Mínimo: R$ ${minimo.toFixed(2)}`;
    }
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('valt-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'valt-toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `valt-toast valt-toast--${type === 'error' ? 'cart' : 'fav'}`;
    toast.innerHTML = `
      <span class="valt-toast-icon">${type === 'error' ? '⚠️' : '✦'}</span>
      <span class="valt-toast-msg">${message}</span>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('valt-toast--show'));
    setTimeout(() => {
      toast.classList.remove('valt-toast--show');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  },
};

window.LancesUI = LancesUI;

async function bootLancesUI() {
  await LancesUI.init();
  document.dispatchEvent(new CustomEvent('lances:ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootLancesUI);
} else {
  bootLancesUI();
}

export default LancesUI;
