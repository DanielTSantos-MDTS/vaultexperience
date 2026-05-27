import express from 'express';
import itemController from '../controllers/itemController.js';
import verificarToken from '../middlewares/verificarToken.js';
const router = express.Router();

router.get('/', itemController.listar);
router.get('/:id', itemController.buscarPorId);
router.post('/anunciar', verificarToken.autorizar ,itemController.criar);
router.put('/:id', verificarToken.autorizar, itemController.atualizar);
router.delete('/:id', verificarToken.autorizar, itemController.apagar);

export default router;