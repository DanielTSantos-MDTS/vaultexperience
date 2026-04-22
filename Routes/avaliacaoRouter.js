import express from 'express';
import avaliacaoController from "../controllers/avaliacaoController.js";
const router = express.Router();

router.get('/', avaliacaoController.listar);
router.get('/:id', avaliacaoController.acharUm);
router.post('/', avaliacaoController.adicionar);
router.put('/:id', avaliacaoController.atualizar);
router.delete('/:id', avaliacaoController.apagar);

export default router;