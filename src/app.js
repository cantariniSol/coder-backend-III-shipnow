// External dependencies
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

// Configuration 
import config from "./config/index.js";
import connectDB from "./config/db.js";

// Utilities 
import logger from "./utils/logger.js";

// Swagger documentation
import { swaggerSpecs } from "./docs/swagger.config.js";

// Errors & middlewares
import { createError } from "./errors/createError.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Routes
import mocksRouter from "./routes/mocks.router.js";
import ordersRouter from "./routes/orders.router.js";
import productsRouter from "./routes/products.routes.js";
import storesRouter from "./routes/stores.router.js";
import usersRouter from "./routes/users.routes.js";




//Incializamos express
const app = express();

// Configuración de Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


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
app.use("/api/users", usersRouter);
//Ruta para tiendas
app.use("/api/stores", storesRouter);
//Ruta para productos
app.use("/api/products", productsRouter);
//Ruta para pedidos
app.use("/api/orders", ordersRouter);
//Ruta para mocks protegido para entornos de desarrollo
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/mocks', mocksRouter);
}


// 3. Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    next(createError("ROUTE_NOT_FOUND"));
});

// 4. Middleware para manejar errores
app.use(errorHandler);

//Mensaje de StartApp  por consola
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
