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


router.get("/", validarJWT, listarAuditLogs);
router.post("/", validarJWT, crearAuditLogValidator, validarCampos, crearAuditLog);
router.get("/:id", validarJWT, idValidator, validarCampos, obtenerAuditLog);
router.put("/:id", validarJWT, idValidator, actualizarAuditLogValidator, validarCampos, actualizarAuditLog);
router.delete("/:id", validarJWT, idValidator, validarCampos, eliminarAuditLog);

export default router;
