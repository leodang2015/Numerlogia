import mongoose from "mongoose";

export const x = async () => {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conexión exitosa a MongoDB");
    };