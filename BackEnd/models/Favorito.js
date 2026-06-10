import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const favoritoSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Iten',
        required: true
    },
    dataAdicionado: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índice único para evitar duplicatas
favoritoSchema.index({ usuario: 1, item: 1 }, { unique: true });

const Favorito = model('Favorito', favoritoSchema);
export default Favorito;
