import { Router } from "express";
import { 
  crearNumerologyProfile, 
  listarNumerologyProfiles, 
  obtenerNumerologyProfile, 
  actualizarNumerologyProfile, 
  eliminarNumerologyProfile 
} from "../controllers/NumerologyProfiles.js";
import { 
  crearNumerologyProfileValidator, 
  actualizarNumerologyProfileValidator, 
  idValidator 
} from "../validators/NumerologyProfiles.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.get("/", listarNumerologyProfiles);
router.post("/", crearNumerologyProfileValidator, validarCampos, crearNumerologyProfile);
router.get("/:id", idValidator, validarCampos, obtenerNumerologyProfile);
router.put("/:id", idValidator, actualizarNumerologyProfileValidator, validarCampos, actualizarNumerologyProfile);
router.delete("/:id", idValidator, validarCampos, eliminarNumerologyProfile);

export default router;