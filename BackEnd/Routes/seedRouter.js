import express from 'express';
import seedController from '../controllers/seedController.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = express.Router();

router.get('/', seedController.status);
// Opcional: se enviar Authorization, o item fica no usuário logado
router.post('/catalogo', verificarToken.autorizarOpcional, seedController.popularCatalogo);
router.delete('/itens-teste', seedController.limparItensTeste);

export default router;
