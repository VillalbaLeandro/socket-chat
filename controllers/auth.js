const { response, json } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req, res = response) => {

    const { _id, ...resto } = req.body
    const { correo, password } = resto

    try {
        // Verificar si el usuario existe 
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario no esta registrado'
            })
        }
        // El usuario esta activo? 
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario se encuentra deshabilitado'
            })
        }

        // Verificar contraseña 
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario o contraseña incorrectos'
            })
        }

        // Generar JWT 
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.json({
            msg: 'Hable con el administrador'
        })
    }

}


const googeSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ';P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }
            usuario = new Usuario(data)
            await usuario.save()
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }


        // Generar JWT 
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

const renovarToken = async (req, res = response) => {
    const { usuario } = req;

    // Generar JWT 
    const token = await generarJWT(usuario.id);
    
    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googeSignIn,
    renovarToken
}