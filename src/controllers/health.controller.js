import config from "../config/index.js";

export const getHealth = (req, res) => {
    res.json({
        status: "success",
        environment: config.NODE_ENV,
        uptime: Number(process.uptime().toFixed(2)),
        timestamp: new Date().toISOString(),
    });
};
