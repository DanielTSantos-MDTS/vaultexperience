import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const estadoSchema = new Schema ({
    label: {
        type: String,
        required: true
    },
    descricao: String,
    ordem: Number
});

const Estado = model('Estado', estadoSchema);
export default Estado;