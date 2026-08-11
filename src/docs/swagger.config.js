import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "ShipNow API",
            version: "1.0.0",
            description:
                "Documentación de la API ShipNow para gestión de usuarios, pedidos, entregas, mocks, errores y logging.",
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local",
            },
            {
                url: "http://localhost:3001",
                description: "Servidor de desarrollo",
            },
            {
                url: "http://localhost:3006",
                description: "Servidor de staging",
            },
        ],

        tags: [
            {
                name: "Users",
                description: "Operaciones relacionadas con usuarios",
            },
            {
                name: "Products",
                description: "Operaciones relacionadas con productos",
            },
            {
                name: "Orders",
                description: "Operaciones relacionadas con pedidos",
            },
            {
                name: "Stores",
                description: "Operaciones relacionadas con tiendas",
            },
            {
                name: "Mocks",
                description: "Endpoints para generación de datos de prueba",
            },
            {
                name: "Logger",
                description: "Endpoints para prueba de logging y manejo de errores",
            },
        ],
    },

    apis: ["./src/docs/**/*.yaml"],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);