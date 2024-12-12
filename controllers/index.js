const { generateResponse, hashCompare, generateToken, validateToken } = require("../utils")
const { findMembership, insertMembership, findBanners, findServices, topup: deposit, insertTransaction, findHistoryTransactions, updateProfile, updateImage: editImage } = require("../models")

async function registration(req, res, next) {
    try {
        const { email, first_name, last_name, password } = req.body
        if (!email || !first_name || !last_name || !password) throw { errorName: "nullForm" }
        await insertMembership(req.body)
        let response = generateResponse(0, "Registrasi berhasil silahkan login")
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body
        console.log(req.body)
        if (!email || !password) throw { errorName: "nullForm" }
        let user = await findMembership(req.body)
        if (!user || !hashCompare(password, user.password)) throw { errorName: "invalid" }
        let token = generateToken({ email: user.email })
        let response = generateResponse(0, "Login Sukses", { token })
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function banner(req, res, next) {
    try {
        let banners = await findBanners()
        let response = generateResponse(0, "Sukses", banners)
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function profile(req, res, next) {
    try {
        const { token } = req.headers
        const credential = validateToken(token)
        let user = await findMembership(credential)
        delete user.id
        delete user.balance
        delete user.password
        let response = generateResponse(0, "Sukses", user)
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function editProfile(req, res, next) {
    try {
        const { token } = req.headers
        console.log(req, "------")
        const { email } = validateToken(token)
        const { first_name, last_name } = req.body
        let user = await updateProfile(first_name, last_name, email)
        let response = generateResponse(0, "Update Pofile berhasil", user)
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function updateImage(req, res, next) {
    try {
        // if (!req.file) throw { errorName: "nullForm" }
        const token = req.headers
        console.log(token, "**********")
        const url = req.file?.path || null
        // console.log("MASUK UPDATE IMAGE", req.file, !req.file, url)
        // const { email } = validateToken(token)
        let user = await editImage(url, "user@mail.com")
        let response = generateResponse(0, "Update Profile Image berhasil", user)
        res.json(response)
    } catch (error) {
        console.log(error)
        // next(error)
    }
}
async function services(req, res, next) {
    try {
        let services = await findServices()
        let response = generateResponse(0, "Sukses", services)
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function balance(req, res, next) {
    try {
        const { token } = req.headers
        const credential = validateToken(token)
        let user = await findMembership(credential)
        let response = generateResponse(0, "Get Balance Berhasil", { balance: user.balance })
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function topup(req, res, next) {
    try {
        const { token } = req.headers
        const credential = validateToken(token)
        const { top_up_amount } = req.body
        let user = await deposit(top_up_amount, credential.email)
        let response = generateResponse(0, "Top Up Balance berhasil", { balance: user.balance })
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function transaction(req, res, next) {
    try {
        const { token } = req.headers
        const credential = validateToken(token)
        const { service_code } = req.body
        let transaction = await insertTransaction(service_code, credential.email)
        let response = generateResponse(0, "Transaksi berhasil", transaction)
        res.json(response)
    } catch (error) {
        next(error)
    }
}
async function historyTransaction(req, res, next) {
    try {
        const { token } = req.headers
        const credential = validateToken(token)
        const { limit, offset } = req.query
        let history = await findHistoryTransactions(credential.email, limit, offset)
        let response = generateResponse(0, "Get History Berhasil", history)
        res.json(response)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    registration,
    login,
    banner,
    profile,
    editProfile,
    updateImage,
    services,
    balance,
    topup,
    transaction,
    historyTransaction,
}