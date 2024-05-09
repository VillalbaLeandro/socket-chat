const { response } = require("express");
const rolUsuario = require("../utils/roles");

const adminRole = (req, res = response, next)=>{

    if(!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin verificar el token primero'
        })
    }

    const {rol, nombre} = req.usuario

    if(rol !== rolUsuario.admin){
        return res.status(401).json({
            msg: `${nombre} no es administrador - no puede hacer esto`
        })
    }
    next();
}

const tieneRole = (...roles) => {
    return (req, res, next) => {
        console.log(roles);
        if(!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin verificar el token primero'
            })
        }
        if(!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: 'Necesita ser rol Administador o Usuario para realizar esta acción'
            })
        }
        next()
    }
}

module.exports = { 
    adminRole,
    tieneRole
}