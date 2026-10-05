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

// Una sola ruta GET /:id con la traza al inicio
router.get("/:id", (req, res, next) => {
  console.log("llegué a RUTA: GET /readings/:id");
  next();
}, idValidator, validarCampos, obtenerReading);

router.post("/", validarJWT, crearReadingValidator, validarCampos, crearReading);
router.put("/:id", validarJWT, idValidator, actualizarReadingValidator, validarCampos, actualizarReading);
router.delete("/:id", validarJWT, idValidator, validarCampos, eliminarReading);

export default router;