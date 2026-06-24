function validateEnv() {
    const requiredEnvVars = [
        "PORT",
        "MONGODB_URI",
        "NODE_ENV",
    ];

    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(
                `❌ Falta variable de entorno: ${key}`
            );
        }
    });

    // URI de MongoDB
    if (!process.env.MONGODB_URI.startsWith("mongodb")){
        throw new Error(
            "❌ MONGODB_URI no parece una URI válida de MongoDB"
        );
    }
}

module.exports = validateEnv;