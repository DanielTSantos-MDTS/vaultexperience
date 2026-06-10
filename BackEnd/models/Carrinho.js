import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import User from './User.js';
import Iten from './Iten.js';

const carrinhoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    itens: [{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Iten',
            required: true
        },
        quantidade: {
            type: Number,
            default: 1,
            min: 1
        },
        precoUnitario: {
            type: Number,
            required: true,
            set: v => Math.round(v * 100),
            get: v => (v / 100).toFixed(2)
        },
        adicionadoEm: {
            type: Date,
            default: Date.now
        }
    }],
    dataCriacao: {
        type: Date,
        default: Date.now
    },
    dataAtualizado: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true
});

const Carrinho = model('Carrinho', carrinhoSchema);
export default Carrinho;
