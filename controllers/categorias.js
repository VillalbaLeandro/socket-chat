const { response } = require("express")
const { Categoria } = require('../models');

// Listo - obtenerCategorias - paginado - total - populate 
// obtenerCategoria - populate {} --> regresa el objeto de la categoria
// actualizarCategoria 
// borrarCategoria - estado : false

const obtenerCategorias = async (req, res = response) => {
    const query = { estado: true }
    const { limite = 5, desde = 0 } = req.query
    const [categorias, categoriasActivas, categoriasTotal] = await Promise.all([
        Categoria.find(query)
            .populate('usuario', {
                nombre: 1,
                correo: 1,
                rol: 1,
            })
            .skip(Number(desde))
            .limit(Number(limite)),
        Categoria.countDocuments(query),
        Categoria.countDocuments()
    ])
    const totalMostrados = categorias.length

    res.json({
        categoriasActivas,
        categoriasTotal,
        totalMostrados,
        categorias
    })
}

const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params
    const categoriaDB = await Categoria.findById(id)
        .populate('usuario', {
            nombre: 1,
            correo: 1,
            rol: 1,
        });

    if (!categoriaDB) {
        res.status(401).json({
            msg: 'El id ingresado no corresponde a ninguna categoria'
        })
    }

    res.json({
        categoriaDB
    })
}

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre })

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data)
    await categoria.save()

    res.status(201).json({
        categoria,
        msg: 'Categoria creada con éxito'
    })
}

const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    //excluimos los atributos que no queremos operar
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre })
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })

    res.json({
        categoria,
        msg: 'Categoría actualizada con éxito'
    })
}

const borrarCategoria = async (req, res = response) => {
    const id = req.params.id
    const categoriaDB = await Categoria.findById(id)
    if (!categoriaDB.estado) {
        res.json({
            msg: `La categoria ${categoriaDB.nombre} ya se encuentra deshabilitada`
        })
    }
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
        .populate('usuario', {
            nombre: 1,
            correo: 1,
            rol: 1,
        });

    res.json({
        categoria,
        msg: 'Categoría deshabilitada con éxito'
    })
}

module.exports = {
    obtenerCategorias,
    crearCategoria,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}