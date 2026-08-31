import { Router } from "express";
import { 
  crearReading, 
  listarReadings, 
  obtenerReading, 
  actualizarReading, 
  eliminarReading 
} from "../controllers/Readings.js";
import { 
  crearReadingValidator, 
  actualizarReadingValidator, 
  idValidator 
} from "../validators/Readings.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarJWT } from "../middlewares/Webtoken.js";

const router = Router();

router.get("/", listarReadings);
router.get("/:id", idValidator, validarCampos, obtenerReading);

router.post("/", validarJWT, crearReadingValidator, validarCampos, crearReading);
router.put("/:id", validarJWT, idValidator, actualizarReadingValidator, validarCampos, actualizarReading);
router.delete("/:id", validarJWT, idValidator, validarCampos, eliminarReading);

export default router;
