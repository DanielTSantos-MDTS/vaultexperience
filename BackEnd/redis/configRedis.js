import { createClient } from 'redis';

const redisClient = createClient({ url: 'redis://localhost:6379' });

redisClient.on('error', (error) => console.log('Erro ao conectar com o redis. Erro: ', error));
redisClient.on('connect', () => console.log('Redis conectado com sucesso!'));

// Tenta conectar mas não derruba o servidor se falhar
try {
    await redisClient.connect();
} catch (error) {
    console.log('⚠️  Redis não disponível — cache desativado. O filtro por categoria funcionará direto do MongoDB.');
}

export default redisClient;
