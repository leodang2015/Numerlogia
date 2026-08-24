import NumerologyProfile from "../models/NumerologyProfiles.js";


export const crearNumerologyProfile = async (req, res) => {
    try {
        const {
            usuario_id,
            numero_vida,
            numero_expresion,
            numero_alma
        } = req.body;

        const numerologyProfile = await NumerologyProfile.create({
            usuario_id,
            numero_vida,
            numero_expresion,
            numero_alma
        });

        res.status(201).json(numerologyProfile);
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al crear perfil numerológico",
            error: error.message
        });
    }
};


export const listarNumerologyProfiles = async (req, res) => {
    try {
        const numerologyProfiles = await NumerologyProfile.find();

        res.status(200).json(numerologyProfiles);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al listar perfiles numerológicos",
            error: error.message
        });
    }
};


export const obtenerNumerologyProfile = async (req, res) => {
    try {
        const numerologyProfile = await NumerologyProfile.findById(req.params.id);

        if (!numerologyProfile) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        res.status(200).json(numerologyProfile);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener perfil numerológico",
            error: error.message
        });
    }
};


export const actualizarNumerologyProfile = async (req, res) => {
    try {
        const {
            usuario_id,
            numero_vida,
            numero_expresion,
            numero_alma
        } = req.body;

        const numerologyProfile = await NumerologyProfile.findByIdAndUpdate(
            req.params.id,
            {
                usuario_id,
                numero_vida,
                numero_expresion,
                numero_alma
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!numerologyProfile) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        res.status(200).json(numerologyProfile);
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al actualizar perfil numerológico",
            error: error.message
        });
    }
};


export const eliminarNumerologyProfile = async (req, res) => {
    try {
        const numerologyProfile = await NumerologyProfile.findByIdAndDelete(
            req.params.id
        );

        if (!numerologyProfile) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Perfil numerológico eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar perfil numerológico",
            error: error.message
        });
    }
};

