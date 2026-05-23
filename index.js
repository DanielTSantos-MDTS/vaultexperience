import mongoose from "mongoose";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();

import Reputacao from './models/Reputacao.js';
import reputacaoRouter from './Routes/reputacaoRouter.js';
import avaliacaoRouter from './Routes/avaliacaoRouter.js';
import userRouter from './Routes/userRouter.js';
import itemRouter from './Routes/itemRouter.js';
import categoriaRouter from './Routes/categoriaRouter.js'

const app = express();
const port = 3000;

app.use(express.json());
app.use('/reputacao', reputacaoRouter);
app.use('/avaliacao', avaliacaoRouter);
app.use('/usuarios', userRouter);
app.use('/item', itemRouter);
app.use('/categoria', categoriaRouter);

const db = process.env.DATABASE_URL;
async function criarReputacoes() {
    const quantidade = await Reputacao.countDocuments();

    if(quantidade === 0){
        await Reputacao.create([
            { label: 'Iniciante' },
            { label: 'Confiável' },
            { label: 'Mestre' }
        ])
        console.log('Níveis de reputação criados!');
    } else{
        console.log('Níveis de reputação já existem');
    }
}
async function conectarMongoDB() {
    try{
        await mongoose.connect(db);
        console.log('Banco de dados conectado!');
        await criarReputacoes();
    } catch (error){
        console.log('Erro: ', error);
    }
}


app.get('/', (req, res) => {
    res.send("Hello World...");
})
app.get('/db', async (req, res) => {
    try{
        const reputacao = await Reputacao.find();
        if (reputacao.length > 0){
            res.json(reputacao);
        } else{
            res.send("Sucesso em procurar no Documents reputacao, mas está vazio");
        }
    } catch (error){
        res.send('Erro: ', error);
    }
})

conectarMongoDB();

app.listen(port, () =>{
    console.log(`Servidor rodando na porta localhost:${port}`);
});