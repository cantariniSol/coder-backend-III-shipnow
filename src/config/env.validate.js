function validateEnv() {
    const requiredEnvVars = [
        "PORT",
        "MONGODB_URI",
        "NODE_ENV",
    ];

    requiredEnvVars.forEach((key) => {
        if (!process.env[key] || typeof process.env[key] !== "string" || !process.env[key].trim()) {
            throw new Error(
                `❌ Falta variable de entorno: ${key}`
            );
        }
    });

    const port = Number(process.env.PORT);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        throw new Error("❌ PORT debe ser un número entero entre 1 y 65535");
    }

    const validEnvironments = ["development", "test"];
    if (!validEnvironments.includes(process.env.NODE_ENV)) {
        throw new Error(
            `❌ NODE_ENV inválido. Valores permitidos: ${validEnvironments.join(", ")}`
        );
    }

    const mongoUri = process.env.MONGODB_URI.trim();
    const mongoUriPattern = /^(mongodb(?:\+srv)?:\/\/).+/i;
    if (!mongoUriPattern.test(mongoUri)) {
        throw new Error(
            "❌ MONGODB_URI no parece una URI válida de MongoDB"
        );
    }
}

export default validateEnv;