import express from "express";
import trocaController from "../controllers/trocaController.js";
const router = express.Router();

router.get("/", trocaController.listar);
router.get("/:id", trocaController.buscarPorId);
router.post("/", trocaController.criar);
router.put("/:id", trocaController.atualizar); // corrigido: era buscarPorId
router.delete("/:id", trocaController.apagar);

export default router;
