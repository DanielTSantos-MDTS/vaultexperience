import express from 'express';
import lanceController from '../controllers/lanceController.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = express.Router();

// Fazer um lance (requer autenticação)
router.post('/', verificarToken.autorizar, lanceController.fazerLance);

// Listar lances do usuário atual (requer autenticação) — antes de /:itemId
router.get('/usuario/meus-lances', verificarToken.autorizar, lanceController.listarMeusLances);

// Obter maior lance de um item
router.get('/:itemId/maior', lanceController.obterMaiorLance);

// Listar lances de um item
router.get('/:itemId', lanceController.listarLances);

export default router;
