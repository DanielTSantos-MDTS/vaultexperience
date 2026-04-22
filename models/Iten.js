import mongoose from "mongoose";
const { Schema, model } = mongoose;

import User from "./User.js"
import Categoria from "./Categoria.js";
import Estado from "./Estado.js";

const itemSchema = new Schema ({
    nome: {
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    valor: {
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
        type: Schema.Types.ObjectId,
        ref: 'Estado',
        required: true
    },
    imagens: [{type: String}],
    dono:{
        type: Schema.Types.ObjectId,
        ref: 'User',
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

const Item = model('Item', itemSchema);
export default Item;