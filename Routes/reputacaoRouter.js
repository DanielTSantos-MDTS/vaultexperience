import express from 'express';
import reputacaoController from '../controllers/reputacaoController.js';
const router = express.Router();

router.get('/', reputacaoController.listar);
router.get('/:id', reputacaoController.buscarPorId);
router.post('/', reputacaoController.criar);
router.put('/:id', reputacaoController.atualizar);
router.delete('/:id', reputacaoController.apagar);

export default router;