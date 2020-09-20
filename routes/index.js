const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("Test working");
});

router.post("/register", userController.validation, userController.register);

router.post("/login", userController.validation, userController.login);

router.post("/logout", userController.logout);

module.exports = router;
