const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");

router.get("/", authenticate, (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}! 🎉 This is a protected route.` });
});

module.exports = router;
