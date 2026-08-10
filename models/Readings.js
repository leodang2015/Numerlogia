import mongoose from "mongoose";

const readingSchema = new mongoose.Schema(
    {
        prompt: {
            type: String,
            required: [true, "El prompt es obligatorio"],
            trim: true,
        },
        respuesta: {
            type: String,
            required: [true, "La respuesta es obligatoria"],
            trim: true,
        },
        tipo_lectura: {
            type: String,
            required: [true, "El tipo de lectura es obligatorio"],
            trim: true,
        },
        fecha: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Reading", readingSchema);