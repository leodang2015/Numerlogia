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

const router = Router();

router.get("/", listarAuditLogs);
router.post("/", crearAuditLogValidator, validarCampos, crearAuditLog);
router.get("/:id", idValidator, validarCampos, obtenerAuditLog);
router.put("/:id", idValidator, actualizarAuditLogValidator, validarCampos, actualizarAuditLog);
router.delete("/:id", idValidator, validarCampos, eliminarAuditLog);

export default router;