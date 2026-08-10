import express from "express";
import { x } from "./DataBase/cnxmongo.js";

import UsersRoutes from "./routers/Users.js";
import NumerologyProfilesRoutes from "./routers/NumerologyProfiles.js";
import CompatibilityMatchesRoutes from "./routers/CompatibilityMatches.js";
import ReadingsRoutes from "./routers/Readings.js";
import AuditLogsRoutes from "./routers/AuditLogs.js";
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

    res.status(500).json({
        mensaje: "Error interno del servidor"
    });
});

x().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
});