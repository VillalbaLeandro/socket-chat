
const fs = require('fs')
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require("../models");
const cargarArchivos = async (req, res = response) => {

    try {

        const nombre = await subirArchivo(req.files, undefined, 'imgs')
        res.json({
            msg: 'Archivo cargado con éxito',
            nombre
        })
    } catch (error) {
        res.status(400).json({ msg: error })
    }
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imagenes 
    if (modelo.img) {
        // hay que borrar la imagen del servidor 
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
    }


    try {
        const nombre = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = nombre
        await modelo.save()
        return res.json({
            msg: 'Archivo actualizado con éxito',
            modelo
        })
    } catch (error) {
        res.status(400).json({ msg: error })
    }
}

const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imagenes 
    if (modelo.img) {
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id, extension] = nombre.split('.');
        cloudinary.uploader.destroy( public_id)
    }
    const { tempFilePath } = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url
    await modelo.save()
    return res.json(modelo)
    
}

const mostrarImagenes = async (req, res) => {
    const pathNoImage = path.join(__dirname, '../assets/no-image.jpg')

    const { id, coleccion } = req.params

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imagenes 
    if (modelo.img) {
        // hay que borrar la imagen del servidor 
        const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImage)) {
            return res.sendfile(pathImage)
        }
    }

    res.sendfile(pathNoImage)
    // res.json({msg: 'falta placeholder'})
}

module.exports = {
    cargarArchivos,
    // actualizarImagen,
    mostrarImagenes,
    actualizarImagenCloudinary
}