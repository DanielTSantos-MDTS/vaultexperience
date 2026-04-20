import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import Endereco from './Endereco'

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
        lowercase: true
    },
    tel: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: Date
    },
    endereco: Endereco,
    notaAtual:{
        type: Number,
        default: 0
    },
    quantidadeAvaliacoes: {
        type: Number,
        default: 0
    }
});

const User = model('User', userSchema);
export default User;