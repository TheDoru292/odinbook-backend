var express = require("express");
var router = express.Router();

const { getUserPosts } = require("../controllers/postController");
const user = require("../controllers/userController");
const helper = require("../lib/helper");
const ErrorHandler = require("../lib/ErrorHandler");
const friend = require("../controllers/friendController");
const friendModel = require("../models/friend");

const passport = require("passport");
const friendReq = require("../models/friendReq");
require("../passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", user.registerWithEmail);

router.get("/:userId/post", helper.checkIfUserExists, getUserPosts);

// Route to get user's friends
router.get("/:userId/friend", friend.getUserFriends);

// Route to unfriend user
router.delete(
  "/:userId/friend/:friendId",
  passport.authenticate("jwt", { session: false }),
  helper.checkSameUser,
  helper.checkIfUserFriends,
  friend.removeFriend
);

// Route to send a friend request to the user
router.post(
  "/:userId/friend/request",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfUserExists,
  helper.checkFriendRequestExists,
  helper.checkIfFriends,
  helper.checkSameUserFriend,
  friend.post
);

// Route for the user to get their friend requests
router.get(
  "/:userId/friend/request",
  passport.authenticate("jwt", { session: false }),
  helper.checkIfUserExists,
  helper.checkSameUser,
  friend.getFriendRequests
);

// Route for user to accept friend request
router.post(
  "/:userId/friend/request/:requestId",
  passport.authenticate("jwt", { session: false }),
  helper.checkSameUser,
  helper.checkFriendRequestExists,
  friend.acceptFriendRequest
);

// Route for user to deny friend request
router.delete(
  "/:userId/friend/request/:requestId",
  passport.authenticate("jwt", { session: false }),
  helper.checkSameUser,
  helper.checkFriendRequestExists,
  friend.deleteFriendRequest
);

// Route for user to see outgoing friend requests
router.get(
  "/:userId/friend/request/outgoing",
  passport.authenticate("jwt", { session: false }),
  helper.checkSameUser,
  friend.getOutgoingFriendRequests
);

// Route for user to delete outgoing friend request
router.delete(
  "/:userId/friend/request/outgoing/:requestId",
  passport.authenticate("jwt", { session: false }),
  helper.checkSameUser,
  helper.checkFriendReqById,
  friend.deleteOutgoingFriendRequest
);

module.exports = router;
