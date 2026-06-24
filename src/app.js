import express from "express";
import config from "./config/index.js";
import usersRouter from "./routes/users.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "ShipNow API funcionando correctamente"
    });
});

app.get("/health", (req, res) => {
    res.json({
        environment: config.NODE_ENV,
        port: config.PORT
    });
});

app.use("/users", usersRouter);

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${config.NODE_ENV} on port ${PORT}`
    );
});