const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
    'productosPorCategoria'
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)
    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })
    const countResults = await Usuario.countDocuments({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        countResults,
        results: usuarios
    });
}
const buscarProductosPorCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)
    if (esMongoID) {
        const productos = await Producto.find(
            { categoria: termino }).populate('categoria', 'nombre')
        return res.json({
            results: (productos) ? [productos] : []
        });
    }
}
const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino)
    if (esMongoID) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre')
    const countResults = await Producto.countDocuments({
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    })

    res.json({
        countResults,
        results: productos
    });
}

// const buscarEnTodasLasColecciones = async (termino = '', res = response) => {
//     const regex = new RegExp(termino, 'i');
//     const resultados = [];

//     // Buscar en la colección de usuarios
//     const usuarios = await Usuario.find({
//         $or: [{ nombre: regex }, { correo: regex }],
//         $and: [{ estado: true }]
//     });
//     resultados.push(...usuarios);

//     // Buscar en la colección de categorías
//     const categorias = await Categoria.find({
//         nombre: regex,
//         estado: true
//     });
//     resultados.push(...categorias);

//     // Buscar en la colección de productos
//     const productos = await Producto.find({
//         $or: [{ nombre: regex }, { descripcion: regex }],
//         $and: [{ estado: true }]
//     });
//     resultados.push(...productos);

//     // Combinar los resultados en una sola respuesta
//     res.json({
//         countResults: resultados.length,
//         results: resultados
//     });
// };


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            return buscarUsuarios(termino, res)
            break;
        case 'categorias':
            return buscarCategorias(termino, res)
            break;
        case 'productos':
            return buscarProductos(termino, res)
            break;
        case 'productosPorCategoria':
            return buscarProductosPorCategorias(termino, res)
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
            break;
    }

}

module.exports = {
    buscar
}