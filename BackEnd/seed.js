/**
 * seed.js — Vault Experience
 * 
 * Script que popula o banco com as categorias necessárias.
 * Execute UMA VEZ após configurar o .env:
 *   node seed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Categoria from './models/Categoria.js';

dotenv.config();

const CATEGORIAS = [
  { nome: 'consoles' },
  { nome: 'jogos' },
  { nome: 'livros' },
  { nome: 'figures' },
  { nome: 'assinaturas' },
  { nome: 'acessorios' },
  { nome: 'softwares' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ MongoDB conectado!');

    const existentes = await Categoria.countDocuments();
    if (existentes > 0) {
      console.log(`ℹ️  Já existem ${existentes} categoria(s) no banco. Nada foi alterado.`);
      console.log('   Se quiser recriar, apague as categorias no MongoDB Atlas primeiro.');
      await mongoose.disconnect();
      return;
    }

    await Categoria.insertMany(CATEGORIAS);
    console.log('🎉 Categorias criadas com sucesso:');
    CATEGORIAS.forEach(c => console.log(`   - ${c.nome}`));
  } catch (error) {
    console.error('❌ Erro ao rodar o seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Conexão encerrada.');
  }
}

seed();
