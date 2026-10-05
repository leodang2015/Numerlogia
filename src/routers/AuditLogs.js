import { Router } from "express";
import { 
  crearAuditLog, 
  listarAuditLogs, 
  obtenerAuditLog, 
  actualizarAuditLog, 
  eliminarAuditLog 
} from "../controllers/AuditLogs.js";
import { 
  crearAuditLogValidator, 
  actualizarAuditLogValidator, 
  idValidator 
} from "../validators/AuditLogs.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarJWT } from "../middlewares/Webtoken.js";

const router = Router();

router.use(validarJWT);

router.get("/", listarAuditLogs);

// Una sola ruta GET /:id con la traza al inicio
router.get("/:id", (req, res, next) => {
  console.log("llegué a RUTA: GET /audit-logs/:id");
  next();
}, idValidator, validarCampos, obtenerAuditLog);

router.post("/", crearAuditLogValidator, validarCampos, crearAuditLog);
router.put("/:id", idValidator, actualizarAuditLogValidator, validarCampos, actualizarAuditLog);
router.delete("/:id", idValidator, validarCampos, eliminarAuditLog);

export default router;