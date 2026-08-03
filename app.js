import express from "express";
import dotenv from "dotenv";
import { x } from "./cnxmongo.js";

// Cargar variables de entorno primero
dotenv.config();

const app = express();

// Ejecutar la conexión a MongoDB
x();

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});