import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import Iten from "./Iten";
import User from "./User";

const trocaSchema = new Schema ({
    ofertante: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destinatario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemOfertado: {
        type: Schema.Types.ObjectId,
        ref: 'Iten',
        required: true
    },
    itemDesejado: {
        type: Schema.Types.ObjectId,
        ref: 'Iten',
        required: true
    },
    status: {
        type: String,
        enum: ['Pendente', 'Aceita', 'Recusada', 'Cancelada', 'Concluída'],
        default: 'Pendente',
        required: true
    },
    dataPedido: {
        type: Date,
        default: Date.now
    },
    dataConclusao: Date
});

const Troca = model('Troca', trocaSchema);
export default Troca;