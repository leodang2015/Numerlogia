import CompatibilityMatch from "../models/CompatibilityMatches.js";


export const crearCompatibilityMatch = async (req, res) => {
    try {
        const {
            usuario_id_1,
            usuario_id_2,
            puntaje_calculado,
            interpretacion_ia
        } = req.body;

        const compatibilityMatch = await CompatibilityMatch.create({
            usuario_id_1,
            usuario_id_2,
            puntaje_calculado,
            interpretacion_ia
        });

        res.status(201).json(compatibilityMatch);
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al crear análisis de compatibilidad",
            error: error.message
        });
    }
};


export const listarCompatibilityMatches = async (req, res) => {
    try {
        const compatibilityMatches = await CompatibilityMatch.find();

        res.status(200).json(compatibilityMatches);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al listar análisis de compatibilidad",
            error: error.message
        });
    }
};


export const obtenerCompatibilityMatch = async (req, res) => {
    try {
        const compatibilityMatch = await CompatibilityMatch.findById(req.params.id);

        if (!compatibilityMatch) {
            return res.status(404).json({
                mensaje: "Análisis de compatibilidad no encontrado"
            });
        }

        res.status(200).json(compatibilityMatch);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener análisis de compatibilidad",
            error: error.message
        });
    }
};


export const actualizarCompatibilityMatch = async (req, res) => {
    try {
        const {
            usuario_id_1,
            usuario_id_2,
            puntaje_calculado,
            interpretacion_ia
        } = req.body;

        const compatibilityMatch = await CompatibilityMatch.findByIdAndUpdate(
            req.params.id,
            {
                usuario_id_1,
                usuario_id_2,
                puntaje_calculado,
                interpretacion_ia
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!compatibilityMatch) {
            return res.status(404).json({
                mensaje: "Análisis de compatibilidad no encontrado"
            });
        }

        res.status(200).json(compatibilityMatch);
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al actualizar análisis de compatibilidad",
            error: error.message
        });
    }
};


export const eliminarCompatibilityMatch = async (req, res) => {
    try {
        const compatibilityMatch = await CompatibilityMatch.findByIdAndDelete(
            req.params.id
        );

        if (!compatibilityMatch) {
            return res.status(404).json({
                mensaje: "Análisis de compatibilidad no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Análisis de compatibilidad eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar análisis de compatibilidad",
            error: error.message
        });
    }
};

