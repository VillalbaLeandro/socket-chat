const { Categoria, Producto } = require('../models')
const Role = require('../models/rol')
const Usuario = require('../models/usuario')

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
        throw new Error(`El rol ${rol} indicado no es valido`)
    }
}
const mailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo })
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya esta registrado`)
    }
}
const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id ingresado no existe`)
    }
}
const existeCategoriaPorId = async (id) => {
    const existeCategoria = await Categoria.findById(id)
    if (!existeCategoria) {
        throw new Error(`El id ingresado no existe`)
    }
}
const existeCategoriaPorNombre = async(nombre) => {
    const categoriaDB = await Categoria.findOne({ nombre })
    if (categoriaDB) {
        throw new Error(`La categoria ingresada ya existe`)
    }
}
const existeProductoPorNombre = async(nombre) => {
    const prodcutoDB = await Producto.findOne({ nombre })
    if (prodcutoDB) {
        throw new Error(`El producto ingresada ya existe`)
    }
}
const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`El id ingresado no existe`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = [])=> {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error (`La coleccion ${coleccion} no es permitida - colecciones permitidas = ${colecciones}`)
    }
    return true;
}
module.exports = {
    esRolValido,
    mailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeCategoriaPorNombre,
    existeProductoPorId,
    existeProductoPorNombre,
    coleccionesPermitidas
}