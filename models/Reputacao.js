import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater'
mongoose.plugin(slug);

const { Schema, model } = mongoose;

const reputacaoSchema = new Schema ({
    label: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: 'label',
        lowercase: true,
        unique: true
    }
})

const Reputacao = model('Reputacao', reputacaoSchema);
export default Reputacao;
