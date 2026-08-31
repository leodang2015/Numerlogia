import User from "../models/Users.js";
import { generarJWT } from "../middlewares/Webtoken.js";


export const crearUsuario = (req, res) => {
  const { nombre_completo, email, password_hash, fecha_nacimiento, fecha_registro } = req.body;

  User.create({ nombre_completo, email, password_hash, fecha_nacimiento, fecha_registro })
    .then(usuario => res.status(201).json(usuario))
    .catch(error => res.status(400).json({ mensaje: "Error al crear usuario", error: error.message }));
};


export const loginUsuario = (req, res) => {
  const { email, password_hash } = req.body;

  User.findOne({ email, password_hash, estado: { $ne: 0 } })
    .then(usuario => 
      !usuario 
        ? res.status(400).json({ mensaje: "Credenciales incorrectas o usuario inactivo" })
        : generarJWT(usuario._id).then(token => res.json({ usuario, token }))
    )
    .catch(error => res.status(500).json({ mensaje: "Error en el servidor", error: error.message }));
};

export const listarUsuarios = (req, res) => {
  User.find()
    .then(usuarios => res.status(200).json(usuarios))
    .catch(error => res.status(500).json({ mensaje: "Error al listar usuarios", error: error.message }));
};


export const obtenerUsuario = (req, res) => {
  User.findById(req.params.id)
    .then(usuario => 
      !usuario 
        ? res.status(404).json({ mensaje: "Usuario no encontrado" })
        : res.status(200).json(usuario)
    )
    .catch(error => res.status(500).json({ mensaje: "Error al obtener usuario", error: error.message }));
};


export const actualizarUsuario = (req, res) => {
  const { nombre_completo, email, password_hash, fecha_nacimiento, fecha_registro } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    { nombre_completo, email, password_hash, fecha_nacimiento, fecha_registro },
    { new: true, runValidators: true }
  )
    .then(usuario => 
      !usuario 
        ? res.status(404).json({ mensaje: "Usuario no encontrado" })
        : res.status(200).json(usuario)
    )
    .catch(error => res.status(400).json({ mensaje: "Error al actualizar usuario", error: error.message }));
};

export const eliminarUsuario = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(usuario => 
      !usuario 
        ? res.status(404).json({ mensaje: "Usuario no encontrado" })
        : res.status(200).json({ mensaje: "Usuario eliminado correctamente" })
    )
    .catch(error => res.status(500).json({ mensaje: "Error al eliminar usuario", error: error.message }));
};
