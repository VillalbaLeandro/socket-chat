const { Schema, model } = require('mongoose')


const ProductoSchema = Schema({
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
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String,
        default: 'Sin descripción'
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: {type: String}
})

ProductoSchema.methods.toJSON = function () {
    // Desestructura el objeto this (el objeto de usuario actual)
    const { __v, ...data } = this.toObject();
    // Retorna un nuevo objeto JSON que excluye los campos __v 
    return data;
}

module.exports = model('Producto', ProductoSchema)
