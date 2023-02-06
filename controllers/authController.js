const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong.",
        user: user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.status(400).json({
          success: false,
          code: 400,
          status: "Bad err",
        });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({ success: true, token });
    });
  })(req, res);
};
