import { Router } from "express";
import { actualizarUsuario, crearUsuario, eliminarUsuario, listarUsuarios, obtenerUsuario } from "../controllers/Users.js";


const router = Router();
router.post("/", crearUsuario);
router.get("/", listarUsuarios);
router.get("/:id", obtenerUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);
export default router;