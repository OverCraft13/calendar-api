const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const auth = require("../middleware/auth");

router.get("/", auth.isAuthenticated, eventController.index);

router.post(
  "/",
  auth.isAuthenticated,
  eventController.storeValidation,
  eventController.store
);

router.patch(
  "/:id",
  auth.isAuthenticated,
  eventController.updateValidation,
  eventController.update
);

router.delete("/:id", auth.isAuthenticated, eventController.deleteEvent);

module.exports = router;
