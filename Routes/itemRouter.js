import express from 'express';
import itemController from '../controllers/itemController.js';
const router = express.Router();

router.get('/', itemController.listar);
router.get('/:id', itemController.buscarPorId);
router.post('/', itemController.criar);
router.put('/:id', itemController.atualizar);
router.delete('/:id', itemController.apagar);

export default router;