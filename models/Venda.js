import mongoose from "mongoose";
const { Schema, model } = mongoose;

import User from "./User";
import Iten from "./Iten";

const vendaSchema = new Schema ({
    comprador: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Iten',
        required: true
    },
    status: {
        type: String,
        enum: ['Pendente', 'Em negociação', 'Recusada', 'Aceita', 'Cancelada', 'Concluída'],
        required: true
    },
    valorOfertado: {
        type: Number,
        required: true,
        set: v => Math.round(v * 100),
        get: v => (v / 100).toFixed(2)
    },
    dataOferta: {
        type: Date,
        default: Date.now
    },
    dataConclusao: Date
}, {
    toJSON: { getters: true },
    toObject: { getters: true }
});

const Venda = model('Venda', vendaSchema);
export default Venda;