import mongoose from "mongoose";
const { Schema, model } = mongoose;

import User from "./User.js"
import Categoria from "./Categoria.js";
import enderecoSchema from "./Endereco.js";

const itemSchema = new Schema ({
    nome: {
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    precoOriginal: {
        type: Number,
        required: true,
        set: v => Math.round(v * 100),
        get: v => (v / 100).toFixed(2)
    },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true
    },
    estado:{
        type: String,
        enum: ['Novo', 'Seminovo', 'Usado'],
        required: true
    },
    franquia:{
        type: String
    },
    imagens: [{type: String}],
    dono:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    especificacoes: [{
        chave: String, 
        valor: String
    }],
    estoque: {
        type: Number,
        default: 1,
        required: true
    },
    troca:{
        type: Boolean,
        default: false,
        required: true
    },
    negociacao:{
        type: Boolean,
        default: false,
        required: true
    },
    dataPostagem: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true }
});

const Item = model('Iten', itemSchema);
export default Item;