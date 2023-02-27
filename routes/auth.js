require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const auth = require("../controllers/authController");
const user = require("../models/user");
const ErrorHandler = require("../lib/ErrorHandler");

router.get("/", (req, res) => {
  return res.json({ success: true });
});

router.post("/login", auth.login);

router.post("/test", (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const Error = new ErrorHandler(err, 400, "Invalid token.");
      return res.status(Error.errCode).json(Error.error);
    }

    console.log(decoded);

    user.findOne({ _id: decoded._id }, (err, user) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      if (!user) {
        const Error = new ErrorHandler(err, 400, "Invalid token.");
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({
        success: true,
        status: "Valid token.",
        user: {
          id: user._id,
          username: user.username,
          userhandle: user.url_handle,
          profilePicture: user.profile_picture_url,
        },
      });
    });
  });
});

module.exports = router;
