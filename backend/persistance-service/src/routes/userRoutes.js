const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.post("/users/me", requireAuth, userController.saveMe);
router.get("/users/me", requireAuth, userController.getMe);

module.exports = router;
