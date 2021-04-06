const express = require("express");
const router = express.Router();
const Controller = require("../controllers/payment");
const checkAuth = require("../middleware/check-auth");

// Create
router.post("/payment", Controller.payment);

module.exports = router;
