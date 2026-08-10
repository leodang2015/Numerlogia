import { Router } from "express";
import { actualizarReading, crearReading, eliminarReading, listarReadings, obtenerReading } from "../controllers/Readings.js";

const router = Router();
router.post("/", crearReading);
router.get("/", listarReadings);
router.get("/:id", obtenerReading)
router.put("/:id", actualizarReading);
router.delete("/:id", eliminarReading);
export default router;