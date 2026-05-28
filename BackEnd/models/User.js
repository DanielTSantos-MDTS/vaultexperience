import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const { Schema, model } = mongoose;
const saltRounds = 10;

import enderecoSchema from './Endereco.js'
import Reputacao from './Reputacao.js'

const userSchema = new Schema({
    nome:{
        type: String,
        required: true
    },
    sobrenome:{
        type: String,
        required: true
    },
    dataNascimento: {
        type: Date,
        required: true
    },
    contatoPrincipal: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    // endereco: {
    //     type: enderecoSchema,
    //     required: true
    // },
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

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, saltRounds);

    this.password = hash;
})

const User = model('User', userSchema);
export default User;