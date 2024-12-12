const express = require("express");
const { authentication, errorHandler, upload } = require("../middleware");
const router = express.Router();
const { registration, login, banner, profile, updateImage, services, balance, topup, transaction, historyTransaction, editProfile } = require("../controllers");



router.get("/", function (_, res) {
    res.send("API is running....");
});
router.post("/registration", registration)
router.post("/login", login)
router.get("/banner", banner)
router.use(authentication)
router.get("/profile", profile)
router.put("/profile/update", editProfile)
router.put("/profile/image", upload.single('profile_image'), updateImage)
router.get("/services", services)
router.get("/balance", balance)
router.post("/topup", topup)
router.post("/transaction", transaction)
router.get("/transaction/history", historyTransaction)
router.use(errorHandler)

module.exports = router;