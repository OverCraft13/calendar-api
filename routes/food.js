const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");

router.get("/", foodController.index);

router.get("/:id", foodController.show);

module.exports = router;
