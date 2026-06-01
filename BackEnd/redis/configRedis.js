import { createClient } from 'redis';

const redisClient = createClient({url: 'redis://localhost:6379'});

redisClient.on('error', (error) => console.log('Erro ao conectar com o redis. Erro: ', error));
redisClient.on('connect', (connect) => console.log('Redis conectado com sucesso!'));
await redisClient.connect();

export default redisClient;