const fs = require("fs")
const pool = require("./db")

const banners = JSON.parse(fs.readFileSync("./config/data/banners.json", "utf-8")).map((element) => {
    const { banner_name, banner_image, description } = element
    return `('${banner_name}', '${banner_image}', '${description}')`
}).join(", ")


const services = JSON.parse(fs.readFileSync("./config/data/services.json", "utf-8")).map((element) => {
    const { service_code, service_name, service_icon, service_tariff } = element
    return `('${service_code}', '${service_name}', '${service_icon}', ${service_tariff})`
}).join(",\n")

const seedBanners = `
insert into "Banners"("banner_name", "banner_image", "description")
values ${banners};
`

const seedServices = `
insert into "Services"("service_code", "service_name", "service_icon", "service_tariff")
values ${services};
`
const seeding = async () => {
    try {
        await pool.query(seedBanners);
        await pool.query(seedServices);
    } catch (error) {
        console.log(error)
    }
}
seeding()
