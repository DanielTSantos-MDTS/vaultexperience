// carrinho-ui.js - Integração UI de Carrinho

import CarrinhoAPI from './carrinho-api.js';
import { getToken } from './api.js';

const CarrinhoUI = {
    async init() {
        await this.sincronizarCarrinho();
        this.setupListeners();
    },

    setupListeners() {
        // Adicionar ao carrinho
        document.addEventListener('click', async (e) => {
            if (e.target.closest('[data-add-to-cart]')) {
                const btn = e.target.closest('[data-add-to-cart]');
                const itemId = btn.dataset.itemId;
                const quantidade = parseInt(btn.dataset.quantidade || 1);

                await this.adicionarAoCarrinho(itemId, quantidade);
            }

            // Remover do carrinho
            if (e.target.closest('[data-remove-from-cart]')) {
                const btn = e.target.closest('[data-remove-from-cart]');
                const itemId = btn.dataset.itemId;
                await this.removerDoCarrinho(itemId);
            }

            // Atualizar quantidade
            if (e.target.closest('[data-update-qty]')) {
                const input = e.target.closest('[data-update-qty]');
                const itemId = input.dataset.itemId;
                const quantidade = parseInt(input.value);
                await this.atualizarQuantidade(itemId, quantidade);
            }

            // Limpar carrinho
            if (e.target.closest('[data-clear-cart]')) {
                if (confirm('Deseja limpar todo o carrinho?')) {
                    await this.limparCarrinho();
                }
            }
        });
    },

    async adicionarAoCarrinho(itemId, quantidade = 1) {
        try {
            if (!getToken()) {
                this.showToast('Faça login para adicionar ao carrinho', 'error');
                window.location.href = 'login.html';
                return;
            }

            await CarrinhoAPI.adicionar(itemId, quantidade);
            this.showToast('Adicionado ao carrinho!', 'success');
            await this.sincronizarCarrinho();
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error);
            this.showToast('Erro ao adicionar ao carrinho', 'error');
        }
    },

    async removerDoCarrinho(itemId) {
        try {
            await CarrinhoAPI.remover(itemId);
            this.showToast('Removido do carrinho', 'success');
            await this.sincronizarCarrinho();
        } catch (error) {
            console.error('Erro ao remover do carrinho:', error);
            this.showToast('Erro ao remover do carrinho', 'error');
        }
    },

    async atualizarQuantidade(itemId, quantidade) {
        const qty = parseInt(quantidade, 10);
        if (!qty || qty <= 0) {
            await this.removerDoCarrinho(itemId);
            return;
        }

        try {
            await CarrinhoAPI.atualizarQuantidade(itemId, qty);
            await this.sincronizarCarrinho();
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            this.showToast(error.message || 'Erro ao atualizar carrinho', 'error');
            throw error;
        }
    },

    async limparCarrinho() {
        try {
            await CarrinhoAPI.limpar();
            this.showToast('Carrinho limpo', 'success');
            await this.sincronizarCarrinho();
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            this.showToast('Erro ao limpar carrinho', 'error');
        }
    },

    async sincronizarCarrinho() {
        try {
            if (!getToken()) return;

            const carrinho = await CarrinhoAPI.obter();
            
            // Atualizar contador no header
            const cartCount = carrinho.itens.reduce((acc, item) => acc + item.quantidade, 0);
            this.updateHeaderBadge(cartCount);

            // Emitir evento de atualização (cart.js e store.js escutam)
            document.dispatchEvent(new CustomEvent('carrinho:updated', { detail: { carrinho } }));
        } catch (error) {
            console.error('Erro ao sincronizar carrinho:', error);
        }
    },

    updateHeaderBadge(cartCount) {
        document.querySelectorAll('[data-valt="cart-btn"]').forEach(btn => {
            btn.setAttribute('aria-label', `Carrinho (${cartCount})`);
            let badge = btn.querySelector('.valt-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'valt-badge';
                btn.style.position = 'relative';
                btn.appendChild(badge);
            }
            badge.textContent = cartCount;
            badge.style.display = cartCount > 0 ? 'flex' : 'none';
        });
    },

    showToast(message, type = 'info') {
        if (typeof _showToast === 'function') {
            _showToast(message, type);
        } else {
            alert(message);
        }
    }
};

// Ponte global: API se logado, localStorage se visitante
window.vaultAddToCart = async function (itemId, product, qty = 1) {
    if (getToken()) {
        await CarrinhoUI.adicionarAoCarrinho(itemId, qty);
    } else if (typeof VaultStore !== 'undefined') {
        const cart = VaultStore.getCart();
        const idx = cart.findIndex(i => i.id === product.id);
        if (idx >= 0) {
            VaultStore.updateQty(product.id, cart[idx].qty + qty);
        } else {
            VaultStore.addToCart(product);
            if (qty > 1) VaultStore.updateQty(product.id, qty);
        }
    }
};

window.CarrinhoUI = CarrinhoUI;

async function bootCarrinhoUI() {
    await CarrinhoUI.init();
    document.dispatchEvent(new CustomEvent('carrinho:ready'));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootCarrinhoUI);
} else {
    bootCarrinhoUI();
}

export default CarrinhoUI;
