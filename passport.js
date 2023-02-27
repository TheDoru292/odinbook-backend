require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrpyt = require("bcryptjs");

const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const UserModel = require("./models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      UserModel.findOne({ email }, (err, user) => {
        if (err) {
          return cb(err);
        }

        if (!user) {
          return cb(null, false, { message: "Invalid email or password." });
        }

        bcrpyt.compare(password, user.password, (err, success) => {
          if (err) {
            return cb(err);
          }

          if (success === false) {
            return cb(null, false, { message: "Incorrect email or password." });
          }

          return cb(null, user, { message: "Logged in successfully." });
        });
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, cb) {
      return UserModel.findOne({ _id: jwtPayload._id }, (err, user) => {
        if (err) {
          return cb(err);
        }

        return cb(null, user);
      });
    }
  )
);
