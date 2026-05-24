import express from 'express';
import vendaCotroller from "../controllers/vendaController.js";
const router = express.Router();

router.get("/", vendaCotroller.listar);
router.get("/:id", vendaCotroller.buscarPorId);
router.post("/", vendaCotroller.criar);
router.put("/:id", vendaCotroller.atualizar);
router.delete("/:id", vendaCotroller.apagar);

export default router;