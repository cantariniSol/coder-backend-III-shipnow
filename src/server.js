import config from "./config/index.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import app from "./app.js";

const PORT = config.PORT;

const startApp = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`🚀 Server running:`);
            logger.info(`--- Environment: ${config.NODE_ENV}`);
            logger.info(`--- Port: ${PORT}`);
            logger.info(`--- URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.fatal("Error al iniciar la aplicación", {
            error: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
};

startApp();
