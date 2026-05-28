import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater'
const { Schema, model } = mongoose;

const categoriaSchema = new Schema ({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: 'nome',
        lowercase: true,
        unique: true
    }
})

const Categoria = model('Categoria', categoriaSchema);
export default Categoria;