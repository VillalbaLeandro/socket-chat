const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, adminRole } = require('../middlewares');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeCategoriaPorNombre, existeProductoPorId, existeProductoPorNombre } = require('../helpers/db-validators');
const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerProductos)

// obtener una categoria por id - publico 
router.get('/:id', [
    check('id')
        .isMongoId()
        .withMessage('El id ingresado no es valido')
        .custom(existeProductoPorId),
    validarCampos
],
    obtenerProducto)

// Crear una nueva categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es requerido')
        .notEmpty()
        .isString()
        .withMessage('El nombre debe ser de tipo string')
        .isLength({ max: 50 })
        .withMessage('El nombre no puede tener más de 50 caracteres'),
    check('precio', 'El precio debe ser de tipo númerico')
        .isNumeric()
        .optional(),
    check('categoria', 'La categoria es requerida')
        .notEmpty()
        .isMongoId()
        .withMessage('El id  de la categoria ingresada no es valido'),
    check('descripcion')
        .isString()
        .withMessage('La descripción debe ser de tipo String')
        .isLength({ max: 200 })
        .withMessage('El nombre no puede tener más de 200 caracteres')
        .optional(),
    check('disponible')
        .isBoolean()
        .withMessage('El campo disponible debe ser de tipo Booleano')
        .optional(),
    validarCampos
],
    crearProducto)

// Atualizar un registro por id - privado - cualquiera con un token valido
router.put('/:id', [
    validarJWT,
    check('id')
        .isMongoId()
        .withMessage('El id ingresado no es valido')
        .custom(existeProductoPorId)
        .withMessage('El id ingresado  no existe'),
    check('nombre', 'El nombre es requerido')
        .isString()
        .withMessage('El nombre debe ser de tipo string')
        .isLength({ max: 50 })
        .withMessage('El nombre no puede tener más de 50 caracteres')
        .optional(),
    check('precio', 'El precio debe ser de tipo númerico')
        .isNumeric()
        .optional(),
    check('categoria', 'La categoria es requerida')
        .notEmpty()
        .isMongoId()
        .withMessage('El id de la categoria ingresada no es valido')
        .optional(),
    check('descripcion')
        .isString()
        .withMessage('La descripción debe ser de tipo String')
        .isLength({ max: 200 })
        .withMessage('El nombre no puede tener más de 200 caracteres')
        .optional(),
    check('disponible')
        .isBoolean()
        .withMessage('El campo disponible debe ser de tipo Booleano')
        .optional(),
    validarCampos
],
    actualizarProducto)

// delete o borrar una categoria - privado - admin
router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id')
        .isMongoId()
        .withMessage('El id ingresado no es valido')
        .custom(existeProductoPorId)
        .withMessage('El id ingresado  no existe'),
    validarCampos
],
    borrarProducto)

module.exports = router;