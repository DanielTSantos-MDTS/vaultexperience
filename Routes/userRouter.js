import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

router.get('/', userController.listar);
router.get('/:id', userController.buscarPorId);
router.post('/', userController.criar);
router.put('/:id', userController.atualizar);
router.delete('/:id', userController.apagar);

export default router