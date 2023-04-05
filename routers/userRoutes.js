const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.post("/", userController.signUp);
router.post("/login", userController.login);
router.get("/login-user",userController.currentLoginUser);

module.exports = router;
