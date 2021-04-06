const express = require("express");
const router = express.Router();
const Controller = require("../controllers/blog-controller");
const checkAuth = require("./../middleware/check-auth");

// Create
router.post("/create", Controller.create);

// get
router.post("/get", Controller.get);

// update
router.post("/update", Controller.update);

// get blog by user id
router.post("/get-by-creator-id", Controller.getBlogCreatorId);

router.post("/get-by-user-id", Controller.getBlogUserId);

// delete
router.post("/delete", Controller.delete);
// router.post('/delete', checkAuth, Controller.delete);

module.exports = router;
