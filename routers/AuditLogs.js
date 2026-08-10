import { Router } from "express";
import { actualizarAuditLog, crearAuditLog, eliminarAuditLog, listarAuditLogs, obtenerAuditLog } from "../controllers/AuditLogs.js";


const router = Router();
router.post("/:id", crearAuditLog);
router.get("/:id", listarAuditLogs);
router.get("/:id", obtenerAuditLog);
router.put("/:id", actualizarAuditLog);
router.delete("/:id", eliminarAuditLog);
export default router;