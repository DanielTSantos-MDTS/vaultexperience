// lances-api.js - API de Lances/Leilão

import { apiCall } from './api.js';

const LancesAPI = {
    async fazer(itemId, valor) {
        return await apiCall('/lances', 'POST', { itemId, valor }, true);
    },

    async listar(itemId) {
        return await apiCall(`/lances/${itemId}`, 'GET', null, false);
    },

    async obterMaiorLance(itemId) {
        const result = await apiCall(`/lances/${itemId}/maior`, 'GET', null, false);
        return result;
    },

    async listarMeus() {
        return await apiCall('/lances/usuario/meus-lances', 'GET', null, true);
    },

    // Função auxiliar para validar lance
    async validarLance(itemId, valor) {
        try {
            const maiorLance = await this.obterMaiorLance(itemId);
            const minimo = maiorLance.priceFloor || 0;
            
            const min = parseFloat(minimo) || 0;
            if (valor <= min) {
                throw new Error(`O lance deve ser maior que R$ ${min.toFixed(2)}`);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
};

export default LancesAPI;
