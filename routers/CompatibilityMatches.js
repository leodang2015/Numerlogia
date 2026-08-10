import { Router } from "express";
import { actualizarCompatibilityMatch, crearCompatibilityMatch, eliminarCompatibilityMatch, listarCompatibilityMatches, obtenerCompatibilityMatch } from "../controllers/CompatibilityMatches.js";

const router = Router();
router.post("/", crearCompatibilityMatch);
router.get("/", listarCompatibilityMatches);
router.get("/:id", obtenerCompatibilityMatch);
router.put("/:id", actualizarCompatibilityMatch);
router.delete("/:id", eliminarCompatibilityMatch);
export default router;