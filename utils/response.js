function generateResponse(status, message, data = null) {
    return {
        status,
        message,
        data
    }
}

module.exports = generateResponse