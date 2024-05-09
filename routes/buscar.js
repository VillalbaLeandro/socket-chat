const {Router} = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

router.get('/:coleccion/:termino', buscar)
// router.get('/:termino', buscarEnTodasLasColecciones);
module.exports = router; 