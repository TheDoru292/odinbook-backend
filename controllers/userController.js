const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const config = require("../config");

exports.registerWithEmail = [
  body("email").isEmail(),
  body("username").isLength({ min: 1 }).trim(),
  body("password").isLength({ min: 1 }).trim(),
  body("url-handle").isLength({ min: 3 }).trim(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        code: 400,
        status: "Check errors",
        errors: errors.array(),
      });
    }

    User.findOne({ url_handle: req.body.url_handle }, (err, user) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, code: 500, status: "Internal server error" });
      }

      if (user) {
        return res.status(400).json({
          success: false,
          code: 400,
          status: "Url handle is already in use.",
        });
      }
    });

    const encryptedPassword = bcrypt.hash(
      req.body.password,
      10,
      (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({
            success: false,
            code: 500,
            status: "Internal server error",
          });
        }

        return hashedPassword;
      }
    );

    const userObj = {
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
      url_handle: req.body.url_handle,
      profile_picture_url: config.default_profile_picture_url,
      registered_on: new Date(),
    };

    User.create(userObj, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          code: 500,
          status: "Internal server error",
        });
      }

      return res.status(200).json({
        success: true,
        code: 200,
        status: "Account created",
      });
    });
  },
];
