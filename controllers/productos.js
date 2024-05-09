const { response } = require("express")
const { Producto } = require('../models');

const obtenerProductos = async (req, res = response) => {
    const query = { estado: true }
    const { limite = 5, desde = 0 } = req.query
    const [productos, productosActivas, productosTotal] = await Promise.all([
        Producto.find(query)
            .populate('categoria', {
                nombre: 1,
            })
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite)),
        Producto.countDocuments(query),
        Producto.countDocuments()
    ])
    const totalMostrados = productos.length

    res.json({
        productosActivas,
        productosTotal,
        totalMostrados,
        productos
    })
}

const obtenerProducto = async (req, res = response) => {
    const { id } = req.params
    const prodcutoDB = await Producto.findById(id)
        .populate('categoria', {
            nombre: 1,
        })
        .populate('usuario', 'nombre');

    if (!prodcutoDB) {
        res.status(401).json({
            msg: 'El id ingresado no corresponde a ningun producto'
        })
    }

    res.json({
        prodcutoDB
    })
}

const crearProducto = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body
    const nombre = req.body.nombre.toUpperCase();
    const productoDB = await Producto.findOne({ nombre })

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }

    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id,
    }

    const producto = new Producto(data)
    await producto.save()

    res.status(201).json({
        producto,
        msg: 'Producto creado con éxito'
    })
}

const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

    res.json({
        producto,
        msg: 'Producto actualizado con éxito'
    })
}

const borrarProducto = async (req, res = response) => {
    const id = req.params.id
    const prodcutoDB = await Producto.findById(id)
    if (!prodcutoDB.estado) {
        res.json({
            msg: `La productos ${prodcutoDB.nombre} ya se encuentra deshabilitada`
        })
    }
    const productos = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
        .populate('categoria', {
            nombre: 1,
        })
        .populate('usuario', {
            nombre: 1
        });

    res.json({
        productos,
        msg: 'Producto deshabilitado con éxito'
    })
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}