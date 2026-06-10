import express from 'express';
import vendaCotroller from "../controllers/vendaController.js";
import verificarToken from '../middlewares/verificarToken.js';
const router = express.Router();

router.get("/", vendaCotroller.listar);
router.post("/comprar", verificarToken.autorizar, vendaCotroller.criarCompra);
router.get("/usuario/compras", verificarToken.autorizar, vendaCotroller.listarCompras);
router.get("/usuario/vendas", verificarToken.autorizar, vendaCotroller.listarVendasUsuario);
router.get("/:id", vendaCotroller.buscarPorId);
router.post("/", vendaCotroller.criar);
router.put("/:id", vendaCotroller.atualizar);
router.delete("/:id", vendaCotroller.apagar);

export default router;