import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { x } from "./DataBase/cnxmongo.js";

const app = express();

x();

import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
