const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, adminRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId, existeCategoriaPorNombre } = require('../helpers/db-validators');
const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerCategorias)

// obtener una categoria por id - publico 
router.get('/:id', [
    check('id')
        .isMongoId()
        .withMessage('El id ingresado no es valido')
        .custom(existeCategoriaPorId)
        .withMessage('El id ingresado  no existe'),
    validarCampos
],
    obtenerCategoria)

// Crear una nueva categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es requerido').notEmpty(),
    validarCampos
],
    crearCategoria)

// Atualizar un registro por id - privado - cualquiera con un token valido
router.put('/:id', [
    validarJWT,
    check('id')
        .isMongoId()
        .withMessage('El id ingresado no es valido')
        .custom(existeCategoriaPorId)
        .withMessage('El id ingresado  no existe'),
    check('nombre', 'El nombre es requerido')
        .notEmpty()
        .custom(existeCategoriaPorNombre)
        .withMessage('La categoria ingresada ya existe'),
    validarCampos
],
    actualizarCategoria)

// delete o borrar una categoria - privado - admin
router.delete('/:id', [
    validarJWT,
    adminRole,
    check('id')
        .isMongoId()
        .withMessage('El id ingresado no es valido')
        .custom(existeCategoriaPorId)
        .withMessage('El id ingresado  no existe'),
    validarCampos
],
    borrarCategoria)

module.exports = router;