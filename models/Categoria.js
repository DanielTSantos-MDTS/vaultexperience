import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categoriaSchema = new Schema ({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    }
})

const Categoria = model('Categoria', categoriaSchema);
export default Categoria;