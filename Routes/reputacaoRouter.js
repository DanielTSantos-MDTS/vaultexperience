import express from 'express';
import reputacaoController from '../controllers/reputacaoController.js';
const router = express.Router();

router.post('/', reputacaoController.adicionar);
router.get('/', reputacaoController.listar);
router.get('/:id', reputacaoController.listarUm);
router.put('/:id', reputacaoController.atualizar);
router.delete('/:id', reputacaoController.deletar);

export default router;