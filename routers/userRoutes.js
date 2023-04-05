const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.post("/", userController.signUp);
router.post("/login", userController.login);
router.get("/login-user", userController.currentLoginUser);
router.get("/logout", userController.protect ,userController.logOut);

module.exports = router;
