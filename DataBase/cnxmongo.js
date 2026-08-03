import mongoose from "mongoose";

export const x = async () => {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Conexión exitosa a MongoDB");
    };
