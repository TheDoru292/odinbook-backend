const express = require("express");
const router = express.Router();

const comment = require("../controllers/commentController");
const post = require("../controllers/postController");
const helper = require("../lib/helper");

const passport = require("passport");
require("../passport");

router.get("/", post.get);

router.post("/", passport.authenticate("jwt", { session: false }), post.create);

router.get("/:postId", post.getOne);

router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfPostExists,
  helper.checkSameUserPost,
  post.delete
);

router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfPostExists,
  helper.checkSameUserPost,
  post.edit
);

router.get(
  "/:postId/comment",
  helper.checkIfPostExists,
  comment.getAllPostComments
);

router.post(
  "/:postId/comment",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfPostExists,
  comment.post
);

module.exports = router;
