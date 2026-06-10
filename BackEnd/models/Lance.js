import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import User from './User.js';
import Iten from './Iten.js';

const lanceSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Iten',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    valor: {
        type: Number,
        required: true,
        set: v => Math.round(v * 100),
        get: v => (v / 100).toFixed(2)
    },
    dataLance: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true
});

// Índice para melhorar performance em buscas
lanceSchema.index({ item: 1, dataLance: -1 });

const Lance = model('Lance', lanceSchema);
export default Lance;
