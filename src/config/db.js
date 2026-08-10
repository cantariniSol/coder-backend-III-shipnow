import mongoose from "mongoose";
import config from "./index.js";

const connectDB = async () => {
    const mongoUri = config.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("Falta la variable MONGODB_URI");
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("✅ MongoDB conectado exitosamente!");
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error.message);
        throw new Error(`Error de conexión a MongoDB: ${error.message}`);
    }
};

export default connectDB;
