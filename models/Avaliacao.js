import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import User from './User';
import Reputacao from './Reputacao'
import Venda from './Venda';

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
    
    vendedor.notaAtual = ((vendedor.notaAtual * quantidadeAntiga) + doc.estrelas) / vendedor.quantidadeAvaliacoes;

    await vendedor.save();
});

const Avaliacao = model('Avaliacao', avaliacaoSchema);
export default Avaliacao;