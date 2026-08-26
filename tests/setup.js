import mongoose from "mongoose";
import config from "../src/config/index.js";
import { createError } from "../src/errors/createError.js";


before(async function () {
    this.timeout(15000);

    if (!config.MONGODB_URI) {
        throw createError("VALIDATION_ERROR", "Falta MONGODB_URI para tests");
    }

    await mongoose.connect(config.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
    });
});

beforeEach(async function () {
    // Limpia todas las colecciones para que cada test arranque limpio
    const { collections } = mongoose.connection;
    const cleanupTasks = Object.values(collections).map((collection) =>
        collection.deleteMany({})
    );
    await Promise.all(cleanupTasks);
});

after(async function () {
    await mongoose.connection.close();
});