if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const { errorHandler } = require("./middleware");
const router = require("./routes");
const cors = require('cors');
const port = process.env.PORT

// app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
    console.log("Connected to port " + port);
})