import AppError from "./AppError.js";
import { ERROR_DICTIONARY } from "./errors.dictionary.js";

export function createError(code, customMessage = null, details = null) {
    const errorDefinition = ERROR_DICTIONARY[code] || ERROR_DICTIONARY.INTERNAL_SERVER_ERROR;

    return new AppError(customMessage || errorDefinition.message, {
        code: ERROR_DICTIONARY[code] ? code : "INTERNAL_SERVER_ERROR",
        statusCode: errorDefinition.statusCode,
        details,
    });
}