import { Router } from "express";
import { 
  crearUsuario, 
  loginUsuario, 
  listarUsuarios, 
  obtenerUsuario, 
  actualizarUsuario, 
  eliminarUsuario 
} from "../controllers/Users.js";
import { 
  crearUserValidator, 
  loginUserValidator,
  actualizarUserValidator, 
  idValidator 
} from "../validators/Users.js"; 
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarJWT } from "../middlewares/Webtoken.js";

const router = Router();

router.post("/", crearUserValidator, validarCampos, crearUsuario);

router.post("/login", loginUserValidator, validarCampos, loginUsuario); 

// Rutas protegidas que requieren Token JWT válido
router.get("/", validarJWT, listarUsuarios);

// Una sola ruta GET /:id con la traza al inicio
router.get("/:id", (req, res, next) => {
  console.log("llegué a RUTA: GET /users/:id");
  next();
}, validarJWT, idValidator, validarCampos, obtenerUsuario);

router.put("/:id", validarJWT, idValidator, actualizarUserValidator, validarCampos, actualizarUsuario);
router.delete("/:id", validarJWT, idValidator, validarCampos, eliminarUsuario);

export default router;