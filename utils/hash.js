const bcrypt = require("bcrypt")

function hash(data) {
    return bcrypt.hashSync(data, 10)
}
function hashCompare(data, dataCompare) {
    return bcrypt.compareSync(data, dataCompare)
}

module.exports = {
    hash,
    hashCompare,
}