const { response, json } = require('express')
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req, res = response, next) => {
    const token = req.header('x-token');

    // Verificar si existe 

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion realizada'
        })
    }

    // Verificar si es valido 
    try {
        const { uid } = jwt.verify(token, process.env.SECRET_KEY) //Si esta instruccion da error lanza un throw error! 


        const usuario = await Usuario.findById(uid)

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario inexistente'
            })
        }

        //Verificar el estado del usuario 
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'El usuario se encuentra deshabilitado'
            })
        }
        req.usuario = usuario;

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

}

module.exports = {
    validarJWT
}