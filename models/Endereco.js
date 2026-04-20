import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const enderecoSchema = new Schema({
    cep: {
        type: String,
        required: true
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
        require: true
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

const Endereco = model('Endereco', enderecoSchema);
export default Endereco;