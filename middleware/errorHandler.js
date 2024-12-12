const { generateResponse } = require("../utils");

function errorsHandler(error, req, res, next) {
    let status, message, statusCode
    switch (error.errorName) {
        case "nullForm":
            statusCode = 400
            status = 400
            message = "Form is incomplete"
            break;
        case "invalid":
            statusCode = 401
            status = 103
            message = "email atau password salah"
            break;
        case "invalidService":
            statusCode = 400
            status = 102
            message = "Service ataus Layanan tidak ditemukan"
            break;
        case "unAuthentication":
        case "JsonWebTokenError":
            statusCode = 401
            status = 108
            message = "Token tidak tidak valid atau kadaluwarsa"
            break;
        case "notEnoughBalance":
            statusCode = 400
            status = 400
            message = "Balance tidak mencukupi"
            break;
        default:
            console.log("ERROR FROM ERRORHANDLE :", error);
            statusCode = 500
            status = 500
            message = "Internal Server Error"
            break;
    }
    let response = generateResponse(status, message)
    res.status(statusCode).json(response)
}

module.exports = errorsHandler