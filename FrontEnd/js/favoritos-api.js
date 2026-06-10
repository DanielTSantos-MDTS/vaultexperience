// favoritos-api.js - API de Favoritos

import { apiCall } from './api.js';

const FavoritosAPI = {
    async listar() {
        return await apiCall('/favoritos', 'GET', null, true);
    },

    async adicionar(itemId) {
        return await apiCall('/favoritos', 'POST', { itemId }, true);
    },

    async remover(itemId) {
        return await apiCall(`/favoritos/${itemId}`, 'DELETE', null, true);
    },

    async verificar(itemId) {
        const result = await apiCall(`/favoritos/verificar/${itemId}`, 'GET', null, true);
        return result.isFavorito;
    },

    async toggle(itemId, isFavorito) {
        if (isFavorito) {
            return await this.remover(itemId);
        } else {
            return await this.adicionar(itemId);
        }
    }
};

export default FavoritosAPI;
