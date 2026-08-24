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

const router = Router();

router.get("/", listarReadings);
router.post("/", crearReadingValidator, validarCampos, crearReading);
router.get("/:id", idValidator, validarCampos, obtenerReading);
router.put("/:id", idValidator, actualizarReadingValidator, validarCampos, actualizarReading);
router.delete("/:id", idValidator, validarCampos, eliminarReading);

export default router;