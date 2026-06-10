import express from 'express';
import carrinhoController from '../controllers/carrinhoController.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = express.Router();

// Rotas protegidas (requerem autenticação)
router.get('/', verificarToken.autorizar, carrinhoController.obterCarrinho);
router.post('/', verificarToken.autorizar, carrinhoController.adicionarAoCarrinho);
router.delete('/', verificarToken.autorizar, carrinhoController.limparCarrinho);
router.delete('/:itemId', verificarToken.autorizar, carrinhoController.removerDoCarrinho);
router.put('/:itemId', verificarToken.autorizar, carrinhoController.atualizarQuantidade);

export default router;
