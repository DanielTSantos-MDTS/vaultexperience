// api.js - Configurações gerais da API

const API_BASE = 'http://localhost:3000';

const TOKEN_KEY = 'vault_token';
const LEGACY_TOKEN_KEY = 'auth_token';

// Obter token do localStorage (unificado com login/register)
function getToken() {
    let token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        const legacy = localStorage.getItem(LEGACY_TOKEN_KEY);
        if (legacy) {
            localStorage.setItem(TOKEN_KEY, legacy);
            localStorage.removeItem(LEGACY_TOKEN_KEY);
            token = legacy;
        }
    }
    return token;
}

// Configurar headers com token
function getHeaders(includeAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };
    if (includeAuth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Função genérica para requisições
async function apiCall(endpoint, method = 'GET', body = null, includeAuth = true) {
    try {
        const options = {
            method,
            headers: getHeaders(includeAuth)
        };

        if (body) options.body = JSON.stringify(body);

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || data.Erro || `Erro ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`Erro na API (${endpoint}):`, error);
        throw error;
    }
}

export { API_BASE, getToken, getHeaders, apiCall };
