const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");

const User = require("../models/user");
const config = require("../config");

exports.registerWithEmail = [
  body("email").isEmail().withMessage("Value should be a valid email!"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username should be at least 3 characters long.")
    .trim(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long!")
    .trim(),
  body("url_handle")
    .isLength({ min: 3 })
    .withMessage("Url handle should be at least 3 characters long.")
    .trim(),

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
        console.log(err);
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

    async.parallel(
      {
        encryptedPassword: function (callback) {
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
              callback(err);
            }

            return callback(null, hashedPassword);
          });
        },
      },
      function (err, results) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            code: 500,
            status: "Internal server error",
          });
        }

        const userObj = {
          username: req.body.username,
          email: req.body.email,
          password: results.encryptedPassword,
          url_handle: req.body.url_handle,
          profile_picture_url: config.default_profile_picture_url,
          registered_on: new Date(),
        };

        User.create(userObj, (err, user) => {
          if (err) {
            console.log(err);
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
      }
    );
  },
];
