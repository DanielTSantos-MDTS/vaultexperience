import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const enderecoSchema = new Schema({
    cep: {
        type: String,
        required: true,
        match: [/^\d{5}-\d{3}$/, 'Formato de CEP inválido! Use 00000-000.']
    },
    logradouro: {
        type: String,
        required: true,
        trim: true
    },
    bairro: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    complemento: {
        type: String,
        trim: true
    },
    cidade: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        required: true,
        uppercase: true,
        minlength: 2,
        maxlength: 2
    }
}, {
    _id: false
});

export default enderecoSchema;