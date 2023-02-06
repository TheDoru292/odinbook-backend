require("dotenv").config();
const express = require("express");
const router = express.Router();

const auth = require("../controllers/authController");

router.get("/", (req, res) => {
  return res.json({ success: true });
});

router.post("/register", auth.register);

router.post("/login", auth.login);

module.exports = router;
