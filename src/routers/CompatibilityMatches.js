import { Router } from "express";
import { 
  crearCompatibilityMatch, 
  listarCompatibilityMatches, 
  obtenerCompatibilityMatch, 
  actualizarCompatibilityMatch, 
  eliminarCompatibilityMatch 
} from "../controllers/CompatibilityMatches.js";
import { 
  crearCompatibilityMatchValidator, 
  actualizarCompatibilityMatchValidator, 
  idValidator 
} from "../validators/CompatibilityMatches.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.get("/", listarCompatibilityMatches);
router.post("/", crearCompatibilityMatchValidator, validarCampos, crearCompatibilityMatch);
router.get("/:id", idValidator, validarCampos, obtenerCompatibilityMatch);
router.put("/:id", idValidator, actualizarCompatibilityMatchValidator, validarCampos, actualizarCompatibilityMatch);
router.delete("/:id", idValidator, validarCampos, eliminarCompatibilityMatch);

export default router;