import express from 'express';
import userController from '../controllers/userController.js';
import verificarToken from '../middlewares/verificarToken.js';
const router = express.Router();

router.get('/', userController.listar);
router.get('/:id', userController.buscarPorId);
router.post('/registrar', userController.criar);
router.put('/:id', verificarToken.autorizar, userController.atualizar);
router.delete('/:id',verificarToken.autorizar, userController.apagar);

export default router