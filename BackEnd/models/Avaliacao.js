import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import User from './User.js';
import Reputacao from './Reputacao.js'
import Venda from './Venda.js';

const avaliacaoSchema = new Schema ({
    avaliador:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendaAvaliada: {
        type: Schema.Types.ObjectId,
        ref: 'Venda',
        required: true
    },
    vendedorAvaliado:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estrelas: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        required: true
    },
    avaliacao: {
        type: String,
        required: true
    },
    foto: [{type: String}]
})

avaliacaoSchema.post('save', async function(doc) {
    
    const vendedor = await User.findById(doc.vendedorAvaliado);
    
    const quantidadeAntiga = vendedor.quantidadeAvaliacoes;

    vendedor.quantidadeAvaliacoes = vendedor.quantidadeAvaliacoes + 1;
    
    const calculoNota = ((vendedor.notaAtual * quantidadeAntiga) + doc.estrelas) / vendedor.quantidadeAvaliacoes;

    vendedor.notaAtual = Math.max(0, Math.min(calculoNota, 5));

    let reputacaoAtual;

    if (vendedor.notaAtual >= 4.5){
        reputacaoAtual = await Reputacao.findOne({ label: 'Mestre'});
    } else if (vendedor.notaAtual >= 2.5){
        reputacaoAtual = await Reputacao.findOne({label: 'Confiável'});
    } else {
        reputacaoAtual = await Reputacao.findOne({label: 'Iniciante'});
    }
    
    if (reputacaoAtual){
        vendedor.reputacao = reputacaoAtual;
    }
    await vendedor.save();
});

const Avaliacao = model('Avaliacao', avaliacaoSchema);
export default Avaliacao;