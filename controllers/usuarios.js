const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const usuariosGet = async (req = request, res = response) => {
    // Paginación 
    const query = { estado: true }
    const { limite = 5, desde = 0 } = req.query

    const [usuarios, usuariosActivos, totalRegistros] = await Promise.all([
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
        Usuario.countDocuments(query),
        Usuario.countDocuments()
    ])

    const totalMostrados = usuarios.length

    res.json({
        totalRegistros,
        usuariosActivos,
        totalMostrados,
        usuarios
    })
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const usuariosPost = async (req, res) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); //Numero de vueltas, por defecto 10
    usuario.password = bcryptjs.hashSync(password, salt) //se llama a password que es la propiedad que esta en el Modelo Usuario. 
    // Guardar en BD
    await usuario.save();
    res.json({
        usuario,
        msg: 'Usuario creado con éxito'
    })
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------
const usuariosPut = async (req, res) => {
    const id = req.params.id;
    //excluimos los atributos que no queremos operar
    const { _id, password, google, ...resto } = req.body

    if (!id) {
        return res.status(401).json({
            msg: 'El id no existe'
        })
    }
    //Validar contra base de datos
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); //Numero de vueltas, por defecto 10
        resto.password = bcryptjs.hashSync(password, salt) //se llama a password que es la propiedad que esta en el Modelo Usuario. 
    }
    // busca y actualiza el usuario por su id(1er parametro) con lo que le llega del rest operator
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })

    // retornamos los datos seleccionados al usuario 
    res.json({
        usuario,
        msg: 'Usuario actualizado con éxito'
    })
}

/// -----------------------------------------------------------------------------------------------------------------------------------------------------------

const usuariosDelete = async (req, res) => {
    const { id } = req.params;

    // const usuario = await Usuario.findByIdAndDelete(id);
    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json({
        usuario,
        msg: 'Usuario deshabilitado con éxito'
    }) 
}

/// -----------------------------------------------------------------------------------------------------------------------------------------------------------

const usuariosHabilitar = async (req, res) => {
    const { id } = req.params;

    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: true }, { new: true })
    res.json({
        usuario,
        msg: 'Usuario habilitado con éxito'
    }) 
}

/// -----------------------------------------------------------------------------------------------------------------------------------------------------------

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'Patch API'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
    usuariosHabilitar
}