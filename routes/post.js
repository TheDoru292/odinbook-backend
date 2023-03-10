const express = require("express");
const router = express.Router();

const comment = require("../controllers/commentController");
const post = require("../controllers/postController");
const like = require("../controllers/likeController");
const helper = require("../lib/helper");

const passport = require("passport");
require("../passport");

router.get("/", passport.authenticate("jwt", { session: false }), post.get);

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

router.get("/:postId/comment/:commentId", comment.get);

router.post(
  "/:postId/comment",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfPostExists,
  comment.post
);

router.put(
  "/:postId/comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfPostExists,
  helper.checkSameUserComment,
  comment.editComment
);

router.delete(
  "/:postId/comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfPostExists,
  helper.checkSameUserComment,
  comment.delete
);

router.post(
  "/:postId/like",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfLiked,
  like.post
);

module.exports = router;
