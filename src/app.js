import express from "express";
import cors from "cors";
import config from "./config/index.js";
import connectDB from "./config/db.js";
import usersRouter from "./routes/users.routes.js";
import storesRouter from "./routes/stores.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from "./routes/products.routes.js";
import mocksRouter from "./routes/mocks.router.js";
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
        message: "ShipNow API está corriendo y lista para recibir peticiones",
        environment: config.NODE_ENV,
        port: config.PORT,
        url: `http://localhost:${config.PORT}`
    });
});

//Ruta de salud del servidor
app.get("/health", (req, res) => {
    res.json({
        status: "success",
        message: "Health check de ShipNow API",
        url: `http://localhost:${config.PORT}`,
        puerto: config.PORT,
        environment: config.NODE_ENV,
        server: "conectado",
        database: "conectado"
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
//Ruta para mocks protegido para entornos de desarrollo
if (process.env.NODE_ENV !== 'production') {
    app.use('/mocks', mocksRouter);
}


// 3. Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Ruta no encontrada"
    });
});

//Mensaje de StartApp  por consola
const PORT = config.PORT;

const startApp = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running:`);
            console.log(`- Environment: ${config.NODE_ENV}`);
            console.log(`- Port: ${PORT}`);
            console.log(`- URL: http://localhost:${PORT}`);
            console.log(`- Conexión al servidor: Exitosa!`);
            console.log(`- Conexión a MongoDB: Exitosa!`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar la aplicación:", error.message);
        process.exit(1);
    }
};

startApp();
