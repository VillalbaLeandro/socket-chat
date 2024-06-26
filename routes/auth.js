const { Router } = require('express');
const { check } = require('express-validator');
const { login, googeSignIn, renovarToken } = require('../controllers/auth');
const { validarCampos, validarJWT } = require('../middlewares');
const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],   login )

router.post('/google',[
    check('id_token', 'El id token es necesario').notEmpty(),
    validarCampos
], googeSignIn )

router.get('/', validarJWT , renovarToken)

module.exports = router;
