import express from "express";
import dotenv from "dotenv";

// 1. Cargar variables de entorno
dotenv.config();

// 2. Importar la función desde la carpeta DataBase
import { x } from "./DataBase/cnxmongo.js";

const app = express();

// 3. Conectar a MongoDB
x();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});