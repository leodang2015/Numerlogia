import express from "express";
import dotenv from "dotenv";
import { x } from "../cnxmongo.js";

dotenv.config();

const app = express();

x();

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
