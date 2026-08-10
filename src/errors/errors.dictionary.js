export const ERROR_DICTIONARY = {
    // Errores de validación / bad request
    VALIDATION_ERROR: {
        statusCode: 400,
        message: "Datos invalidos o incompletos",
    },
    INVALID_USER_ROLE: {
        statusCode: 400,
        message: "Rol invalido",
    },
    INVALID_ORDER_STATUS: {
        statusCode: 400,
        message: "Estado de orden invalido",
    },
    ORDER_ITEMS_REQUIRED: {
        statusCode: 400,
        message: "El pedido debe incluir al menos un item",
    },

    // Errores de recurso no encontrado
    USER_NOT_FOUND: {
        statusCode: 404,
        message: "Usuario no encontrado",
    },
    STORE_NOT_FOUND: {
        statusCode: 404,
        message: "Tienda no encontrada",
    },
    ORDER_NOT_FOUND: {
        statusCode: 404,
        message: "Pedido no encontrado",
    },
    PRODUCT_NOT_FOUND: {
        statusCode: 404, 
        message: "Producto no encontrado"
    },
    ROUTE_NOT_FOUND: {
        statusCode: 404,
        message: "Ruta no encontrada",
    },

    // Errores de conflicto
    USER_ALREADY_EXISTS: {
        statusCode: 409,
        message: "Ya existe un usuario con ese email",
    },
    PRODUCT_ALREADY_EXISTS: { 
        statusCode: 409, 
        message: "Ya existe un producto con ese código" 
    },

    // Error interno / servidor
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: "Error interno del servidor",
    },
};