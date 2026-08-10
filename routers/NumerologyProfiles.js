import { Router } from "express";
import { actualizarNumerologyProfile, crearNumerologyProfile, eliminarNumerologyProfile, listarNumerologyProfiles, obtenerNumerologyProfile } from "../controllers/NumerologyProfiles.js";
const router = Router();
router.post("/", crearNumerologyProfile);
router.get("/:id", obtenerNumerologyProfile);
router.get("/", listarNumerologyProfiles);
router.put("/:id", actualizarNumerologyProfile);
router.delete("/:id", eliminarNumerologyProfile);
export default router;