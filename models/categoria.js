const { Schema, model } = require('mongoose')


const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: [true, 'el estado es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

CategoriaSchema.methods.toJSON = function () {
    // Desestructura el objeto this (el objeto de usuario actual)
    const { __v, _id, ...data } = this.toObject();
    data.uid = _id;
    // Retorna un nuevo objeto JSON que excluye los campos __v y _id
    return data;
}

module.exports = model('Categoria', CategoriaSchema)
