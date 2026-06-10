import express from 'express';
import favoritoController from '../controllers/favoritoController.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = express.Router();

// Rotas protegidas (requerem autenticação)
router.get('/', verificarToken.autorizar, favoritoController.listarFavoritos);
router.post('/', verificarToken.autorizar, favoritoController.adicionarFavorito);
router.delete('/:itemId', verificarToken.autorizar, favoritoController.removerFavorito);
router.get('/verificar/:itemId', verificarToken.autorizar, favoritoController.verificarFavorito);

export default router;
