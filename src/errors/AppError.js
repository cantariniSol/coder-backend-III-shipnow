class AppError extends Error {
    constructor(message = "Internal server error", { code = "INTERNAL_ERROR", statusCode = 500, details = null } = {}) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            status: "error",
            error: {
                code: this.code,
                message: this.message,
                details: this.details,
            },
        };
    }
}

class BadRequestError extends AppError {
    constructor(message = "Bad request", details = null) {
        super(message, { code: "BAD_REQUEST", statusCode: 400, details });
    }
}

class NotFoundError extends AppError {
    constructor(message = "Resource not found", details = null) {
        super(message, { code: "NOT_FOUND", statusCode: 404, details });
    }
}

class ConflictError extends AppError {
    constructor(message = "Conflict", details = null) {
        super(message, { code: "CONFLICT", statusCode: 409, details });
    }
}

class DatabaseError extends AppError {
    constructor(message = "Database error", details = null) {
        super(message, { code: "DB_ERROR", statusCode: 500, details });
    }
}

/* Errores de dominio específicos */
class InvalidQuantityError extends BadRequestError {
    constructor(message = "Cantidad inválida", details = null) {
        super(message, details);
        this.code = "INVALID_QUANTITY";
    }
}

class UserNotFoundError extends NotFoundError {
    constructor(message = "Usuario no encontrado", details = null) {
        super(message, details);
        this.code = "USER_NOT_FOUND";
    }
}

class OrderNotFoundError extends NotFoundError {
    constructor(message = "Pedido no encontrado", details = null) {
        super(message, details);
        this.code = "ORDER_NOT_FOUND";
    }
}

class StoreNotFoundError extends NotFoundError {
    constructor(message = "Tienda no encontrada", details = null) {
        super(message, details);
        this.code = "STORE_NOT_FOUND";
    }
}

class ProductNotFoundError extends NotFoundError {
    constructor(message = "Producto no encontrado", details = null) {
        super(message, details);
        this.code = "PRODUCT_NOT_FOUND";
    }
}

class InvalidStatusError extends BadRequestError {
    constructor(message = "Estado inválido", details = null) {
        super(message, details);
        this.code = "INVALID_STATUS";
    }
}

export {
    AppError,
    BadRequestError,
    NotFoundError,
    ConflictError,
    DatabaseError,
    InvalidQuantityError,
    UserNotFoundError,
    OrderNotFoundError,
    StoreNotFoundError,
    ProductNotFoundError,
    InvalidStatusError,
};

export default AppError;