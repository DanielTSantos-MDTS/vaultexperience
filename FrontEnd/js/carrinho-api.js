// carrinho-api.js - API de Carrinho

import { apiCall } from './api.js';

const CarrinhoAPI = {
    async obter() {
        return await apiCall('/carrinho', 'GET', null, true);
    },

    async adicionar(itemId, quantidade = 1) {
        return await apiCall('/carrinho', 'POST', { itemId, quantidade }, true);
    },

    async remover(itemId) {
        return await apiCall(`/carrinho/${itemId}`, 'DELETE', null, true);
    },

    async atualizarQuantidade(itemId, quantidade) {
        return await apiCall(`/carrinho/${itemId}`, 'PUT', { quantidade }, true);
    },

    async limpar() {
        return await apiCall('/carrinho', 'DELETE', null, true);
    },

    // Função auxiliar para obter total
    async obterTotal() {
        const carrinho = await this.obter();
        const total = carrinho.itens.reduce((acc, item) => {
            return acc + (parseFloat(item.precoUnitario) * item.quantidade);
        }, 0);
        return total.toFixed(2);
    },

    // Função auxiliar para obter quantidade total de itens
    async obterQuantidadeTotal() {
        const carrinho = await this.obter();
        return carrinho.itens.reduce((acc, item) => acc + item.quantidade, 0);
    }
};

export default CarrinhoAPI;
