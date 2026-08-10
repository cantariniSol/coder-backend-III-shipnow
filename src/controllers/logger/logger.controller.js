import logger from "../../utils/logger.js";

export const testLogger = (req, res) => {
    logger.debug("Logger test - debug");
    logger.http("Logger test - http");
    logger.info("Logger test - info");
    logger.warn("Logger test - warning");
    logger.error("Logger test - error");
    logger.fatal("Logger test - fatal");

    res.json({
        status: "success",
        message: "Logger test ejecutado. Revisa consola y archivo de logs.",
    });
};