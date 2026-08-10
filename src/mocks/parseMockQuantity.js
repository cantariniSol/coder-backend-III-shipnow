import { createError } from "../errors/createError.js";

const MAX_MOCK_QUANTITY = 50;

export function parseMockQuantity(rawValue, defaultValue = 1) {
    const quantity = rawValue === undefined || rawValue === null ? defaultValue : Number(rawValue);

    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw createError("VALIDATION_ERROR", "La cantidad debe ser un número entero positivo");
    }

    if (quantity > MAX_MOCK_QUANTITY) {
        throw createError("VALIDATION_ERROR", `La cantidad máxima permitida es ${MAX_MOCK_QUANTITY}`);
    }

    return quantity;
}
