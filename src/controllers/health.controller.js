import config from "../config/index.js";

export const getHealth = (req, res) => {
    res.json({
        status: "success",
        message: "Health check de ShipNow API",
        url: `http://localhost:${config.PORT}`,
        puerto: config.PORT,
        environment: config.NODE_ENV,
        server: "conectado",
        database: "conectado"
    });
};
