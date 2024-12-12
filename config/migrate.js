const pool = require("./db");

const Memberships = `
CREATE TABLE IF NOT EXISTS "Memberships"(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL,
    balance INT DEFAULT 0.0,
    profile_image VARCHAR(255)
)`
const Services = `
CREATE TABLE IF NOT EXISTS "Services"(
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(100) UNIQUE NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    service_icon VARCHAR(100) NOT NULL,
    service_tariff INT NOT NULL
)`
const Banners = `
CREATE TABLE IF NOT EXISTS "Banners"(
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(100) NOT NULL,
    banner_image VARCHAR(100) NOT NULL,
    description TEXT NOT NULL
)`
const Transactions = `
CREATE TABLE IF NOT EXISTS "Transactions"(
    id SERIAL PRIMARY KEY,
    service_id INT NOT NULL REFERENCES "Services"("id"),
    email VARCHAR(100) NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    description VARCHAR(100),
    total_amount INT NOT NULL,
    created_on TIMESTAMP NOT NULL
)`
const migrate = async () => {
    try {
        await pool.query('DROP TABLE IF EXISTS "public"."Transactions"');
        await pool.query('DROP TABLE IF EXISTS "public"."Banners"');
        await pool.query('DROP TABLE IF EXISTS "public"."Services"');
        await pool.query('DROP TABLE IF EXISTS "public"."Memberships"');
        await pool.query(Memberships);
        await pool.query(Services);
        await pool.query(Banners);
        await pool.query(Transactions);
    } catch (error) {
        console.log(error)
    }
}
migrate()