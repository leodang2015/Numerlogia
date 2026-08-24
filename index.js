import express from "express";
import { x } from "./src/DataBase/cnxmongo.js";

import UsersRoutes from "./src/routers/Users.js";
import NumerologyProfilesRoutes from "./src/routers/NumerologyProfiles.js";
import CompatibilityMatchesRoutes from "./src/routers/CompatibilityMatches.js";
import ReadingsRoutes from "./src/routers/Readings.js";
import AuditLogsRoutes from "./src/routers/AuditLogs.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT ;

app.use(express.json());

app.use("/api/v1/users", UsersRoutes);
app.use("/api/v1/numerology-profiles", NumerologyProfilesRoutes);
app.use("/api/v1/compatibility-matches", CompatibilityMatchesRoutes);
app.use("/api/v1/readings", ReadingsRoutes);
app.use("/api/v1/audit-logs", AuditLogsRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: "Error interno del servidor" });
});

x().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
});