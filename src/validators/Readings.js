import { body, param } from "express-validator";
import mongoose from "mongoose";

export const crearReadingValidator = [
  body("prompt")
    .trim()
    .notEmpty().withMessage("El prompt es obligatorio")
    .isString().withMessage("El prompt debe ser una cadena de texto"),

  body("respuesta")
    .trim()
    .notEmpty().withMessage("La respuesta es obligatoria")
    .isString().withMessage("La respuesta debe ser una cadena de texto"),

  body("tipo_lectura")
    .trim()
    .notEmpty().withMessage("El tipo de lectura es obligatorio")
    .isString().withMessage("El tipo de lectura debe ser una cadena de texto"),

  body("fecha")
    .optional()
    .isISO8601().withMessage("La fecha debe tener un formato ISO8601 válido")
];

export const actualizarReadingValidator = [
  body("prompt")
    .optional()
    .trim()
    .isString().withMessage("El prompt debe ser una cadena de texto"),

  body("respuesta")
    .optional()
    .trim()
    .isString().withMessage("La respuesta debe ser una cadena de texto"),

  body("tipo_lectura")
    .optional()
    .trim()
    .isString().withMessage("El tipo de lectura debe ser una cadena de texto"),

  body("fecha")
    .optional()
    .isISO8601().withMessage("La fecha debe tener un formato ISO8601 válido")
];

// get de pertenencia con traza de consola
export const idValidator = [
  param("id").custom((value) => {
    console.log("llegué a VALIDATOR: idValidator (Readings)");
    return mongoose.Types.ObjectId.isValid(value);
  })
];