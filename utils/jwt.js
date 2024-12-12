if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.JWT_KEY

function generateToken(data) {
    let result = jwt.sign(data, SECRET_KEY, { expiresIn: 3600 })
    return result
}
function validateToken(token) {
    let result = jwt.verify(token, SECRET_KEY)
    // console.log(token, SECRET_KEY, result)
    return result
}

module.exports = {
    generateToken,
    validateToken,
}