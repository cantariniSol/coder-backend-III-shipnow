import logger from "../utils/logger.js";
import AppError from "../errors/AppError.js";
import { errorResponse } from "../responses/apiResponse.js";

export function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);

    const requestContext = {
        method: req.method,
        url: req.originalUrl,
    };

    // Multer: tamaño excedido o campo de archivo inesperado
    if (error?.name === "MulterError") {
        const code = error.code === "LIMIT_FILE_SIZE"
            ? "FILE_TOO_LARGE"
            : "INVALID_FILE_TYPE";

        logger.warn("Error al cargar archivo", {
            ...requestContext,
            code,
            multerCode: error.code,
            field: error.field,
        });

        return errorResponse(res, {
            statusCode: 400,
            message: code === "FILE_TOO_LARGE"
                ? "El archivo supera el tamaño máximo permitido"
                : "El campo del archivo no es válido",
            error: {
                code,
                message: code === "FILE_TOO_LARGE"
                    ? "El archivo supera el tamaño máximo permitido"
                    : "El campo del archivo no es válido",
                details: {
                    field: error.field ?? null,
                },
            },
        });
    }

    // Mongoose CastError (ObjectId inválido)
    if (error?.name === "CastError") {
        logger.warn("Error de validación en request", {
            ...requestContext,
            code: "INVALID_ID",
            message: error.message,
            path: error.path,
            value: error.value,
        });

        return errorResponse(res, {
            statusCode: 400,
            message: "ID inválido",
            error: {
                code: "INVALID_ID",
                message: "El id proporcionado no tiene el formato correcto",
                details: {
                    path: error.path,
                    value: error.value,
                },
            },
        });
    }

    // Mongoose ValidationError
    if (error?.name === "ValidationError") {
        const details = Object.values(error.errors || {}).map((e) => ({
            path: e.path,
            message: e.message,
        }));

        logger.warn("Error de validación de datos", {
            ...requestContext,
            code: "VALIDATION_ERROR",
            message: error.message,
            details,
        });

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

    // Duplicate key (11000)
    if (error?.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0];
        const value = error.keyValue?.[field] ?? null;

        logger.warn("Recurso duplicado", {
            ...requestContext,
            code: "DUPLICATE_KEY",
            field,
            value,
            message: error.message,
        });

        return errorResponse(res, {
            statusCode: 409,
            message: `Valor duplicado en ${field}`,
            error: {
                code: "DUPLICATE_KEY",
                message: error.message,
                details: {
                    field,
                    value,
                },
            },
        });
    }

    // Errores controlados de la aplicación
    if (error instanceof AppError) {
        const statusCode = error.statusCode;

        if (statusCode >= 500) {
            logger.error("Error de aplicación", {
                ...requestContext,
                code: error.code,
                message: error.message,
                statusCode,
                details: error.details ?? null,
                stack: error.stack,
            });
        } else {
            logger.warn("Error de aplicación", {
                ...requestContext,
                code: error.code,
                message: error.message,
                statusCode,
                details: error.details ?? null,
            });
        }

        return errorResponse(res, {
            statusCode,
            message: error.message,
            error: {
                code: error.code,
                message: error.message,
                details: error.details ?? null,
            },
        });
    }

    // Fallback: error inesperado
    logger.error("Error interno no controlado", {
        ...requestContext,
        code: error?.code || "INTERNAL_SERVER_ERROR",
        message: error?.message || "Error interno del servidor",
        stack: error?.stack,
    });

    return errorResponse(res, {
        statusCode: error?.statusCode || 500,
        message: error?.message || "Error interno del servidor",
        error: {
            code: error?.code || "INTERNAL_SERVER_ERROR",
            message: error?.message || "Error interno del servidor",
            details: error?.details || null,
        },
    });
}