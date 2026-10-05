import mongoose from "mongoose";

export const x = async () => {
  try {
    // Activa la depuración de Mongoose para el Reto 5.2
    mongoose.set("debug", true);

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/trabajodenumologia"
    );
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.log("Error al conectar a la base de datos:", error);
  }
};