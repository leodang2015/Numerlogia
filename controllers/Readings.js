import Reading from "../models/Readings.js";


export const crearReading = async (req, res) => {
    try {
        const {
            prompt,
            respuesta,
            tipo_lectura,
            fecha
        } = req.body;

        const reading = await Reading.create({
            prompt,
            respuesta,
            tipo_lectura,
            fecha
        });

        res.status(201).json(reading);
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al crear lectura",
            error: error.message
        });
    }
};


export const listarReadings = async (req, res) => {
    try {
        const readings = await Reading.find();

        res.status(200).json(readings);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al listar lecturas",
            error: error.message
        });
    }
};


export const obtenerReading = async (req, res) => {
    try {
        const reading = await Reading.findById(req.params.id);

        if (!reading) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        res.status(200).json(reading);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener lectura",
            error: error.message
        });
    }
};


export const actualizarReading = async (req, res) => {
    try {
        const {
            prompt,
            respuesta,
            tipo_lectura,
            fecha
        } = req.body;

        const reading = await Reading.findByIdAndUpdate(
            req.params.id,
            {
                prompt,
                respuesta,
                tipo_lectura,
                fecha
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!reading) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        res.status(200).json(reading);
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al actualizar lectura",
            error: error.message
        });
    }
};


export const eliminarReading = async (req, res) => {
    try {
        const reading = await Reading.findByIdAndDelete(
            req.params.id
        );

        if (!reading) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Lectura eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar lectura",
            error: error.message
        });
    }
};

