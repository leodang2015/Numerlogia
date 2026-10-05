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
import { validarJWT } from "../middlewares/Webtoken.js";

const router = Router();

router.get("/", listarCompatibilityMatches);

// Una sola ruta GET /:id con la traza al inicio
router.get("/:id", (req, res, next) => {
  console.log("llegué a RUTA: GET /compatibility-matches/:id");
  next();
}, idValidator, validarCampos, obtenerCompatibilityMatch);

router.post("/", validarJWT, crearCompatibilityMatchValidator, validarCampos, crearCompatibilityMatch);
router.put("/:id", validarJWT, idValidator, actualizarCompatibilityMatchValidator, validarCampos, actualizarCompatibilityMatch);
router.delete("/:id", validarJWT, idValidator, validarCampos, eliminarCompatibilityMatch);

export default router;