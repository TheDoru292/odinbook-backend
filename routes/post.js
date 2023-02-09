const express = require("express");
const router = express.Router();

const post = require("../controllers/postController");

const passport = require("passport");
require("../passport");

router.get("/", post.get);

router.post("/", passport.authenticate("jwt", { session: false }), post.create);

router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  post.delete
);

module.exports = router;
