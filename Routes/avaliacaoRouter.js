import express from 'express';
import avaliacaoController from "../controllers/avaliacaoController.js";
const router = express.Router();

router.get('/', avaliacaoController.listar);
router.get('/:id', avaliacaoController.buscarPorId);
router.post('/', avaliacaoController.criar);
router.put('/:id', avaliacaoController.atualizar);
router.delete('/:id', avaliacaoController.apagar);

export default router;