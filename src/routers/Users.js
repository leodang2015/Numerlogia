import { Router } from "express";
import { 
  crearUsuario, 
  listarUsuarios, 
  obtenerUsuario, 
  actualizarUsuario, 
  eliminarUsuario 
} from "../controllers/Users.js";
import { 
  crearUserValidator, 
  actualizarUserValidator, 
  idValidator 
} from "../validators/Users.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.get("/", listarUsuarios);
router.post("/", crearUserValidator, validarCampos, crearUsuario);
router.get("/:id", idValidator, validarCampos, obtenerUsuario);
router.put("/:id", idValidator, actualizarUserValidator, validarCampos, actualizarUsuario);
router.delete("/:id", idValidator, validarCampos, eliminarUsuario);

export default router;