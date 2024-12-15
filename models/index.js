const pool = require("../config/db")
const { hash, generateInvoiceNumber } = require("../utils")

async function insertMembership({ email, first_name, last_name, password }) {
    try {
        password = hash(password)
        const query = `
        insert into "Memberships"("email", "first_name", "last_name", "password")
        values ($1, $2, $3, $4);
        `
        await pool.query(query, [email, first_name, last_name, password])
    } catch (error) {
        throw error
    }
}
async function findMembership({ email }) {
    try {
        const query = `
        select * from "Memberships" where email ilike $1;
        `
        let result = await pool.query(query, [email])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}
async function findBanners() {
    try {
        const query = `
        select * from "Banners";
        `
        let result = await pool.query(query)
        result.rows.map((el) => {
            delete el.id
            return el
        })
        return result.rows
    } catch (error) {
        throw error
    }
}
async function updateProfile(first_name, last_name, email) {
    try {
        const query = `
        update "Memberships" set first_name = $1, last_name = $2 where email ilike $3 returning email, first_name, last_name, profile_image;
        `
        let result = await pool.query(query, [first_name, last_name, email])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}
async function updateImage(profile_image, email) {
    try {
        // console.log(profile_image)
        const query = `
        update "Memberships" set profile_image = $1 where email ilike $2 returning email, first_name, last_name, profile_image;
        `
        let result = await pool.query(query, [profile_image, email])
        return result.rows[0]
    } catch (error) {
        throw error
    }
}
async function findServices() {
    try {
        const query = `
        select * from "Services";
        `
        let result = await pool.query(query)
        result.rows.map((el) => {
            delete el.id
            return el
        })
        return result.rows
    } catch (error) {
        throw error
    }
}
async function topup(topup, email) {
    const tx = await pool.connect()
    try {
        tx.query("BEGIN")
        let query = `
        update "Memberships" set balance = "Memberships".balance + $1 where email ilike $2 returning *;
        `
        let result = await tx.query(query, [topup, email])

        query = `select max(id) as last_id from "Transactions";`
        let id = await tx.query(query)
        let invoice_number = generateInvoiceNumber(id.rows[0].last_id + 1)

        query = `select * from "Services" where service_code = $1;`
        let service = await tx.query(query, ['TOPUP'])

        query = `
        insert into "Transactions"("service_id", "email", "invoice_number", "transaction_type", "description", "total_amount", "created_on")
        values ($1, $2, $3, $4, $5, $6, $7) returning id;
        `
        await tx.query(query, [service.rows[0].id, email, invoice_number, service.rows[0].service_code, service.rows[0].service_name, topup, new Date()])
        tx.query("COMMIT")
        return result.rows[0]
    } catch (error) {
        tx.query("ROLLBACK")
        throw error
    } finally {
        tx.release()
    }
}
async function insertTransaction(service_code, email) {
    const tx = await pool.connect()
    try {
        tx.query("BEGIN")
        let query = `select max(id) as last_id from "Transactions";`
        let id = await tx.query(query)
        let invoice_number = generateInvoiceNumber(id.rows[0].last_id + 1)

        query = `select * from "Services" where service_code = $1;`
        let service = await tx.query(query, [service_code])
        if (service.rows.length == 0) throw { errorName: "invalidService" };

        query = `
        insert into "Transactions"("service_id", "email", "invoice_number", "transaction_type", "description", "total_amount", "created_on")
        values ($1, $2, $3, $4, $5, $6, $7) returning invoice_number, transaction_type, total_amount, created_on;
        `
        let transaction = await tx.query(query, [service.rows[0].id, email, invoice_number, "PAYMENT", service.rows[0].service_name, service.rows[0].service_tariff, new Date()])

        query = `select * from "Memberships" where email ilike $1;`
        let user = await tx.query(query, [email])
        if (user.rows[0].balance < service.rows[0].service_tariff) throw { errorName: "notEnoughBalance" }

        query = `
        update "Memberships" set balance = "Memberships".balance - $1 where email ilike $2;
        `
        await tx.query(query, [service.rows[0].service_tariff, email])
        tx.query("COMMIT")
        transaction.rows[0].service_code = service.rows[0].service_code
        transaction.rows[0].service_name = service.rows[0].service_name
        return transaction.rows[0]
    } catch (error) {
        tx.query("ROLLBACK")
        throw error
    } finally {
        tx.release()
    }
}
async function findHistoryTransactions(email, limit = 0, offset = 0) {
    try {
        let query = `select * from "Transactions" where email ilike $1`
        if (limit) {
            query += ` limit ${limit} offset ${offset}`
        }
        let history = await pool.query(query, [email])
        if (history.rows.length != 0) {
            history.rows.map((el) => {
                delete el.id
                delete el.service_id
                delete el.email
                return el
            })
        }
        let data = {
            limit: Number(limit),
            offset: Number(offset),
            records: history.rows
        }
        return data
    } catch (error) {
        throw error
    }
}

module.exports = {
    insertMembership,
    findMembership,
    findBanners,
    updateProfile,
    updateImage,
    findServices,
    topup,
    insertTransaction,
    findHistoryTransactions,
}