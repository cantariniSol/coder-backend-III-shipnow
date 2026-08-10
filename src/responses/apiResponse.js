export function successResponse(res, { statusCode = 200, message = "OK", payload = null }) {
    return res.status(statusCode).json({
        status: "success",
        message,
        payload,
    });
}

export function errorResponse(res, { statusCode = 500, error = null, message = "Internal server error" }) {
    return res.status(statusCode).json({
        status: "error",
        message,
        error,
    });
}