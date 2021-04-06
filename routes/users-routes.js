const express = require("express");
const router = express.Router();
const Controller = require("../controllers/users-controller");

// Create user
router.post("/create", Controller.create);

// login
router.post("/login", Controller.login);

// login witj google
router.post("/login-with-google", Controller.loginWithGoogle);

// Users
router.post("/get", Controller.get);

// Users
router.post("/get-by-id", Controller.getById);

// User update
router.post("/update", Controller.update);

// Userdelete
router.post("/delete", Controller.delete);

module.exports = router;
