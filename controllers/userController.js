const { validationResult, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
const ErrorHandler = require("../lib/ErrorHandler");

const User = require("../models/user");
const config = require("../config");
const friend = require("../models/friend");

exports.getAll = (req, res, next) => {
  User.find({}, "url_handle profile_picture_url username", (err, users) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    return res.status(200).json({ success: true, users });
  });
};

exports.getAllWithoutFriends = (req, res, next) => {
  User.find({}, "_id", (err, users) => {
    if (err) {
      const Error = new ErrorHandler(err, 500);
      return res.status(Error.errCode).json(Error.error);
    }

    let array = [];

    async.forEach(
      users,
      (user, callback) => {
        friend.findOne(
          { first_user: req.user._id, second_user: user._id },
          (err, friend) => {
            if (err) {
              callback(err);
            }

            if (!friend) {
              console.log("hi");
              User.findOne(
                { _id: user._id },
                "username url_handle profile_picture_url",
                (err, user) => {
                  if (err) {
                    callback(err);
                  }

                  array.push(user);
                  callback();
                }
              );
            } else {
              callback();
            }
          }
        );
      },
      (err) => {
        console.log(array);

        return res.status(200).json({ success: true, users: array });
      }
    );
  });
};

exports.get = (req, res, next) => {
  User.findOne(
    { url_handle: req.params.urlHandle },
    "username profile_picture_url registered_on url_handle",
    (err, user) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      return res.status(200).json({ success: true, user });
    }
  );
};

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
  body("profile_picture_url").trim(),
  body("url_handle")
    .isLength({ min: 3 })
    .withMessage("Url handle should be at least 3 characters long.")
    .trim(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const Error = new ErrorHandler(null, 400, "Check errors", errors.array());
      return res.status(Error.errCode).json(Error.error);
    }

    User.findOne({ url_handle: req.body.url_handle }, (err, user) => {
      if (err) {
        const Error = new ErrorHandler(err, 500);
        return res.status(Error.errCode).json(Error.error);
      }

      if (user) {
        const Error = new ErrorHandler(
          null,
          400,
          "Url handle is already in use."
        );
        return res.status(Error.errCode).json(Error.error);
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
          const Error = new ErrorHandler(err, 500);
          return res.status(Error.errCode).json(Error.error);
        }

        const userObj = {
          username: req.body.username,
          email: req.body.email,
          password: results.encryptedPassword,
          url_handle: req.body.url_handle,
          profile_picture_url:
            req.body.profile_picture_url || config.default_profile_picture_url,
          registered_on: new Date(),
        };

        User.create(userObj, (err, user) => {
          if (err) {
            const Error = new ErrorHandler(err, 500);
            return res.status(Error.errCode).json(Error.error);
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
