import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import enderecoSchema from './Endereco.js'
import Reputacao from './Reputacao.js'

const userSchema = new Schema({
    usuario:{
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: Date,
        required: true
    },
    endereco: {
        type: enderecoSchema,
        required: true
    },
    notaAtual:{
        type: Number,
        default: 0
    },
    quantidadeAvaliacoes: {
        type: Number,
        default: 0
    },
    reputacao: {
        type: Schema.Types.ObjectId,
        ref: 'Reputacao'
    },
    dataCriação:{
        type: Date,
        default: Date.now
    }
});

const User = model('User', userSchema);
export default User;