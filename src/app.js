import express from "express";
import cors from "cors";
import config from "./config/index.js";
import usersRouter from "./routes/users.routes.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from "./routes/products.routes.js";

//Incializamos express
const app = express();


//Middleware
// 1. Middleware para habilitar CORS
app.use(cors());
// 2. Middleware para parsear el body de las peticiones
app.use(express.json());


//Rutas
//Ruta principal
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "ShipNow API funcionando correctamente"
    });
});
//Ruta de salud del servidor
app.get("/health", (req, res) => {
    res.json({
        environment: config.NODE_ENV,
        port: config.PORT
    });
});

//Ruta para usuarios
app.use("/users", usersRouter);
//Ruta para tiendas
app.use("/stores", storesRouter);
//Ruta para productos
app.use("/products", productsRouter);
//Ruta para pedidos
app.use("/orders", ordersRouter);


// 3. Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Ruta no encontrada"
    });
});

//Configuración del puerto
const PORT = config.PORT;
//Iniciamos el servidor
app.listen(PORT, () => {
    console.log(
        `🚀 Server running in ${config.NODE_ENV} on port ${PORT}`
    );
});