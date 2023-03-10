const jwt = require("jsonwebtoken");
const passport = require("passport");
const ErrorHandler = require("../lib/ErrorHandler");

exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      const Error = new ErrorHandler(
        err || null,
        400,
        "Incorrect username or password"
      );
      return res.status(Error.errCode).json(Error.error);
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        const Error = new ErrorHandler(err, 400);
        return res.status(Error.code).json(Error.get);
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        // expiresIn: "1h",
      });

      console.log(user);

      const userObj = {
        _id: user._id,
        username: user.username,
        url_handle: user.url_handle,
        profile_picture_url: user.profile_picture_url,
        registered_on: user.registered_on,
      };

      res.cookie("token", token, { maxAge: 31536000 * 60 * 20 });

      return res.json({
        success: true,
        user: userObj,
        token,
      });
    });
  })(req, res);
};
