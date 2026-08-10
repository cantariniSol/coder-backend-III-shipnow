import AppError from "../errors/AppError.js";
import { errorResponse } from "../responses/apiResponse.js";

export function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);

    // Mongoose CastError (ObjectId inválido)
    if (error && error.name === "CastError") {
        return errorResponse(res, {
            statusCode: 400,
            message: "ID inválido",
            error: {
                code: "INVALID_ID",
                message: "El id proporcionado no tiene el formato correcto",
                details: { path: error.path, value: error.value },
            },
        });
    }

    // Mongoose ValidationError (errores de esquema)
    if (error && error.name === "ValidationError") {
        const details = Object.values(error.errors || {}).map((e) => ({
            path: e.path,
            message: e.message,
        }));
        return errorResponse(res, {
            statusCode: 400,
            message: "Datos inválidos",
            error: {
                code: "VALIDATION_ERROR",
                message: error.message,
                details,
            },
        });
    }

    // Duplicate key (11000) -> conflicto / recurso duplicado
    if (error && error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0];
        return errorResponse(res, {
            statusCode: 409,
            message: `Valor duplicado en ${field}`,
            error: {
                code: "DUPLICATE_KEY",
                message: error.message,
                details: { field, value: error.keyValue?.[field] ?? null },
            },
        });
    }

    // Errores de la aplicación (AppError)
    if (error instanceof AppError) {
        return errorResponse(res, {
            statusCode: error.statusCode,
            message: error.message,
            error: {
                code: error.code,
                message: error.message,
                details: error.details ?? null,
            },
        });
    }

    // Fallback para errores no esperados
    return errorResponse(res, {
        statusCode: error.statusCode || 500,
        message: error.message || "Error interno del servidor",
        error: {
            code: error.code || "INTERNAL_SERVER_ERROR",
            message: error.message || "Error interno del servidor",
            details: error.details || null,
        },
    });
}