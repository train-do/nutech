const { findMembership } = require("../models")
const { validateToken } = require("../utils")

async function authentication(req, res, next) {
    try {
        const { token } = req.headers
        if (!token) throw ({ errorName: "unAuthentication" })
        const { email } = validateToken(token)
        const user = await findMembership({ email })
        if (!user) throw ({ errorName: "unAuthentication" })
        next()
    } catch (error) {
        // console.log("ERROR FROM AUTH :", error)
        next({ errorName: "unAuthentication" })
    }
}

module.exports = authentication