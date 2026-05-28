import express from 'express';
import categoriaController from '../controllers/categoriaController.js';
const router = express.Router();

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.buscarPorId);
router.post('/', categoriaController.criar);
router.put('/:id', categoriaController.atualizar);
router.delete('/:id', categoriaController.apagar);

export default router;