import User from "../models/Users.js";

// Crear usuario
export const crearUsuario = async (req, res) => {
    try {
        const { nombre_completo, email, password_hash, fecha_nacimiento, fecha_registro } = req.body;
        const usuario = await User.create({
            nombre_completo,
            email,
            password_hash,
            fecha_nacimiento,
            fecha_registro
        });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear usuario", error: error.message });
    }
};

// Listar usuarios
export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al listar usuarios", error: error.message });
    }
};

// Obtener un usuario por ID
export const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuario", error: error.message });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { nombre_completo, email, password_hash, fecha_nacimiento, fecha_registro } = req.body;
        const usuario = await User.findByIdAndUpdate(
            req.params.id,
            { nombre_completo, email, password_hash, fecha_nacimiento, fecha_registro },
            { new: true, runValidators: true }
        );
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar usuario", error: error.message });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await User.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar usuario", error: error.message });
    }
};