import mongoose from "mongoose";
import config from "./index.js";
import logger from "../utils/logger.js";

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
        logger.info("🤖 Conexión a MongoDB exitosa!");
    } catch (error) {
        logger.fatal("Error al conectar con MongoDB", {
            error: error.message,
            stack: error.stack,
        });
        throw new Error(`Error de conexión a MongoDB: ${error.message}`);
    }
};

export default connectDB;
